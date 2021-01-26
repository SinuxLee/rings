import SoundManager from "./SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundCtrl extends cc.Component {

    private audio:cc.AudioSource = null;

    onLoad(){
        this.audio = this.getComponent(cc.AudioSource);
    }

    onEnable(){
        if(this.audio){
            this.audio.mute = !SoundManager.Instance.getSoundControl();
        }
    }
}
