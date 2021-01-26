import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";
import GameManager, { GameType } from "../Game/GameManager";
import TipsManager from "../YZKCocos/Tools/TipsManager";
import PowerManager from "../YZKCocos/Tools/PowerManager";
import SoundManager, { SoundName } from "../Tools/SoundManager";
import GunDataManager from "../Data/GunDataManager";
import SelectGunItem from "./SelectGunItem";
import SpriteFrameManager from "../Tools/SpriteFrameManager";
import ShareGameManager from "../YZKCocos/ShareGameManager/ShareGameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectGunUI extends UIPanelBase {

    private itemParent:cc.Node = null;
    private itemPrefab:cc.Node = null;
    private conditionLab:cc.Label = null;
    private useBtn:cc.Node = null;
    private selectBoxNode:cc.Node = null;
    private exitBtn:cc.Node = null;

    private itemList:SelectGunItem[] = [];

    private selectIndex = 0;
    private onChangeGun = null;

    onLoad(){

        super.onLoad();

        this.initUI();

        this.setSelectBox();
    }

    onEnable(){
        super.onEnable();

        this.selectIndex = GameManager.getInstance().playerData.useGun;

        this.updateUI();

        this.btnOfSelectItem(null,this.selectIndex);
    }

    onInit(param){
        this.onChangeGun = param[0][0];
    }

    initComponent(){
        this.itemParent = this.node.getChildByPath("ScrollView/view/content");
        this.itemPrefab = this.node.getChildByName("GunItem");
        this.conditionLab = this.node.getChildByName("tiaojian").getComponent(cc.Label);
        this.useBtn = this.node.getChildByName("useBtn");
        this.selectBoxNode = this.node.getChildByName("selectBox");
        this.exitBtn = this.node.getChildByName("cha");

    }

    addBtnListener(){
        this.useBtn.addListener(this.btnOfUse,this);
        this.exitBtn.addListener(this.closeSelf,this);
    }

    initUI(){
        let length = GunDataManager.getInstance().getGunCount();
        for(let i=0;i<length;i++){
            let node = cc.instantiate(this.itemPrefab);
            node.setParent(this.itemParent);
            let item = node.getComponent(SelectGunItem);
            item.icon.spriteFrame = SpriteFrameManager.Instance.getItemById(i);
            this.itemList.push(item); 
            node.addListener(this.btnOfSelectItem,this,i);
            node.active = true;
        }
    }

    updateUI(){
        let ownGuns = GameManager.getInstance().playerData.ownGuns;
        for(let i=0;i<this.itemList.length;i++){
            this.itemList[i].lock.active = ownGuns[i] != 1;
        }
    }

    btnOfUse(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        GameManager.getInstance().playerData.useGun = this.selectIndex;
        GameManager.getInstance().savePlayerData();
        
        this.onChangeGun && this.onChangeGun();

        this.closeSelf();
    }

    btnOfSelectItem(e,index){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        let ownGuns = GameManager.getInstance().playerData.ownGuns;
        if(ownGuns[index] != 1){
            let high = GunDataManager.getInstance().getGunData(index).high;
            let condition = `达到${high}解锁`;
            TipsManager.getInstance().showTips(condition);
            this.conditionLab.string = condition;
            this.useBtn.active = false;
        }else{
            this.conditionLab.string = "";
            this.useBtn.active = true;
        }
        this.selectIndex = index;

        this.setSelectBox();
    }

    setSelectBox(){
        this.selectBoxNode.setParent(this.itemList[this.selectIndex].select);
        this.selectBoxNode.position = cc.v2();
        this.selectBoxNode.active = true;
    }
	
}
