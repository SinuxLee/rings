
export class Dictionary<Tkey,Tvalue>
{
    public keys:Tkey[] = [];
    public values:Tvalue[] = [];
    public static get defaultValue(){
        return new Dictionary();
    }

    public getValue(key:Tkey,dValue:Tvalue = undefined):Tvalue{
        let index =this.keys.indexOf(key);
        if(index === -1){
            if(dValue !== undefined){
                return dValue;
            }else{
                console.error(`字典中不包含key:${key}`);
                return null;
            }
        }
        return this.values[index];
    }

    public add(key:Tkey,value:Tvalue){
        let index = this.keys.indexOf(key);
        if(index === -1){
            this.keys.push(key);
            this.values.push(value);
        }else{
            this.values[index] = value;
        }
        return this;
    }

    public remove(key:Tkey){
        let index = this.keys.indexOf(key);
        if(index!==-1){
            this.keys.splice(index,1);
            this.values.splice(index,1);
        }
        return this;
    }

    public hasKey(key:Tkey): boolean{
        return this.keys.indexOf(key) !== -1;
    }

    public clear(){
        this.keys = [];
        this.values = [];
    }
    
    public forEach(elements:(key:Tkey,value:Tvalue)=>void) {
        for(let i=0;i<this.keys.length;i++){
            elements(this.keys[i],this.values[i]);
        }
    }

    public toJsonString():string{
        return JSON.stringify(this);
    }

    public toString():string{
        return "字典数据，建议使用toJsonString()";
    }
    
    public static parse<Tkey,Tvalue>(jsonStr:string){
        let dic = JSON.parse(jsonStr);
        let newDic = new Dictionary<Tkey,Tvalue>();
        newDic.keys = dic.keys;
        newDic.values = dic.values;

        return newDic;
    }

    

}
