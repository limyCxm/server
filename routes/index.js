var express = require('express');
var router = express.Router();

var http = require('http');
var fs = require('fs');


router.get('/', function (req, res, next) {
  req.getConnection(function (err, conn) {
    if (err) {
      return next(err);
    } else {
      conn.query('SELECT * FROM t_image_rec_record WHERE create_time BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND NOW()', function (err, result) {

        if (err) {
          return next(err);
        } else {
          var data = JSON.parse(JSON.stringify(result));
          var pushData = [];
          data.map(function (item, index) {
            // console.log(item.input_content)
            if(item.input_content.indexOf('http://mmbiz.qpic.cn') > -1){
              var name = item.input_content.split('/')[4];
              http.get(item.input_content, function onResponse(response) {
                response.pipe(fs.createWriteStream('./public/images/'+name+'.jpg','utf-8'));
                  var modSql = 'UPDATE t_image_rec_record SET input_content = ? WHERE Id = ?';
                  var modSqlParams = [ 'https://localhost:3000/images/'+name+'.jpg',item.id];
                  conn.query(modSql,modSqlParams,function (err,result){
                    if(err){
                      console.log("update error", error.message);
                      return;
                    }
                    console.log("update success!");
                  })

               
              });
            }
          })
          
          res.json({ msg: "success" });
        }
      })
    }
  })
});

router.get('/tag', function (req, res, next) {
  req.getConnection(function (err, conn) {
    if (err) {
      return next(err);
    } else {
      conn.query('SELECT DISTINCT output_content FROM t_image_rec_record WHERE create_time BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND NOW()', function (err, result) {

        if (err) {
          return next(err);
        } else {
          var data = JSON.parse(JSON.stringify(result));
          var pushData = [];
          data.map(function (item, index) {
            var single = eval(item.output_content)[0];
            if (single == null) {
            } else {
                if(pushData.indexOf(single.imageClass) == -1){
                  pushData.push(single.imageClass);
                }
            }
          })
          
          res.json({ data: pushData });
        }
      })
    }
  })
});

router.post('/select', function (req, res, next) {
  var name = req.body.name;
  req.getConnection(function (err, conn) {
    if (err) {
      return next(err);
    } else {
      conn.query('SELECT * FROM chengxm_image', function (err, result) {

        if (err) {
          return next(err);
        } else {
          var pushData = [];
          var data = JSON.parse(JSON.stringify(result));
          data.map(function(item,index){
            var singleData = eval(item.output_content)
            if(singleData.length !== 0){
              if(singleData[0].imageClass == name){
                pushData.push(item);
              }
            }
            
          })
          // console.log(data);
          res.json({msg: "success",data: pushData, total: pushData.length});
        }
      })
     
    }
  })
});


module.exports = router;
