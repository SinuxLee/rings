import UIPanelBase from "../YZKCocos/UIFrame/UIPanelBase";
import { VideoManager } from "../YZKCocos/VideoManager/VideoManager";
import PowerManager from "../YZKCocos/Tools/PowerManager";
import SoundManager, { SoundName } from "../Tools/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GetPowerUI extends UIPanelBase {

    private exitBtn:cc.Node = null;
    private getBtn:cc.Node = null;

    initComponent(){
        this.exitBtn = this.node.getChildByName("exit");
        this.getBtn = this.node.getChildByName("get");
    }

    addBtnListener(){
        this.exitBtn.addListener(this.btnOfExit,this);
        this.getBtn.addListener(this.btnOfGet,this);
    }

    btnOfExit(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        this.closeSelf();
    }

    btnOfGet(){
        SoundManager.getInstance().playSound(SoundName.sound_common_click);

        VideoManager.showVideo(()=>{
            PowerManager.getInstance().addPowerCount(5);
            this.closeSelf();
        });        
    }
	
}
