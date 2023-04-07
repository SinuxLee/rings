import RingPoint from './RingPoint'
import Ring from './Ring'

const { ccclass, property } = cc._decorator

@ccclass
export default class NextRingPoint extends RingPoint {
  private beginPos: cc.Vec2 = null

  onLoad () {
    this.beginPos = this.node.position
  }

  onEnable () {
    this.node.position = this.beginPos.sub(cc.v2(0, 300))
    cc.tween(this.node).by(0.2, { position: cc.v2(0, 300) }).start()
  }

  createNew (ring: Ring[]) {
    ring.forEach(r => {
      this.setRing(r)
    })

    this.node.active = true
  }

  resetPos () {
    this.node.position = this.beginPos
  }

  resetRingPoint () {
    this.node.position = this.beginPos
    this.node.active = false
    this.clearRing()
  }

  onDiscard () {
    cc.tween(this.node).by(0.2, { position: cc.v2(0, -300) }).call(() => {
      this.node.active = false
      this.clearRing()
    }).start()
  }
}
