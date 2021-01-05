export function getValue4templateName(obj,name){
    if(!obj) return;
    const attributes = name.split('.');
    let temp = obj;
    for(let i = 0; i < attributes.length; i ++){
        if(temp[attributes[i]] || temp[attributes[i]] == ''){
            temp = temp[attributes[i]]

        }else{
            return undefined;
        }
    }
    return temp;
}