/**
 * 电机控制实验
 * 运行程序后即进入REPL模式，支持以下命令：
 * motor.start(255)即可令电机转动
 * motor.stop()停止转动
 * motor.reverse(255)反向转动
 */
const J5 = require('johnny-five');
let board = new J5.Board();
board.on('ready',function(){
    let motor = new J5.Motor({
        pin:6
    });
    console.log('board is ready');
    this.repl.inject({
        motor:motor
    });
});