/*背景*/
class Background {
    constructor(w, h) {
        this.y = 0;
        this.width = w;
        this.height = h;
        // 生成一个拼接的背景完成滚动
        this.shape = new createjs.Shape();
        this.shape.graphics
            .beginBitmapFill(queue.getResult('map'))
            .drawRect(0, 0, this.width, this.height)
            .drawRect(0, -1 * this.height, this.width, this.height);
    }
    update() {
        if (this.y >= this.height) {
            this.y = 0;
            this.shape.y = this.y;
        }else{
            this.y += 1;
            this.shape.y = this.y;
        }

    }
}