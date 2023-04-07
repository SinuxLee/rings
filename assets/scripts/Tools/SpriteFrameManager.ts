import { Dictionary } from '../YZKCocos/Tools/Dictionary'
import { RingType } from '../Game/Ring'
import { SkinType } from '../Game/GameManager'

const { ccclass, executionOrder, property, executeInEditMode } = cc._decorator

@ccclass
// @executeInEditMode

@executionOrder(-1)
export default class SpriteFrameManager extends cc.Component {
  @property({
    type: [cc.SpriteFrame],
    displayName: '冰雪Large'
  })
  private readonly snowLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '冰雪Mid'
  })
  private readonly snowMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '冰雪Small'
  })
  private readonly snowSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '蛇Large'
  })
  private readonly snakeLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '蛇Mid'
  })
  private readonly snakeMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '蛇Small'
  })
  private readonly snakeSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '星座Large'
  })
  private readonly starLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '星座Mid'
  })
  private readonly starMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '星座Small'
  })
  private readonly starSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '海洋Large'
  })
  private readonly seaLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '海洋Mid'
  })
  private readonly seaMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '海洋Small'
  })
  private readonly seaSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '科学Large'
  })
  private readonly scienceLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '科学Mid'
  })
  private readonly scienceMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '科学Small'
  })
  private readonly scienceSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '经典Large'
  })
  private readonly classicLarge: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '经典Mid'
  })
  private readonly classicMid: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: '经典Small'
  })
  private readonly classicSmall: cc.SpriteFrame[] = []

  @property({
    type: [cc.SpriteFrame],
    displayName: 'skinBG'
  })
  private readonly skinBG: cc.SpriteFrame[] = []

  private static _instance: SpriteFrameManager = null
  static get Instance (): SpriteFrameManager {
    return this._instance
  }

  onLoad () {
    SpriteFrameManager._instance = this
    cc.game.addPersistRootNode(this.node)

    // 面板上的sprite整合到一起
    // this.sprites.AddRange(this.itemsSprite);

    // this._spriteDic = new Dictionary<string,number>();
    // for (let i = 0; i < this.sprites.length; i++) {
    //     this._spriteDic.add(this.sprites[i].name,i);
    // }
  }
  /*
    @property
    doread:boolean = false;

    update(){
        if(this.doread){
            this.doread = false;
            cc.loader.loadResDir("星座",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.starLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.starMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.starSmall.push(array[i]);
                    }
                }
            });

            cc.loader.loadResDir("冰雪",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.snowLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.snowMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.snowSmall.push(array[i]);
                    }
                }
            });

            cc.loader.loadResDir("圈与蛇",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.snakeLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.snakeMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.snakeSmall.push(array[i]);
                    }
                }
            });

            cc.loader.loadResDir("海洋",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.seaLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.seaMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.seaSmall.push(array[i]);
                    }
                }
            });

            cc.loader.loadResDir("科学",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.scienceLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.scienceMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.scienceSmall.push(array[i]);
                    }
                }
            });

            cc.loader.loadResDir("经典",cc.SpriteFrame,(e,array)=>{
                for(let i=0;i<array.length;i++){
                    let n:string = array[i].name;
                    if(n.indexOf("da") != -1){
                        this.classicLarge.push(array[i]);
                    }
                    if(n.indexOf("zh") != -1){
                        this.classicMid.push(array[i]);
                    }
                    if(n.indexOf("xi") != -1){
                        this.classicSmall.push(array[i]);
                    }
                }
            });
        }
    } */

  getIcon (skinType: SkinType, type: RingType, index: number): cc.SpriteFrame {
    switch (skinType) {
      case SkinType.冰雪:
        if (type == RingType.large) {
          return this.snowLarge[index]
        } else if (type == RingType.mid) {
          return this.snowMid[index]
        } else {
          return this.snowSmall[index]
        }
      case SkinType.星座:
        if (type == RingType.large) {
          return this.starLarge[index]
        } else if (type == RingType.mid) {
          return this.starMid[index]
        } else {
          return this.starSmall[index]
        }
      case SkinType.海洋:
        if (type == RingType.large) {
          return this.seaLarge[index]
        } else if (type == RingType.mid) {
          return this.seaMid[index]
        } else {
          return this.seaSmall[index]
        }
      case SkinType.科学:
        if (type == RingType.large) {
          return this.scienceLarge[index]
        } else if (type == RingType.mid) {
          return this.scienceMid[index]
        } else {
          return this.scienceSmall[index]
        }
      case SkinType.经典:
        if (type == RingType.large) {
          return this.classicLarge[index]
        } else if (type == RingType.mid) {
          return this.classicMid[index]
        } else {
          return this.classicSmall[index]
        }
      case SkinType.蛇:
        if (type == RingType.large) {
          return this.snakeLarge[index]
        } else if (type == RingType.mid) {
          return this.snakeMid[index]
        } else {
          return this.snakeSmall[index]
        }
    }
  }

  getSkinBg (skinType: SkinType) {
    return this.skinBG[skinType]
  }
}
