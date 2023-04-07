import MiniGameBase from './MiniGameBase'

const { ccclass, property } = cc._decorator

@ccclass
export class MG_XiaoMi extends MiniGameBase {
  createVideoAd () {
    // @ts-expect-error
    this.videoAd = wx.createRewardedVideoAd({
      adUnitId: this.appData.videoid
    })

    this.videoAd.onClose(res => {
      if (res && res.isEnded || res === undefined) {
        // 正常播放结束，可以下发游戏奖励
        if (MG_XiaoMi.videoCallback) {
          MG_XiaoMi.videoCallback(true)
        }
      } else {
        if (MG_XiaoMi.videoCallback) {
          MG_XiaoMi.videoCallback(false)
        }
      }
      MG_XiaoMi.videoCallback = null

      this.videoAd.load()
    })
  }

  showVideoAd (callback: any) {
    MG_XiaoMi.videoCallback = callback
    if (!this.videoAd) {
      callback(false)
      return
    }
    this.videoAd.show().catch(err => {
      callback(false)
    })
  }

  request (object) {
    // @ts-expect-error
    return qg.request(object)
  }

  downloadFile (object) {
    // @ts-expect-error
    return qg.downloadFile(object)
  }

  uploadFile (object) {
    // @ts-expect-error
    return qg.uploadFile(object)
  }

  startAccelerometer (callback) {
    cc.systemEvent.setAccelerometerEnabled(true)
    cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, (event) => {
      callback && callback({ x: event.acc.x * 10, y: event.acc.y * 10, z: event.acc.z * 10 })
    }, this)
  }

  stopAccelerometer () {
    cc.systemEvent.setAccelerometerEnabled(false)
  }
}
