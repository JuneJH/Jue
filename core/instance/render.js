import { getValue4templateName } from "../utils/getValue.js";
import {cereateVnode} from './mount.js'
//构建vnode与template的关系
const template2vnode = new Map();
const vnode2template = new Map();
// 预渲染
/**
 * 构建索引，映射关系
 * @param {*} vm 
 * @param {*虚拟节点} vnode 
 */
export function prepareRender(vm, vnode) {
    if (vnode.nodeType == 3) {
        analysisTemplateString(vnode);
    } else if (vnode.nodeType == 1) {
        analysisAttribute(vnode)
    }else if(vnode.nodeType == 0){
        const dataName = vnode.data.trim().split(" ")[2]
        setTemplate2vnode(dataName, vnode)
        setVnode2template(dataName, vnode)
    }
    for (let i = 0; i < vnode.children.length; i++) {
        prepareRender(vm, vnode.children[i])
    }
}
// 分析存在属性标签，一下标签属性会存在依赖关系，
function analysisAttribute(vnode) {
    const attributes = vnode.elm.getAttributeNames();
    if(attributes.includes('v-for')){
        const dataName = vnode.data.trim().split(" ")[2]
        setTemplate2vnode(dataName, vnode)
        setVnode2template(dataName, vnode)
    }
    if (attributes.includes('v-model')) {
        const dataName = vnode.elm.getAttribute('v-model');
        setTemplate2vnode(dataName, vnode)
        setVnode2template(dataName, vnode)
    }
}
/**
 * 处理文本中的模板，得到数据名，并创建索引
 * @param {虚拟节点} vnode 
 */
function analysisTemplateString(vnode) {
    const vnodeTexts = vnode.text.match(/{{[A-z0-9. + _-]+}}/g)
    for (let i = 0; vnodeTexts && i < vnodeTexts.length; i++) {
        let template = vnodeTexts[i].substring(2, vnodeTexts[i].length - 2).trim();
        setTemplate2vnode(template, vnode)
        setVnode2template(template, vnode)
    }
}
/**
 * 
 * @param {模板数据名，带有层级的} template 
 * @param {*} vnode 
 */
function setTemplate2vnode(template, vnode) {
    const templateMap = template2vnode.get(template);
    if (templateMap) {
        templateMap.push(vnode)
    } else {
        template2vnode.set(template, [vnode])
    }

}
function setVnode2template(template, vnode) {
    const vnodeMap = vnode2template.get(vnode);
    if (vnodeMap) {
        vnodeMap.push(template);
    } else {
        vnode2template.set(vnode, [template])
    }
}
// 测试用，在构建好后检查索引的情况
export function getTemplate2vnode() {
    return template2vnode;
}
export function getVnode2template() {
    return vnode2template;
}

// 修改数据后再次渲染  
/**
 * rebuildNode调用了此方法
 * @param {*} vm 
 * @param {*变量名，层级关系完整} dataName 
 */
export function renderData(vm, dataName) {
    const vnodes = template2vnode.get(dataName);
    for (let i = 0; vnodes && i < vnodes.length; i++) {
        renderNode(vm, vnodes[i])
    }
}
// 数据变动处理函数/
/**
 * 当依赖数据变化时，执行此方法改变状态
 * @param {*} vm 
 * @param {*} dataName 
 */
export function rebuildNode(vm, dataName){
    const vnodes = template2vnode.get(dataName);
    for (let i = 0; vnodes && i < vnodes.length; i++) {
        if(vnodes[i].nodeType == 0){
            vnodes[i].parent.elm.innerHTML = "";
            vnodes[i].parent.elm.appendChild(vnodes[i].elm);
            const result = cereateVnode(vm, vnodes[i].elm, vnodes[i].parent)
            vnodes[i].parent.children = [result];
            clearMap();
            prepareRender(vm,vm._vnode);
        }
    }
    renderData(vm, dataName)
}
//清空索引，
function clearMap(){
    vnode2template.clear();
    template2vnode.clear();
}
// 正式渲染
export function renderMixin(Jue) {
    Jue.prototype._render = function () {
        renderNode(this, this._vnode)
    }
}
function renderNode(vm, vnode) {
    if (!vnode) return;
    if (vnode.nodeType == 3) {  // 解析文本中的模板，并替换为真实值
        const templates = vnode2template.get(vnode);
        let result = vnode.text;
        for (let i = 0; templates && i < templates.length; i++) {
            let value = getTemplateValue([vm._data,vnode.env], templates[i]);
            if(value || value == ""){
                if(typeof value == 'function'){
                    value = value();
                }
                result = result.replace('{{' + templates[i] + '}}', value)
            }
        }
        vnode.elm.nodeValue = result;
    } else if (vnode.nodeType == 1 && vnode.tag == 'INPUT') {  // v-model
        const templates = vnode2template.get(vnode);
        for (let i = 0; templates && i < templates.length; i++) {
            const value = getTemplateValue([vm._data,vnode.env], templates[i]);
            if(value){
                vnode.elm.value = value;  // 双向数据绑定
            }
        }
    }
    for (let i = 0; i < vnode.children.length; i++) {
        renderNode(vm, vnode.children[i])
    }
}
// 通过层级变量名查值
function getTemplateValue(objs, templateName) {
    if (!objs) return;
    for (let i = 0; i < objs.length; i++) {
        const result = getValue4templateName(objs[i], templateName);
        if (result || result == "") {
            return result
        }
    }
    return undefined;
}