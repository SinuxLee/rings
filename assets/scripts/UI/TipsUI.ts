import UIPanelBase from '../YZKCocos/UIFrame/UIPanelBase'
import { VideoManager } from '../YZKCocos/VideoManager/VideoManager'
import SoundManager, { SoundName } from '../Tools/SoundManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class TipsUI extends UIPanelBase {
  private exitBtn: cc.Node = null
  private getBtn: cc.Node = null

  private callback = null

  onInit (param) {
    this.callback = param[0][0]
  }

  initComponent () {
    this.exitBtn = this.node.getChildByName('exit')
    this.getBtn = this.node.getChildByName('getBtn')
  }

  addBtnListener () {
    this.exitBtn.addListener(this.btnOfExit, this)
    this.getBtn.addListener(this.btnOfGet, this)
  }

  btnOfExit () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    this.closeSelf()
  }

  btnOfGet () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    VideoManager.showVideo(() => {
      this.callback && this.callback()
      this.closeSelf()
    })
  }
}
