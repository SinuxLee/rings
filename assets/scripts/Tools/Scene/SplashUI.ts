import { SaveData } from "../../YZKCocos/Tools/SaveData";
import GameManager, { PlayerData } from "../../Game/GameManager";
import { MG_SFH5 } from "../../YZKCocos/MiniGameManager/MG_SFH5";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SplashUI extends cc.Component {

    start(){
        //  SaveData.deleteAll();
        try{
            cc.loader.downloader.loadSubpackage("sub_loading",(err)=>{
                this.scheduleOnce(()=>{
                    cc.director.loadScene("loading");
                },0.5); 
            });
        }catch
        {
            cc.director.loadScene("loading");
        }
    }

      /* let a = new Proxy([], {
            set(obj, prop, value) {
                obj[prop] = value;
                cc.log(prop);
                //if (prop === 'bestScore') {
                    console.log("set " + prop + ": " + obj[prop]);
               // }
                return true;
            },
            get(obj,prop){
                return obj[prop];
            }
        });
        a[0] = 100;
        a[1] = 99;

        cc.log(a)
        cc.log(a[1])
        return;*/
}
