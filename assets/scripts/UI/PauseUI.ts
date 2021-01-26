import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import YZK from "../YZKCocos/YZK";
import SoundManager, { SoundName } from "../Tools/SoundManager";
import GameManager from "../Game/GameManager";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseUI extends UIPanelBase {

    private soundBtn:cc.Node = null;
    private soundOnNode:cc.Node = null;
    private soundOffNode:cc.Node = null;

    private vibrateBtn:cc.Node = null;
    private vibrateOnNode:cc.Node = null;
    private vibrateOffNode:cc.Node = null;
    
    private exitBtn:cc.Node = null;
    private continueBtn:cc.Node = null;


    private soundCtrl:boolean = true;
    private vibrateCtrl:boolean = true;

    onEnable(){
        this.soundCtrl = SoundManager.getInstance().getSoundControl();
        this.updateSound();

        this.vibrateCtrl = GameManager.getInstance().playerData.vibrate;
        this.updateVibrate();
    }

    initComponent(){
        this.soundBtn = this.node.getChildByPath("sound");
        this.soundOnNode = this.soundBtn.getChildByPath("on");
        this.soundOffNode = this.soundBtn.getChildByPath("off");

        this.vibrateBtn = this.node.getChildByPath("vibrate");
        this.vibrateOnNode = this.vibrateBtn.getChildByPath("on");
        this.vibrateOffNode = this.vibrateBtn.getChildByPath("off");

        this.exitBtn = this.node.getChildByPath("退出");
        this.continueBtn = this.node.getChildByPath("继续");

    }

    addBtnListener(){
        this.soundBtn.addListener(this.btnOfSound,this);
        this.vibrateBtn.addListener(this.btnOfVibrate,this);
        this.continueBtn.addListener(this.btnOfContinue,this);
        this.exitBtn.addListener(this.btnOfExit,this);

    }

    btnOfSound(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.soundCtrl = !this.soundCtrl;
        SoundManager.getInstance().setSoundCtrl(this.soundCtrl);
        this.updateSound();
    }

    btnOfVibrate(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.vibrateCtrl = !this.vibrateCtrl;
        GameManager.getInstance().playerData.vibrate = this.vibrateCtrl;
        GameManager.getInstance().savePlayerData();
        this.updateVibrate();
    }

    updateSound(){
        this.soundOffNode.active = !this.soundCtrl;
        this.soundOnNode.active = this.soundCtrl;
    }

    updateVibrate(){
        this.vibrateOnNode.active = this.vibrateCtrl;
        this.vibrateOffNode.active = !this.vibrateCtrl;
    }

    btnOfContinue(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        this.closeSelf();
    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);
        this.closeSelf();
        GameManager.getInstance().exitGame(()=>{
            UIPanelManager.showPanel(PanelName.MainUI);
        });
    }
}
