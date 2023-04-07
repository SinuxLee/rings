import MiniGameBase from './MiniGameBase'

const { ccclass, property } = cc._decorator

@ccclass
export class MG_TouTiao extends MiniGameBase {
  getSystemInfo () {
    // @ts-expect-error
    return tt.getSystemInfoSync()
  }

  showShareMenu () {
    // @ts-expect-error
    tt.showShareMenu({
      withShareTicket: true
    })
  }

  setOnShareAppMessage () {
    // @ts-expect-error
    tt.onShareAppMessage(() => {
      return {
        // title: null,
        // imageUrl: null
        // query:this.shareString//分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
      }
    })
  }

  shareApp (callback?: Function, shareTitle?: string, shareImageUrl?: string, query: string = '') {
    this.readyShare = this.isToutiaoLite()

    // @ts-expect-error
    tt.shareAppMessage(
      {
        // title: shareTitle ? shareTitle : null,
        // imageUrl: null,
        query, // 分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
        success () {
          // @ts-expect-error
          tt.showToast({
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
          tt.showToast({
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
    tt.showToast({
      title,
      icon: successIcon ? 'success' : 'none',
      duration: 2000, // 延迟,
      mask: true // 防触摸穿透
    })
  }

  chekcUpdateVersion () {
    // @ts-expect-error
    const updateManager = tt.getUpdateManager()
    // 请求新版本信息回调
    updateManager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) { // 没新版本
        return
      }
      // @ts-expect-error
      tt.showToast({
        title: '即将有更新'
      })

      updateManager.onUpdateReady(() => {
        // @ts-expect-error
        tt.showModal({
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
        tt.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线,请重新启动后更新'
        })
      })
    })
  }

  launchMiniProgram (miniProgramAppId: string, callback) {
    // @ts-expect-error
    tt.navigateToMiniProgram({
      appId: miniProgramAppId,
      success: (res) => {
        callback && callback(true)
      },
      fail: (res) => {
        callback && callback(false)
        console.log('小程序跳转失败')
      }
    })
  }

  login (callBack: any) {
    // @ts-expect-error
    tt.login({
      success: (userRes) => {
        MG_TouTiao.userCode = userRes.code
        callBack && callBack()
      }
    })
  }

  getSetting (callback) {
    // @ts-expect-error
    qq.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // @ts-expect-error
          qq.getUserInfo({
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
    tt.authorize({
      scope: 'scope.userInfo',
      success: (res) => {
        // @ts-expect-error
        tt.getSetting({
          success: (res) => {
            callback && callback(res)
          }
        })
      }
    })
  }

  setUserCloudStorage (key: string, value: string) {
    // @ts-expect-error
    tt.setUserCloudStorage({
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
    tt.getOpenDataContext().postMessage({
      text: message
    })
  }

  getOpenId (callback) {
    if (!MG_TouTiao.userCode) {
      this.login(() => {
        this.getOpenId(callback)
      })
      return
    }

    const url = `https://developer.toutiao.com/api/apps/jscode2session?appid=${this.appData.appid}&secret=${this.appData.appsecret}&code=${MG_TouTiao.userCode}`
    // @ts-expect-error
    tt.request({
      url,
      complete: function (res) {
        callback(res)
      }
    })
  }

  createBanner () {
    // tt banner 没有onclose

    // @ts-expect-error
    this.bannerAd = tt.createBannerAd({
      adUnitId: this.appData.bannerid,
      adIntervals: 30,
      style: {
        left: 0,
        top: this.systemInfo.windowHeight - 120,
        width: this.systemInfo.windowWidth
      }
    })

    this.bannerAd.onResize((size) => {
      if (this.bannerAd) {
        this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2
        this.bannerAd.style.top = this.systemInfo.windowHeight - (size.height == 0 ? 110 : size.height) - 20
      }
    })

    this.bannerAd.onLoad(() => {
      if (this.needShowBanner) {
        this.bannerAd.show()
      }
    })

    this.bannerAd.onError((res) => {
      console.error(res)
      this.bannerAd.destroy()
      this.bannerAd = null
    })
  }

  showBanner () {
    if (this.bannerAd) {
      this.hideBanner()
    }
    this.needShowBanner = true
    this.createBanner()
  }

  hideBanner () {
    if (this.bannerAd) {
      this.bannerAd.hide()
      // this.bannerAd.offLoad();
      this.bannerAd.destroy()
      this.bannerAd = null
    }
    this.needShowBanner = false
  }

  createVideoAd () {
    // @ts-expect-error
    this.videoAd = tt.createRewardedVideoAd({
      adUnitId: this.appData.videoid
    })

    this.videoAd.onClose(res => {
      if (res && res.isEnded || res === undefined) {
        // 正常播放结束，可以下发游戏奖励
        if (MG_TouTiao.videoCallback) {
          MG_TouTiao.videoCallback(true)
        }
      } else {
        if (MG_TouTiao.videoCallback) {
          MG_TouTiao.videoCallback(false)
        }
      }
      MG_TouTiao.videoCallback = null
    })

    this.videoAd.onError((res) => {
      console.log('video error', res)
    })
  }

  showVideoAd (callback: any) {
    MG_TouTiao.videoCallback = callback
    this.videoAd.show().catch(err => {
      callback(false)
    })
  }

  doVibrate (short: boolean = true) {
    if (short) {
      // @ts-expect-error
      tt.vibrateShort({})
    } else {
      // @ts-expect-error
      tt.vibrateLong({})
    }
  }

  getGameRecorderManager () {
    // @ts-expect-error
    return tt.getGameRecorderManager()
  }

  getMoreGamesButton (width: number, parentNode: cc.Node) {
    const screenSize = cc.view.getFrameSize()

    const worldPos: cc.Vec2 = parentNode.parent.convertToWorldSpaceAR(parentNode.position)
    const x = worldPos.x / cc.winSize.width * screenSize.width
    const y = (1 - worldPos.y / cc.winSize.height) * screenSize.height

    const pos = new cc.Vec2(x, y)

    // @ts-expect-error
    const btn = tt.createMoreGamesButton({
      type: 'text',
      // image: parentNode.getComponent(cc.Sprite).spriteFrame.getTexture().url,,
      text: '',
      style: {
        left: pos.x - width / 2,
        top: pos.y - width / 2,
        width: width + 5,
        height: width + 5,
        lineHeight: width,
        backgroundColor: '#00000000',
        textColor: '#00000000',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 0,
        borderWidth: 0,
        borderColor: '#00000000'
      },
      appLaunchOptions: [
        {
          appId: this.appData.appid,
          query: '',
          extraData: {}
        }
      ],
      onNavigateToMiniGame (res) {
        console.log('跳转其他小游戏', res)
      }
    })
    return btn
  }

  getMenuButtonWorldPos () {
    const screenSize = cc.view.getFrameSize()
    let worldPos

    // @ts-expect-error
    const menu = tt.getMenuButtonBoundingClientRect()
    const pos = new cc.Vec2(menu.left + menu.width / 4, menu.bottom)

    const x = pos.x / screenSize.width * cc.winSize.width
    const y = (1 - pos.y / screenSize.height) * cc.winSize.height
    worldPos = new cc.Vec2(x, y)
    return worldPos
  }

  exitGame () {
    // @ts-expect-error
    tt.exitMiniProgram({})
  }

  shareVideo (videoPath) {
    // @ts-expect-error
    tt.shareAppMessage({
      channel: 'video',
      title: '分享',
      // imageUrl: '',
      // path: '',
      extra: {
        videoPath
      }
    })
  }

  onShow () {
    if (!this.readyShare) {
      return null
    }
    this.readyShare = false
    const delta = Date.now() - this.shareOutTime
    return delta > 3000
  }

  onHide () {
    if (this.readyShare) {
      this.shareOutTime = Date.now()
    }
  }

  private isDouyin () {
    return this.systemInfo.appName == 'Douyin'
  }

  private isToutiaoLite () {
    return this.systemInfo.appName == 'news_article_lite'
  }

  request (object) {
    // @ts-expect-error
    return tt.request(object)
  }

  downloadFile (object) {
    // @ts-expect-error
    return tt.downloadFile(object)
  }

  uploadFile (object) {
    // @ts-expect-error
    return tt.uploadFile(object)
  }

  startAccelerometer (callback) {
    // @ts-expect-error
    tt.startAccelerometer({})
    // @ts-expect-error
    tt.onAccelerometerChange((res) => {
      callback && callback(res)
      // console.log(res);
    })
  }

  stopAccelerometer () {
    // @ts-expect-error
    tt.stopAccelerometer({})
  }

  showMoreGamesModal () {
    // @ts-expect-error
    tt.showMoreGamesModal({
      appLaunchOptions: [
        {
          appId: this.appData.appid,
          query: '',
          extraData: {}
        }
      ],
      fail (res) {
        console.log('show tt more game model fail', res.errMsg)
      }
    })
  }
}
