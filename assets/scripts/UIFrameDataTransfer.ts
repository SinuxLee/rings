import SingleBase from './YZKCocos/Tools/SingleBase'
import { PanelName } from './YZKCocos/UIFrame/UIPanelName'
import UIPanelManager from './YZKCocos/UIFrame/UIPanelManager'
import TipsManager from './YZKCocos/Tools/TipsManager'
import { UIFrameInterface } from './YZKCocos/UIFrame/UIFrameInterface'
import SpriteFrameManager from './Tools/SpriteFrameManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class UIFrameDataTransfer extends SingleBase implements UIFrameInterface {
  @property(cc.Node)
    uiRoot: cc.Node = null

  onLoad () {
    super.onLoad()

    if (!this.uiRoot) {
      this.uiRoot = this.node
    }
  }

  playClickSound () {
    cc.log('播放点击音效')
  }

  playExitSound () {
    cc.log('播放退出音效')
  }

  getSpriteById (id) {
    return null
  }

  getNameById (id) {
    return '测试'
  }

  getCountById (itemId) {
    return 1
  }

  addItems (itemIds: number[], itemCounts: number[], needShowWindow: boolean = true) {
    TipsManager.getInstance().showTips(`获得${itemIds[0]} *${itemCounts[0]}个`)
  }

  useItems (itemIds: number[], itemCounts: number[]) {
    TipsManager.getInstance().showTips(`使用${itemIds[0]} *${itemCounts[0]}个`)
  }

  isItemEnough (itemId: number): boolean {
    return true
  }
}
