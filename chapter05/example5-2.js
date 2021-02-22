//2.中级开发者的实现

let originData = require('./data.js');

function getAllFood(data) {
   return sortAndUnique(flatmap(data.map(item=>item.dinner),[]));
}

//排序去重
function sortAndUnique(arr){
   let resultMap = {};
   arr.forEach(i=>resultMap[i]=1);
   return Object.keys(resultMap).sort((a, b) => a.localeCompare(b));
}

//数组扁平化
function flatmap(arr, result){
    if(isArray(arr)){
        arr.map(item=>{
            flatmap(item,result);
        });
    }else{
        result.push(arr);
    }
   return result;
}

//判断传入的是否是一个数组
function isArray(data) {
    return Object.prototype.toString.call(data).slice(8, -1) === 'Array';
}

console.log(getAllFood(originData));