import UIPanelBase from '../YZKCocos/UIFrame/UIPanelBase'
import SoundManager, { SoundName } from '../Tools/SoundManager'
import GameManager from '../Game/GameManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class SettingUI extends UIPanelBase {
  private exitBtn: cc.Node = null
  private shakeBtn: cc.Node = null
  private soundBtn: cc.Node = null

  private shakeOnNode: cc.Node = null
  private shakeOffNode: cc.Node = null
  private soundOnNode: cc.Node = null
  private soundOffNode: cc.Node = null

  private soundCtrl: boolean = true
  private shakeCtrl: boolean = true

  onEnable () {
    this.soundCtrl = SoundManager.getInstance().getSoundControl()
    this.shakeCtrl = GameManager.getInstance().playerData.isShake

    this.updateSound()
    this.updateShake()
  }

  initComponent () {
    this.exitBtn = this.node.getChildByName('exit')
    this.shakeBtn = this.node.getChildByName('shake')
    this.soundBtn = this.node.getChildByName('sound')
    this.shakeOnNode = this.shakeBtn.getChildByName('on')
    this.shakeOffNode = this.shakeBtn.getChildByName('off')
    this.soundOnNode = this.soundBtn.getChildByName('on')
    this.soundOffNode = this.soundBtn.getChildByName('off')
  }

  addBtnListener () {
    this.exitBtn.addListener(this.btnOfExit, this)
    this.shakeBtn.addListener(this.btnOfShake, this)
    this.soundBtn.addListener(this.btnOfSound, this)
  }

  updateSound () {
    this.soundOnNode.active = this.soundCtrl
    this.soundOffNode.active = !this.soundCtrl
  }

  updateShake () {
    this.shakeOnNode.active = this.shakeCtrl
    this.shakeOffNode.active = !this.shakeCtrl
  }

  btnOfExit () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    this.closeSelf()
  }

  btnOfShake () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    this.shakeCtrl = !this.shakeCtrl
    GameManager.getInstance().playerData.isShake = this.shakeCtrl
    GameManager.getInstance().savePlayerData()

    this.updateShake()
  }

  btnOfSound () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    this.soundCtrl = !this.soundCtrl
    SoundManager.getInstance().setSoundCtrl(this.soundCtrl)
    this.updateSound()
  }
}
