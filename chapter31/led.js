const five = require('johnny-five');
let board = new five.Board();

board.on('ready',function(){
    var led = new five.Led(13);
    led.blink(2000);
})