import UIPanelBase from '../YZKCocos/UIFrame/UIPanelBase'
import GameManager from '../Game/GameManager'
import UIPanelManager from '../YZKCocos/UIFrame/UIPanelManager'
import { PanelName } from '../YZKCocos/UIFrame/UIPanelName'
import GameUIItem from './GameUIItem'
import { VideoManager } from '../YZKCocos/VideoManager/VideoManager'
import SoundManager, { SoundName } from '../Tools/SoundManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class GameUI extends UIPanelBase {
  private diamondLab: cc.Label = null
  private bestScoreLab: cc.Label = null
  private currScoreLab: cc.Label = null
  private scoreRateLab: cc.Label = null

  private chehui: GameUIItem = null
  private diuqi: GameUIItem = null
  private xiaochu: GameUIItem = null

  private pauseNode: cc.Node = null
  private shopNode: cc.Node = null
  private doubleHitNode: cc.Node = null
  private doubleHitLab: cc.Label = null

  onLoad () {
    super.onLoad()

    GameManager.getInstance().gameui = this

    GameManager.onDiamondChange.add(this.updateDiamond.bind(this), this.node.uuid)
    GameManager.onBestScoreChange.add(this.updateBestScore.bind(this), this.node.uuid)
  }

  onEnable () {
    super.onEnable()

    const playerData = GameManager.getInstance().playerData
    cc.log(playerData)
    this.updateBestScore(playerData.bestScore[GameManager.getInstance().gameType])
    this.updateDiamond(playerData.diamond)

    this.updateInfoScore(0, 0)

    this.updateChehuiUi(false)
    this.updateDiuqiUi(true)
    this.updateXiaochuUi(false)
  }

  onDestroy () {
    super.onDestroy()
    GameManager.getInstance().gameui = null

    GameManager.onDiamondChange.remove(this.node.uuid)
    GameManager.onBestScoreChange.remove(this.node.uuid)
  }

  initComponent () {
    this.diamondLab = this.node.getChildByPath('diamond/value').getComponent(cc.Label)
    this.bestScoreLab = this.node.getChildByPath('best/value').getComponent(cc.Label)
    this.currScoreLab = this.node.getChildByPath('current').getComponent(cc.Label)
    this.scoreRateLab = this.node.getChildByPath('rate').getComponent(cc.Label)

    this.pauseNode = this.node.getChildByPath('zanting')
    this.shopNode = this.node.getChildByPath('zhuti')

    this.chehui = this.node.getChildByPath('chehui').getComponent(GameUIItem)
    this.diuqi = this.node.getChildByPath('diuqi').getComponent(GameUIItem)
    this.xiaochu = this.node.getChildByPath('xiaochu').getComponent(GameUIItem)

    this.doubleHitNode = this.node.getChildByPath('连击')
    this.doubleHitLab = this.doubleHitNode.getChildByPath('value').getComponent(cc.Label)
  }

  addBtnListener () {
    this.pauseNode.addListener(this.btnOfPause, this)
    this.shopNode.addListener(this.btnOfShop, this)
    this.chehui.node.addListener(this.btnOfChehui, this)
    this.diuqi.node.addListener(this.btnOfDiuqi, this)
    this.xiaochu.node.addListener(this.btnOfXiaochu, this)
  }

  private btnOfPause () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    UIPanelManager.showPanel(PanelName.PauseUI)
  }

  private btnOfShop () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    UIPanelManager.showPanel(PanelName.ShopUI)
  }

  private updateDiamond (value) {
    this.diamondLab.string = value + ''
  }

  private updateBestScore (value) {
    this.bestScoreLab.string = value + ''
  }

  updateInfoScore (score, rate) {
    this.currScoreLab.string = score + ''
    // cc.tween(this.currScoreLab.node).to(0.3,{scale:1.2}).to(0.3,{scale:1}).start();

    if (rate > 1) {
      this.scoreRateLab.node.active = true
      this.scoreRateLab.string = 'x' + rate
      cc.tween(this.scoreRateLab.node).to(0.3, { scale: 1.5 }).to(0.3, { scale: 1 }).start()

      this.doubleHitNode.opacity = 255
      this.doubleHitLab.string = 'x' + rate
      cc.tween(this.doubleHitNode).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).to(0.5, { opacity: 0 }).start()

      SoundManager.getInstance().playSound(SoundName.sound_double_hit)
    } else {
      this.scoreRateLab.node.active = false
      this.doubleHitNode.opacity = 0
    }
  }

  btnOfChehui () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    if (this.chehui.useDiamond) {
      GameManager.getInstance().playerData.diamond -= 10
      GameManager.getInstance().game.recoveryBackupData()
    } else {
      VideoManager.showVideo(() => {
        GameManager.getInstance().game.recoveryBackupData()
      })
    }
  }

  btnOfDiuqi () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    if (this.diuqi.useDiamond) {
      GameManager.getInstance().playerData.diamond -= 10
      GameManager.getInstance().game.discardNextPoints()
    } else {
      VideoManager.showVideo(() => {
        GameManager.getInstance().game.discardNextPoints()
      })
    }
  }

  btnOfXiaochu () {
    SoundManager.getInstance().playSound(SoundName.sound_common_click)

    if (this.xiaochu.useDiamond) {
      GameManager.getInstance().playerData.diamond -= 10
      GameManager.getInstance().game.clearRingPoint()
    } else {
      VideoManager.showVideo(() => {
        GameManager.getInstance().game.clearRingPoint()
      })
    }
  }

  updateChehuiUi (canUse: boolean) {
    this.chehui.setButtonInfo(canUse)
  }

  updateDiuqiUi (canUse: boolean) {
    this.diuqi.setButtonInfo(canUse)
  }

  updateXiaochuUi (canUse: boolean) {
    this.xiaochu.setButtonInfo(canUse)
  }
}
