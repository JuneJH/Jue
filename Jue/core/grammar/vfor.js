import { VNode } from "../instance/vdom/VNode.js";
import {getValue4templateName} from '../utils/getValue.js'

export function vfor(vm,elm,parent,dataName){
    const virtualNode = new VNode(elm.nodeName,0,elm,[],parent,getInstructions(dataName),"")
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(""));//补充删多了的文本节点
    analysisInstructions(vm,elm,parent,dataName);
    return virtualNode;
}

function analysisInstructions(vm,elm,parent,dataName){
    let instructSet = getInstructions(dataName);
    instructSet = instructSet.trim().split(" ");

    const data = getValue4templateName(vm._data,instructSet[2]);
    if(!data){
        throw new Error('data is errorr!!')
    }
    for(let i = 0; i < data.length; i ++){
        const tepmDom = document.createElement(elm.nodeName);
        tepmDom.innerHTML = elm.innerHTML;
        tepmDom.env = analysisEnv(instructSet[0],data[i],i)
        parent.elm.appendChild(tepmDom)
    }
}

function analysisEnv(instruction,value,index){
    if(/([A-z0-9-_=+$ ,.]+)/.test(instruction)){
        instruction = instruction.trim().substring(1,instruction.length-1);
    }
    const inset = instruction.split(',');
    const obj = {};
    if(inset.length < 1){
        throw new Error('instruction is error!!!')
    }
    if(inset.length >= 1){
       obj[inset[0]] = value;
    }
    if(inset.length >= 2){
        obj[inset[1]] = index;
    }
    return obj;
}

function getInstructions(instruction){
    if(!instruction)return "";
    const temp = instruction.trim().split(" ");
    if(temp.length != 3 || temp[1] != 'in' && temp[1] != 'of'){
        throw new Error('data is error!!!')
    }
    return instruction;
}