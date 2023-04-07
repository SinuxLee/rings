import UIPanelBase from '../YZKCocos/UIFrame/UIPanelBase'
import YZK from '../YZKCocos/YZK'
import GameManager from '../Game/GameManager'
import SoundManager, { SoundName } from '../Tools/SoundManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class AddHeartUI extends UIPanelBase {
  private shareBtn: cc.Node = null
  private cancelBtn: cc.Node = null

  initComponent () {
    this.shareBtn = this.node.getChildByName('shareBtn')
    this.cancelBtn = this.node.getChildByName('cancelBtn')
  }

  addBtnListener () {
    this.shareBtn.addListener(this.btnOfShare, this)
    this.cancelBtn.addListener(this.btnOfCancel, this)
  }

  btnOfShare () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)
    YZK.shareToWx(() => {
      GameManager.getInstance().game.addHeartCount()
      this.closeSelf()
    })
  }

  btnOfCancel () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)
    this.closeSelf()
  }
}
