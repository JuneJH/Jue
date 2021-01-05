import { mergeObj } from "../utils/mergeObj.js";
import {getValue4templateName} from '../utils/getValue.js'

export function vbind(vm,elm,parent,attributeName,dataName){
    const k = attributeName.trim().substring(attributeName.trim().indexOf(':') + 1);
    const Env = mergeObj(vm._data,elm.env);
    if(/^{[\w\W]+}$/.test(dataName)){
        const contextEnv = analysisDataName(Env);
        const result = runCode(dataName,contextEnv);
        elm.removeAttribute(attributeName)
        elm.setAttribute(k,result)
    }else{
        const v = getValue4templateName(Env,dataName);
        elm.removeAttribute(attributeName)
        elm.setAttribute(k,v)
    }
}

function analysisDataName(Env){
    let defineProperty = "";
    for (const key in Env) {
        defineProperty += `let ${key} = ${JSON.stringify(Env[key])};`
    }
   return defineProperty
}
function runCode(dataName,contextEnv){
    dataName = dataName.substring(1,dataName.length - 1).split(',');
    let result = '';
    for(let i = 0; i < dataName.length; i ++){
        const splitPostion = dataName[i].indexOf(':');
        if(splitPostion > -1){
            let temp = dataName[i].trim().substring(splitPostion + 1);
            if(isTrue(contextEnv,temp)){
                result += dataName[i].substring(0,splitPostion) + ' ';
            }
        }else{
             result += dataName[i].substring(0,splitPostion) + " ";
        }
    }
    return result.substring(0,result.length - 1);
}
function isTrue(contextEnv,code){
    let flag = false;
    contextEnv += `if(${code}){flag = true}`
    eval(contextEnv);
    return flag;
}