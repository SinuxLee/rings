import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_Oppo extends MiniGameBase {
    
    initAd(){
        this.initAdService(()=>{
            this.createBanner();
            this.createVideoAd();
            this.createInsertAd();
        });
    }

    getSystemInfo() {
        //@ts-ignore
        return qg.getSystemInfoSync();
    }

    /**
     * Oppo跳转逻辑
     * @param miniProgramAppId 包名(eg.'com.demo')
     * @param callback 
     */
    launchMiniProgram(miniProgramAppId:string,callback) {
        //@ts-ignore
        qg.navigateToMiniGame({
            pkgName:miniProgramAppId,
            success:()=>{
                callback && callback(true);
            },
            fail:(res)=>{
                callback && callback(false);
                console.log(`小程序跳转失败`);
            }
        });
    }

    /**
     * Oppo的登陆只能获得Token
     * 获取用户信息需要使用Token获取
     * https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/feature/account.html
     */
    login(callBack: any) {
        //@ts-ignore
        qg.login({
            success:(userRes)=>{
                MG_Oppo.userCode = userRes.data.token;
            },
            fail (res) {
                console.log(`login调用失败`);
            }
        });
    }

    /**
     * 初始化广告服务
     */
    initAdService(callBack){
        console.log("1051版本开始不需要初始化操作");
        return;

        //@ts-ignore
        qg.initAdService({
            appId: this.appData.appsid,
            isDebug:true,
            success: function(res) {
                console.error("oppo广告组件初始化成功");
                callBack && callBack();
            }
        })
    }

    createBanner() {
        //oppo暂不支持 onload

        //@ts-ignore
        this.bannerAd = qg.createBannerAd({
            adUnitId: this.appData.bannerid
        });
      
        this.bannerAd.onHide(()=>{
            this.bannerAd.destroy();
            this.bannerAd = null;
        });

        this.bannerAd.onError((res)=>{
            console.log(res);
            this.bannerAd.destroy();
            this.bannerAd = null;
        });

        //console.log("oppo banner",this.bannerAd);
        // this.bannerAd.onLoad(()=>{
        //     if(this.needShowBanner){
        //         this.bannerAd.show();
        //     }
        // });
    }

    showBanner() {
        if(this.bannerAd){
            this.hideBanner();
        }
        this.needShowBanner = true;
        this.createBanner();
        setTimeout(() => {
            if(this.needShowBanner){
                this.bannerAd.show();
            }
        }, 1000);
    }

    hideBanner() {
        if(this.bannerAd){
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        this.needShowBanner = false;
    }

    createVideoAd() {
        //@ts-ignore
        this.videoAd = qg.createRewardedVideoAd({
            adUnitId:this.appData.videoid
        });
        this.videoAd.load();
        
        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_Oppo.videoCallback){
                    MG_Oppo.videoCallback(true);
                }
            }else{
                if(MG_Oppo.videoCallback){
                    MG_Oppo.videoCallback(false);
                }
            }
            MG_Oppo.videoCallback = null;
        });
    }

    showVideoAd(callback: any) {
        MG_Oppo.videoCallback = callback;
        if(!this.videoAd){
            callback(false);
            return;
        }
        this.videoAd.show().catch(err => {
            callback(false);
        });
    }

    createInsertAd() {
        //@ts-ignore
        this.insertAd = qg.createInsertAd({
            adUnitId:this.appData.insertid
        });

        this.insertAd.onClose(()=>{
            this.insertAd = null;
            this.showBanner();
        });

        this.insertAd.onError((res)=>{
            console.log(res);
        });

        this.insertAd.load(()=>{
            this.insertAd.show();
        });
    }

    showInsertAd() {
        if(this.insertAd){
            this.insertAd.show();
        }else{
            this.createInsertAd();
        }
    }

    doVibrate(short: boolean = true) {
        if(short){
            //@ts-ignore
            qg.vibrateShort({});
        }else{
            //@ts-ignore
            qg.vibrateLong({});
        }
    }

    exitGame() {
        //@ts-ignore
        qg.exitApplication({});
    }
    request(object) {
        //@ts-ignore
        return qg.request(object);
    }

    downloadFile(object) {
        //@ts-ignore
        return qg.downloadFile(object);
    }

    uploadFile(object) {
        //@ts-ignore
        return qg.uploadFile(object);
    }
    
    startAccelerometer(callback) {
        //@ts-ignore
        qg.startAccelerometer({
            interval: "normal"
        });
        //@ts-ignore
        qg.onAccelerometerChange((x,y,z)=>{
            callback && callback({x:x,y:y,z:z});
        });
    }

    stopAccelerometer() {
        //@ts-ignore
        qg.stopAccelerometer({});
    }
}
