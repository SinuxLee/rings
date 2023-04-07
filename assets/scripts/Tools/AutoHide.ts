const { ccclass, property } = cc._decorator

@ccclass
export default class AutoHide extends cc.Component {
  @property
    delayTime: number = 1

  onEnable () {
    this.scheduleOnce(() => {
      this.SetActive(false)
    }, this.delayTime)
  }
}
