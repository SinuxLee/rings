import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_WeChat extends MiniGameBase {

    private bannerCount = 0;

    getSystemInfo() {
        //@ts-ignore
        return wx.getSystemInfoSync();
    }

    showShareMenu() {
        //@ts-ignore
        wx.showShareMenu({
            withShareTicket:true
        });
    }

    setOnShareAppMessage() {
        //@ts-ignore
        wx.onShareAppMessage(()=>{
            return {
                title: this.appData.sharetitle,
                imageUrl: this.appData.shareimageurl
                //query:this.shareString//分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            }
        });
    }

    shareApp(callback?: Function, shareTitle?: string, shareImageUrl?: string,query:string = "") {
        this.readyShare = true;

        //@ts-ignore
        wx.shareAppMessage(
        {
            title: shareTitle ? shareTitle : this.appData.sharetitle,
            imageUrl: shareImageUrl ? shareImageUrl : this.appData.shareimageurl,
            query:query //分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
        });
    }

    showToast(title:string,successIcon:boolean = true ) {
        //@ts-ignore
        wx.showToast({
            title:title,
            icon:successIcon? "success":"none",
            duration:2000,//延迟,
            mask:true,//防触摸穿透
        });
    }

    chekcUpdateVersion() {
        //@ts-ignore
        let updateManager = wx.getUpdateManager();
        //请求新版本信息回调
        updateManager.onCheckForUpdate((res)=>{
            if(!res.hasUpdate){//没新版本
                return;
            }
            //@ts-ignore
            wx.showToast({
                title: '即将有更新'
            });

            updateManager.onUpdateReady(()=>{
                //@ts-ignore    
                wx.showModal({
                    title:"更新提示",
                    content:"新版本已经准备好,是否重启应用?",
                    success:(res)=>{
                        if(res.confirm)
                        {
                            updateManager.applyUpdate();
                        }
                    }
                });
            })
            updateManager.onUpdateFailed(()=>{
                //@ts-ignore
                wx.showModal({
                    title:"已经有新版本了哟~",
                    content:"新版本已经上线,请重新启动后更新"
                })
            })
        });
    }

    launchMiniProgram(miniProgramAppId:string,callback) {
        //@ts-ignore
        wx.navigateToMiniProgram({
            appId:miniProgramAppId,
            success:(res)=>{
                callback && callback(true);
            },
            fail:(res)=>{
                callback && callback(false);
                console.log(`小程序跳转失败`);
            }
        });
    }

    login(callback: any) {
        //@ts-ignore
        wx.login({
            success:(userRes)=>{
                MG_WeChat.userCode = userRes.code;
                callback && callback();
            },
            fail (res) {
                console.log(`login调用失败`);
            }
        });
    }

    getSetting(callback){
        //@ts-ignore
        wx.getSetting({
            success(res){
                if (res.authSetting["scope.userInfo"]){
                    //@ts-ignore
                    wx.getUserInfo({
                        success: (res) => {
                            /*{
                                avatarUrl: 头像
                                city：城市
                                country：国家
                                gender：性别：1男
                                language：语言
                                nickName：昵称
                                province：省份
                            }*/
                            //此时可以进行登陆后的操作
                            callback && callback(res);
                        }
                    });
                }else{
                    console.log("用户未授权"); 
                    this.createUserInfoButton(callback);
                }
            }
        })  
    }

    createUserInfoButton(callback){
        //@ts-ignore
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '是否登陆?',
            style: {
              left: this.systemInfo.windowWidth/2 - 100,
                top: this.systemInfo.windowHeight/2-20,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })
        button.onTap((res) => {
            callback && callback(res);
        })
    }

    setUserCloudStorage(key:string,value:string) {
        //@ts-ignore
        wx.setUserCloudStorage({
            KVDataList:[
                {
                    key:key,
                    value:value
                }
            ],
            fail:function(res){
                console.log(`数据上传失败${res}`);
            }
        });
    }

    postMessage2OpenData(message:string) {
        //@ts-ignore
        wx.getOpenDataContext().postMessage({
            text:message
        });
    }

    getOpenId(callback) {
        if(!MG_WeChat.userCode){
            this.login(()=>{
               this.getOpenId(callback); 
            });
            return;
        }

        let url = `https://www.youzhikong.cn/server/getopenid.aspx?appid=${this.appData.appid}&secret=${this.appData.appsecret}&js_code=${MG_WeChat.userCode}`;
        //@ts-ignore
        wx.request({
            url:url,
            complete:function(res){
                console.log("openid",res);
                callback(res);
            }
        });
    }

    createBanner() {

        //@ts-ignore
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.appData.bannerid,
            adIntervals:30,
            style:{
                left: 0,
                top: this.systemInfo.windowHeight,
                width: 300
            }
        });

        this.bannerAd.onResize((size)=>{
			if(this.bannerAd){
				this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width)/2;
				this.bannerAd.style.top = this.systemInfo.windowHeight - (size.height == 0 ? 100 : size.height) - 20;
			}
        });

        this.bannerAd.onError(()=>{
            this.bannerAd.destroy();
            this.bannerAd = null;
        });
        
        this.bannerAd.onClose(()=>{
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
            // this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }

        this.needShowBanner = false;
    }

    createVideoAd() {
        //@ts-ignore
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId:this.appData.videoid
        });

        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_WeChat.videoCallback){
                    MG_WeChat.videoCallback(true);
                }
            }else{
                if(MG_WeChat.videoCallback){
                    MG_WeChat.videoCallback(false);
                }
            }
            MG_WeChat.videoCallback = null;
        });

        this.videoAd.onError((res)=>{
            console.log("video error",res);
        });
    }

    showVideoAd(callback: any) {
        MG_WeChat.videoCallback = callback;
        this.videoAd.show().catch(err => {
            callback(false);
        });
    }

    createInsertAd() {
        //@ts-ignore
        this.insertAd = wx.createInterstitialAd({
            adUnitId:this.appData.insertid
        });

        this.insertAd.onLoad(()=>{
            this.insertAd.show();
        });

        this.insertAd.onClose(res => {
            
            this.showBanner();

            this.insertAd.offLoad();
            this.insertAd.offClose();
            this.insertAd.destroy();
            this.insertAd = null;
        });

        this.insertAd.onError((res)=>{
            console.log(res);
        });
    }

    showInsertAd() {
        this.createInsertAd();
    }

    doVibrate(short: boolean = true) {
        if(short){
            //@ts-ignore
            wx.vibrateShort({});
        }else{
            //@ts-ignore
            wx.vibrateLong({});
        }
    }

    getMenuButtonWorldPos() {
        let screenSize = cc.view.getFrameSize();
        let worldPos;

        //@ts-ignore
        let menu =  wx.getMenuButtonBoundingClientRect();
        let pos = new cc.Vec2((menu.left + menu.right) / 2 ,(menu.bottom + menu.top) / 2);

        let x = pos.x / screenSize.width * cc.winSize.width;
        let y = (1- pos.y / screenSize.height) * cc.winSize.height;
        worldPos = new cc.Vec2(x,y);
        return worldPos;
    }

    exitGame() {
        //@ts-ignore
        wx.exitMiniProgram({});
    }

    onShow() {
        if(!this.readyShare){
            return null;
        }
        this.readyShare = false;
        let delta = Date.now() - this.shareOutTime;
        return delta > 3000;   
    }

    onHide() {
        if(this.readyShare){
            this.shareOutTime = Date.now();
        }
    }

    
    request(object) {
        //@ts-ignore
        return wx.request(object);
    }

    downloadFile(object) {
        //@ts-ignore
        return wx.downloadFile(object);
    }

    uploadFile(object) {
        //@ts-ignore
        return wx.uploadFile(object);
    }

    startAccelerometer(callback) {
        //@ts-ignore
        wx.startAccelerometer({
            interval: 'ui'
        });
        //@ts-ignore
        wx.onAccelerometerChange((res)=>{
            callback && callback(res);   
        });
    }
 
    stopAccelerometer() {
        //@ts-ignore
        wx.stopAccelerometer({});
    }
}
