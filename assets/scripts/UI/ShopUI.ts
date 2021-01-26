import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import ShopItem from "./ShopItem";
import GameManager from "../Game/GameManager";
import TipsManager from "../YZKCocos/Tools/TipsManager";
import SoundManager, { SoundName } from "../Tools/SoundManager";
import ShareGameManager from "../YZKCocos/ShareGameManager/ShareGameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopUI extends UIPanelBase {

    private readonly needDiamond:number[] = [0,100,150,200,300,260];

    private exitBtn:cc.Node = null;
    private diamondLab:cc.Label = null;
    private itemsParent:cc.Node = null;

    private items:ShopItem[] = [];

    onLoad(){
        super.onLoad();

        this.initUI();
    }

    onEnable(){
        super.onEnable();

        this.updateUI();

        this.updateDiamond();
        GameManager.onDiamondChange.add(this.updateDiamond.bind(this),this.node.uuid);
    }

    onDisable(){
        super.onDisable();
        GameManager.onDiamondChange.remove(this.node.uuid);
    }

    initComponent(){
        this.exitBtn = this.node.getChildByName("guanbi");
        this.itemsParent = this.node.getChildByPath("skins");
        this.diamondLab = this.node.getChildByPath("diamond/value").getComponent(cc.Label);
        
        this.items = this.itemsParent.getComponentsInChildren(ShopItem);
    }

    addBtnListener(){
        this.exitBtn.addListener(this.btnOfExit,this);

        for(let i=0;i<this.items.length;i++){
            this.items[i].node.addListener(this.btnOfBuyOrUse,this,i);       
        }
    }

    initUI(){
        for(let i=0;i<this.items.length;i++){
            this.items[i].diamondLab.string = "" + this.needDiamond[i];
        }
    }

    updateUI(){
        let playerData = GameManager.getInstance().playerData;
        for(let i=0;i<this.items.length;i++){
            this.items[i].diamondNode.active = playerData.skin[i] != 1;
            this.items[i].useCheck.active = playerData.useSkin == i;
        }
    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.closeSelf();
    }

    btnOfBuyOrUse(e,index){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        let playerData = GameManager.getInstance().playerData;
        if(playerData.skin[index] == 0){ // buy
            if(playerData.diamond < this.needDiamond[index]){
                TipsManager.getInstance().showTips("钻石不足");
                return;
            }
            playerData.diamond -= this.needDiamond[index];
            playerData.skin[index] = 1;
            playerData.useSkin = index;
            GameManager.getInstance().savePlayerData();
            this.updateUI();
            return;
        }

        playerData.useSkin = index;
        GameManager.getInstance().savePlayerData();
        this.updateUI();
    }
    
    updateDiamond(value = null){
        if(!value){
            value = GameManager.getInstance().playerData.diamond;
        }
        this.diamondLab.string = value + "";
    }
}
