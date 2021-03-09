class Collision{
    constructor(eles){
        this.player = eles[1];
        this.bullets = eles.slice(2,7);
        this.enemies = eles.slice(7,15);
    }
    //检测敌人是否击中玩家
    isPlayerHit() {
        return this.enemies.some(enemy=>{
            return this._isSpriteOverlap(this.player, enemy);
        });
    }
    //检测子弹是否击中敌机
    isEnemyHit(gamectrl){
        this.bullets.map(bullet=>{
            this.enemies.map(enemy=>{
                let hit = this._isImgOverlap(bullet, enemy);
                if (hit) {
                    //若敌人被击中,则消失并播放音效
                    bullet.visible =false;
                    enemy.visible = false;
                    createjs.Sound.play('die');
                    gamectrl.addScore();
                }
            });
        });
    }
    //被检测元素区域重叠
    _isSpriteOverlap(a, b){
        //如果不可见则不会碰撞
        if (!a.visible || !b.visible) {
            return false
        }
        //否则检测坐标
        if((Math.abs(a.x - b.x) < a.spriteSheet._frameWidth/5 + b.spriteSheet._frameWidth/5) //横向判断
            && (Math.abs(a.y - b.y) < a.spriteSheet._frameHeight/5 + b.spriteSheet._frameHeight/5) //纵向判断
          ){
              return true 
          }
        return false;
    }
    _isImgOverlap(a, b){
        //如果不可见则不会碰撞
        if (!a.visible || !b.visible) {
            return false
        }
        //否则检测坐标
        if((Math.abs(a.x - b.x) < a.image.naturalWidth/2 + b.spriteSheet._frameWidth/2) //横向判断
            && (Math.abs(a.y - b.y) < a.image.naturalHeight/2 + b.spriteSheet._frameHeight/2) //纵向判断
        ){
            return true 
        }
        return false;
    }

}