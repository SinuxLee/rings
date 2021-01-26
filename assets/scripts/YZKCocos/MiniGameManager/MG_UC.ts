import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_UC extends MiniGameBase {

    createBanner() {
        //@ts-ignore
        this.bannerAd = uc.createBannerAd({
            style: {
                gravity:7,			// 0:左上 1：顶部居中 2：右上
                                                // 3：左边垂直居中 4：居中 5：右边垂直居中
                                                // 6：左下 7：底部居中 8：右下 （默认为0）
                left: 10, 			// 左边 margin
                top: 76, 				// 顶部 margin
                bottom: 100, 		// 底部 margin
                right: 100, 		// 右边 margin
                width: 320,
                height: 200,		// 如果不设置高度，会按比例适配
              }
        });
        
        this.bannerAd.onLoad(() => {
            if(this.needShowBanner){
                this.bannerAd.show();
            }
        });

        this.bannerAd.onError((res)=>{
            console.error(res);
            this.bannerAd.destroy();
            this.bannerAd = null;
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
            //this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        this.needShowBanner = false;
    }

    createVideoAd() {
        console.log("开始加载视频");
        //@ts-ignore
        this.videoAd = uc.createRewardVideoAd();
      
        this.videoAd.onLoad(()=>{
            console.log("视频加载成功");
        });

        //this.videoAd.load();

        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_UC.videoCallback){
                    MG_UC.videoCallback(true);
                }
            }else{
                if(MG_UC.videoCallback){
                    MG_UC.videoCallback(false);
                }
            }
            MG_UC.videoCallback = null;
        });
    }

    showVideoAd(callback: any) {
        MG_UC.videoCallback = callback;
        if(!this.videoAd){
            callback(false);
            return;
        }
        this.videoAd.show().then().catch(err => {
            callback(false);
        });
    }

    shareApp(callback?: Function, shareTitle?: string, shareImageUrl?: string,query:string = "") {

        //@ts-ignore
        uc.shareAppMessage(
        {
            // title: shareTitle ? shareTitle : null,
            // imageUrl: null,
            query:query, //分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            target:'wechat',
            success() {
                console.log("share success");
                if(callback){
                    callback();
                }
            },
            fail(e) {
                console.log("share fail");
            }
        });
        
    }
}
