import YZK from '../YZK'

const { ccclass, property } = cc._decorator

@ccclass
export default class ShareToFriend extends cc.Component {
  onLoad () {
    this.node.addListener(this.btnOfShare, this)
  }

  btnOfShare () {
    YZK.shareToWx()
  }
}
