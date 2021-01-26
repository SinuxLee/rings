import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import GameManager, { GameType } from "../Game/GameManager";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";
import YZK from "../YZKCocos/YZK";
import SoundManager, { SoundName } from "../Tools/SoundManager";
import PowerManager from "../YZKCocos/Tools/PowerManager";
import { Random } from "../Tools/Random";
import { VideoManager } from "../YZKCocos/VideoManager/VideoManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndUI extends UIPanelBase {

    private currScoreLab:cc.Label = null;
    private highScoreLab:cc.Label = null;
    private newHighNode:cc.Node = null;
    private getDiamondLab:cc.Label = null;
    private doubleBtn:cc.Node = null;

    private exitBtn:cc.Node = null;

    private currScore:number = 0;
    private highScore:number = 0;
    private maxRate:number = 0;
    private diamondCount:number = 0;

    onInit(param){
        this.currScore = param[0][0];
        this.maxRate = param[0][1];

    }

    onEnable(){
        super.onEnable();

        SoundManager.getInstance().playSound(SoundName.sound_end);

        if(GameManager.getInstance().gameType != GameType.十字){
            this.diamondCount = Math.floor(this.currScore / 10) + this.maxRate;
        }else{
            this.diamondCount = Math.floor(Math.sqrt(this.currScore)); 
        }

        this.getDiamondLab.string = "" + this.diamondCount;

        this.highScore = GameManager.getInstance().playerData.bestScore[GameManager.getInstance().gameType];
        this.newHighNode.active = this.highScore <= this.currScore;

        this.currScoreLab.string = this.currScore + "";
        this.highScoreLab.string = this.highScore + "";

    }

    initComponent(){
        this.currScoreLab = this.node.getChildByName("currScore").getComponent(cc.Label);
        this.highScoreLab = this.node.getChildByPath("highScore").getComponent(cc.Label);
        this.exitBtn = this.node.getChildByName("exit");
        this.newHighNode = this.node.getChildByPath("currScore/newHigh");
        this.getDiamondLab = this.node.getChildByPath("zuanshi/value").getComponent(cc.Label);
        this.doubleBtn = this.node.getChildByPath("anniu");
    }

    addBtnListener(){
        this.doubleBtn.addListener(this.btnOfDouble,this);
        this.exitBtn.addListener(this.btnOfExit,this);
    }

    btnOfDouble(){

        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        VideoManager.showVideo(()=>{

            GameManager.getInstance().playerData.diamond += this.diamondCount * 2;

            GameManager.getInstance().exitGame(()=>{
                UIPanelManager.showPanel(PanelName.MainUI);
            });
            this.closeSelf();
        });

    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        GameManager.getInstance().playerData.diamond += this.diamondCount;
        
        GameManager.getInstance().exitGame(()=>{
            UIPanelManager.showPanel(PanelName.MainUI);
        });
    }
   
}
