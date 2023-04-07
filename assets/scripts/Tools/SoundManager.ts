import { Dictionary } from '../YZKCocos/Tools/Dictionary'
import YZK from '../YZKCocos/YZK'

const { ccclass, executionOrder, property } = cc._decorator

@ccclass
export default class SoundManager extends cc.Component {
  private readonly saveKey: string = 'soundsavekey'

  @property
    folderName: string = 'sounds'

  private static _instance = null
  static getInstance (): SoundManager {
    return this._instance
  }

  private readonly audioSourceArray: any[] = []
  private soundPlayer: cc.Node = null
  private bgmPlayer = null
  private soundArray: cc.AudioClip[] = []
  private soundDic: Dictionary<string, number> = null

  private soundContrl = false

  private lastBGMStatus = false

  onLoad () {
    SoundManager._instance = this
    cc.game.addPersistRootNode(this.node)
    this.initAudioPlayer()
    this.loadSounds(this.initSoundDic.bind(this))
    this.soundContrl = this.getData()
    this.bgmPlayer.mute = !this.soundContrl
    this.lastBGMStatus = !this.soundContrl

    cc.game.on(cc.game.EVENT_SHOW, () => {
      this.bgmPlayer.mute = this.lastBGMStatus
    }, this)

    cc.game.on(cc.game.EVENT_HIDE, () => {
      this.lastBGMStatus = this.bgmPlayer.mute
    }, this)
  }

  private initAudioPlayer () {
    this.soundPlayer = new cc.Node('soundplayer')
    this.soundPlayer.setParent(this.node)
    this.soundPlayer.addComponent(cc.AudioSource)

    const node = new cc.Node('bgmplayer')
    node.setParent(this.node)
    this.bgmPlayer = node.addComponent(cc.AudioSource)
    this.bgmPlayer.loop = true
    this.bgmPlayer.playOnLoad = true
  }

  private loadSounds (callback) {
    this.soundArray = []
    this.soundDic = new Dictionary<string, number>()
    cc.loader.loadResDir('sounds', (a, b, clip) => {
      if (clip.type == 'mp3') {
        this.soundArray.push(clip._owner)
        this.soundDic.add(clip._owner.name, this.soundArray.length - 1)

        if (clip._owner.name == 'bgm') {
          this.bgmPlayer.clip = clip._owner
          this.bgmPlayer.mute = !this.soundContrl
          !this.bgmPlayer.isPlaying && this.bgmPlayer.play()
        }
      }
    }, (e, resArray, u) => {
      // console.log(resArray);
      // callback && callback(resArray);
    })
  }

  private initSoundDic (clips) {
    for (let i = 0; i < clips.length; i++) {
      this.soundDic.add(clips[i].name, i)

      if (clips[i].name == 'bgm') {
        this.bgmPlayer.clip = clips[i]
        this.bgmPlayer.mute = !this.soundContrl
        !this.bgmPlayer.isPlaying && this.bgmPlayer.play()
      }
    }
  }

  setSoundCtrl (open: boolean): boolean {
    this.soundContrl = open
    this.bgmPlayer.mute = !open
    this.setData()
    return this.soundContrl
  }

  getSoundControl () {
    return this.soundContrl
  }

  playSound (clipName: string) {
    if (!this.soundContrl) {
      return
    }

    let audioSource: any = null
    if (this.audioSourceArray.length == 0) {
      audioSource = this.createAudioSource()
    } else {
      audioSource = this.audioSourceArray.pop()
    }

    const clip = this.soundArray[this.soundDic.getValue(clipName)]
    if (YZK.isBaidu) {
      audioSource.src = clip.url
    } else {
      audioSource.clip = clip
    }
    audioSource.play()
    setTimeout(() => {
      audioSource.stop()
      this.audioSourceArray.push(audioSource)
    }, 1000)
  }

  setBGMPause () {
    this.bgmPlayer.mute = true
  }

  setBGMResume () {
    this.bgmPlayer.mute = !this.soundContrl
  }
  /*
        const backgroundAudioManager = swan.createInnerAudioContext();

        backgroundAudioManager.src = 'http://ameng.gz01.bdysite.com/music/sol_music_BGM.mp3'
        backgroundAudioManager.loop = true
        backgroundAudioManager.autoplay = true
    */

  /**
     * 百度平台音效会有播放不出的现象
     * 针对百度有特殊处理
     */
  private createAudioSource () {
    if (YZK.isBaidu) {
      // @ts-expect-error
      const backgroundAudioManager = swan.createInnerAudioContext()
      backgroundAudioManager.loop = false
      backgroundAudioManager.autoplay = false
      return backgroundAudioManager
    }
    const node = cc.instantiate(this.soundPlayer)
    node.setParent(this.node)
    const audioSource = node.getComponent(cc.AudioSource)
    audioSource.clip = null
    audioSource.playOnLoad = false
    audioSource.loop = false
    return audioSource
  }

  private getData () {
    const str = cc.sys.localStorage.getItem(this.saveKey)
    if (!str || str == '' || str == '1') {
      return true
    }
    return false
  }

  private setData () {
    cc.sys.localStorage.setItem(this.saveKey, this.soundContrl ? 1 : 0)
  }
}

export class SoundName {
  static sound_common_click = '通用按钮'
  static sound_end = '结束'
  static sound_double_hit = '连击'
  static sound_clear_ring = '消环'
  static sound_put_wrong = '放环失败'
  static sound_put_right = '放环成功'
}
