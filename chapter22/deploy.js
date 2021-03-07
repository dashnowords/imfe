const shell = require('shelljs');

let rootPath = __dirname;

shell.cd( `${rootPath}/usr1/server/tinyserver`);
//移除public目录
shell.rm('-rf', 'public');
shell.cd(`${rootPath}/usr1/server`);
shell.exec('unzip public.zip', function (err, stdout) {
    if (err) {
        console.log('unzip error:', err);
        process.exit(1);
    } else {
        console.log('unzip success!');
        shell.mv('public', `./tinyserver`);
    }
});