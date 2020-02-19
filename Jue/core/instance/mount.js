import { VNode } from "./vdom/VNode.js";
import { prepareRender, getTemplate2vnode, getVnode2template } from "./render.js";
import { vmodel } from "../grammar/vmodel.js";
import { vfor } from "../grammar/vfor.js";
import { mergeObj } from "../utils/mergeObj.js";
import { vbind } from "../grammar/vbind.js";
import { von } from "../grammar/von.js";

export function mountMinx(Due) {
    Due.prototype.$mount = function (el) {   //实现$mount
        let elm = document.getElementById(el)  
        this._vnode = mount(this, elm);
    }
}
export function mount(vm, elm) {
    vm._vnode = cereateVnode(vm, elm, null);
    // 预渲染，构建映射索引
    prepareRender(vm, vm._vnode);
    // console.log(getTemplate2vnode())
    // console.log(getVnode2template())
}
/**
 * 创建虚拟节点
 * @param {实例} vm 
 * @param {*对应真实dom} elm 
 * @param {*父级} parent 
 */
export function cereateVnode(vm, elm, parent) {
    let vnode = analysisAttribute(vm, elm, parent)  // 查看标签上的属性 v-for v-model v-bind.....
    if (vnode == null) {
        const tag = elm.nodeName;
        const nodeType = elm.nodeType;
        const children = [];
        const text = getText(elm);
        const data = {};
        vnode = new VNode(tag, nodeType, elm, children, parent, data, text);
        // 混入环境变量，比如v-for产生的一些变量
        if (vnode.nodeType == 1 && elm.env) {
            vnode.env = mergeObj(vnode.env, elm.env);
        } else {
            vnode.env = mergeObj(vnode.env, parent && parent.env)
        }
    }
    let kids;
    // vnode.nodeType == 0 表示虚拟节点
    if (vnode.nodeType == 0) {
        // 在创建生成的新节点时，将新节点放置父节点上的
        kids = vnode.parent.elm.childNodes;
    } else {
        kids = elm.childNodes;
    }
    for (let i = 0; i < kids.length; i++) {  // 深度优先
        let node = cereateVnode(vm, kids[i], vnode);
        if (node instanceof VNode) {
            vnode.children.push(node);
        } else {
            vnode.children.push(...node)
        }
    }
    return vnode;
}
// 处理掉空格
function getText(elm) {
    if (elm.nodeType == 3) {
        let text = elm.nodeValue;
        let templates = text.match(/{{[A-z0-9-_+ ,.]+}}/g)
        for (let i = 0; templates && i < templates.length; i++) {
            let temp = templates[i].substring(2, templates[i].length - 2).trim();
            text = text.replace(templates[i], "{{" + temp + "}}");
        }
        return text;
    } else {
        return '';
    }
}
// 分析属性，比如是否绑定了事件
function analysisAttribute(vm, elm, parent) {
    if (elm.nodeType != 1) return;
    const attributes = elm.getAttributeNames();
    if (attributes.includes('v-for')) {
        const dataName = elm.getAttribute('v-for')
        return vfor(vm, elm, parent, dataName)
    }
    if (attributes.includes('v-model')) {
        const dataName = elm.getAttribute('v-model')
        vmodel(vm, elm, dataName)
    }
    for(let i = 0; i < attributes.length; i ++){
        if (attributes[i].includes('v-bind:') || attributes[i].trim().indexOf(":") == 0 ) {
            const dataName = elm.getAttribute(attributes[i])
            vbind(vm,elm,parent,attributes[i],dataName)
        }
        if (attributes[i].includes('v-on:') || attributes[i].includes("@") ) {
            const dataName = elm.getAttribute(attributes[i])
            von(vm,elm,parent,attributes[i],dataName)
        }
        

    }

}