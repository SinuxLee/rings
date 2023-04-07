import SingleBase from '../YZKCocos/Tools/SingleBase'
import { Dictionary } from '../YZKCocos/Tools/Dictionary'
import ReadDataTable from '../Tools/ReadDataTable'

const { ccclass, property } = cc._decorator

@ccclass
export default class GunDataManager extends SingleBase {
  getGunCount () {
    return ReadDataTable.guns.length
  }

  getGunData (index) {
    return ReadDataTable.guns[index]
  }
}
export class LevelData {
  b: [{ x: 0, y: 0, w: 0, h: 0 }]
  e: { x: 0, y: 0 }
  w: 0
  h: 0
  c: ''
}
