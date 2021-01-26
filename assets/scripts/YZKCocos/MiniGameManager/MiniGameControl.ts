import YZK from "../YZK";
import MiniGameManager from "./MiniGameManager";

const {ccclass, property} = cc._decorator;

/**
 * 指定在哪个平台下显示此节点
 */
@ccclass
export default class MiniGameControl extends cc.Component {

    @property({
        displayName:"微信开关"
    })
    isWeChat:boolean = false;
    
    @property({
        displayName:"QQ开关"
    })
    isQQ:boolean = false;

    @property({
        displayName:"头条开关"
    })
    isToutiao:boolean = false;

    @property({
        displayName:"头条安卓",
        visible(){
            return this.isToutiao;
        }
    })
    isAndroidToutiao:boolean = true;

    @property({
        displayName:"头条IOS",
        visible(){
            return this.isToutiao;
        }
    })
    isIosToutiao:boolean = false;

    @property({
        displayName:"百度"
    })
    isBaidu:boolean = false;

    @property({
        displayName:"Oppo"
    })
    isOppo:boolean = false;

    @property({
        displayName:"Vivo"
    })
    isVivo:boolean = false;

    @property({
        displayName:"小米"
    })
    isXiaomi:boolean = false;

    @property({
        displayName:"UC"
    })
    isUC:boolean = false;

    @property({
        displayName:"4399"
    })
    is4399:boolean = false;

    @property({
        displayName:"360"
    })
    is360:boolean = false;

    @property({
        displayName:"原生安卓开关"
    })
    isAndroid:boolean = false;

    @property({
        displayName:"原生IOS开关"
    })
    isIOS:boolean = false;

    onEnable(){
        
        let on = false;
        if(YZK.isMiniGame || YZK.isTestBrowser){
            on = (this.isWeChat && MiniGameManager.Instance.isWeChat) || 
                (this.isQQ && MiniGameManager.Instance.isQQ) ||
                (this.isToutiao && MiniGameManager.Instance.isTouTiao && ((MiniGameManager.Instance.isAndroid && this.isAndroidToutiao) || (MiniGameManager.Instance.isIOS && this.isIosToutiao))) ||
                (this.isBaidu && MiniGameManager.Instance.isBaidu) ||
                (this.isOppo && MiniGameManager.Instance.isOppo) ||
                (this.isVivo && MiniGameManager.Instance.isVivo) ||
                (this.isXiaomi && MiniGameManager.Instance.isXiaoMi) ||
                (this.isUC && MiniGameManager.Instance.isUC) ||
                (this.isUC && MiniGameManager.Instance.is4399) ||
                (this.isUC && MiniGameManager.Instance.is360) 
                ;
        }else if(YZK.isAndroid){
            on = this.isAndroid;
        }else if(YZK.isIOS){
            on = this.isIOS;
        }
        this.node.active = on;
    }
}
