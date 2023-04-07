import { MG_WeChat } from './MG_WeChat'
import { MG_QQ } from './MG_QQ'
import { MG_TouTiao } from './MG_TouTiao'
import { MG_BaiDu } from './MG_BaiDu'
import { MG_Oppo } from './MG_Oppo'
import { MG_Vivo } from './MG_Vivo'
import { MG_XiaoMi } from './MG_XiaoMi'
import MiniGameBase, { MiniGameData } from './MiniGameBase'
import { MG_Browser } from './MG_Browser'
import ShareGameManager from '../ShareGameManager/ShareGameManager'
import YZK from '../YZK'
import TipsManager from '../Tools/TipsManager'
import { MG_UC } from './MG_UC'
import { MG_4399 } from './MG_4399'
import { MG_360 } from './MG_360'
import { MG_SFH5 } from './MG_SFH5'

const { ccclass, property } = cc._decorator

@ccclass
export default class MiniGameManager extends cc.Component {
  @property({
    displayName: 'YZKID'
  })
  public yzkId: string = ''

  public isWeChat: boolean = false

  public isQQ: boolean = false

  public isTouTiao: boolean = false

  public isOppo: boolean = false

  public isVivo: boolean = false

  public isBaidu: boolean = false

  public isXiaoMi: boolean = false

  public isUC: boolean = false

  public is4399: boolean = false

  public is360: boolean = false

  public isSFH5: boolean = false

  public gameData: MiniGameBase = null

  public static shareCallBack = null

  public get systemInfo () {
    return this.gameData.systemInfo
  }

  private static _instance = null
  static get Instance (): MiniGameManager {
    return this._instance
  }

  outTime = -1

  get openId () {
    return cc.sys.localStorage.getItem('minigame_openid')
  }

  onLoad () {
    MiniGameManager._instance = this
    cc.game.addPersistRootNode(this.node)

    this.getMiniGameData()

    cc.game.on(cc.game.EVENT_SHOW, () => {
      this.onGameShow()
    }, this)

    cc.game.on(cc.game.EVENT_HIDE, () => {
      this.onGameHide()
    }, this)
  }

  // 主动分享
  public shareApp (callback: Function, shareTitle?: string, shareImage?: string, query?: string) {
    MiniGameManager.shareCallBack = callback
    this.gameData && this.gameData.shareApp(callback, shareTitle, shareImage, query)
  }

  private onGameHide () {
    this.gameData && this.gameData.onHide()
  }

  private onGameShow () {
    const result = this.gameData.onShow()
    if (result == null) {
      return
    }
    if (result) {
      // 分享成功，发放奖励
      if (MiniGameManager.shareCallBack) {
        MiniGameManager.shareCallBack()
        MiniGameManager.shareCallBack = null
        this.showToast('分享成功', true)
      }
    } else {
      this.showToast('分享失败', false)
    }
  }

  /**
     * 调用系统提示框
     */
  public showToast (title, success: boolean) {
    this.gameData.showToast(title, success)
  }

  /**
     * 小程序跳转
     */
  launchMiniProgram (miniProgramAppId: string, callback = null) {
    this.gameData.launchMiniProgram(miniProgramAppId, callback)
  }

  /**
     * 请求授权登陆
     * 获取登录凭证 code
     * 使用 code 可以换取openid 和 session_key
     */
  login (callBack) {
    this.gameData.login(callBack)
  }

  /***
     * 上传玩家数据
     */
  setUserCloudStorage (key: string, value: string) {
    this.gameData.setUserCloudStorage(key, value)
  }

  // 向子域发送消息
  postMessage2OpenData (message: string) {
    this.gameData.postMessage2OpenData(message)
  }

  /**
     * 获取玩家的openid
     */
  getOpenId (callback) {
    this.gameData.getOpenId(callback)
  }

  /*
    *  加载BannerAd 并展示
    */
  showBanner () {
    this.gameData.showBanner()
  }

  /**
     * 隐藏
     */
  hideBanner () {
    this.gameData.hideBanner()
  }

  /**
     * 展示QQ广告盒子
     */
  showQQAppBox (callback) {
    this.gameData.showAppBox(callback)
  }

  /**
     * 展示广告
     * @param callBack
     */
  showVideo (callBack) {
    this.gameData.showVideoAd(callBack)
  }

  /**
     * 展示插屏广告
     */
  showInsert () {
    this.gameData.showInsertAd()
  }

  /**
     * 震动
     */
  doVibrate (short: boolean = true) {
    this.gameData.doVibrate(short)
  }

  /**
    * 录屏功能
    * 获取录屏单例
    */
  private gameRecoderManager = null
  private readonly onStartCallBack = null
  private onStopCallBack = null
  private recordTime = 0
  private isPlayerStop: boolean = false
  private delayAction = null

  get GameRecorderManager () {
    if (!this.gameRecoderManager) {
      this.gameRecoderManager = this.gameData.getGameRecorderManager()
      this.gameRecoderManager && this.gameRecoderManager.onStart(res => {
        this.recordTime = Date.now()
        if (this.onStartCallBack) {
          this.onStartCallBack()
        }
      })

      this.gameRecoderManager && this.gameRecoderManager.onStop(res => {
        const deltaTime = Date.now() - this.recordTime
        if (deltaTime < 3000) {
          this.showToast('录制时间小于3秒', false)
          if (this.onStopCallBack) {
            this.onStopCallBack(false)
            return
          }
        }

        if (this.isPlayerStop) {
          this.gameData.shareVideo(res.videoPath)
          if (this.onStopCallBack) {
            this.onStopCallBack(false)
          }
        } else {
          if (this.onStopCallBack) {
            this.onStopCallBack(true)
          }
          this.delayAction = () => {
            this.gameData.shareVideo(res.videoPath)
          }
        }
      })
    }
    return this.gameRecoderManager
  }

