class GameCtrl{
    constructor(){
        this.score = 0;
        this.text = new createjs.Text(`Score: ${this.score}`, "24px Arial", "#ffffff");
        this.shape = new createjs.Shape();
        this.shape.graphics
            .beginBitmapFill(queue.getResult('gameover'))
            .drawRect(0, 0, 320, 125);
        this.shape.x = 30;
        this.shape.y = 200;
        this.shape.visible = false;
        this.text.x = 10;
        this.text.y = 10;
        this.gameover = false;
        //点击gameover时再来一次
        this.shape.addEventListener('click',()=>{
            this.score = 0;
            this.gameover = false;
            this.shape.visible = false;
            //清空敌人
            stage.children.slice(7,15).map(enemy=>{
                enemy.visible = false;
            });
            createjs.Ticker.paused = false;
        });
    }
    update(){
        //刷新计分
        this.text.text = `Score: ${this.score}`;
        //检查是否游戏结束
        if (this.gameover) {
            this.shape.visible = true;
        }
    }
    addScore(){
        this.score += 10;
    }
}