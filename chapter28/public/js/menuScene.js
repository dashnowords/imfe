class menuScene extends Phaser.Scene{
    constructor(){
        super('menu');
        this.delta = 12;//每帧位移量
        this._coverPosY = 0;//封面图形定位点y坐标
        this._coverMoveDir = 1;//封面图形移动方向
        this._step = 1;//计步时间戳
    }
    preload(){
       
    }
    create(){
        let { width, height } = this.game.config;
        //绘制背景
        
        //打包后整图加载
        //this.bg = this.add.sprite(width / 2, height / 2, 'assets1', 'bg1.png');
        //独立资源加载
        this.bg = this.add.image(width/2, height/2, 'bg');

        //绘制封面并置于画布以外
        this.cover = this.add.image(width*2, height/3, 'cover');
        this._coverPosY = this.cover.y;
        
        //在画布以外绘制开始按钮
        this.btn = this.add.sprite(width/2, height*1.2, 'btn').setScale(0.5).setInteractive();
        this.btn_down = this.add.sprite(width/2, height*0.79, 'btn_down').setScale(0.5).setVisible(false).setInteractive();
       
        //绑定鼠标点击事件
        this.input.on("gameobjectdown",this.handleMouseDown, this);
    }
    update(){
        this._step++;
        this.showButton(this.moveCover(this._step));
    }
    handleMouseDown(pointer,obj,event){
        console.log(obj === this.btn);
        this.input.off('gameobjectdown', this.handleMouseDown);
        this.btn_down.setVisible(true);
        setTimeout(()=>{
            this.scene.start('play');
        },150);
    }
    //移动封面图
    moveCover(step){
        //先横向移动
        if (this.cover.x > this.game.config.width / 2) {
            this.cover.x -= this.delta;
            return true;
        }else{
            //横向移动至指定位置后上下小范围移动
            if (this.cover.y < this._coverPosY) {
                this._coverMoveDir = 0.1;
            }
            if (this._coverPosY + 20 < this.cover.y) {
                this._coverMoveDir = -0.1;
            }
            this.cover.y += this._coverMoveDir;
            return false;
        } 
    }
    //是否显示按钮
    showButton(coverMoved){
        if (!coverMoved) {
            if (this.btn.y > this.game.config.height *0.8) {
                this.btn.y -= this.delta;
            }
        }
    }
}