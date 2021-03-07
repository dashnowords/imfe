const path = require('path');
const archiver =require('archiver');
const fs = require('fs');
const srcPath = path.resolve(__dirname,'./dist');
const shell = require('shelljs');

//const configs = require('./config');

console.log('开始压缩dist目录...');
startZip();

//压缩dist目录为public.zip
function startZip() {
    var archive = archiver('zip', {
        zlib: { level: 5 } //递归扫描最多5层
    }).on('error', function(err) {
        throw err;//压缩过程中如果有错误则抛出
    });
    
    var output = fs.createWriteStream(__dirname + '/public.zip')
     .on('close', function(err) {
         /*压缩结束时会触发close事件，然后才能开始上传，
           否则会上传一个内容不全且无法使用的zip包*/
         if (err) {
            console.log('压缩zip文件异常:',err);
            return;
         }
         console.log('已生成zip包');
         console.log('开始上传public.zip至远程机器...');
         uploadFileMock();
     });
    archive.pipe(output);//典型的node stream用法

//将srcPath路径对应的内容添加到zip包中/public路径
    archive.directory(srcPath,'/public');
    archive.finalize();
}

// 虚拟的上传函数
function uploadFileMock(){
   shell.mv('./public.zip','./usr1/server/');
   console.log('上传完成');
}

//将dist目录上传至正式环境
/* function uploadFile() {
    ssh.connect({ //configs存放的是连接远程机器的信息
        host: configs.host,
        username: configs.user,
        password: configs.password,
        port:22 //SSH连接默认在22端口
    }).then(function () {
      //上传网站的发布包至configs中配置的远程服务器的指定地址
      ssh.putFile(__dirname + '/public.zip', configs.path).then(function(status) {
           console.log('上传文件成功');
           console.log('开始执行远端脚本');
              startRemoteShell();//上传成功后触发远端脚本
          }).catch(err=>{
             console.log('文件传输异常:',err);
             process.exit(0);
          });
    }).catch(err=>{
        console.log('ssh连接失败:',err);
        process.exit(0);
    });
}
 */