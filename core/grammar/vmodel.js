import { setValue } from "../utils/setValue.js"

export function vmodel (vm,elm,dateName){
    elm.oninput = function (){
        setValue(vm._data,dateName,elm.value)
    }
}