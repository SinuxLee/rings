declare module $SF {
  const WEB = 0
  const ANDROID = 1
  const IOS = 2
  const WX = 3
  const QQ = 4
  const PROP_PLATFORM = 'sys.platform'
  const PROP_RELEASE = 'sys.build.release'
  const PROP_DEVICE_ID = 'deviceId'
  const PROP_CMD_VIB = 'cmd.vibration'
  const PROP_CMD_CLEARALL = 'cmd.clearAll'
  const PROP_CMD_CLEARDATA = 'cmd.clearData'
  const PROP_UID = 'uid'
  const PROP_TOKEN = 'token'
  const PROP_USER_NAME = 'nick'
  const PROP_USER_ICON_URL = 'icUrl'
  const PROP_RETRY_CNT = 'prop.retryCnt'
  const PROP_CHECK = 'check'
  const PROP_EN_EFFECT = 'enEffect'
  const PROP_EN_MUSIC = 'enMusic'
  const PROP_APP_VER = 'gc_ver'
  function saveToFile (filePath: string, href: string): void
  class SFSocial {
    /**
         * 获取社交接口支持类型
         *
         * @return 返回一个json字符串 格式如:{"login": ["qq","wx","wb"],"share": ["qq","wx","wb"]}
         *
         */
    static isSupport (): string
    static loginQQ (callback: (data: string) => void): void
    static logoutQQ (callback: (data: string) => void): void
    static loginWX (callback: (data: string) => void): void
    static logoutWX (callback: (data: string) => void): void
    static share (data: any, callback: (data: string) => void): void
    static joinQQGroup (uin: string, key: string): void
  }
  class SFPay {
    static OK: number
    static Fail: number
    static Cancel: number
    static action (data: {
      productId: string
      price: number
      productName: string
      orderId: string
    }, callback: (r: number, orderId: string, productId: string, receiptOrMsg: string) => void): void
    static finishAction (data: {
      productId: string
      orderId: string
    }, callback: (data: string) => void): void
    static onResumeAction (callback: (r: number, orderId: string, productId: string, receiptOrMsg: string) => void): void
    static restoreAction (callback: (data: string) => void): void
  }
  function log (str: any): void
  class sfLocalStorage {
    private static remapKey (k)
    static setItem (k: string, v: string): void
    static getItem (k: string): string
    static removeItem (k: string): void
    static clear (): void
    static getJSON (k: string): any
    static setJSON (k: string, v: any): void
  }
  class Ga {
    private static readonly _inited
    private static readonly _id
    private static readonly _isSingle
    private static readonly _hutuiReqCnt
    private static readonly _isFirstStart
    private static readonly _requestParams
    private static getUrlParam (key)
    private static setUrlParam (key, val)
    private static initParams (search)
    private static initPId ()
    static _checkEnv (log: any): void
    static localStorage: typeof sfLocalStorage
    static init (data: {
      id: number
      complete: () => void
    }): void
    static readonly id: number
    static readonly isSingle: boolean
    static back (isError?: boolean): void
    static prop (name: string, val?: string): any
    static startVib (durationInMS: any): any
    static onLoadingProgress (data: {
      loadCur: number
      loadMax: number
    }): void
    static onGameStart (cb: (data: {
      r: boolean
    }) => void): void
    static onGameEnd (data: {
      score: number
      level?: number
      win?: number
    }, cb: (data: {
        r: boolean
      }) => void): void
    static startShare (data: any, cb: (data: {
      r: boolean
    }) => void): void
    static hutuiReq (params: any, cb: any): void
    static hutuiAct (params: any): void
    static onPause (callback: () => void): void
    static onResume (callback: () => void): void
    static postHomeMsg (msgId: number, msgData: any, cb: (data: any) => void): void
    static readonly daUserToken: string
    static daInit (gid: number, complete?: (r: ADResult) => void): void
    private static _postPlayDa (posId, userPosId, complete)
    static playFullVideo (userPosId: number, complete: (r: number, pid?: number) => void, isLandscape?: boolean): void
    static playRewardVideo (userPosId: number, complete: (r: number, pid?: number) => void, isLandscape?: boolean): void
    static showBa (userPosId: number, isTop: boolean, complete: (r: number) => void): void
    static hideBa (): void
    static loadNativeBanner (userPosId: number, complete: (r: number, adData: string) => void): void
    static getADMsg (r: number): string
    static noticeShowNativeView (exdata: string): void
    static onLoadingErr (params: any): void
    static update (params: any, callback: any): void
    static restart (params: {
      type?: number
      gid: number
      ver: string
      url: string
    }): void
    static exit (): void
    static onKeyBack (callback: (data: string) => void): void
    static addView (data: {
      url: string
      top: number
      left: number
      w: number
      h: number
      onload: () => void
      viewId: number
    }): void
    static removeView (data: {
      viewId: number
    }): void
    static initRetweets (shareData: any): void
    static retweetsReq (callback: any): void
    static miniProLogIn (data: any, complete: any): void
    static getMiniProUserInfo (callback: any): void
  }
  class Analytics {
    static onEvent (eventId: string): void
    static onEventWithParameters (eventId: string, eventData: any): void
    static trackingRegisterUid (userId: string): void
    static trackingLoginUid (userId: string): void
    static trackingonEvent (eventName: string): void
    static trackingDAEvent (DAID: string, sdkID: string, value: string, complete: boolean): void
  }
  class XMLHttp {
    static ajax (url: string, options: any): any
    static getJSON (url: string, complete?: (xhr: any, rspData: any, usedTS: number) => void, timout?: number, headers?: any): any
    static postJSONEx (url: string, xor: boolean, reqData: any, complete?: (xhr: any, rspData: any, usedTS: number) => void, timout?: number, headers?: any): void
  }
  class AdShowInfo {
    static STATUS_UNKNOWN: number
    static STATUS_PROMPTED: number
    static STATUS_OK: number
    static STATUS_CANCELED: number
    static STATUS_OUT_OF_AD: number
    static STATUS_TIMEOUT: number
    static STATUS_CLICK_AD: number
    static STATUS_ERR: number
    static STATUS_EXCEPTION: number
    static STATUS_ONSHOW: number
    p: number
    d: number
    s: number
    c: number
    m: number
    v?: string
    adData?: string
  }
  enum ADResult {
    BusyInit = -3,
    NoInit = -2,
    InitFail = -1,
    Unknown = 0,
    Success = 2,
    Canceled = 3,
    OutOfAD = 4,
    TimeOut = 5,
    Click = 6,
    Err = 7,
    Exception = 8,
    OnShow = 9,
  }
  enum EPosID {
    FullVideoPortrait = 1,
    FullVideoLandscape = 2,
    RewardVideoPortrait = 3,
    RewardVideoLandscape = 4,
    BaTop = 5,
    BaBottom = 6,
    NativeBa = 7,
    ExpressAD = 8,
  }
  enum PlayResult {
    NONE = 0,
    WIN = 1,
    LOSE = 2,
    DEUCE = 5,
  }
}
