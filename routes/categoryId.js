var express = require('express');
var router = express.Router();

/* GET users listing. */
/* GET home page. */
router.get('/:name', function(req, res, next) {
  req.getConnection(function (err, conn) {
    if (err) {
      return next(err);
    } else {
      conn.query('SELECT * FROM t_image_rec_record WHERE create_time BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND NOW()', function (err, result) {

        if (err) {
          return next(err);
        } else {
          var data = JSON.parse(JSON.stringify(result));
          // console.log(data);
          console.log(req.params.id);
          // var pushData = [];
        //  data.map(function (item, index) {
        //      var single = eval(item.output_content)[0];
        //     if (single == null) {
        //     } else {
        //         if(pushData.indexOf(single.imageClass) == -1){
        //           pushData.push({name:single.imageClass, id:item.id});
        //         }
        //     }
        //   })
          
          // res.json({ data: pushData });
        }
      })
    }
  })
})
module.exports = router;
