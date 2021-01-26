import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";
import { VideoManager } from "../YZKCocos/VideoManager/VideoManager";
import GameManager from "../Game/GameManager";
import SoundManager, { SoundName } from "../Tools/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReviveUI extends UIPanelBase {

    private cdLab:cc.Label = null;
    private videoBtn:cc.Node = null;
    private exitBtn:cc.Node = null;

    private totalCd:number = 5;

    onEnable(){
        super.onEnable();

        this.totalCd = 5;
        this.cdLab.string = 5 + "";
    }

    initComponent(){
        this.cdLab = this.node.getChildByName("CD").getComponent(cc.Label);
        this.videoBtn = this.node.getChildByName("videoBtn");
        this.exitBtn = this.node.getChildByName("exit");
    }

    addBtnListener(){
        this.videoBtn.addListener(this.btnOfVideo,this);
        this.exitBtn.addListener(this.btnOfExit,this);
    }

    update(dt){
        this.totalCd -= dt;
        this.cdLab.string = Math.ceil(this.totalCd) + "";
        if(this.totalCd <= 0){
            this.closeSelf();
            UIPanelManager.showPanel(PanelName.EndUI);
        }
    }

    btnOfVideo(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        VideoManager.showVideo(()=>{
            GameManager.getInstance().game.revive();
            this.closeSelf();
        });
    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        this.closeSelf();

        UIPanelManager.showPanel(PanelName.EndUI);
    }
	
}
