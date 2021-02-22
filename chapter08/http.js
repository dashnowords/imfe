/**
 * 模拟http返回数据
 */

let id = 0;

const http = {
  post(val){
    console.log(`服务端收到第${++id}个请求,携带数据为:${val}`);
    return new Promise((resolve, reject)=>{
      let delay = Math.random()*500 + 100; //100~600ms
      setTimeout((id)=>{
          resolve({
              id,
              val
          });
      },delay,id);
    })
  }
}
