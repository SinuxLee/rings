import YZK from '../YZK'

const { ccclass, property } = cc._decorator

/**
 * 指定此节点在有无广告时的显示逻辑
 */
@ccclass
export default class VideoControl extends cc.Component {
  onEnable () {
    if (!YZK.isOpenVideo) {
      this.node.active = false
    }
  }
}
