define('business1',['business3'],function(){
    console.log(`执行business1模块工厂方法`);
    function welcome() { 
        console.log('执行business1模块的welcome方法');
        $('#welcome-modal').animate({opacity:1},2000);
    }
    return {welcome};
});