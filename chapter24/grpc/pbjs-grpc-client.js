const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader")
const packageDescripter = protoLoader.loadSync(
     '../proto/search-rpc.proto',
    {
        keepCase: true
    }
)

const ProductPkg = grpc.loadPackageDefinition(packageDescripter).product;
const stubProduct = new ProductPkg.ProductService('localhost:9527', grpc.credentials.createInsecure());
// 请求载荷
let payload = {
    keywords: 'Tony',
    page: 31,
    items_per_page:20
};

//RPC调用query服务
stubProduct.query(payload, (err, response) => {
    if (err) { return console.log(err) }
    if (!response) {return console.log('no response')}
    if (response.status){
        console.log(response);
    }
})
