export class VNode{
    /**
     * 
     * @param {*标签名} tag 
     * @param {*标签类型，1===标签  2=== 属性  3====文本} nodeType 
     * @param {*对应的真实dom} elm 
     * @param {*后代} children 
     * @param {*父级} parent 
     * @param {*数据} data 
     * @param {*文本值} text 
     */
    constructor(tag,nodeType,elm,children,parent,data,text){
        this.tag = tag;
        this.nodeType = nodeType;
        this.elm = elm;
        this.children = children;
        this.parent = parent;
        this.data = data;
        this.text = text;
        this.env = {};
        this.instructions = {};
        this.template = [];

    }
}