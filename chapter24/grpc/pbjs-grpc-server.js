const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader");
const pbjs = require('protobufjs');

const root = pbjs.loadSync('../proto/search-rpc.proto');
const SearchResponse = root.lookupType('SearchResponse');

const packageDescripter = protoLoader.loadSync(
    '../proto/search-rpc.proto',
    {
        keepCase: true
    }
)

const productPkg = grpc.loadPackageDefinition(packageDescripter).product;

function query(call, callback) {
    console.log('request:', JSON.stringify(call.request))
    setTimeout(() => {
        //响应消息
        let response = {
            status: 1,
            total: 20,
            data: [{
                uuid: 1,
                name: '零件1',
                supplierId: 1005,
                createTime: '2020-09-10', 
                quantity: 50,
            }]
        }
        let errMsg = SearchResponse.verify(response);
        if (errMsg) {
            console.log('response message is not valid');
            callback(new Error(errMsg), null);
        } else {
            callback(null, response);
        }
    }, 1000);
}

function main() {
    const server = new grpc.Server()
    server.addService(productPkg.ProductService.service, {
        query,
    })

    server.bind('0.0.0.0:9527', grpc.ServerCredentials.createInsecure())
    server.start();
}

main();