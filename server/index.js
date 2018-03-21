const bodyParser = require('body-parser');
const express = require('express');
const userApi = require('./routes/user');
const addressApi = require('./routes/address');
const app = express();

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:8088");//配置请求的客户端
  if (req.method === 'OPTIONS') {
    /*让options请求快速返回*/
    res.send(200);
  }
  else {
    /*防止异步造成多次响应，出现错误*/
    var _send = res.send;
    var sent = false;
    res.send = function (data) {
      if (sent) return;
      _send.bind(res)(data);
      sent = true;
    };
    next();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/selUser', userApi.selUser);
app.get('/selAddress', addressApi.selAddress);

app.post('/addUser', userApi.addUser);
app.post('/addAddress', addressApi.addAddress);

const server = app.listen(8081, function () {
  const port = server.address().port;
  console.log('success listen at port:' + port);
});
