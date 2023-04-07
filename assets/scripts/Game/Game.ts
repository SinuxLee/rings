import RingPoint from './RingPoint'
import Ring, { RingType } from './Ring'
import { Random } from '../Tools/Random'
import NextRingPoint from './NextRingPoint'
import { Dictionary } from '../YZKCocos/Tools/Dictionary'
import UIPanelManager from '../YZKCocos/UIFrame/UIPanelManager'
import { PanelName } from '../YZKCocos/UIFrame/UIPanelName'
import GameManager, { PlayerData, GameType } from './GameManager'
import SpriteFrameManager from '../Tools/SpriteFrameManager'
import SoundManager, { SoundName } from '../Tools/SoundManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class Game extends cc.Component {
  private spriteCount: number = 3

  private readonly baseTotalTime: number = 35

  @property(cc.Sprite)
    skinBg: cc.Sprite = null

  @property(cc.Node)
    gameBox: cc.Node = null

  @property(cc.Node)
    nextBox: cc.Node = null

  @property(cc.Node)
    clearTip: cc.Node = null

  @property([cc.SpriteFrame])
    timeLineSpr: cc.SpriteFrame[] = []

  @property([cc.SpriteFrame])
    timeLineHeadSpr: cc.SpriteFrame[] = []

  @property(cc.Sprite)
    timeLine: cc.Sprite = null

  @property(cc.Sprite)
    timeLineHead: cc.Sprite = null

  protected ringPoints: RingPoint[] = []
  private nextRingPoints: NextRingPoint[] = []
  private canUseNextPointCount: number = 0

  private touchedNextPoint: NextRingPoint = null

  private _score: number = 0
  private get score () {
    return this._score
  };

  private set score (value) {
    this._score = value
    if (this.spriteCount == 8) {
      return
    }
    this.spriteCount = Math.min(5, Math.floor(value / 20)) + 3
  }

  private scoreRate: number = 0
  private maxScoreRate: number = 0

  private gameType: GameType = 0

  private scoreBackup = null
  private scoreRateBackup = null
  private bestScoreBackup = null
  private nextPointsCountsBackup = null

  private clearRingStatus: boolean = false

  private nextPointsCount: number = 0

  private isTimeMode: boolean = null
  private gameTime: number = 0
  private timeProgressBar: cc.ProgressBar = null

  private isGameRun: boolean = true

  start () {
    GameManager.getInstance().game = this

    this.initRingPoints()

    this.initNextRingPoints()

    this.createNewNextPoints()

    this.gameType = GameManager.getInstance().gameType

    this.skinBg.spriteFrame = SpriteFrameManager.Instance.getSkinBg(GameManager.getInstance().skinType)

    this.isTimeMode = GameManager.getInstance().gameType == GameType.限时
    if (this.isTimeMode) {
      this.gameTime = this.baseTotalTime
      this.timeProgressBar = this.timeLine.getComponent(cc.ProgressBar)
      this.timeLine.spriteFrame = this.timeLineSpr[GameManager.getInstance().skinType]
      this.timeLineHead.spriteFrame = this.timeLineHeadSpr[GameManager.getInstance().skinType]
    }

    this.isGameRun = true
  }

  update (dt) {
    if (!this.isTimeMode || !this.isGameRun) {
      return
    }

    this.gameTime -= dt
    if (this.gameTime < 0) {
      this.onGameEnd()
      this.gameTime = 0
    }
    this.timeProgressBar.progress = this.gameTime / this.baseTotalTime
  }

  initRingPoints () {
    this.ringPoints = this.gameBox.getComponentsInChildren(RingPoint)
    for (let i = 0; i < this.ringPoints.length; i++) {
      this.ringPoints[i].node.addListener(this.btnOfClickRing, this, i)
    }
  }

  initNextRingPoints () {
    this.nextRingPoints = this.nextBox.getComponentsInChildren(NextRingPoint)
    this.nextRingPoints.forEach(n => {
      n.node.on(cc.Node.EventType.TOUCH_START, this.onTouchNextPoint, this)
      n.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveNextPoint, this)
      n.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndNextPoint, this)
      n.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndNextPoint, this)
    })

    this.nextPointsCount = this.nextRingPoints.length
  }

  getNextRingPointsData () {
    const ringsData = []
    this.ringPoints.forEach(e => {
      const data = e.getLackRingData()
      data && ringsData.push(data)
    })

    if (ringsData.length == 0) {
      // 没有可以放置的位置
      return null
    }

    const nextData: number[][] = []
    if (ringsData.length <= 3) {
      ringsData.forEach(e => {
        nextData.push(e)
      })
      for (let i = 0; i < 3; i++) {
        nextData.push([Random.RangeInt(0, 3)])
      }
      return nextData
    }

    for (let i = 0; i < 3; i++) {
      const temp = ringsData.RemoveAt(Random.RangeInt(0, ringsData.length))
      nextData.push(temp)
    }

    return nextData
  }

  checkEnd () {
    let hasEmpty: boolean = false
    for (let i = 0; i < this.ringPoints.length; i++) {
      const ringData = this.ringPoints[i].getRingsData()
      if (ringData.Has(-1)) {
        hasEmpty = true
        break
      }
    }

    if (!hasEmpty) {
      this.onGameEnd()
      return
    }

    if (this.canUseNextPointCount != 0) {
      for (let i = 0; i < this.nextRingPoints.length; i++) {
        if (!this.nextRingPoints[i].node.active) {
          continue
        }
        for (let j = 0; j < this.ringPoints.length; j++) {
          const canput = this.checkPointCanUse(j, this.nextRingPoints[i])
          if (canput) {
            return
          }
        }
      }
      this.onGameEnd()
    }
  }

  onGameEnd () {
    this.isGameRun = false
    UIPanelManager.showPanel(PanelName.EndUI, this.score, this.maxScoreRate)
  }

  checkCreateNewPoints () {
    if (this.canUseNextPointCount != 0) {
      return
    }

    this.createNewNextPoints()
  }

  createNewNextPoints () {
    const data = this.getNextRingPointsData()

    if (!data) {
      return
    }

    for (let i = 0; i < this.nextPointsCount; i++) {
      const rings: Ring[] = []
      const e = data[i]
      e.forEach(type => {
        const ring = new Ring()
        ring.ringType = type
        ring.ringIconIndex = Random.RangeInt(0, this.spriteCount)
        rings.push(ring)
      })
      this.nextRingPoints[i].createNew(rings)
    }
    this.canUseNextPointCount = this.nextPointsCount

    // GameManager.getInstance().gameui.updateDiuqiUi(true);
  }

  onTouchNextPoint (event: cc.Event.EventTouch) {
    if (this.clearRingStatus) {
      return
    }
    this.touchedNextPoint = event.currentTarget.getComponent(NextRingPoint)

    const rightPoints = this.checkNextPointCanMove(this.touchedNextPoint)
    if (!rightPoints) {
      this.touchedNextPoint = null
      return
    }
    this.touchedNextPoint.node.setWorldPos(event.getLocation())
  }

  onMoveNextPoint (e: cc.Event.EventTouch) {
    if (!this.touchedNextPoint || this.clearRingStatus) {
      return
    }
    this.touchedNextPoint.node.position = this.touchedNextPoint.node.position.add(e.getDelta())
  }

  onTouchEndNextPoint (e: cc.Event.EventTouch) {
    if (!this.touchedNextPoint || this.clearRingStatus) {
      return
    }

    const minDisPointIndex = this.checkMoveInGameBox()

    if (minDisPointIndex == -1) {
      this.touchedNextPoint.resetPos()
      return
    }
    const canPut = this.checkPointCanUse(minDisPointIndex, this.touchedNextPoint.getComponent(NextRingPoint))
    if (!canPut) {
      this.touchedNextPoint.resetPos()
      SoundManager.getInstance().playSound(SoundName.sound_put_wrong)

      return
    }
    this.putInRingPoint(minDisPointIndex)
    SoundManager.getInstance().playSound(SoundName.sound_put_right)
  }

  checkNextPointCanMove (point: RingPoint) {
    const ringData = point.getRingsData()
    for (let i = 0; i < ringData.length; i++) {
      if (ringData[i] != -1) {
        return true
      }
    }
    return false
  }

  checkMoveInGameBox () {
    const pos = this.touchedNextPoint.node.getWorldP()
    const gameboxRect = this.gameBox.getBoundingBoxToWorld()
    if (!(pos.x >= gameboxRect.x && pos.x <= gameboxRect.x + gameboxRect.width && pos.y >= gameboxRect.y && pos.y < gameboxRect.y + gameboxRect.height)) {
      return -1
    }

    let minDis = 0
    let index = 0
    for (let i = 0; i < this.ringPoints.length; i++) {
      const dis = this.ringPoints[i].node.getWorldP().sub(this.touchedNextPoint.node.getWorldP()).magSqr()
      if (i == 0) {
        minDis = dis
        continue
      }
      if (dis < minDis) {
        minDis = dis
        index = i
      }
    }
    return index
  }

  checkPointCanUse (index: number, sourcePoint: NextRingPoint) {
    const destinationPoint = this.ringPoints[index]

    for (let i = 0; i < 3; i++) {
      const iconIndex = sourcePoint.getRingDataByIndex(i)
      if (iconIndex != -1) {
        if (destinationPoint.getRingDataByIndex(i) != -1) {
          return false
        }
      }
    }
    return true
  }

  putInRingPoint (index) {
    this.setRingDatasBackup()

    const sourcePoint = this.touchedNextPoint.getComponent(NextRingPoint)
    const sourceRingDatas = sourcePoint.getRingsData()
    const destinationPoint = this.ringPoints[index]

    for (let i = 0; i < sourceRingDatas.length; i++) {
      if (sourceRingDatas[i] != -1) {
        const ring = new Ring()
        ring.ringType = i
        ring.ringIconIndex = sourceRingDatas[i]
        destinationPoint.setRing(ring)
      }
    }
    sourcePoint.resetRingPoint()
    this.canUseNextPointCount--

    // 检查消除
    this.checkRemoveRing(index)

    // 检查是否结束游戏
    this.checkEnd()

    // 检查是否需要生成新的环
    this.checkCreateNewPoints()

    this.checkClearRing()
    GameManager.getInstance().gameui.updateDiuqiUi(true)
  }

  checkHasThree (index: number) {
    const point: RingPoint = this.ringPoints[index]
    const datas = point.getRingsData()
    if (datas[0] != -1 && datas[0] == datas[1] && datas[2] == datas[1]) {
      return datas[0]
    }
    return -1
  }

  getRemovePoint (dir: PointDir, index: number, iconIndex: number = -1) {
    if (iconIndex != -1) {
      const rowPoint = this.getPointsByDir(dir, index)
      if (rowPoint && rowPoint.length > 0) {
        let count = 0
        rowPoint.forEach(data => {
          const ringDatas = data.getRingsData()
          for (let i = 0; i < ringDatas.length; i++) {
            if (ringDatas[i] == iconIndex) {
              count++
              break
            }
          }
        })
        if (count == 3) {
          return ([{ dir, iconIndex }])
        }
      }
    } else {
      const rowPoint = this.getPointsByDir(dir, index)
      if (rowPoint && rowPoint.length > 0) {
        const dic: Dictionary<number, number[]> = new Dictionary<number, number[]>()

        for (let n = 0; n < rowPoint.length; n++) {
          const ringDatas = rowPoint[n].getRingsData()
          for (let i = 0; i < ringDatas.length; i++) {
            if (ringDatas[i] != -1) {
              const rCount: number[] = dic.getValue(ringDatas[i], [])
              if (!rCount.Has(n)) {
                rCount.push(n)
                dic.add(ringDatas[i], rCount)
              }
            }
          }
        }

        const result = []
        dic.forEach((k, v) => {
          if (v.length == 3) {
            // cc.log(k + "有3个或以上，进行消除",index,dir);
            result.push({ dir, iconIndex: k })
          }
        })

        return result
      }
    }
    return null
  }

  checkRemoveRing (index: number) {
    const removePoints: Array<{ dir: PointDir, iconIndex: number }> = []
    const hasThree = this.checkHasThree(index)
    if (hasThree != -1) {
      removePoints.push({ dir: PointDir.独点, iconIndex: hasThree })
    }

    let temp = this.getRemovePoint(PointDir.横向, index, hasThree)
    temp && removePoints.AddRange(temp)
    temp = this.getRemovePoint(PointDir.纵向, index, hasThree)
    temp && removePoints.AddRange(temp)
    temp = this.getRemovePoint(PointDir.左上右下, index, hasThree)
    temp && removePoints.AddRange(temp)
    temp = this.getRemovePoint(PointDir.右上左下, index, hasThree)
    temp && removePoints.AddRange(temp)

    if (removePoints.length == 0) {
      this.scoreRate = 0
      GameManager.getInstance().gameui.updateInfoScore(this.score, this.scoreRate)
      return
    }

    this.scoreRate += removePoints.length
    if (this.scoreRate > this.maxScoreRate) {
      this.maxScoreRate = this.scoreRate
    }
    for (let i = 0; i < removePoints.length; i++) {
      this.doRemoveRing(removePoints[i].dir, removePoints[i].iconIndex, index)
    }
  }

  doRemoveRing (dir: PointDir, iconIndex: number, index: number) {
    let scoreCount = 0
    const points = this.getPointsByDir(dir, index)
    if (!points || points.length == 0) {
      return
    }
    points.forEach(p => {
      const datas = p.getRingsData()
      for (let i = 0; i < datas.length; i++) {
        if (datas[i] == iconIndex) {
          p.removeRingAt(i)
          scoreCount++
        }
      }
    })

    this.score += scoreCount * this.scoreRate

    if (this.score > GameManager.getInstance().playerData.bestScore[this.gameType]) {
      GameManager.getInstance().setPlayerBestScore(this.score)
    }

    GameManager.getInstance().gameui.updateInfoScore(this.score, this.scoreRate)
    // cc.log("得分" + scoreCount);
    // cc.log("特效方向" + PointDir[dir]);

    GameManager.getInstance().showGameParticle(dir, points, iconIndex)

    if (this.isTimeMode) {
      this.gameTime += scoreCount
    }
  }

  getPointsByDir (pointDir: PointDir, index: number) {
    const points: RingPoint[] = []

    if (pointDir == PointDir.独点) {
      points.push(this.ringPoints[index])
      return points
    }
    if (pointDir == PointDir.横向) {
      let pos = 0
      pos = Math.floor(index / 3) * 3
      points.push(this.ringPoints[pos])
      points.push(this.ringPoints[pos + 1])
      points.push(this.ringPoints[pos + 2])
      return points
    }
    if (pointDir == PointDir.纵向) {
      let pos = 0
      pos = Math.floor(index % 3)
      points.push(this.ringPoints[pos])
      points.push(this.ringPoints[pos + 3])
      points.push(this.ringPoints[pos + 6])
      return points
    }

    if (pointDir == PointDir.左上右下) {
      if (index == 0 || index == 4 || index == 8) {
        points.push(this.ringPoints[0])
        points.push(this.ringPoints[4])
        points.push(this.ringPoints[8])
      }
      return points
    }
    if (pointDir == PointDir.右上左下) {
      if (index == 2 || index == 4 || index == 6) {
        points.push(this.ringPoints[2])
        points.push(this.ringPoints[4])
        points.push(this.ringPoints[6])
      }
      return points
    }
  }

  setRingDatasBackup () {
    this.scoreBackup = this.score
    this.scoreRateBackup = this.scoreRate
    this.bestScoreBackup = GameManager.getInstance().playerData.bestScore[this.gameType]

    this.nextPointsCountsBackup = this.canUseNextPointCount
    this.ringPoints.forEach(e => {
      e.setBackupData()
    })
    this.nextRingPoints.forEach(e => {
      e.setBackupData()
    })

    this.setRecorveyButtonUi(true)
  }

  recoveryBackupData () {
    this.score = this.scoreBackup
    this.scoreRate = this.scoreRateBackup
    this.canUseNextPointCount = this.nextPointsCountsBackup

    GameManager.getInstance().setPlayerBestScore(this.bestScoreBackup)
    GameManager.getInstance().gameui.updateInfoScore(this.score, this.scoreRate)

    this.ringPoints.forEach(e => {
      e.recoveryBackupData()
    })
    this.nextRingPoints.forEach(e => {
      e.recoveryBackupData()
    })

    this.setRecorveyButtonUi(false)
  }

  setRecorveyButtonUi (canRecovery: boolean) {
    GameManager.getInstance().gameui.updateChehuiUi(canRecovery)
  }

  discardNextPoints () {
    this.nextRingPoints.forEach(e => {
      e.onDiscard()
    })
    this.scheduleOnce(() => {
      this.createNewNextPoints()
    }, 0.25)
  }

  checkClearRing () {
    for (let i = 0; i < this.ringPoints.length; i++) {
      const ringData = this.ringPoints[i].getRingsData()
      for (let j = 0; j < ringData.length; j++) {
        if (ringData[j] != -1) {
          GameManager.getInstance().gameui.updateXiaochuUi(true)
          return
        }
      }
    }
    GameManager.getInstance().gameui.updateXiaochuUi(false)
  }

  clearRingPoint () {
    this.clearRingStatus = true
    this.clearTip.active = true
  }

  btnOfClickRing (e, index) {
    if (!this.clearRingStatus) {
      return
    }

    const datas = this.ringPoints[index].getRingsData()
    if (datas.findIndex(e => { return e != -1 }) == -1) {
      return
    }

    this.ringPoints[index].onClearRing()
    this.clearRingStatus = false
    this.clearTip.active = false

    this.checkClearRing()
  }
}

export enum PointDir {
  横向,
  纵向,
  左上右下,
  右上左下,
  独点
}
