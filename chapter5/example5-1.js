//1.初级开发者的实现
let originData = require('./data.js');
function getAllFood(data) {
    let resultMap = {};
    //遍历每一条记录的dinner字段，然后使用对象实现去重
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].dinner.length; j++) {
            let foods = data[i].dinner[j];
            if (typeof foods === 'string' && !resultMap[foods]) {
                //处理字符串类型的情况
                resultMap[foods] = 1;
            } else if (isArray(foods)) {
                //处理数组类型的情况
                foods.forEach(item => {
                    if (!resultMap[item]) {
                        resultMap[item] = 1;
                    }
                });
            }
        }
    }

    //从对象生成并最终结果
    return Object.keys(resultMap).sort((a, b) => a.localeCompare(b));
}
//判断传入的是否是一个数组
function isArray(data) {
    return Object.prototype.toString.call(data).slice(8, -1) === 'Array';
}

console.log(getAllFood(originData));