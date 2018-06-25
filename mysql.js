var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '119.23.153.216',
    user     : 'root',
    password : 'gxtangyu',
    port: '3306',
    database: ' test'
  });
   
  connection.connect(function(err,result){
      if(err) {
          console.log(err);
      }else{
          console.log(result);
          console.log('链接数据库成功')
      }
  });

  connection.query('SELECT * FROM chengxm_image ', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });



  connection.end();