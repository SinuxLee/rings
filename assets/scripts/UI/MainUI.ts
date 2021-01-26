import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import { VideoManager } from "../YZKCocos/VideoManager/VideoManager";
import PowerManager from "../YZKCocos/Tools/PowerManager";
import YZK from "../YZKCocos/YZK";
import SoundManager, { SoundName } from "../Tools/SoundManager";
import GameManager, { SkinType, GameType } from "../Game/GameManager";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";
import TipsManager from "../YZKCocos/Tools/TipsManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends UIPanelBase {

    private soundNode:cc.Node = null;
    private soundOnNode:cc.Node = null;
    private soundOffNode:cc.Node = null;
	private diamondLab:cc.Label = null;
    private singleModelBtn:cc.Node = null;
 
	private classicModelBtn:cc.Node = null;
    private crossModelBtn:cc.Node = null;
    private crossModelMask:cc.Node = null;
    private timeModelBtn:cc.Node = null;
    private timeModelMask:cc.Node = null;
    private rankBtn:cc.Node = null;
	private shopBtn:cc.Node = null;
	private freeDiamondBtn:cc.Node = null;
    private freeScienceSkinBtn:cc.Node = null;
    private shareBtn:cc.Node = null;
    
    private singleModeScoreLab:cc.Label = null;
    private classicModeScoreLab:cc.Label = null;
    private crossModeScoreLab:cc.Label = null;
    private timeModeScoreLab:cc.Label = null;
    
    private soundCtrl:boolean = false;

    onEnable(){
        super.onEnable();

        this.soundCtrl = SoundManager.getInstance().getSoundControl();
        this.updateSound();

        this.updateModelScore();
        
        this.updateDiamond();
        GameManager.onDiamondChange.add(this.updateDiamond.bind(this),this.node.uuid);

        this.updateFreeScienceBtn();
    }
   

    onDisable(){
        super.onDisable();
        GameManager.onDiamondChange.remove(this.node.uuid);

    }

    initComponent(){

        this.soundNode = this.node.getChildByPath("sound");
        this.soundOnNode = this.soundNode.getChildByPath("on");
        this.soundOffNode = this.soundNode.getChildByPath("off");
        this.diamondLab = this.node.getChildByPath("diamond/value").getComponent(cc.Label);
        this.singleModelBtn = this.node.getChildByPath("单环模式");
        this.classicModelBtn = this.node.getChildByPath("经典模式");
        this.crossModelBtn = this.node.getChildByPath("十字星");
        this.crossModelMask = this.crossModelBtn.getChildByPath("lock");
        this.timeModelBtn = this.node.getChildByPath("限时模式");
        this.timeModelMask = this.timeModelBtn.getChildByPath("lock");
        //this.rankBtn = this.node.getChildByPath("paihangb");
        this.shopBtn = this.node.getChildByPath("zhuti");
        this.freeDiamondBtn = this.node.getChildByPath("freeDiamond");
        this.freeScienceSkinBtn = this.node.getChildByPath("freeSkin");
        this.shareBtn = this.node.getChildByPath("分享");

        this.singleModeScoreLab = this.singleModelBtn.getChildByPath("heidi/value").getComponent(cc.Label);
        this.classicModeScoreLab = this.classicModelBtn.getChildByPath("heidi/value").getComponent(cc.Label);
        this.crossModeScoreLab = this.crossModelBtn.getChildByPath("heidi/value").getComponent(cc.Label);
        this.timeModeScoreLab = this.timeModelBtn.getChildByPath("heidi/value").getComponent(cc.Label);

    }

    addBtnListener(){

        this.soundNode.addListener(this.btnOfSound,this);
        this.singleModelBtn.addListener(this.btnOfSingleModel,this);
        this.classicModelBtn.addListener(this.btnOfClassicModel,this);
        this.crossModelBtn.addListener(this.btnOfCrossModel,this);
        this.timeModelBtn.addListener(this.btnOfTimeModel,this);
        //this.rankBtn.addListener(this.btnOfRank,this);
        this.shopBtn.addListener(this.btnOfShop,this);
        this.freeDiamondBtn.addListener(this.btnOfFreeDiamond,this);
        this.freeScienceSkinBtn.addListener(this.btnOfFreeSkin,this);
        this.shareBtn.addListener(this.btnOfShare,this);
    }

    updateDiamond(value = null){
        if(!value){
            value = GameManager.getInstance().playerData.diamond;
        }
        this.diamondLab.string = value + "";
    }

    updateModelScore(){
        let data = GameManager.getInstance().playerData;
        this.singleModeScoreLab.string = "" + data.bestScore[GameType.单环];
        this.classicModeScoreLab.string = "" + data.bestScore[GameType.经典];
        this.crossModeScoreLab.string = "" + data.bestScore[GameType.十字];
        this.timeModeScoreLab.string = "" + data.bestScore[GameType.限时];
        

        this.crossModelMask.active = data.bestScore[GameType.单环] < 120;
        this.timeModelMask.active = data.bestScore[GameType.经典] < 120;

    }

    updateFreeScienceBtn(){
        this.freeScienceSkinBtn.active = GameManager.getInstance().playerData.skin[SkinType.科学] != 1;
    }

    btnOfSound(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.soundCtrl = !this.soundCtrl;
        SoundManager.getInstance().setSoundCtrl(this.soundCtrl);
        this.updateSound();
    }

    updateSound(){
        this.soundOnNode.active = this.soundCtrl;
        this.soundOffNode.active = !this.soundCtrl;
    }

    btnOfSingleModel(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        GameManager.getInstance().enterGame(GameType.单环,()=>{
            UIPanelManager.showPanel(PanelName.GameUI);
        });
    }

    btnOfClassicModel(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        GameManager.getInstance().enterGame(GameType.经典,()=>{
            UIPanelManager.showPanel(PanelName.GameUI);
        });
    }

    btnOfCrossModel(){

        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        if(GameManager.getInstance().playerData.bestScore[GameType.单环] < 120){
            TipsManager.getInstance().showTips("单环模式120解锁!");
            return;
        }
        GameManager.getInstance().enterGame(GameType.十字,()=>{
            UIPanelManager.showPanel(PanelName.GameUI);
        });
    }

    btnOfTimeModel(){

        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        if(GameManager.getInstance().playerData.bestScore[GameType.经典] < 100){
            TipsManager.getInstance().showTips("经典模式100解锁!");
            return;
        }
        GameManager.getInstance().enterGame(GameType.限时,()=>{
            UIPanelManager.showPanel(PanelName.GameUI);
        });
    }

    btnOfRank(){

    }

    btnOfShop(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        UIPanelManager.showPanel(PanelName.ShopUI);
    }

    btnOfFreeDiamond(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        VideoManager.showVideo(()=>{
            GameManager.getInstance().playerData.diamond += 50;
        });
    }

    btnOfFreeSkin(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        VideoManager.showVideo(()=>{
            GameManager.getInstance().playerData.skin[SkinType.科学] = 1;
            this.updateFreeScienceBtn();
        });
    }


    btnOfShare(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        YZK.shareToWx();
    }

}
