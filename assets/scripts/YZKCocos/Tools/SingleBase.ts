
const { ccclass, property } = cc._decorator

@ccclass
export default class SingleBase extends cc.Component {
  private _isInit: boolean = false
  private static readonly _instance = null
  public static getInstance<T extends SingleBase>(this: new () => T): T {
    if (!(this as any)._instance) {
      const node = new cc.Node(this.name)
      node.active = false
      node.setParent(cc.director.getScene())
      cc.game.addPersistRootNode(node);
      (this as any)._instance = node.addComponent(this);
      (this as any)._instance._isInit = true
      node.active = true
    }
    return (this as any)._instance
  }

  onLoad () {
    if (!this._isInit) {
      this._isInit = true
      cc.game.addPersistRootNode(this.node)
      const className = cc.js.getClassName(this)
      const com = cc.js.getClassByName(className)
      // @ts-expect-error
      com._instance = this
    }
  }
}
