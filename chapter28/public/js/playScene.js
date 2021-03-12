const LEFT_BORDER = 65;
const RIGHT_BORDER = 320;
const BOTTOM_BORDER = 590;
const HEIGHT = 590;

class playScene extends Phaser.Scene {
    constructor() {
        super('play');
        this.side = 0;//标记忍者在哪一侧
        this.playerDie = false;//是否游戏结束
    }
    create() {
        let { width, height } = this.game.config;

        //绘制游戏背景
        this.bg = this.add.tileSprite(width / 2, height / 2, width, height, 'bg_game');
        //齿轮需要和玩家角色进行碰撞检测,所以使用物理引擎组来封装
        this.saws = this.physics.add.staticGroup();

        //左边的转动锯齿
        this.leftSaw = this.saws.create(30, Phaser.Math.Between(0, height * 2 / 3), 'saw').setScale(0.5).refreshBody();
        //右边的转动锯齿
        this.rightSaw = this.saws.create(width - 30, Phaser.Math.Between(0, height * 2 / 3), 'saw').setScale(0.5).refreshBody();

        //左墙
        this.leftwall = this.add.tileSprite(0, height / 2, 76, height, 'leftwall');
        //右墙
        this.rightwall = this.add.tileSprite(width, height / 2, 76, height, 'rightwall');
        //绘制用于碰撞检测的地面
        this.platforms = this.physics.add.staticImage(width / 2, height - 10, 'ground1').setScale(0.7).refreshBody();

        //绘制用于展示的地面
        this.ground = this.add.image(width / 2, height - 30, 'ground1').setScale(0.7);

        //背景图组
        this.dynamicBg = this.add.group([this.bg,
        this.leftwall,
        this.rightwall,
        this.leftSaw,
        this.rightSaw,
        this.ground,
        this.platforms]);

        //绘制忍者精灵表,播放静止姿态动画
        this.player = this.physics.add.sprite(width / 2, height - 90, 'ninja').setScale(0.5);
        this.player.setBounce(0.1);
        //定义忍者动画帧
        this.initAnimations();
        //播放静止忍者动画
        this.player.play('stand');

        //初始化事件
        this.initEvents();
        //初始化碰撞检测
        this.initCollision();
    }
    update() {
        this.fixRotationWithArcade();
        this.updateSaw();//更新锯齿
        this.updatePlayer();//更新忍者
        this.updateSaw();//更新锯齿(超出画面后重新生成)
    }
    initEvents() {
        //背景监听鼠标点击
        this.input.on("pointerup", this.handleMouseUp, this);
    }
    initCollision() {
        //检测玩家是否碰到地面(有反弹);
        this.physics.add.collider(this.player, this.platforms);
        //检测玩家是否碰到锯齿(无反弹);
        this.physics.add.overlap(this.player, this.saws, this.gameOver, null, this);

    }
    //玩家碰到锯齿则游戏结束
    gameOver() {
        this.playerDie = true;
        //x方向偏移,避免持续碰撞
        this.player.x = this.side === 'right' ? RIGHT_BORDER - 30 : LEFT_BORDER + 30;
        this.player.setVelocityX(this.side === 'right' ? -30 : 30, 200);
        this.player.setGravityY(700);
        this.player.play('fall');
    }
    //修复arcade刚体模型无法旋转的Bug
    fixRotationWithArcade() {
        this.leftSaw.body.position.y = this.leftSaw.y - 24;
        this.rightSaw.body.position.y = this.rightSaw.y - 24;
        this.leftSaw.rotation += 0.02;
        this.rightSaw.rotation -= 0.02;
    }
    //鼠标点击时人物跳动
    handleMouseUp() {
        //如果第一次跳,则向右跳
        if (!this.side) {
            this.initJump();
        }

        //向对侧跳
        if (this.side === 'right') {
            this.jumpLeft();
        } else {
            this.jumpRight();
        }
    }
    //初始化动画定义
    initAnimations() {
        //定义静止忍者帧动画
        this.anims.create({
            key: "stand",
            frames: this.anims.generateFrameNumbers('ninja', { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
        });
        //向右跳
        this.anims.create({
            key: "jumpright",
            frames: this.anims.generateFrameNumbers('ninja', { start: 4, end: 14 }),
            frameRate: 30
        });
        //向左跳
        this.anims.create({
            key: "jumpleft",
            frames: this.anims.generateFrameNumbers('ninja', { start: 14, end: 4 }),
            frameRate: 30
        });
        //跌落
        this.anims.create({
            key: "fall",
            frames: this.anims.generateFrameNumbers('ninja', { start: 13, end: 5 }),
            frameRate: 40,
            repeat: -1
        });
    }
    // 首次跳之前初始化
    initJump() {
        this.side = 'left';
        // 开始跳跃后移除地面物理模型，否则会阻止物体下落
        this.platforms.y = HEIGHT * 2;
        this.platforms.body.y = HEIGHT * 2;
    }
    // 向右跳
    jumpRight() {
        this.player.play('jumpright');
        this.side = 'right';
    }
    // 向左跳
    jumpLeft() {
        this.player.play('jumpleft');
        this.side = 'left';
    }
    //更新玩家角色
    updatePlayer() {
        //如果游戏结束则玩家坠落
        if (this.playerDie) {
            return;
        }
        if (this.side === 'right' && this.player.x < RIGHT_BORDER) {
            this.player.y -= 6;
            this.player.x += 20;
            this.player.body.velocity.y = 0;
            this.updateBackground();//更新其他布景
        }
        if (this.side === 'left' && this.player.x > LEFT_BORDER) {
            this.player.y -= 6;
            this.player.x -= 20;
            this.player.body.velocity.y = 0;
            this.updateBackground();//更新其他布景
        }
    }
    //更新背景图案
    updateBackground() {
        //更新背景和墙壁的填充偏移
        this.dynamicBg.children.entries.map(i => {
            if (i.tilePositionY !== undefined) {
                i.tilePositionY -= 6;
            } else {
                i.y += 6;
            }
            return i;
        });
    }
    //更新锯齿(超出画面后重新生成)
    updateSaw() {
        [this.leftSaw, this.rightSaw].map(saw => {
            if (BOTTOM_BORDER - saw.y < 0) {
                saw.y = Phaser.Math.Between(0, HEIGHT * 1 / 10);
            }
            return saw;
        });
    }
}