  gameRecorderStart (callback = null, maxRecordTime: number = 150) {
    if (this.GameRecorderManager) {
      this.isPlayerStop = false
      this.delayAction = null

      this.onStopCallBack = callback
      this.GameRecorderManager.start({
        duration: maxRecordTime
      })
    }
  }

  doDelayAction () {
    if (this.delayAction) {
      this.delayAction()
      this.delayAction = null
    }

    this.onStopCallBack(false)
  }

  gameRecorderStop () {
    if (this.GameRecorderManager) {
      if (this.delayAction) {
        this.doDelayAction()
        return
      }
      this.isPlayerStop = true
      this.GameRecorderManager.stop()
    }
  }

  get isDouyin () {
    return this.systemInfo && this.systemInfo.appName == 'Douyin'
  }

  get isToutiaoLite () {
    return this.systemInfo && this.systemInfo.appName == 'news_article_lite'
  }

  get isXiGua () {
    return this.systemInfo && this.systemInfo.appName == 'XiGua'
  }

  get isAndroid () {
    return this.systemInfo && this.systemInfo.platform == 'android'
  }

  get isIOS () {
    return this.systemInfo && this.systemInfo.platform == 'ios'
  }

  createMoreGamesButton (width: number, parentNode: cc.Node) {
    return this.gameData.getMoreGamesButton(width, parentNode)
  }

  getMenuButtonWorldPos () {
    return this.gameData.getMenuButtonWorldPos()
  }

  exitGame () {
    this.gameData.exitGame()
  }

  restartGame () {
    this.gameData.restartGame()
  }

  /**
     * 开始监听加速度数据
     */
  startAccelerometer (callback) {
    if (YZK.isMiniGame) {
      this.gameData.startAccelerometer(callback)
    } else {
      this.nativeCallback = callback
      cc.systemEvent.setAccelerometerEnabled(true)
      cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.nativeAccelerometerListener.bind(this), this)
    }
  }

  /**
     * 兼容原生平台加速度计
     */
  private nativeCallback = null
  private nativeAccelerometerListener (event) {
    this.nativeCallback && this.nativeCallback(event.acc)
  }

  /**
     * 结束监听加速度数据
     */
  stopAccelerometer () {
    if (YZK.isMiniGame) {
      this.gameData.stopAccelerometer()
    } else {
      this.nativeCallback = null
      cc.systemEvent.setAccelerometerEnabled(false)
      cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.nativeAccelerometerListener.bind(this), this)
    }
  }

  private getMiniGameData () {
    cc.loader.loadRes('json/appconfig', cc.JsonAsset, (error, json) => {
      if (error) {
        cc.error(error.message)
        this.gameData = new MG_Browser()
      } else {
        const data: MiniGameData = json.json.appconfig

        switch (data.channel) {
          case 'weixin':
            this.gameData = new MG_WeChat()
            this.isWeChat = true
            break
          case 'qq':
            this.gameData = new MG_QQ()
            this.isQQ = true
            break
          case 'toutiao':
            this.gameData = new MG_TouTiao()
            this.isTouTiao = true
            break
          case 'baidu':
            this.gameData = new MG_BaiDu()
            this.isBaidu = true
            break
          case 'oppo':
            this.gameData = new MG_Oppo()
            this.isOppo = true
            break
          case 'vivo':
            this.gameData = new MG_Vivo()
            this.isVivo = true
            break
          case 'xiaomi':
            this.gameData = new MG_XiaoMi()
            this.isXiaoMi = true
            break
          case 'uc':
            this.gameData = new MG_UC()
            this.isUC = true
            break
          case '4399':
            this.gameData = new MG_4399()
            this.is4399 = true
            break
          case '360':
            this.gameData = new MG_360()
            this.is360 = true
            break
          case 'sfh5':
            this.gameData = new MG_SFH5()
            this.isSFH5 = true
            break
        }

        if (!this.gameData) {
          this.gameData = new MG_Browser()
          return
        }

        this.gameData.initAppData(data)
        this.gameData.showShareMenu()
        this.gameData.setOnShareAppMessage()
        this.gameData.chekcUpdateVersion()

        const shareManager = new cc.Node('ShareManager')
        shareManager.setParent(this.node)
        shareManager.addComponent(ShareGameManager)
        shareManager.active = true

        if (this.isWeChat || this.isQQ) {
          if (!this.openId || this.openId == '' || this.openId == 'null' || this.openId == 'undefined') {
            this.login(() => {
              this.getOpenId((res) => {
                // console.log("获取openid");
                cc.sys.localStorage.setItem('minigame_openid', res.data.openid)
              })
            })
          }
        }
      }
    })
  }

  /**
     * 展示头条游戏盒子
     */
  showMoreGamesModal () {
    this.gameData.showMoreGamesModal()
  }
}
