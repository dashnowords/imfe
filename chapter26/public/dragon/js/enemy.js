class Enemies {
    constructor(w, h, maxNums = 10, stage) {
        this.maxNums = maxNums;
        this.w = w;
        this.h = h;
        this.stage = stage;
        this.step = 0;
        this.EnemyStep = 40; //生成敌人的间隔帧数
        this.eles = []; //已经在图中的敌人
        this.shape = []; //已经在图中的敌人的easeljs句柄

        //根据最大可存在子弹数生成响应的对象
        for(let i = 0; i < maxNums; i++){
            let enemy = new Enemy(w, h);
            this.shape.push(enemy.shape);
            this.eles.push(enemy);
        }
    }
    update() {
        this.step++;
        //检查数量
        if (this.shouldAddEnemy()) {
            //如果可以开火,则捞出一个已经在画面之外的子弹
            let enemy = this.eles.filter(enemy=>!enemy.shape.visible)[0];
            if (enemy) {
                //初始化一个敌人
                enemy.reset();
            }
        }
        //更新敌人
        this.eles.map(enemy=> {
            enemy.update();
        })
    }
    shouldAddEnemy() {
        return this.step % this.EnemyStep == 0
    }
}

// 单个敌人
class Enemy {
    constructor(w, h) {
        //生成不同类型的敌人
        let type = 1 + ~~(Math.random()*3)
        this.type = type;
        this.spritesheet = queue.getResult(`enemy${type}`);
        this.shape = new createjs.Sprite(this.spritesheet, "play"); 
        this.halfX = this.shape.spriteSheet._frameWidth / 2;
        this.halfY = this.shape.spriteSheet._frameHeight / 2;
        this.w = w;
        this.h = h;       
        //敌人是否显示
        this.shape.visible = false;
        this.shape.scale = 1;
    }
    update() {
        //移动敌人
        if (this.shape.visible) {
            this.shape.y += this.velocity;
        }

        //判断敌人是否已经飞出画面
        if (this.shape.y - this.h > 100) {
            this.shape.visible = false;
        }
    }
    //使用空闲对象初始化一个敌人
    reset(){ 
        this.shape.x = ~~(Math.random() * (this.w - 2*this.halfX)); //补偿飞龙图片的宽度
        this.shape.y = 0;
        this.velocity = 2 + Math.ceil((Math.random()*5));
        this.shape.visible = true;
    }
}