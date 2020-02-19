export function setValue(obj,dataName,value){
    if(!obj)return;
    const attributes = dataName.split('.');
    let temp = obj;
    for(let i = 0; i < attributes.length-1; i ++){
        if(temp[attributes[i]]){
            temp = temp[attributes[i]]
        }else{
            return undefined;
        }
    }
    if(temp[attributes[attributes.length - 1]] || temp[attributes[attributes.length - 1]] == ""){
        temp[attributes[attributes.length - 1]] = value;
    }
}