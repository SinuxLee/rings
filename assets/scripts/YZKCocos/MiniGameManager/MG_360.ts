import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_360 extends MiniGameBase {
    
    showShareMenu() {
        //@ts-ignore
        qh.showShareMenu({});
    }

    setOnShareAppMessage(shareTitle?:string,shareImageUrl?:string) {
        //@ts-ignore
        qh.onShareAppMessage(()=>{
            return {
                title: this.appData.sharetitle,
                imageUrl: this.appData.shareimageurl
                //query:this.shareString//分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            }
        });
    }

    shareApp(callback?: Function, shareTitle?: string, shareImageUrl?: string,query:string = "") {
        //@ts-ignore
        qh.shareAppMessage(
        {
            title: shareTitle ? shareTitle : this.appData.sharetitle,
            imageUrl: shareImageUrl ? shareImageUrl : this.appData.shareimageurl,
            query:query, //分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            success(res){
                if(res.result){
                    callback(true);
                }
            }
        });
    }

    createVideoAd() {
        //@ts-ignore
        this.videoAd = qh.createRewardedVideoAd({
            adUnitId:this.appData.videoid
        });

        this.videoAd.load();

        this.videoAd.onLoad(res=>{
            console.log('video loaded');
        });

        this.videoAd.onClose(res =>{
            if ((res && res.isEnded) || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_360.videoCallback){
                    MG_360.videoCallback(true);
                }
            }else{
                if(MG_360.videoCallback){
                    MG_360.videoCallback(false);
                }
            }
            MG_360.videoCallback = null;
        });

        this.videoAd.onError((res)=>{
            console.log("video error",res);
        });
    }

    showVideoAd(callback: any) {
        MG_360.videoCallback = callback;
        this.videoAd.show().catch(err => {
            console.log('play video err ');
            callback(false);
        });
    }

    createBanner() {

        //@ts-ignore
        this.bannerAd = qh.createBannerAd({
            adUnitId: this.appData.bannerid,
            adIntervals:30,
            style:{
                left: 0,
                top: this.systemInfo.windowHeight,
                width: 200
            }
        });

        this.bannerAd.onError(()=>{
            this.bannerAd.destroy();
            this.bannerAd = null;
        });

        this.bannerAd.onLoad(() => {
            if(this.needShowBanner){
                this.bannerAd.show();
            }
        });
    }

    showBanner() {
        if(this.bannerAd){
            this.hideBanner();
        }

        this.needShowBanner = true;
        this.createBanner();
    }

    hideBanner() {
        if(this.bannerAd){
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }

        this.needShowBanner = false;
    }
    
}
