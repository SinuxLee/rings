
const { ccclass, property } = cc._decorator

@ccclass('TeachBase')
export class TeachBase {
  @property({
    multiline: true
  })
    btnPath: any = ''

  @property(cc.Boolean)
    showFinger: boolean = true

  @property(cc.Boolean)
    needMask: boolean = true
}

@ccclass
export default class TeachStep extends cc.Component {
  @property([TeachBase])
    teachStep: TeachBase[] = []
}
