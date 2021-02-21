//原始数据
let a1 = {
    id:1,
    name:'Tony Stark',
    heroIdentity:'Iron Man'
};

//ES5方法
let partnerValue;
Object.defineProperty(a1, 'partner', {
    get:function(){
       return partnerValue;
    },
    set:function (value) {
        partnerValue = value;
    },
    enumerable:true
});

a1.partner = [{
    id:2,
    name:'Steve',
    heroIdentity:'Captain America'
},{
    id:3,
    name:'Bruce Banner',
    heroIdentity:'Hulk'
},{
    id:4,
    name:'Nartasha',
    heroIdentity:'Black Widow'
}];

a1.partner.push({id:5,name:'noBody'});

//ES6-proxy
let a2 = {
    id:1,
    name:'Tony Stark',
    heroIdentity:'Iron Man',
    partner:[]
};

let proxy_partner = new Proxy(a2.partner,{
    set:function (target, prop, value) {
        console.log('setting value to proxy!',prop, value);
        return Reflect.set(target, prop, value);
    }
});

proxy_partner.push({id:5,name:'noBody'});

