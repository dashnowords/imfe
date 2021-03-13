class bootScene extends Phaser.Scene{
    constructor(){
        super('boot');
    }
    preload(){
        /**使用独立资源的方式加载 */
        this.load.image('bg', 'assets/bg1.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('loading-out','assets/loading.png');
        this.load.image('loading','assets/loading2.png');

       /**使用打包资源的方式加载 */
       // this.load.multiatlas('assets1','assets/sprite/assets1.json','assets/sprite');
        
    }
    create(){
        this.scene.start('preload');
    }
}