require.config({
    baseUrl: '.',
    paths: {
        'jQuery': 'scripts/jquery.min',
        'business1': 'scripts/business1',
        'business2': 'scripts/business2',
        'business3': 'scripts/business3'
    }
});

require(['business1', 'business2'], function (biz1) {
    console.log('主函数执行');
    biz1.welcome();
});

