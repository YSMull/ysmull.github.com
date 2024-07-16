---
layout: post
title: Nodejs 服务启动时如何异步加载配置
tags:
    - node
---

* toc
{:toc}
  
## 背景
在 Nodejs 服务中，我们往往会引入一个 Config 模块，该模块是整个 App 的配置中心，其加载将会初始化好整个系统所需的配置。
例如：
```javascript
// config.js
let config = {};
let init = function () {
    config = initConfig();
    process.globalConfig = config;
}
init();
module.exports = {
    get: function (key) {
        return config[key];
    }
}
```
在上面的代码中，init方法做了两件事情，分别满足了两种使用场景：
1. 先通过调用 initConfig() 方法构建了 config 对象，这样其它模块可以引入该模块后通过暴露出去的 get 方法获取配置。
    ```javascript
    const config = require('./config.js');
    exports.serviceA = async function () {
        let configA = config.get('keyA');
        // ...
    }
    ```
2. 把 config 对象绑定到 process 这个全局对象上，这样其它模块可以通过 process.globalConfig 获取到 config 对象。 比如某些模块，可能需要基于 process.globalConfig 来进行初始化：
    ```javascript
    // other module
    / ...
    exports.obj = initObj(process.globalConfig);
    // ...
    ```

如果 initConfig() 需要发一个请求获取配置，那么 config.js 就得改写为：

```javascript
// config.js
let config = {};
let init = async function () {
    config = await initConfig();
    process.globalConfig = config;
}
init().catch(console.err);
module.exports = {
    get: function (key) {
        return config[key];
    }
}
```

其它模块在最顶层拿到的 process.globalConfig 的值会变成 undefined，上面第二种使用场景中的 exports.obj 将会构造失败，并且其他模块在最外层通过 config.get() 拿配置也会拿不到。

## 问题解决
这个问题更通用的描述是：我们如何让一个模块在异步请求结束后，才能允许其他模块对他进行加载。最先想到了 top-level-await 特性，它可能是一个解决方案，但我没有深入调研，因为我们的工程不支持 mjs。
当应用加载时，首先加载的是 config 模块，如果 config 模块不加载完成，可能会影响到其他模块的加载，比如数据库连接池的初始化等等。在其他语言里，config 对象的初始化中的 IO 默认是同步的，但在 nodejs 中 IO 是异步的，会产生这个尴尬的问题。

### 双进程法
一种解决方案是，在服务进程启动前，让另一个进程把配置解析好，比如写到文件里或者环境变量里。这样我们的 nodejs 进程就不需要在获取 config 时发生异步 IO 操作了，只需要同步读文件或环境变量。

### 双生命周期法
跟[翔哥](https://github.com/zhangxiang958)讨论了一波后，他说我应该换一个思路，Config 应该是一个独立的声明周期，当它变为加载完成的状态时，再去启动 App 的声明周期。

我听到这个解法后，豁然开朗，这跟双进程法的思路是一样的，只不过这个做法是在单进程中控制生命周期的顺序。于是我对 config.js 进行了如下改造：
```javascript
// config.js
class Config extends Emitter {
    constructor() {
        super();
        this.config = {};
        init().then(_ => {
            this.emit('ready');
        }).catch(err => {
            console.err(err);
            process.exit(-1);
        })
    }
    async init() {
        this.config = await initConfig();
    }
    
    get(key) {
        return this.config[key];
    }
}

let config = process.globalConfig = new Config();
modules.export = config;
```
以 koa 应用举例，在 app.js 中，我们加载 config 后，监听他的 ready 事件，当 config 构建好之后，我们再去启动 App 的声明周期，此后所有由 App 带来的后续操作，一定可以访问到 config，且对已经写好的业务逻辑没有侵入性，因为 config 对象仍然有一个 get 方法。
```javascript
const App = require('./app');
const config = require('./config');
config.on('ready', function() {
  const app = new App();
  app.start();
});
```