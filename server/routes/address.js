var models = require('../db');
var mysql = require('mysql');
var sql = '';
var _sql = require('../sql');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = (res, ret) => {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

exports.selAddress = (req, res) => {
  sql = _sql.address.sel;
  conn.query(sql, (err, result) => {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    if (result) {
      jsonWrite(res, result);
    }
    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
  });
};

exports.addAddress = (req, res) => {
  console.log('添加地址：', req);
  sql = _sql.address.add;
  let params = req.body;
  console.log('params:', params.name, params.address, params.tag, params.username, params.sex, params.phone, params.house);
  conn.query(sql, [params.name, params.address, params.tag, params.username, params.sex, params.phone, params.house], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
};

