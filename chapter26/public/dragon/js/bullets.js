class Bullets {
    constructor(w, h, maxNums = 5, stage) {
        this.maxNums = maxNums;
        this.w = w;
        this.h = h;
        this.stage = stage;
        this.step = 0;
        this.fireStep = 40; //发射子弹间隔的帧数
        this.eles = []; //已经在图中的子弹
        this.shape = []; //已经在图中的子弹的easeljs句柄

        //根据最大可存在子弹数生成响应的对象
        for(let i = 0; i < maxNums; i++){
            let bullet = new Bullet(w, h);
            this.shape.push(bullet.shape);
            this.eles.push(bullet);
        }
    }
    update() {
        this.step++;
        //检查数量
        if (this.canFire()) {
            //如果可以开火,则捞出一个已经在画面之外的子弹
            let bullet = this.eles.filter(bullet=>!bullet.shape.visible)[0];
            if (bullet) {
                let [x,y] = this.getPosition();
                bullet.reset(x, y);
                createjs.Sound.play('attack');
            }
        }
        //更新子弹
        this.eles.map(bullet => {
            bullet.update();
        })
    }
    canFire() {
        return this.step % this.fireStep == 0
    }
    //获取到当前玩家的位置
    getPosition(){
        let player = this.stage.children[1];
        return [player.x, player.y]
    }
}

// 单个子弹
class Bullet {
    constructor(w, h) {
        this.shape = new createjs.Bitmap(queue.getResult('bullet'));
        //子弹是否显示
        this.shape.visible = false;
        //子弹图片缩放
        this.shape.scale = 0.8;
        this.velocity = -4;
    }
    update() {
        //移动子弹
        if (this.shape.visible) {
            this.shape.y += this.velocity;
        }

        //判断是否已经飞出画面
        if (this.shape.y < -100) {
            this.shape.visible = false;
        }
    }
    //将放于画面之外的子弹
    reset(x,y){
        this.shape.visible = true;
        this.shape.x = x + 20; //补偿飞龙图片的宽度
        this.shape.y = y;
    }
}