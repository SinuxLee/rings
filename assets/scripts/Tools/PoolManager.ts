import { Dictionary } from '../YZKCocos/Tools/Dictionary'

const { ccclass, property } = cc._decorator

/**
 * 对象池脚本
 * 挂在需要使用对象池的节点上
 * 该节点会成为对象池的根节点
 */
@ccclass
export default class PoolManager extends cc.Component {
  private poolParentDic: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>()
  private prefabsMap: Dictionary<string, cc.Node[]> = new Dictionary<string, cc.Node[]>()

  /***
     * 获取一个预制体实例
     * prefab: 预制体
     * worldPos: 世界位置，用parent.convertWorldSpaceAR转换的位置
     * angle: 旋转量
     */
  public takeNode (prefab: cc.Prefab, worldPos?: cc.Vec2, angle: number = 0, active: boolean = false): cc.Node {
    const temp = this.findNode(prefab)
    if (worldPos) {
      temp.position = temp.parent.convertToNodeSpaceAR(worldPos)
    } else {
      temp.position = cc.Vec2.ZERO
    }
    temp.angle = angle
    temp.active = active
    return temp
  }

  /**
     * 重置所有预制体实例为false
     */
  public resetAll () {
    this.prefabsMap.forEach((name, node) => {
      node.forEach((n) => {
        n.active = false
      })
    })
  }

  /**
     * 销毁所有预制体实例
     */
  public releaseAll () {
    this.prefabsMap.forEach((name, node) => {
      node.forEach((n) => {
        n.destroy()
      })
    })
    this.poolParentDic = new Dictionary<string, cc.Node>()
    this.prefabsMap = new Dictionary<string, cc.Node[]>()
    this.node.removeAllChildren()
  }

  /**
     * 获取对应的预制体所有生成的实例
     */
  public getNodes (name: string): cc.Node[] {
    return this.prefabsMap.getValue(name)
  }

  private findNode (prefab: cc.Prefab): cc.Node {
    const unUse: cc.Node = this.haveUnuse(prefab.name)
    return unUse == null ? this.addNew(prefab) : unUse
  }

  private haveUnuse (name: string): cc.Node {
    if (!this.prefabsMap.hasKey(name)) {
      return null
    }
    const temp: cc.Node[] = this.prefabsMap.getValue(name)
    if (temp.length == 0) return null
    for (let i = 0; i < temp.length; i++) {
      if (!temp[i].active) { return temp[i] }
    }
    return null
  }

  private addNew (prefab: cc.Prefab): cc.Node {
    const parent: cc.Node = this.findParent(prefab.name)
    const list: cc.Node[] = this.prefabsMap.getValue(prefab.name)

    for (let i = 0; i < 4; i++) {
      const n: cc.Node = cc.instantiate(prefab)
      n.setParent(parent)
      n.name = list.length + ''
      n.active = false
      list.push(n)
    }
    return list[list.length - 1]
  }

  private findParent (name: string): cc.Node {
    if (!this.poolParentDic.hasKey(name)) {
      this.addInPool(name)
    }
    return this.poolParentDic.getValue(name)
  }

  private addInPool (name: string) {
    const temp = new cc.Node(name)
    temp.setParent(this.node)
    temp.position = cc.Vec2.ZERO
    this.poolParentDic.add(name, temp)
    this.prefabsMap.add(name, new Array<cc.Node>())
  }
}
