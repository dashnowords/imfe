class Player{
    constructor(w, h){
       this.spritesheet = queue.getResult('player');
       this.shape = new createjs.Sprite(this.spritesheet, "fly"); 
       this.halfX = this.shape.spriteSheet._frameWidth / 2;
       this.halfY = this.shape.spriteSheet._frameHeight / 2;
       this.shape.x = w / 2;
       this.shape.y = 5 * (h / 6);
       this._followMouse();
    }
    // 让飞龙跟随鼠标
    _followMouse(){
       
       this.shape.addEventListener('mousedown',()=>{
           this.follow = true;
       });
       // 如果鼠标按下处于跟踪状态,则将鼠标位置和精灵图自身坐标计算出新的位置
       this.shape.addEventListener('pressmove',(event)=>{
           if (this.follow) {
               this.shape.x = event.stageX - this.halfX;
               this.shape.y = event.stageY - this.halfY;
           }
       })
       this.shape.addEventListener('mouseup', ()=>{
           this.follow = false;
       })
    }
    update(){

    }
}