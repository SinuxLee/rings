import MiniGameBase from "./MiniGameBase";
import { Dictionary } from "../Tools/Dictionary";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_SFH5 extends MiniGameBase {
    
    static init(_id,callback){
        $SF.Ga.init({
            id:_id,
            complete(){
                callback && callback();
            }
        });
    }

    static onLoading(curr,total){
        $SF.Ga.onLoadingProgress({
            loadCur: curr,
            loadMax: total
        })
    }

    static saveData(key,value){
        $SF.sfLocalStorage.setItem(key,JSON.stringify(value));
    }

    static getData(key,defaultValue){
        if(this.has(key)){
            let value = cc.sys.localStorage.getItem(key);
            if(defaultValue instanceof Dictionary){
                return Dictionary.parse(value);
            }else if(defaultValue instanceof Array) {
                return JSON.parse(value);
            }else{
                let type:string = typeof defaultValue;
                if(type === "number"){
                    return parseFloat(value);
                }else if(type == "boolean"){
                    return value === "true";
                }else if(type === "object"){
                    return JSON.parse(value);
                }else{
                    return value;
                }
            }
        }  
        return defaultValue;
    }
    public static has(key:string):boolean{
        let value = $SF.sfLocalStorage.getItem(key);
        return value && value != "" && value != "null" && value != "undefined";
    }

    static onGameStart(callback){
        $SF.Ga.onGameStart((data:any) =>{
            callback && callback();
        });
    }

    static onGameEnd(score,callback){
        $SF.Ga.onGameEnd({
            score:score
        },(data)=>{
            callback && callback();
        });
    }

    showInsertAd(){
        $SF.Ga.playFullVideo(1,()=>{});
    }

    showVideoAd(callback){
        $SF.Ga.playRewardVideo(1,(res)=>{
            callback && callback(res == 2);
        },false);
        
    }

    showBanner(){
        $SF.Ga.showBa(1,false,()=>{});
    }

    hideBanner(){
        $SF.Ga.hideBa();
    }

    doVibrate(){
        $SF.Ga.startVib(100);
    }
}
