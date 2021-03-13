const J5 = require('johnny-five');
let board = new J5.Board();
let motor, servo;

board.on('ready', function () {
    motor = new J5.Motor({ pin: 6 });
    servo = new J5.Servo({
        pin: 9,
        range: [0, 120],
        center: true
    });

    //电机满速旋转
    motor.start(255);

    //舵机摆动
    let state = true;
    this.loop(6000, () => {
        state = !state;
        servo.to(state ? 120 : 0, 4000);
    })
});


board.on('exit', function () {
    motor.stop();
})
