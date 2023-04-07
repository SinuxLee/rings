import MiniGameBase from './MiniGameBase'

const { ccclass, property } = cc._decorator

@ccclass
export class MG_4399 extends MiniGameBase {
  shareApp () {
    // @ts-expect-error
    window.h5api.share()
  }

  showVideoAd (callback) {
    // @ts-expect-error
    window.h5api.canPlayAd((data) => {
      if (!data.canPlayAd || data.remain < 1) {
        callback(false, '今日广告次数已用完!')
      } else {
        // @ts-expect-error
        window.h5api.playAd((obj) => {
          if (obj.code != 10000) {
            callback && callback(obj.code == 10001)
          }
        })
      }
    })
  }
}
