import { event } from "../../Tools/event";
import { TimeManager } from "./TimeManager";
import { SaveData } from "./SaveData";
import SingleBase from "./SingleBase";
import TipsManager from "./TipsManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerManager extends SingleBase {

    private savePowerCdKey:string = "savePowerCdKey";
    private savePowerCountKey:string = "savePowerCountKey";

    private MAX_POWER_COUNT = 100;
    private POWER_COUNT_PRE_ADD = 10;

    private BASE_POWER_CD:number = 300000;

    private powerCd:number = 0;

    onPowerCdChange:event = new event();
    onPowerCountChange:event = new event();

    private powerCdTime = null;
    private powerCount = null;

    private needRecovery = false;
    
    onLoad(){

        super.onLoad();

        let lastPowerTime = this.getPowerCdTime();
        this.powerCd = Date.now() - lastPowerTime;

        if(this.powerCd < this.BASE_POWER_CD){
            this.powerCd = this.BASE_POWER_CD - this.powerCd;
        }else{
            let x = this.powerCd % this.BASE_POWER_CD;
            let delta = (this.powerCd - x) / this.BASE_POWER_CD;
            let currentPower = this.getPowerCount();

            if(delta + currentPower > this.MAX_POWER_COUNT){
                delta = this.MAX_POWER_COUNT - currentPower;
            }
            this.addPowerCount(delta);
            this.setPowerCdTime();
            this.powerCd = this.BASE_POWER_CD - x;
        }

        this.needRecovery = this.getPowerCount() < this.MAX_POWER_COUNT;

        this.onPowerCountChange.add(()=>{
            this.checkNeedRecovery();
        },this.node.uuid);
    }

    update(dt){

        if(!this.needRecovery){
            return;
        }

        this.powerCd -= dt * 1000;

        if(this.powerCd <= 0){
            this.powerCd = this.BASE_POWER_CD;
            this.addPowerCount(this.POWER_COUNT_PRE_ADD);
            this.setPowerCdTime();
        }

        this.onPowerCdChange.Invoke();
    }

    checkNeedRecovery(){
        if(this.getPowerCount() >= this.MAX_POWER_COUNT){
            this.needRecovery = false;
        }else{
            this.needRecovery = true;
        }
    }

    getPowerCdFormat(){
        if(this.powerCount >= this.MAX_POWER_COUNT){
            return "";
        }
        return TimeManager.getFormatString(this.powerCd);
    }

    private getPowerCdTime():number{
        if(this.powerCdTime == null){
            this.powerCdTime = SaveData.get(this.savePowerCdKey,TimeManager.getNow());
        }
        return this.powerCdTime;
    }
    
    private setPowerCdTime(){
        this.powerCdTime = TimeManager.getNow();
        this.savePowerCdTime();
    }
    
    private savePowerCdTime(){
        SaveData.set(this.savePowerCdKey,this.powerCdTime);
    }
    
    getPowerCountFormat():string{
        return `${this.powerCount}/${this.MAX_POWER_COUNT}`;
    }

    getPowerCount():number{
        if(this.powerCount == null){
            this.powerCount = SaveData.get(this.savePowerCountKey,this.MAX_POWER_COUNT);
        }
        return this.powerCount;
    }
    
    addPowerCount(count){
        this.powerCount += count;
        this.savePowerCount();
    }

    usePower(need,callback = null){
        if(this.powerCount < need){
            TipsManager.getInstance().showTips("体力值不足!");
            return false;
        }
        this.powerCount -= need;
        this.savePowerCount();

        callback && callback();
        return true;
    }
    
    private savePowerCount(){
        this.onPowerCountChange.Invoke();
        if(this.powerCount >= this.MAX_POWER_COUNT){
            this.onPowerCdChange.Invoke();
        }
        SaveData.set(this.savePowerCountKey,this.powerCount);
    }
    

}

