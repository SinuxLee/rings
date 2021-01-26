import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_Vivo extends MiniGameBase {

    private canLoadVideo = true;
    private canCreateBanner = true;
    private canCreateInsert = true;

    initAd(){
        setTimeout(() => {
            this.createVideoAd();
        }, 10000);

        // setTimeout(() => {
        //     this.canCreateInsert = true;
        // }, 120000);
    }

    getSystemInfo() {
        //@ts-ignore
        return qg.getSystemInfoSync();
    }

    showToast(title:string,successIcon:boolean = true ) {
        //@ts-ignore
        qg.showToast({
            message:title,
            duration:0
        });
    }

    chekcUpdateVersion() {
        //@ts-ignore
        qg.onUpdateReady((res)=>{
            if(res == 1) {
                //@ts-ignore
                qg.showDialog({
                    title:"更新提示",
                    message:"新版本已经准备好,是否重启应用?",
                    success:()=>{
                        //@ts-ignore
                        qg.applyUpdate();    
                    }
                });
            }
        });
    }

    createBanner() {
        //@ts-ignore
        this.bannerAd = qg.createBannerAd({
            posId: this.appData.bannerid,
            style:{}
        });

        this.bannerAd.onClose(()=>{
            this.bannerAd.destroy();
            this.bannerAd = null;
        });

        this.bannerAd.onError((res)=>{
            console.log(res);
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

        if(!this.canCreateBanner){
            console.log("banner广告太频繁");
            return;
        }
        
        this.canCreateBanner = false;
        setTimeout(() => {
            this.canCreateBanner = true;
        }, 10000);
        
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

    createVideoAd() {
        //@ts-ignore
        this.videoAd = qg.createRewardedVideoAd({
            posId:this.appData.videoid
        });

        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_Vivo.videoCallback){
                    MG_Vivo.videoCallback(true);
                }
            }else{
                if(MG_Vivo.videoCallback){
                    MG_Vivo.videoCallback(false);
                }
            }
            MG_Vivo.videoCallback = null;

            //this.videoAd && this.videoAd.load();
            setTimeout(()=>{
                this.videoAd.load();
            },45000);
        });

        this.videoAd.onError((err)=>{
            console.log(err);
        });
    }

    showVideoAd(callback: any) {
        MG_Vivo.videoCallback = callback;
        if(!this.videoAd){
            callback && callback(false);
            return;
        }
        this.videoAd.show().catch(err => {
            if(this.canLoadVideo){
                this.canLoadVideo = false;
                setTimeout(()=>{
                    this.videoAd.load();
                    this.canLoadVideo = true;
                },10000);
            }
            callback && callback(false);
        });
    }

    createInsertAd() {

        if(!this.canCreateInsert){
            return;
        }

        //@ts-ignore
         this.insertAd = qg.createInterstitialAd({
            posId:this.appData.insertid
        });
        this.insertAd.onClose(()=>{
            this.insertAd.destroy();
            this.insertAd = null;

            this.showBanner();
        });

        this.insertAd.onLoad(()=>{
            this.insertAd.show();
        });
        
        this.insertAd.onError((res)=>{
            console.log("error",res);
            this.insertAd.destroy();
            this.insertAd = null;
        });
    }

    showInsertAd() {
        if(!this.canCreateInsert){
            this.showBanner();
            return;
        }

        this.createInsertAd();
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
        qg.exitApplication();
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
        //cc.systemEvent.setAccelerometerEnabled(true);
        console.log("vivo平台不需要开启监听");
        //@ts-ignore
        qg.subscribeAccelerometer({
            callback: function (data) {
                callback && callback({x:data.x /10,y:data.y/10,z:data.z/10});
            }
        })
    }

    stopAccelerometer() {
       //cc.systemEvent.setAccelerometerEnabled(false);
       //@ts-ignore
       qg.unsubscribeAccelerometer();
    }
}
