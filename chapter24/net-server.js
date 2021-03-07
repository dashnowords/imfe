const net = require('net');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

let server = net.createServer(socket=>{
    socket.on('data',data=>{
        console.log('收到来自客户端的消息:\n',data);
        console.log('收到来自客户端的消息:\n',decoder.write(data));
    });

    socket.on('end',function(){
       console.log('socket从客户端被关闭了');
    });
});

server.listen(12315,()=>{
    console.log('开始监听端口');
});