const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
const fs = require('fs');

let viz = new Viz({ Module, render });

fs.readFile('demo.dot','utf8',function(err,data){
    if (err){
      throw err;
    }
    console.log(data);
    doRender(data);
})

function doRender(content) {
  viz.renderString(content)
  .then(result => {
    fs.writeFileSync('output.svg',result);
  })
  .catch(error => {
    viz = new Viz({ Module, render });
    console.error(error);
  });
}
