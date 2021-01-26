import { Random } from "./Random";

const {ccclass,executionOrder, property} = cc._decorator;

@ccclass
@executionOrder(-1000)
export default class ReadDataTable extends cc.Component {
    
    //在这里记录json表名称
    private static readonly gunTable:string ="json/Gun";

    //在这里申请对应数据结构
    public static guns:GunData[] = null;


    private static actions:Function[] = [];

    private static allRead:boolean[] = [];

    onLoad(){

        //在这里申请加上初始化操作
        ReadDataTable.actions.push(this.loadLevelTable);

        ReadDataTable.allRead = new Array<boolean>(ReadDataTable.actions.length);
        
        ReadDataTable.actions.forEach((func,index)=>{
            func(index);
        });
    }

    update(){

    }

    public static get isAllRead():boolean{
    
        for (let index = 0; index < this.allRead.length; index++) {
            if(this.allRead[index] != true) {
                return false;
            }
        }

        return true;
    }


    //在这里注册初始化方法

    private loadLevelTable(index:number){
        ReadDataTable.getJsonData(ReadDataTable.gunTable,(json:cc.JsonAsset)=>{
            ReadDataTable.guns = json.json.Gun;
            ReadDataTable.allRead[index] = true;
        })
    }
 
    /**
     * 读取json文件的方法
     * @param jsonName 
     * @param callBack 
     */
    private static getJsonData<T>(jsonName:string,callBack:Function){
        cc.loader.loadRes(jsonName,cc.JsonAsset,(error,json)=>{
            if(error){
                cc.error(error.message);
            }else{
               //cc.log(json.json.Skill[0]);
               callBack(json);
            }
        });
    }
}

export class GunData{
    id;
    icon;
    high;
}





