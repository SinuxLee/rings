import UIPanelManager from './UIPanelManager'
import { PanelName } from './UIPanelName'
import { VideoManager } from '../../YZKCocos/VideoManager/VideoManager'

const { ccclass, property } = cc._decorator

const PanelType = cc.Enum({
  界面: 0,
  弹窗: 1
})

@ccclass
export default class UIPanelBase extends cc.Component {
  @property({
    displayName: '界面类型',
    type: cc.Enum(PanelType)
  })
    panelType = PanelType.界面

  @property({
    displayName: '允许广告'
  })
    canShowAd: boolean = false

  @property({
    displayName: '随机弹出插屏',
    visible () {
      return this.canShowAd
    }
  })
    useInsertAd: boolean = false

  @property({
    displayName: '弹出插屏的概率',
    visible () {
      return this.canShowAd && this.useInsertAd
    }
  })
    insertAdProb: number = 0.5

  /**
     * 接受初始化参数的形参
     * @param params 形参
     * parmas会把所有参数集合成一个数组
     *
     * 所以得到的数据是一个长度为1，内含实参的数组
     *
     * 可以使用params[0][...]取得对应的数据
     */
  onInit (params) {

  }

  onLoad () {
    this.initComponent()
    this.addBtnListener()

    UIPanelManager.addPanel(this.node)
  }

  onEnable () {
    if (this.canShowAd) {
      if (this.useInsertAd) {
        const rNum = Math.random()
        if (rNum < this.insertAdProb) {
          const panelId = PanelName[this.node.name]
          VideoManager.showInsert(panelId)
        } else {
          VideoManager.showBanner()
        }
      } else {
        VideoManager.showBanner()
      }
    }
  }

  onDisable () {
    if (this.canShowAd) {
      VideoManager.hideBanner()
    }
  }

  onDestroy () {
    try {
      cc.loader.releaseRes('ui/' + this.node.name)
    } catch {}

    UIPanelManager.removePanel(this.node)
  }

  closeSelf () {
    this.node.active = false
  }

  /**
     * 查找控件
     */
  initComponent () {

  }

  /**
     * 添加按钮监听
     */
  addBtnListener () {

  }
}
