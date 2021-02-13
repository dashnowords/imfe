;(function(window,undefined){
    //模块路径记录
    let modulePaths;
    //模块缓存记录
    let moduleCache = {
        root:document.scripts[0].dataset.main //main方法作为根模块
    };
    //未解析的工厂函数栈
    let unResolvedModules = [];
    let NullFunc = ()=>{};

    //moduleCache中模块的记录
    class Module {
        constructor(name, path, deps=[],factory){
            this.name = name;//模块名
            this.deps = deps;//模块依赖
            this.path = path;//模块路径
            this.load = false;//是否已加载
            this.exports = {};//工厂函数返回内容
            this.factory = factory || NullFunc;//工厂函数
        }
    }

    /**
     * 模块加载方法
     * 1. 用于启动方法
     * 2. 用于在模块定义中就近依赖
     */
    function _require(...rest){
        let paramsNum = rest.length;

        switch (paramsNum){
            case 1://如果只有一个字符串参数，则按模块名对待，如果只有一个函数模块，则直接执行
                if (typeof rest[0] === 'string') {
                    return _checkModulePath(rest[0]);
                } else if (typeof rest[0] === 'function'){
                    return _invoke(rest[0])
                }
            break;
            case 2:
                if (Array.isArray(rest[0]) && typeof rest[1] === 'function'){
                    //如果依赖为空，则直接运行工厂函数，并传入默认参数
                    if(!rest[0].length){
                        return _invoke(rest[1]);
                    } else {
                        //如果有依赖, 则将工厂函数保存为待执行函数
                        return _setUnResolved('root', rest[0], rest[1]);
                        
                    }
                }else{
                    throw new Error('参数类型不正确，require函数签名为(deps:Array<string>, factory:Function):void');
                }
            break;
        }
    }

    /**
     * 模块定义方法，demo中只处理包含传入了完整参数的情况，且假定deps不为空
     * @param {string} id 模块键名
     * @param {array} deps 依赖列表
     * @param {function} factory 工厂函数
     */
    function _define(id, deps, factory){
        let module;
        let modulePath = modulePaths[id];
        //如果存在已注册的模块地址则登记一个模块实例
        if (modulePath) {
            module = new Module(id, modulePath, deps, factory);
        }
        //模块实例挂载至缓存列表
        moduleCache[id] = module;
        //工厂方法加入未解析模块数组
        unResolvedModules.push({name:id, deps,factory});
        //加载依赖
        deps.map(dep=>_checkModulePath(dep));
    }

    //添加配置方法
    _require.config = function(conf = {}){
        modulePaths = conf.paths;
    }

    /**直接调用工厂函数 */
    function _invoke(fn){
        let fnReturn;//工厂函数返回值
        //生成一个临时的匿名模块
        module = {
            exports:{}
        }
        //运行工厂函数
        fnReturn = fn.call(null, _require, module.exports, module);
        return fnReturn ? fnReturn : module.exports;
    }

    /**有依赖时延迟执行模块工厂函数 */
    function _setUnResolved(name, deps, factory) {
        //缓存工厂函数
        unResolvedModules.push({name, deps,factory});
        //加载依赖
        deps.map(dep=>_checkModulePath(dep));
    }

    /**
     * 在路径注册表中查询模块路径
     * @param {string} moduleName 模块名 
     */
    function _checkModulePath(moduleName){
        let path = modulePaths[moduleName];
        if(path){
            _loadModule(moduleName,path);
        }else{
            throw new Error('查询的模块不存在');
        }
    }

    /**
     * 模块加载方法
     * @param {string} name 模块名称
     * @param {string} path 外部脚本的加载路径
     */
    function _loadModule(name, path) {
        //如果存在模块的缓存，表示已有同名模块
        if(name !== 'root' && moduleCache[name]) return;
        //如果没有缓存则进行首次加载
        let script = document.createElement('script');
            script.src = path + '.js';
            script.async = true;
            //初始化待加载模块缓存
            moduleCache[name] = new Module(name,path);
            //加载完毕后回调函数
            script.onload = function(){
                console.log(`${name}模块触发load事件`);
                moduleCache[name].load = true;
                _checkUnResolvedModules();
            }
            document.body.appendChild(script);
    }

    /**按栈顺序检查未执行的工厂函数，如果依赖全部加载完毕，则执行工厂函数 */
    function _checkUnResolvedModules(){
        if(!unResolvedModules.length)return;
        // 取出下一个待检查的工厂函数
        const len = unResolvedModules.length;
        const nextModule =  unResolvedModules[len - 1];
        const depsNum = nextModule.deps.length;
        // 统计依赖项中已完成加载的模块数量
        const loadedDepsNum = nextModule.deps.filter(item=>moduleCache[item].load).length;
        // 如果依赖已经全部加载，则执行工厂函数
        if (loadedDepsNum === depsNum) {
            const { deps, factory, name} = nextModule;
            console.log(`模块${name}的依赖项已全部加载，可以执行工厂函数`);
            //取得已加载模块的导出，将其作为参数传入工厂函数执行并保存其导出结果
            moduleCache[name].exports = factory.apply(null, deps.map(dep=>moduleCache[dep].exports));
            // 初始化后将工厂函数从待执行栈中移除
            unResolvedModules.pop();
            _checkUnResolvedModules();
        }

/*         unResolvedModules.map((module,index)=>{
            let depsNum = module.deps.length;
            let loadedDepsNum = module.deps.filter(item=>moduleCache[item].load).length;
            if (loadedDepsNum === depsNum) {
                let params = module.deps.map(dep=>dep.exports);
                module.factory.apply(null,params);
            }
        }); */
    }

    //挂载全局
    window.require = _require;
    window.define = _define;

    //从data-main指向开始解析
    _loadModule('root',document.scripts[0].dataset.main.slice(0,-3));

})(window)