export function clone(obj){
    if(obj instanceof Array){
        return cloneArray(obj);
    }else if(obj instanceof Object){
         return cloneObject(obj);
    }else{
        return obj;
    }
}
function cloneArray(arr){
    const result = new Array(arr.length);
    arr.forEach((ele,index)=>{
        result[index] = clone(arr[index])
    })
    return result;
}
function cloneObject(obj){
    const result = {};
    Object.getOwnPropertyNames(obj).forEach(ele=>{
        result[ele] = clone(obj[ele])
    })
    return result;
}