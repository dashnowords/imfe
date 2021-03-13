const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
SerialPort.list().then(list=>{
    let {path} = list[0];
    if(!path){
        console.log('未找到串口设备');
    }else{
        const port = new SerialPort(path,{baudRate:9600,autoOpen:true},()=>{
            console.log('串口已经打开');
        });
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        parser.on('data', (data)=>{
            console.log('接收到数据:',data);
        }); 
    }
}).catch(err=>{
    console.log('发生错误:',err);
})