const SerialPort = require('serialport');
const ReadlineParser = require('@serialport/parser-readline');
const Readline = require('readline');

SerialPort.list().then(list=>{
    let {path} = list[0];
    if(!path){
        console.log('未找到串口设备');
    }else{
        const port = new SerialPort(path,{baudRate:9600,autoOpen:true},()=>{
            console.log('串口已经打开');
        });
        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        parser.on('data', (data)=>{
            console.log('接收到数据:',data);
        }); 

        //在终端创建交互界面
        const rl = Readline.createInterface({
            input: process.stdin
        });
        //换行时将信息输出到串口
        rl.on('line',line=>{
            port.write(line+'\r');
        })
    }
}).catch(err=>{
    console.log('发生错误:',err);
})