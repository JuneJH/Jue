import { clone } from "./clone.js";

// export function mergeObj(obj1,obj2){
//     return Object.assign({},obj1,obj2);
// }
export function mergeObj(obj1,obj2){
     if(!obj1){
         return clone(obj2);
     }
     if(!obj2){
         return clone(obj1);
     }
     const result = {};
     Object.getOwnPropertyNames(obj1).forEach(ele=>{
         result[ele] = obj1[ele]
         console.log(ele)
     })
     Object.getOwnPropertyNames(obj2).forEach(ele=>{
        result[ele] = obj2[ele]
    })
    return result;
}