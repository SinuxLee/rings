const { ccclass, property } = cc._decorator

@ccclass
export default class PushAPI {
  public static _instance: PushAPI = null
  public static getInstance (): PushAPI {
    if (this._instance == null) this._instance = new PushAPI()
    return this._instance
  }

  public printLog (message: string) {
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.log(message)
      return
    }

    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/log/Logger', 'd', '(Ljava/lang/String;)V', message)
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  private callPushAPIRet (methodName: string, sign: string, def: any, ...argus: any[]): any {
    this.printLog('callPushAPI: ' + methodName + ', ' + sign + ', ' + argus)

    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 callPushAPIRet功能')
      return def
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', methodName, sign, argus)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return def
  }

  public showScreenOrVideoAd (position: number, callback: Function) {
    console.log('showScreenOrVideoAd by consose')
    this.printLog('showScreenOrVideoAd: ' + position)

    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 showscreenorvideoad功能')
      if (callback != null) callback.call(null, true)
      return
    }

    const date = new Date().getTime()
    const func = 'showScreenOrVideoAdResult' + date
    cc[func] = function (code: string) {
      PushAPI.getInstance().printLog(func + ': ' + (code === 'true'))
      if (code === 'true') {
        console.log('true')
      } else {
        console.log('false')
      }
      if (callback != null) callback.call(null, code === 'true')
    }

    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'showScreenOrVideoAdCocos', '(ILjava/lang/String;)V', position, func)
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public test () {
  }

  public showBanner (bottom: boolean, callback: Function) {
    console.log('showScreenOrVideoAd by consose')
    this.printLog('showBanner: ' + bottom)
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 showBanner功能')
      if (callback != null) callback.call(null, true)
      return
    }

    const date = new Date().getTime()
    const func = 'showBannerAdResult' + date
    cc[func] = function (code: string) {
      PushAPI.getInstance().printLog('showBannerAdResult: ' + (code === 'true'))
      if (callback != null) callback.call(null, code === 'true')
    }

    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'showBannerCocos', '(ZLjava/lang/String;)V', bottom, func)
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public hideBanner () {
    this.printLog('hideBanner')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 hideBanner功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'hideBanner', '()V')
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public isGPMode (): boolean {
    this.printLog('isGPMode')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 isGPMode')
      return false
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'isGPMode', '()Z')
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return false
  }

  public setIsSkipAd (value: boolean) {
    this.printLog('setIsSkipAd')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 setIsSkipAd功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'setIsSkipAd', '(Z)V', value)
        break
      }
      default: {
        cc.warn('只支持Android设备')
        break
      }
    }
  }

  public vibratePhoneOnce (value: number) {
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 vibratePhoneOnce功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'vibratePhoneOnce', '(I)V', value)
        break
      }
      default: {
        cc.warn('只支持Android设备')
        break
      }
    }
  }

  public isInstallFB (): boolean {
    this.printLog('isInstallFB')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 isInstallFB功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'isInstallFB', '()Z')
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return false
  }

  public shareToFB (imgPath: string, callback: Function) {
    this.printLog('shareToFB')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 shareToFB功能')
      return
    }

    const date = new Date().getTime()
    const func = 'shareToFBResult' + date
    cc[func] = function (code: string) {
      PushAPI.getInstance().printLog('shareToFBResult: ' + (code === 'true'))
      if (callback != null) callback.call(null, code === 'true')
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'shareToFBCocos', '(Ljava/lang/String;Ljava/lang/String;)V', imgPath, func)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public jumpToGP () {
    this.printLog('jumpToGP')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 jumpToGP功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'jumpToGP', '()V')
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public getParamS (key: string, def: string): string {
    this.printLog('getParamS')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 getParamS功能')
      return def
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'getParamS', '(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;', key, def)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return def
  }

  public getParamB (key: string, def: boolean): boolean {
    this.printLog('getParamB')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 getParamB功能')
      return def
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'getParamB', '(Ljava/lang/String;Z)Z', key, def)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return def
  }

  public getParamL (key: string, def: number): number {
    this.printLog('getParamL')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 getParamL功能')
      return def
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'getParamL', '(Ljava/lang/String;L)L', key, def)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return def
  }

  public getParamD (key: string, def: number): number {
    this.printLog('getParamD')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 getParamD功能')
      return def
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'getParamL', '(Ljava/lang/String;D)D', key, def)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return def
  }

  public checkCanPlayToDay (adType: number): boolean {
    this.printLog('getParamD')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 getParamD功能')
      return false
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'checkCanPlayToDay', '(I)Z', adType)
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return false
  }

  public isDayLimit (): boolean {
    this.printLog('isDayLimit')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 isDayLimit功能')
      return false
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'isDayLimit', '()Z')
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
    return false
  }

  public sendFirebaseLog (key: string, val: string) {
    this.printLog('issendFirebaseLogDayLimit')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 sendFirebaseLog功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'sendLog', '(Ljava/lang/String;Ljava/lang/String;)V', key, val)
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public restartGame () {
    this.printLog('restartGame')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 restartGame功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'restartGame', '()V')
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }

  public exitGame () {
    this.printLog('exitGame')
    if (!cc.sys.isNative || !cc.sys.isMobile) {
      cc.warn('请在移动设备中使用 exitGame功能')
      return
    }
    switch (cc.sys.platform) {
      case cc.sys.ANDROID: {
        return jsb.reflection.callStaticMethod('com/yzk/sdk/base/PushAPI', 'exitGame', '()V')
        break
      }
      default: {
        cc.warn('只支持Adnroid设备')
        break
      }
    }
  }
}
