const { ccclass, property } = cc._decorator

export interface UIFrameInterface {

  uiRoot: cc.Node

  getSpriteById: (itemId: number) => cc.SpriteFrame

  getNameById: (itemId: number) => string

  getCountById: (itemId: number) => number

  addItems: (itemIds: number[], itemCounts: number[], needShowWindow: boolean) => any

  useItems: (itemIds: number[], itemCounts: number[]) => any

  isItemEnough: (itemId: number) => boolean

  playClickSound: () => any

  playExitSound: () => any
}
