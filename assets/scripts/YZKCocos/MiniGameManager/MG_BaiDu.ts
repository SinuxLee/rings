import MiniGameBase from './MiniGameBase'

const { ccclass, property } = cc._decorator

@ccclass
export class MG_BaiDu extends MiniGameBase {
  baiduBannerReady = false

  initAd () {
    super.initAd()
    setTimeout(() => {
      this.baiduBannerReady = true
    }, 500)
  }

  getSystemInfo () {
    // @ts-expect-error
    return swan.getSystemInfoSync()
  }

  showShareMenu () {
    // @ts-expect-error
    swan.showShareMenu({})
  }

  setOnShareAppMessage () {
    // @ts-expect-error
    swan.onShareAppMessage(() => {
      return {
        title: this.appData.sharetitle,
        imageUrl: this.appData.shareimageurl
        // query:this.shareString//分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
      }
    })
  }

  shareApp (callback?: Function, shareTitle?: string, shareImageUrl?: string, query: string = '') {
    // @ts-expect-error
    swan.shareAppMessage(
      {
        title: shareTitle || this.appData.sharetitle,
        imageUrl: shareImageUrl || this.appData.shareimageurl,
        query, // 分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
        success () {
          // @ts-expect-error
          swan.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000, // 延迟,
            mask: true // 防触摸穿透
          })
          if (callback) {
            callback()
          }
        },
        fail (e) {
          // @ts-expect-error
          swan.showToast({
            title: '分享失败',
            icon: 'none',
            duration: 2000, // 延迟,
            mask: true // 防触摸穿透
          })
        }
      })
  }

  showToast (title: string, successIcon: boolean = true) {
    // @ts-expect-error
    swan.showToast({
      title,
      icon: successIcon ? 'success' : 'none',
      duration: 2000, // 延迟,
      mask: true // 防触摸穿透
    })
  }

  chekcUpdateVersion () {
    // @ts-expect-error
    const updateManager = swan.getUpdateManager()
    // 请求新版本信息回调
    updateManager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) { // 没新版本
        return
      }
      // @ts-expect-error
      swan.showToast({
        title: '即将有更新'
      })

      updateManager.onUpdateReady(() => {
        // @ts-expect-error
        swan.showModal({
          title: '更新提示',
          content: '新版本已经准备好,是否重启应用?',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // @ts-expect-error
        swan.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线,请重新启动后更新'
        })
      })
    })
  }

  /**
     * 百度的要传入AppKey
     * @param appKey
     * @param callback
     */
  launchMiniProgram (appKey: string, callback) {
    // @ts-expect-error
    swan.navigateToMiniProgram({
      appKey,
      success: (res) => {
        callback && callback(true)
      },
      fail: (res) => {
        callback && callback(false)
      }
    })
  }

  login (callback) {
    // @ts-expect-error
    swan.login({
      success (userRes) {
        MG_BaiDu.userCode = userRes.code
        callback && callback()
      },
      fail () {

      }
    })
  }

  getSetting (callback) {
    // @ts-expect-error
    swan.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // @ts-expect-error
          swan.getUserInfo({
            success: (res) => {
              /* {
                                avatarUrl: 头像
                                city：城市
                                country：国家
                                gender：性别：1男
                                language：语言
                                nickName：昵称
                                province：省份
                            } */
              callback && callback(res)
            }
          })
        } else {
          console.log('用户未授权')
          this.createUserInfoButton(callback)
        }
      }
    })
  }

  createUserInfoButton (callback) {
    // @ts-expect-error
    const button = swan.createUserInfoButton({
      type: 'text',
      text: '是否登陆?',
      style: {
        left: this.systemInfo.windowWidth / 2 - 100,
        top: this.systemInfo.windowHeight / 2 - 20,
        width: 200,
        height: 40,
        lineHeight: 40,
        backgroundColor: '#ff0000',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    })
    button.onTap((res) => {
      callback && callback(res)
    })
  }

  setUserCloudStorage (key: string, value: string) {
    // @ts-expect-error
    swan.setUserCloudStorage({
      KVDataList: [
        {
          key,
          value
        }
      ],
      fail: function (res) {
        console.log(`数据上传失败${res}`)
      }
    })
  }

  postMessage2OpenData (message: string) {
    // @ts-expect-error
    swan.getOpenDataContext().postMessage({
      text: message
    })
  }

  getOpenId (callback) {
    if (!MG_BaiDu.userCode) {
      this.login(() => {
        this.getOpenId(callback)
      })
      return
    }

    // https://openapi.baidu.com/nalogin/getSessionKeyByCode?code={}$client_id={appkey}&sk={appSecret}
    const url = `https://www.youzhikong.cn/server/getopenid.aspx?appid=${this.appData.appid}&secret=${this.appData.appsecret}&js_code=${MG_BaiDu.userCode}`
    // @ts-expect-error
    swan.request({
      url,
      complete: function (res) {
        callback(res)
      }
    })
  }

  createBanner () {
    // @ts-expect-error
    this.bannerAd = swan.createBannerAd({
      appSid: this.appData.appsid,
      adUnitId: this.appData.bannerid,
      style: {
        left: 0,
        top: this.systemInfo.windowHeight,
        width: this.systemInfo.windowWidth
      }
    })

    this.bannerAd.onError((res) => {
      console.log(res)
      this.bannerAd.destroy()
      this.bannerAd = null
    })

    this.bannerAd.onResize((size) => {
      console.log(size)
      if (this.bannerAd) {
        this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2
        this.bannerAd.style.top = this.systemInfo.windowHeight - (size.height == 0 ? 100 : size.height) - 20
      }
    })

    this.bannerAd.onLoad(() => {
      this.baiduBannerReady = false
      setTimeout(() => {
        this.baiduBannerReady = true
      }, 31000)

      this.bannerAd.show()
    })
  }

  showBanner () {
    if (!this.baiduBannerReady) {
      return
    }
    if (!this.bannerAd) {
      this.createBanner()
    }
  }

  hideBanner () {
    if (this.bannerAd) {
      this.bannerAd.hide()
      this.bannerAd.destroy()
      this.bannerAd = null
    }
  }

  createVideoAd () {
    // @ts-expect-error
    this.videoAd = swan.createRewardedVideoAd({
      adUnitId: this.appData.videoid,
      appSid: this.appData.appsid
    })

    this.videoAd.onError((res) => {
      this.videoAd = null
    })

    this.videoAd.onClose(res => {
      if (res && res.isEnded || res === undefined) {
        // 正常播放结束，可以下发游戏奖励
        if (MG_BaiDu.videoCallback) {
          MG_BaiDu.videoCallback(true)
        }
      } else {
        if (MG_BaiDu.videoCallback) {
          MG_BaiDu.videoCallback(false)
        }
      }
      MG_BaiDu.videoCallback = null
    })
  }

  showVideoAd (callback: any) {
    MG_BaiDu.videoCallback = callback
    if (!this.videoAd) {
      callback && callback(false)
      return
    }
    this.videoAd.show().catch(err => {
      callback && callback(false)
    })
  }

  doVibrate (short: boolean = true) {
    if (short) {
      // @ts-expect-error
      swan.vibrateShort({})
    } else {
      // @ts-expect-error
      swan.vibrateLong({})
    }
  }

  getGameRecorderManager () {
    // @ts-expect-error
    return swan.getVideoRecorderManager()
  }

  getMenuButtonWorldPos () {
    const screenSize = cc.view.getFrameSize()
    let worldPos

    // @ts-expect-error
    const menu = swan.getMenuButtonBoundingClientRect()
    const pos = new cc.Vec2(menu.left + menu.width / 4, menu.bottom)

    const x = pos.x / screenSize.width * cc.winSize.width
    const y = (1 - pos.y / screenSize.height) * cc.winSize.height
    worldPos = new cc.Vec2(x, y)
    return worldPos
  }

  exitGame () {
    // @ts-expect-error
    swan.exit({})
  }

  restartGame () {
    // @ts-expect-error
    swan.reload({
      content: '确认重载小游戏？'
    })
  }

  shareVideo (videoPath) {
    // @ts-expect-error
    swan.shareVideo({
      videoPath
    })
  }

  request (object) {
    // @ts-expect-error
    return swan.request(object)
  }

  downloadFile (object) {
    // @ts-expect-error
    return swan.downloadFile(object)
  }

  uploadFile (object) {
    // @ts-expect-error
    return swan.uploadFile(object)
  }

  startAccelerometer (callback) {
    // @ts-expect-error
    swan.startAccelerometer({
      interval: 'ui'
    })
    // @ts-expect-error
    swan.onAccelerometerChange((res) => {
      callback && callback(res)
    })
  }

  stopAccelerometer () {
    // @ts-expect-error
    swan.stopAccelerometer({})
  }
}
