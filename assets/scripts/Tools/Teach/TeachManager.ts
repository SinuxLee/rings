import TeachStep, { TeachBase } from './TeachStep'

const { ccclass, property } = cc._decorator

@ccclass
export default class TeachManager extends cc.Component {
  saveKey: string = 'hj3jh3jfhjshf0'

  @property(cc.Node)
    teachMask: cc.Node = null

  @property(cc.Node)
    teachNodeParent: cc.Node = null

  @property(cc.Node)
    fingerNode: cc.Node = null

  @property([TeachStep])
    teachData: TeachStep[] = []

  currentTeach: TeachStep = null

  stepIndex: number = 0

  sourceNode: cc.Node = null
  teachNode: cc.Node = null

  isTeaching: boolean = false

  private sourceNodeParent = null
  private sourceZIndex = null

  private static _instance: TeachManager = null
  static get Instance (): TeachManager {
    return this._instance
  }

  onLoad () {
    TeachManager._instance = this
    cc.game.addPersistRootNode(this.node)
    this.node.zIndex = 100
  }

  public playTeach (teach: TeachStep | number) {
    this.stepIndex = 0
    if (teach instanceof TeachStep) {
      this.currentTeach = teach
    } else {
      this.currentTeach = this.teachData[teach]
    }
    this.isTeaching = true
    this.showTeach()
  }

  private showTeach () {
    if (this.stepIndex >= this.currentTeach.teachStep.length) {
      this.endStep()
      return
    }
    const stepInfo: TeachBase = this.currentTeach.teachStep[this.stepIndex]

    // console.log("path",stepInfo.btnPath);

    this.sourceNode = cc.find(stepInfo.btnPath)
    if (!this.sourceNode) {
      this.scheduleOnce(() => {
        this.showTeach()
      }, 0.16)
      return
    }

    this.teachMask.active = stepInfo.needMask

    this.sourceNodeParent = this.sourceNode.parent
    this.sourceZIndex = this.sourceNode.zIndex

    this.sourceNode.setParent(this.teachNodeParent)

    if (stepInfo.showFinger) {
      this.fingerNode.setWorldPos(this.sourceNode.getWorldP())
      this.fingerNode.active = true
    }
    this.sourceNode.on(cc.Node.EventType.TOUCH_END, this.toNextStep.bind(this))
  }

  private toNextStep () {
    try {
      this.sourceNode.off(cc.Node.EventType.TOUCH_END, this.toNextStep)
      this.sourceNode.setParent(this.sourceNodeParent)
      this.sourceNode.zIndex = this.sourceZIndex
    } catch {}

    this.fingerNode.active = false

    this.scheduleOnce(() => {
      this.stepIndex++
      this.showTeach()
    }, 0.16)
  }

  private endStep () {
    this.isTeaching = false
    this.currentTeach = null
    this.sourceNode = null
    this.teachMask.active = false
    this.sourceNodeParent = null
    this.sourceZIndex = null
    this.fingerNode.active = false
  }
}
