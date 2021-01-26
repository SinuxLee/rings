import YZK from "../YZK";
import ShareGameManager from "./ShareGameManager";
import MiniGameManager from "../MiniGameManager/MiniGameManager";
import TipsManager from "../Tools/TipsManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShareNode extends cc.Component {

    @property({
        displayName:"使用小游戏Icon"
    })
    useGameIcon:boolean = true;

    @property({
        displayName:"是否抖动"
    })
    canShake:boolean = true;

    shareSprite:cc.Sprite = null;

    private static _instance = null;
    static get Instance():ShareNode{
        return this._instance;
    }

    swapIcon() {
        this.showShareNode();

        if(this.canShake){
            this.animation();
        }
    }

    onLoad(){
        if(MiniGameManager.Instance.isXiGua){
            this.node.active = false;
            return;
        }
        
        this.shareSprite = this.getComponent(cc.Sprite);
        this.shareSprite.sizeMode == cc.Sprite.SizeMode.CUSTOM; 
    }

    start(){
        this.scheduleOnce(this.swapIcon,1);
    }

    onDestroy(){
        this.node.targetOff(this.node);
        this.unschedule(this.swapIcon);
    }

    showShareNode(){
        if(YZK.isTestBrowser || YZK.isMiniGame){
            this.scheduleOnce(()=>{

                let appId = ShareGameManager.Instance.getRandomAppIds(1)[0];

                if(!appId || appId ==undefined){
                    return;
                }
                
                if(this.useGameIcon){
                    ShareGameManager.Instance.getAppIcon((spriteFrame)=>{
                        this.shareSprite.spriteFrame = spriteFrame;
                    },appId);
                }
                
                this.node.on(cc.Node.EventType.TOUCH_START,()=>{
                    if(MiniGameManager.Instance.isQQ){
                        MiniGameManager.Instance.showQQAppBox((res)=>{
                            if(!res){
                                TipsManager.getInstance().showTips("广告还没准备好,请稍后再试!");
                            }
                        });
                    }else if(MiniGameManager.Instance.isTouTiao){
                        MiniGameManager.Instance.showMoreGamesModal();
                    }else{
                        YZK.launchMiniProgram(appId);
                    }
                   
                },this);

            },0.5);
        }

        this.scheduleOnce(()=>{
            this.node.off(cc.Node.EventType.TOUCH_START);
            this.showShareNode();
        },10);
    }

    animation(){
        cc.tween(this.node).then(cc.tween().delay(2).then(cc.tween().to(0.1,{angle:10},null).to(0.1,{angle:-10},null)).repeat(4).set({angle:0})).repeatForever().start();
    }
}
