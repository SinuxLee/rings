import YZK from '../YZK'
import MiniGameManager from '../MiniGameManager/MiniGameManager'

export enum AldEvenType {
  按钮点击,
  页面展示,
  关卡
}

/**
 * 开发者设置中添加 request合法域名https://glog.aldwx.com
 */
export class AldManager {
  /**
     * 自定义事件
     * @param type 事件类型[按钮点击，页面展示，关卡次数]
     * @param value 事件名称[按钮/页面/关卡的名称，自定义]
     */
  static aldSendEvent (type: AldEvenType, value: string | object) {
    if (YZK.isMiniGame && MiniGameManager.Instance.isWeChat) {
      try {
        switch (type) {
          case AldEvenType.按钮点击:
            // @ts-expect-error
            wx.aldSendEvent('按钮点击', value)
            break
          case AldEvenType.页面展示:
            // @ts-expect-error
            wx.aldSendEvent('页面展示', value)
            break
          case AldEvenType.关卡:
            // @ts-expect-error
            wx.aldSendEvent('关卡', value)
            break
        }
      } catch {
        console.error('没有导入ald文件，默认不使用阿拉丁功能')
      }
    } else {
      cc.log('阿拉丁打点')
    }
  }

  /**
     * 阿拉丁转发
     * @param imageUrl
     * @param title
     * @param query
     */
  static aldOnShareAppMessage (imageUrl, title, query = '') {
    if (YZK.isMiniGame && MiniGameManager.Instance.isWeChat) {
      // @ts-expect-error
      wx.aldOnShareAppMessage(function () {
        return {
          imageUrl,
          title,
          query
        }
      })
    } else {
      cc.log('阿拉丁转发')
    }
  }

  /**
     * 阿拉丁分享
     * @param imageUrl 分享图片链接
     * @param title     分享内容
     * @param ald_desc 分享埋点
     * @param query    分享参数/可空
     */
  static aldShareAppMessage (imageUrl, title, ald_desc, query = '') {
    if (YZK.isMiniGame && MiniGameManager.Instance.isWeChat) {
      // @ts-expect-error
      wx.aldShareAppMessage(function () {
        return {
          imageUrl,
          title,
          ald_desc,
          query
        }
      })
    } else {
      cc.log('阿拉丁分享')
    }
  }

  /**
     * 关卡开始
     * @param stageId 关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式
     * @param stageName 关卡名称
     */
  static aldLevelOnStart (stageId: number) {
    if (YZK.isMiniGame && MiniGameManager.Instance.isWeChat) {
      // @ts-expect-error
      wx.aldStage.onStart({
        stageId: stageId.toString(),
        stageName: `第${stageId}关`
      })
    } else {
      cc.log('关卡开始', stageId)
    }
  }

  /**
     * 关卡结束
     * @param stageId 关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式
     * @param stageName 关卡名称
     * @param event 是否完成
     *
     */
  static aldLevelOnEnd (stageId: number, isWin: boolean = true, others: object = {}) {
    if (YZK.isMiniGame && MiniGameManager.Instance.isWeChat) {
      // @ts-expect-error
      wx.aldStage.onEnd({
        stageId: stageId.toString(),
        stageName: `第${stageId}关`,
        event: isWin ? 'complete' : 'fail',
        params: others
      })
    } else {
      cc.log('关卡结束', stageId, isWin ? 'complete' : 'fail')
    }
  }
}
