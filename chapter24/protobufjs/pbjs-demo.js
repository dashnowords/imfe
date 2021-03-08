const protobuf = require('protobufjs');
//SearchProto文件根对象
let SearchProto = protobuf.loadSync('../proto/search.proto');
//找到请求消息的类型定义
const SearchRequestMessage = SearchProto.lookupType('SearchRequest');
//对象字面量定义载荷
var payload = {
    keywords: 'Tony',
    page: 31,
    itemsPerPage:20
};
// 判断载荷是否合法
var errMsg = SearchRequestMessage.verify(payload);
if (errMsg)
    throw Error(errMsg);

//如果没有错误则生成消息实例
var message = SearchRequestMessage.create(payload);
console.log('message实例:', message);

//编码
var buff = SearchRequestMessage.encode(message).finish();
console.log('编码后消息:', buff);

//解码
var decodeMessage = SearchRequestMessage.decode(buff);
console.log('解码后消息:', decodeMessage);

//得到对象字面量
var toObj = SearchRequestMessage.toObject(decodeMessage);
console.log('还原为对象:', toObj);