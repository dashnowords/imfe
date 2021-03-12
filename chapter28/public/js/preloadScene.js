class preloadScene extends Phaser.Scene {
    constructor() {
        super('preload');
        this.logo = null;
        this.loadChunk = null;
        this.loadTrack = null;
    }
    preload() {
        //绘制引导画面
        let { width, height } = this.game.config;
        
        /**生产环境使用打包后的整图资源 */
        /*
        this.bg = this.add.sprite(width / 2, height / 2, 'assets1', 'bg1.png');
        this.logo = this.add.sprite(width / 2, height / 3, 'assets1', 'logo.png');
        this.loadTrack = this.add.sprite(75, height * 3 / 4, 'assets1', 'loading.png').setScale(0.6, 0.9).setOrigin(0, 0);
        this.loadChunk = this.add.sprite(80, height * 3 / 4 + 8, 'assets1', 'loading2.png').setScale(0, 1).setOrigin(0, 0);
        */
       
       /**开发环境使用的独立资源 */
       
        this.bg = this.add.image(width / 2, height / 2, 'bg');
        this.logo = this.add.image(width / 2, height / 3, 'logo');
        this.loadTrack = this.add.image(75, height * 3 / 4, 'loading-out').setScale(0.6, 0.9).setOrigin(0, 0);
        this.loadChunk = this.add.image(80, height * 3 / 4 + 8, 'loading');
        this.loadChunk.setScale(0, 1).setOrigin(0, 0); 
        
        
        //加载资源
        this.load.on('progress',this.handleProgress, this);
        this.load.image('bg_game', 'assets/bg_game.png');
        this.load.image('cover', 'assets/cover.png');
        this.load.image('btn', 'assets/btn.png');
        this.load.image('btn_down', 'assets/btn_down.png');
        this.load.image('saw', 'assets/saw.png');
        this.load.image('ground1', 'assets/ground1.png');
        this.load.image('ground2', 'assets/ground2.png');
        this.load.image('cover', 'assets/cover.png');
        this.load.image('leftwall', 'assets/leftwall.png');
        this.load.image('rightwall', 'assets/rightwall.png');
        this.load.spritesheet('ninja',
            'assets/ninja.png',
            { frameWidth: 160, frameHeight: 160 }
        );
    }
    create() {
        //预加载完成后进入前置菜单场景
        this.scene.start('menu');
    }
    handleProgress(event){
        this.loadChunk.setScale(0.6*event, 1);
    }
}