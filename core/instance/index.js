import {prototypeCoding} from './init.js'
import { mountMinx } from './mount.js'
import { renderMixin } from './render.js';

export default function Jue(options){
    // 生命周期函数，还可以添加
    //初始化
    this._init(options);
    // 执行声明created周期函数
    this.created && this.created.call(this);
    // 渲染
    this._render();

}
// 执行下列函数，完成在Jue原型添加
renderMixin(Jue);
prototypeCoding(Jue)
mountMinx(Jue)