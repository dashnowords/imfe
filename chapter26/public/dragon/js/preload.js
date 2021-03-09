/*预加载函数*/
function startPreload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);

    // 加载完成后
    queue.on("complete", handleComplete, this);

    // 加载进度
    queue.on("progress", handleProgress, this);

    // 加载错误
    queue.on("error", handleError, this);

    // 开始加载资源

    queue.loadManifest(getManifest());
}

/* 声明监听函数 */
function handleComplete() {
    console.log('加载完成!');
    bgMusic = queue.getResult('attack')
    bgMusic.volumn = 0.4;
    showPlayBtn();
}

function handleProgress(e) {
    p = parseInt(e.progress * 100, 10) + '%';
    $('#progress-text').text(p);
    $('#track').css('width', p);
}

function handleError(e) {
    console.log('加载错误!',e);
}

/**
 * 加载完成后显示Play按钮
 */
function showPlayBtn() {
    $('#progress-text').hide()
    $('#progress').hide()

    // 将加载后的资源包装为img.src可指向的虚拟地址
    let btnUrl = URL.createObjectURL(queue.getResult('play',true))
    let btnDownUrl = URL.createObjectURL(queue.getResult('play_down',true))
    let btn = $(queue.getResult('play')).addClass('btn-play').appendTo($('#welcome'))
    
    // 为Play按钮绑定开始事件
    btn.one('mousedown',function(e){
        $(this).attr('src', btnDownUrl);
    });
    //鼠标弹起时开始游戏
    btn.one('mouseup',function(e){
        $(this).attr('src', btnUrl);
        setTimeout(()=>{
            startPlay()
        },300);
    });
}

/**资源表 */
function getManifest() {

   return [{
        id: 'attack',src: '/dragon/sound/attack.mp3'
    },{
        id: 'die',src: '/dragon/sound/die.mp3'
    },{
        id: 'map',src: '/dragon/imgs/map.jpg'
    },{
        id: 'bullet',src: '/dragon/imgs/bullet.png'
    },{
        id: 'bullet2',src: '/dragon/imgs/bullet2.png'
    },{
        id: 'play',src: '/dragon/imgs/play.png'
    },{
        id: 'play_down',src: '/dragon/imgs/play_down.png'
    },{
        id: 'gameover',src: '/dragon/imgs/gameover.png'
    },{
        id: 'player',src: '/dragon/imgs/player.json', type:createjs.Types.SPRITESHEET
    } ,{
        id: 'blast',src: '/dragon/imgs/blast.json', type:createjs.Types.SPRITESHEET
    },{
        id: 'die',src: '/dragon/imgs/die.json', type:createjs.Types.SPRITESHEET
    },{
        id: 'enemy1',src: '/dragon/imgs/enemy1.json', type:createjs.Types.SPRITESHEET
    },{
        id: 'enemy2',src: '/dragon/imgs/enemy2.json', type:createjs.Types.SPRITESHEET
    },{
        id: 'enemy3',src: '/dragon/imgs/enemy3.json', type:createjs.Types.SPRITESHEET
    }]

}

