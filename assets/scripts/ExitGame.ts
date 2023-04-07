import PushAPI from './YZKCocos/Android/PushAPI'

const { ccclass, property } = cc._decorator

@ccclass
export default class ExitGame extends cc.Component {
  onLoad () {
    cc.game.addPersistRootNode(this.node)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
      PushAPI.getInstance().exitGame()
    })
  }
}
