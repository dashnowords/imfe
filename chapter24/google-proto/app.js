const SearchProto = require('./search_pb');

//实例化消息体
let message = new SearchProto.SearchRequest();
message.setKeywords('Tony');
message.setPage(31);
message.setItemsPerPage(20);

//转换为对象
let obj = message.toObject();
console.log('转为对象:',obj);
console.log('JSON序列化结果:',JSON.stringify(obj));
console.log('JSON序列化后的长度:',JSON.stringify(obj).length);

//转换为二进制序列化消息
let bytes = message.serializeBinary();
console.log('序列化结果:',bytes)
console.log('序列化原始buffer:',Buffer.from(bytes.buffer))
console.log('protobuf序列化后长度:',bytes.length)

//通过反序列化重建消息内容
let rebuildMessage = SearchProto.SearchRequest.deserializeBinary(bytes);
let rebuildObject = rebuildMessage.toObject();
console.log('反序列化后转对象:', rebuildObject);