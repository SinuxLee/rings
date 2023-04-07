import { default as MiniGameBase, MiniGameData } from './MiniGameBase'

const { ccclass, property } = cc._decorator

@ccclass
export class MG_Browser extends MiniGameBase {
  constructor () {
    super()
    this.appData = new MiniGameData()
  }
}
