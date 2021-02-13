define('business1',['jQuery'],function(){
    function welcome() { 
        $('#welcome-modal').animate({opacity:1},2000);
    }
    return {welcome}
});