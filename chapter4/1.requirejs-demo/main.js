require.config({
    baseUrl:'.',
    paths:{
        'jQuery':'scripts/jquery.min',
        'business1':'scripts/business1'
    }
});

require(['business1','./scripts/business2.js'],function(bus1,bus2){
      bus1.welcome();
      console.log(bus2.showPrototype());
});