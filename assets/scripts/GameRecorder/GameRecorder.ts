import MiniGameManager from '../YZKCocos/MiniGameManager/MiniGameManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class GameRecorder extends cc.Component {
  @property({
    displayName: '最大录制时长',
    range: [3, 300],
    tooltip: '范围:3-300秒'
  })
    recordTime: number = 150

  @property(cc.SpriteFrame)
    startSprite: cc.SpriteFrame = null

  @property(cc.SpriteFrame)
    stopSprite: cc.SpriteFrame = null

  private buttonSprite: cc.Sprite = null
  private endTip: cc.Node = null

  private isStart: boolean = false

  onLoad () {
    // if(MiniGameManager.Instance && !MiniGameManager.Instance.isTouTiao ){
    //     this.node.active = false;
    // }

    cc.game.addPersistRootNode(this.node)

    this.buttonSprite = this.node.getChildByPath('buttonSprite').getComponent(cc.Sprite)
    this.endTip = this.node.getChildByPath('buttonSprite/endTip')

    this.endTip.active = false

    this.addListener()
  }

  addListener () {
    this.buttonSprite.node.addListener(this.bntOfRecord, this)
  }

  bntOfRecord () {
    this.isStart = !this.isStart
    if (this.isStart) {
      this.node.opacity = 100
      this.buttonSprite.spriteFrame = this.stopSprite

      MiniGameManager.Instance && MiniGameManager.Instance.gameRecorderStart((autoStop) => {
        if (autoStop) {
          this.endTip.active = true
        } else {
          this.endTip.active = false
          this.buttonSprite.spriteFrame = this.startSprite
        }
        this.node.opacity = 255
      }, this.recordTime)
    } else {
      MiniGameManager.Instance && MiniGameManager.Instance.gameRecorderStop()
    }
  }
}
