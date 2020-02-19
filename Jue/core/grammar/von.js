import { getValue4templateName } from "../utils/getValue.js"

export function von(vm,elm,parent,attributeName,dataName){
    if(attributeName.includes('@')){
        attributeName = attributeName.substring(attributeName.indexOf('@') + 1)
    }else{
        attributeName = attributeName.substring(attributeName.indexOf(':') + 1)
    }
    dataName = getValue4templateName(vm._methods,dataName)
    elm.addEventListener(attributeName,funcProxy(vm,dataName))

}
function funcProxy(vm,method){
     return function (){
         method.call(vm)
     }
}