import SignInItem from "./SignInItem";
import UIPanelBase from "../../YZKCocos/UIFrame/UIPanelBase";
import UIFrameDataTransfer from "../../UIFrameDataTransfer";
import { TimeManager } from "../../YZKCocos/Tools/TimeManager";
import { VideoManager } from "../../YZKCocos/VideoManager/VideoManager";
import YZK from "../../YZKCocos/YZK";
import GameManager from "../../Game/GameManager";
import { SaveData } from "../../YZKCocos/Tools/SaveData";
import SoundManager, { SoundName } from "../../Tools/SoundManager";
import ShareGameManager from "../../YZKCocos/ShareGameManager/ShareGameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignInUI extends UIPanelBase {

    private readonly saveKey = "saveSignData";
    private readonly coinsCOunt:number[] = [10,20,30,50,60,70,80];

    private exitBtn:cc.Node = null;
    private parentNode:cc.Node = null;
    private doubleGetBtn:cc.Node = null;
    private normalGetBtn:cc.Node = null;
   
    private items:SignInItem[] = [];
    private saveData:{date,index}= null;

    onLoad(){
        super.onLoad();

        this.items = this.parentNode.getComponentsInChildren(SignInItem);
    }

    onEnable(){

        super.onEnable();


        this.doubleGetBtn.active = false;
        this.normalGetBtn.active = false;

        this.getSaveData();
        this.updateUI();

        this.showGetBtn();
    }
   
  
    initComponent(){
        this.exitBtn = this.node.getChildByName("exit");
        this.parentNode = this.node.getChildByName("parentNode");
        this.doubleGetBtn = this.node.getChildByName("doubleBtn");
        this.normalGetBtn = this.node.getChildByName("normalBtn");
    }

    addBtnListener(){
        this.exitBtn.addListener(this.btnOfExit,this);
        this.doubleGetBtn.addListener(this.btnOfDoubleGet,this);
        this.normalGetBtn.addListener(this.btnOfGet,this);
    }

    updateUI(){
        let index = this.saveData.index;

        for(let i = 0;i<this.items.length;i++){
            this.items[i].countLabel.string = `x${this.coinsCOunt[i]}`;
            this.items[i].completeNode.active = i < index;
        }
      
    }

    btnOfGet(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        GameManager.getInstance().playerData.coins += this.coinsCOunt[this.saveData.index];
      
        this.saveData.date = TimeManager.getDate().toLocaleDateString();
        this.saveData.index ++;
        //save
        this.setSaveData();

        this.updateUI();

        this.doubleGetBtn.active = false;
        this.normalGetBtn.active = false;
    }

    btnOfDoubleGet(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        VideoManager.showVideo(()=>{
            GameManager.getInstance().playerData.coins += this.coinsCOunt[this.saveData.index];
          
            this.saveData.date = TimeManager.getDate().toLocaleDateString();
            this.saveData.index ++;
            //save
            this.setSaveData();
            this.updateUI();

            this.doubleGetBtn.active = false;
            this.normalGetBtn.active = false;
        });
    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.closeSelf();
    }

    showGetBtn(){
        let isToday = this.saveData.date == TimeManager.getDate().toLocaleDateString();
        this.doubleGetBtn.active = !isToday;
        this.scheduleOnce(()=>{
            let isToday = this.saveData.date == TimeManager.getDate().toLocaleDateString();
            this.normalGetBtn.active = !isToday;
        },2);
    }

    getSaveData(){
        this.saveData = SaveData.get(this.saveKey,{date:"",index:0});
    }

    setSaveData(){
        SaveData.set(this.saveKey,this.saveData);
    }
}
