//3.高级开发者的实现

let originData = require('./data.js');
let _ = require('lodash');

function getAllFood(){
    return _.chain(originData)
            .map('dinner')
            .flattenDeep()
            .sortBy()
            .sortedUniq()
            .value();
}

console.log(getAllFood(originData));
