import MiniGameManager from "./MiniGameManager/MiniGameManager";
import PushAPI from "./Android/PushAPI";
import IOSSDKManager, { ShareType } from "./IOS/IOSSDKManager";
import Payment from "./Android/Payment";

const { ccclass, property } = cc._decorator;

@ccclass
export default class YZK {

        /**
         * 是否展示广告
         */
        static get isOpenVideo() {
                if (!this.isMiniGame) {
                        return !CC_DEBUG;
                }

                if (!MiniGameManager.Instance) {
                        return true;
                }

                if (!MiniGameManager.Instance.gameData) {
                        return false;
                }

                return MiniGameManager.Instance.gameData.appData.video;
        }

        // <summary>
        /// 展示顶部Banner广告
        /// </summary>
        /// <param name="callBack">回调码，广告类型，回调信息</param>
        public static showBanner(bottom: boolean) {
                if (!this.isOpenVideo) {
                        return;
                }

                if (CC_DEV) {
                        cc.log("播放Banner成功！");
                }
                else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.showBanner();
                }
                else if (YZK.isAndroid) {
                        PushAPI.getInstance().showBanner(bottom, null);
                }
                else if (YZK.isIOS) {
                        IOSSDKManager.Instance().showBanner(bottom);
                }
        }

        /// <summary>
        /// 隐藏底部Banner广告
        /// </summary>
        public static hideBanner() {
                if (!this.isOpenVideo) {
                        return;
                }

                if (CC_DEV) {
                        cc.log("关闭banner广告成功！");
                } else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.hideBanner();
                } else if (YZK.isAndroid) {
                        PushAPI.getInstance().hideBanner();
                } else if (YZK.isIOS) {
                        IOSSDKManager.Instance().hideBanner();
                }
        }

        /**
         * 今日是否可以展示adType类型广告
         * @param adType 0插屏，1视屏，2banner
         */
        public static canShowAd(adType: number): boolean {
                if (!this.isOpenVideo) {
                        return false;
                }

                if (CC_DEV) {
                        return true;
                } else if (YZK.isMiniGame) {
                        return true;
                } else if (YZK.isAndroid) {
                        return PushAPI.getInstance().checkCanPlayToDay(adType);
                } else if (YZK.isIOS) {
                        return IOSSDKManager.Instance().isReadyAd(adType);
                }
        }

        /// <summary>
        /// 展示插屏广告
        /// </summary>
        /// <param name="positionId">插屏广告的位置</param>
        /// <param name="callBack"></param>
        public static showInsert(pageId) {
                if (!this.isOpenVideo) {
                        return;
                }

                if (CC_DEV) {
                        
                }
                else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.showInsert();
                }
                else if (YZK.isAndroid) {
                        
                        PushAPI.getInstance().showScreenOrVideoAd(pageId,null);
                }
                else if (YZK.isIOS) {
                        IOSSDKManager.Instance().showInsert(null);
                }

        }

        /**
         * 播放视频
         * 
         * code =0 成功
         * 
         * code = -1播放失败
         * 
         * code =-2 用户关闭
         * 
         * code =-3 加载失败
         */
        public static showVideo(callBack: (isSuccess: boolean) => void) {

                if (!this.isOpenVideo) {
                        callBack && callBack(true);
                        return;
                }

                if (CC_DEV) {
                        callBack(true);
                }
                else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.showVideo(callBack);
                }
                else if (YZK.isAndroid) {
                        PushAPI.getInstance().showScreenOrVideoAd(-1, (code) => {
                               callBack && callBack(code.toString() == "true");
                        });
                }
                else if (YZK.isIOS) {
                        IOSSDKManager.Instance().showVideo(callBack);
                }
        }

        /// <summary>
        /// 播放开屏广告接口
        /// </summary>
        public static showSplash() {

                if (!this.isOpenVideo) {
                        return;
                }

                if (CC_DEV) {
                        cc.log("播放开屏广告成功！");
                }
                else if (YZK.isMiniGame) {
                        cc.log("微信没有开屏广告！");
                }
                else if (YZK.isAndroid) {
                        cc.log("安卓没有开屏广告！");
                }
                else if (YZK.isIOS) {
                        IOSSDKManager.Instance().showNSplash();
                }

        }

        /**
         * 手机短震动接口
         */
        public static doVibrate() {
                if (CC_DEV) {
                        cc.log("短震动");
                } else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.doVibrate();
                } else if (cc.sys.ANDROID === cc.sys.platform) {
                        //实现此功能需要在Cocos导出的工程中，找到AppActivity加入一些代码，详情参考接入文档
                        try{
                                //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrate", "(I)V", 40);
                                PushAPI.getInstance().vibratePhoneOnce(40);
                        }
                        catch(error) {
                                throw (error);
                        }
                } else if (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform) {
                        IOSSDKManager.Instance().doVibrate();
                }
        }

        /**
         * 
         * 计费接口
         */
        public static buy(goodsId: string, callback: Function) {
                if (!cc.sys.isNative || !cc.sys.isMobile) {
                        callback(true);
                        return;
                }
                Payment.getInstance().buy(goodsId, false, (result) => {
                        callback(result === "true");
                });
        }

        /**
         * 分享功能
         */
        public static shareToWx(callback = null, title: string = null, toScene: ShareType = ShareType.好友) {

                if (this.isVivo || this.isOppo || this.isAndroid || this.isIOS) {
                        callback && callback();
                        return;
                }
                if (YZK.isIOS) {
                        IOSSDKManager.Instance().shareToWx(title, toScene, callback);
                } else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.shareApp(callback, title);
                }
                else {
                        cc.log("分享到微信");
                        callback && callback();
                }
        }

        /**
         * 评分功能
         */
        public static storeReview() {
                if (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform) {
                        IOSSDKManager.Instance().storeReview();
                } else {
                        cc.log("IOS好评功能");
                }
        }

        /**
     * 小程序跳转
     */
        public static launchMiniProgram(miniId: string, callBack = null) {
                if (YZK.isIOS) {
                        IOSSDKManager.Instance().launchMiniProgram(miniId);
                } else if (YZK.isMiniGame) {
                        MiniGameManager.Instance.launchMiniProgram(miniId, callBack);
                } else {
                        cc.log("拉起小程序功能");
                }
        }

        public static get isTestBrowser(): boolean {
                return cc.sys.isBrowser && !cc.sys.isMobile;
        }

        public static get isIOS(): boolean {
                return cc.sys.isMobile && (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform);
        }

        public static get isBrowser(): boolean {
                return cc.sys.isBrowser;
        }

        /**
         * 包含微信,QQ,头条,OPPO,vivo,小米,百度
         */
        public static get isMiniGame() {
                return cc.sys.WECHAT_GAME === cc.sys.platform ||
                        cc.sys.BAIDU_GAME === cc.sys.platform ||
                        cc.sys.OPPO_GAME === cc.sys.platform ||
                        cc.sys.VIVO_GAME === cc.sys.platform ||
                        cc.sys.HUAWEI_GAME === cc.sys.platform||
                        cc.sys.isBrowser
                        ;
        }

        public static get isAndroid() {
                return cc.sys.isMobile && cc.sys.ANDROID === cc.sys.platform;
        }

        public static get isOppo() {
                return cc.sys.OPPO_GAME === cc.sys.platform;
        }

        public static get isVivo() {
                return cc.sys.VIVO_GAME === cc.sys.platform;
        }

        public static get isXiaomi() {
                //@ts-ignore
                return cc.sys.XIAOMI_GAME === cc.sys.platform;
        }

        public static get isBaidu() {
                return cc.sys.BAIDU_GAME === cc.sys.platform;
        }

        public static httpRequestGet(url, callback) {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                                callback && callback(xhr.responseText);
                        }
                };
                xhr.open('Get', url, true);
                xhr.send();
        }

        public static httpRequestPost(url:string,body:string,callback,type = ""){
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = ()=>{
                    if(xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)){
                        callback && callback(xhr.responseText);
                    }
                };
                xhr.open('post',url,true);
                if (type === "json") {
                    xhr.setRequestHeader("Content-Type", "application/json");
                } else {
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }
        
                xhr.send(body);
             }

        public static getImageByUrl(url, callback) {
                cc.loader.load({ url: url, type: 'png' }, (e, p) => {
                        if (e) {
                                console.error(e);
                                return;
                        }
                        callback && callback(new cc.SpriteFrame(p));
                });
        }

        public static getJsonData(jsonName,callback){
                cc.loader.loadRes(jsonName,cc.JsonAsset,(error,json)=>{
                        if(error){
                            cc.error(error.message);
                        }else{
                           callback(json);
                        }
                    });
        }

}
