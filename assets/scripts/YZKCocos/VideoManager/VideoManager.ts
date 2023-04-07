import YZK from '../YZK'
import TipsManager from '../Tools/TipsManager'
import SoundManager from '../../Tools/SoundManager'

const { ccclass, property } = cc._decorator

@ccclass
export class VideoManager {
  private static _isVideoPlaying = false
  static get isVideoPlaying () {
    return this._isVideoPlaying
  }

  static showVideo (success, fail = null) {
    if (!CC_DEBUG) {
      YZK.showVideo((isOk, message = '') => {
        setTimeout(() => {
          cc.game.resume()
          SoundManager.getInstance().setBGMResume()
          this._isVideoPlaying = false
          if (isOk) {
            success && success()
          } else {
            if (fail) {
              fail()
            } else {
              const tips = message || '广告还没准备好,请稍后再试!'
              TipsManager.getInstance().showTips(tips)
            }
          }
        }, 500)
      })
      this._isVideoPlaying = true
      SoundManager.getInstance().setBGMPause()
      cc.game.pause()
    } else {
      success()
    }
  }

  static showBanner () {
    if (!CC_DEBUG) {
      YZK.showBanner(true)
    } else {
      cc.log('展示了Banner')
    }
  }

  static hideBanner () {
    if (!CC_DEBUG) {
      YZK.hideBanner()
    } else {
      cc.log('隐藏Banner')
    }
  }

  static showInsert (pageId) {
    if (!CC_DEBUG) {
      YZK.showInsert(pageId)
    } else {
      cc.log('展示插屏')
    }
  }

  static showSplash () {
    if (!CC_DEBUG) {
      YZK.showSplash()
    } else {
      cc.log('展示Splash')
    }
  }
}
