var models = require('../db');
var mysql = require('mysql');
var sql = '';
var _sql = require('../sql');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

exports.addUser = function (req, res) {
  console.log('进来了---', req);
  sql = _sql.user.add;
  let params = req.body;
  console.log('params:', params.username,params.password,params.email,params.address);
  conn.query(sql, [params.username, params.password, params.address, params.email], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
};

exports.selUser = function (req, res) {
  sql = _sql.user.sel;
  conn.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
  });
  res.send('Hello World');
};

