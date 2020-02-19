import { renderData, rebuildNode } from "./render.js";

function cereateArrayProxy(vm,obj,funcName,namespace){
    Object.defineProperty(obj,funcName,{
        enumerable:true,                                 //可枚举
        configurable:true,                               //可配置
        value:function(...args){
            const fn = Array.prototype[funcName];        // 获取原生方法
            args = cereateDataProxy(vm,args,namespace);  //为新添加的数据做代理
            let result = fn.apply(this,args);            // 调用原生数组方法
            rebuildNode(vm,getNamespace(namespace,''));  // 更改数据后触发页面修改
            return result;
        }
    })
}
/**
 * 代理数组方案
 * @param {实例对象} vm 
 * @param {*为那个数组代理原型，通过此参数为数组设置原型} arr 
 * @param {*多层次的数据} namespace 
 */
function arrayProxy(vm,arr,namespace){
    let obj ={
        eleType:'Array',
        toString(){
            let result = '';
            for(let i = 0; i < arr.length; i ++){
                result += arr[i] + ','
            }
            return result.substring(0,result.length - 1);
        },
        push(){},
        pop(){},
        shift(){},
        unshift(){}
    }
    cereateArrayProxy(vm,obj,'push',namespace);
    cereateArrayProxy(vm,obj,'pop',namespace);
    cereateArrayProxy(vm,obj,'shift',namespace);
    cereateArrayProxy(vm,obj,'unshift',namespace);
    arr.__proto__ = obj;
    return arr;
}
/**
 * 
 * @param {实例} vm 
 * @param {*代理源对象} obj 
 * @param {*命名空间} namespace 
 */
function cereateObjProxy(vm,obj,namespace){
    let objProxy = {};
    for (const key in obj) {
        Object.defineProperty(objProxy,key,{
            configurable:true,
            get(){
                return obj[key]
            },
            set(val){
                // 此时，如果是递归操作，会将代理源对象中的属性的值指向代理对象
                obj[key] = val;
                // renderData(vm,getNamespace(namespace,key))
                rebuildNode(vm,getNamespace(namespace,key))

            }
        })
        // 只需要把最外层的对象属性代理给vm即可，因为嵌套的属性在下面代码中会替换成一个代理对象
        !namespace && Object.defineProperty(vm,key,{
            configurable:true,
            get(){
                return obj[key]
            },
            set(val){
                obj[key] = val;
                // renderData(vm,getNamespace(namespace,key))
                rebuildNode(vm,getNamespace(namespace,key))

            }
        })
        if(obj[key] instanceof Object){
            // 这里的赋值将会给代理源对象赋值，因此在递归时，不能执行vm上的代理函数，否则会把嵌套内中的属性暴露在外面
            objProxy[key] = cereateDataProxy(vm,obj[key],getNamespace(namespace,key))
        }
    }
    return objProxy;
}
/**
 * 开始MVVM框架，代理数据
 * @param {实例，所有函数都需要传，以便后续使用} vm 
 * @param {*代理对象} obj 
 * @param {*命名空间} namespace 
 */
export function cereateDataProxy(vm,obj,namespace){
    let proxyObj = null;
    if(obj instanceof Array){
        proxyObj = new Array(obj.length);
        for(let i = 0; i < obj.length; i ++){
            if(obj[i] instanceof Object){
                proxyObj[i] = cereateDataProxy(vm,obj[i],namespace)
            }else{
                proxyObj[i] = obj[i]
            }
        }
        proxyObj = arrayProxy(vm,proxyObj,namespace)

    }else if(obj instanceof Object){
        proxyObj = cereateObjProxy(vm,obj,namespace);

    }else{
        throw new Error('请传入一个对象数据')
    }
    return proxyObj;
}
/**
 * 得到命名空间
 * @param {命名空间} namespace 
 * @param {*变量属性} keyName 
 */
function getNamespace(namespace,keyName){
    if(namespace == null || namespace == ''){
        return keyName;
    }else if(keyName == null || keyName == ''){
        return namespace
    }else {
        return namespace + '.' + keyName
    }
}