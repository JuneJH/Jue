import { cereateDataProxy } from './proxyData.js'
import { mount } from './mount.js';
let uid = 0;
export function prototypeCoding(Jue){
    Jue.prototype._init = function (options){
        const vm = this;
        vm._uid = uid ++;
        vm._isJue = true;
        // 初始化数据，为vm._data,vm做代理        
        if(options && options.data){
            vm._data = cereateDataProxy(vm,options.data,'');//返回代理对象
        }
        //初始化created
        if(options && options.created){
            vm.created = options.created;
        }
        //初始化computed
        if(options && options.computed){
            vm._computed = options.computed;
            for (const key in options.computed) {
                vm[key] = options.computed[key];
                vm._data[key] = options.computed[key];
            }
        }
        //初始化methods
        if(options && options.methods){
            vm._methods = options.methods;
            for (const key in options.methods) {
               vm[key] = options.methods[key];
               vm._data[key] = options.methods[key];
            }
        }
        // 挂载el
        if(options && options.el){
            const elm = document.getElementById(options.el)
            mount(vm,elm)
        }

    }
}