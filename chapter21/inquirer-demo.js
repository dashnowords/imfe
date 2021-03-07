const inquirer = require('inquirer');

const questions = [{
    type:'input',
    name:'taskID',
    message:'请输入任务ID编号:',
    validate:function(input){

        if( /\d+/g.test(input)){
            return true;
        }else{
            return '提示:任务ID只能包含数字'
        };//判断是否为纯数字
    },
    filter:function(answer){
        return 'Team-S-' + answer;
    }
},{
    type: 'list',
    name: 'CSSPreProcessor',
    message: '请选择想要使用的CSS预处理器:',
    choices: [{
        name: 'sass(dart-sass)',
        value: 'dartSass'
    }, {
        name: 'sass(node-sass)',
        value: 'nodeSass'
    }, {
        name: 'less',
        value: 'less'
    }, {
        name: 'stylus',
        value: 'stylus'
    }]
} ,{
    type: 'checkbox',
    name: 'libs',
    message: '请选择想要添加的库:',
    choices: [{
        name: 'vuex',
        value: 'vuex'
    }, {
        name: 'vue-router',
        value: 'vue-router'
    }, {
        name: 'axios',
        value: 'axios',
        checked:true
    }, {
        name: 'elementUI',
        value: 'elementUI'
    },{
        name:'vuetify',
        value:'vuetify'
    }]
}];

inquirer.prompt(questions).then(answer=>{
  console.log('您选择的所有答案如下:');
  console.log(answer);    
})

