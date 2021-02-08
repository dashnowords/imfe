var express = require('express');
var router = express.Router();
var Mock = require('mockjs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取订单
router.get('/query_orders', function (req, res) {
  var result = Mock.mock({
    'status|1': true,//标识请求是否成功，将以1/2概率返回true
    'message': '@csentence',//请求失败时返回错误信息，使用占位符返回中文句子
    'data|4': [{//将被转译为数组，数组包含4个具有相同格式的对象
      'id|+1': 0, //id为0开始的自增整数
      'create_time': '@datetime', //创建日期使用日期时间占位符
      'request_price|2000-3000.2': 0, //应收金额整数部分为2000-3000，小数点后保留2位
      'pay_price|1000-2000': 0, //实付金额为1000-2000之间整数
      'status|1': ['已支付', '已发货', '已收货'] //订单状态为数组中随机一项
    }]
  });
  res.send(result);
});

module.exports = router;
