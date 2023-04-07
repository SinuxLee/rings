import MiniGameManager from '../MiniGameManager/MiniGameManager'
import YZK from '../YZK'
import ShareNode from './ShareNode'

const { ccclass, property } = cc._decorator

@ccclass
export default class ShareGameManager extends cc.Component {
  private readonly miniGameTable = 'json/gamepushconfig'
  private readonly iconUrl = 'https://yzk-wechat.oss-cn-hangzhou.aliyuncs.com/MiniGameConfig/Icon'

  private selfAppId: string = ''

  private miniGame: MiniGame[] = []

  private iconList: string[] = []

  private static _instance: ShareGameManager = null
  static get Instance (): ShareGameManager {
    if (!this._instance) {
      const shareManager = new cc.Node('ShareManager')
      shareManager.setParent(cc.director.getScene())
      shareManager.addComponent(ShareGameManager)
      cc.game.addPersistRootNode(shareManager)
      shareManager.SetActive(true)
    }

    return this._instance
  }

  onLoad () {
    ShareGameManager._instance = this
    this.selfAppId = MiniGameManager.Instance.gameData.appData.appid
    this.loadMiniGameJson()
    this.getIconList()
  }

  loadMiniGameJson () {
    cc.loader.loadRes(this.miniGameTable, (error, json: cc.JsonAsset) => {
      if (error) {
        cc.error(error.message)
      } else {
        this.miniGame = json.json.gamepushconfig
        this.initAppId()
      }
    })
  }

  initAppId () {
    for (let i = 0; i < this.miniGame.length; i++) {
      if (this.selfAppId == this.miniGame[i].appid) {
        this.miniGame.splice(i, 1)
        i--
      }
    }
  }

  getIconList () {
    if (YZK.isTestBrowser) {
      return
    }
    cc.loader.load({ url: this.iconUrl + '/icon.txt', type: 'txt' }, (e, text) => {
      if (e) {
        console.log('读取IconList错误！')
        this.iconList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        return
      }
      this.iconList = text.split(',')
    })
  }

  getRandomAppIds (count: number): string[] {
    const target = []

    const indexs = []
    const total = this.miniGame.length
    for (let i = 0; i < total; i++) {
      target.push(this.miniGame[i].appid)
      indexs.push(i)
    }

    if (count >= total) {
      return target
    }

    const temp = []
    while (temp.length < count) {
      const i = this.RangeInt(0, indexs.length)
      temp.push(target[indexs[i]])
      indexs.splice(i, 1)
    }

    return temp
  }

  getAllAppIds (): string[] {
    const temp = []
    const total = this.miniGame.length
    for (let i = 0; i < total; i++) {
      temp.push(this.miniGame[i].appid)
    }
    return temp
  }

  getAppName (appId: string): string {
    return this.miniGame.find(e => {
      return e.appid == appId
    }).appname
  }

  getAppIcon (callback, appid?: string) {
    let pngName = 'default'

    if (this.iconList.length == 0) {
      this.getIconList()
    } else {
      pngName = this.iconList[this.RangeInt(0, this.iconList.length)]
    }

    cc.loader.load({ url: `${this.iconUrl}/${pngName}.png`, type: 'png' }, (e, p) => {
      if (e) {
        console.error(e)
        return
      }
      callback(new cc.SpriteFrame(p))
    })
  }

  RangeInt (min: number, max: number): number {
    let value: number = 0

    const i = Math.random()
    value = i * (max - min) + min
    value = Math.floor(value)
    return value
  }
}

export class MiniGame {
  appid: string
  appname: string
}
