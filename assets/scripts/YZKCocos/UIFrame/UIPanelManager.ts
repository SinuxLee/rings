import { PanelName } from './UIPanelName'
import UIPanelBase from './UIPanelBase'
import { Dictionary } from '../../YZKCocos/Tools/Dictionary'
import UIFrameDataTransfer from '../../UIFrameDataTransfer'

const { ccclass, property } = cc._decorator

@ccclass
export default class UIPanelManager {
  private static readonly panelDic: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>()
  private static panelZIndex = 0

  static addPanel (panel: cc.Node) {
    this.panelDic.add(panel.name, panel)
  }

  static removePanel (panel: cc.Node) {
    this.panelDic.remove(panel.name)
  }

  static showPanel (panelName: PanelName, ...params) {
    const pName = PanelName[panelName]
    this.showPanelByName(pName, params)
  }

  static hidePanel (panelName: PanelName) {
    const pName = PanelName[panelName]
    this.hidePanelByName(pName)
  }

  static clearPanel () {
    this.panelDic.forEach((k, v) => {
      v.destroy()
    })

    this.panelDic.clear()
  }

  static showLastPanel () {
    const keys = this.panelDic.keys

    if (keys.length < 2) {
      return
    }

    this.showPanelByName(keys[keys.length - 2])
  }

  private static showPanelByName (pName: string, ...params) {
    this.panelZIndex++

    const panel = this.panelDic.getValue(pName, null)

    if (panel) {
      this.panelDic.remove(pName)
      this.panelDic.add(pName, panel)
      if (params.length > 0) {
        panel.getComponent(UIPanelBase).onInit(params)
      }
      panel.zIndex = this.panelZIndex
      panel.active = true
      return
    }

    cc.loader.loadRes('ui/' + pName, cc.Prefab, (e, p) => {
      if (e) {
        console.error('实例化预制体错误,error = ', e)
        return
      }
      const node: cc.Node = cc.instantiate(p)
      node.name = pName
      node.setParent(UIFrameDataTransfer.getInstance().uiRoot)
      node.position = cc.Vec2.ZERO
      if (params.length > 0) {
        node.getComponent(UIPanelBase).onInit(params)
      }
      node.zIndex = this.panelZIndex
      node.active = true
    })
  }

  private static hidePanelByName (pName: string) {
    const panel = this.panelDic.getValue(pName, null)
    if (!panel) {
      panel.active = false
    }
  }
}
