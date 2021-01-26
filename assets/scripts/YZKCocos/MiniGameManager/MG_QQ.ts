import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_QQ extends MiniGameBase {

    initAd(){
        super.initAd();
        this.createAppBox();
    }

    getSystemInfo() {
        //@ts-ignore
        return qq.getSystemInfoSync();
    }

    showShareMenu() {
        //@ts-ignore
        qq.showShareMenu({
            withShareTicket:true
        });
    }

    setOnShareAppMessage(shareTitle?:string,shareImageUrl?:string) {
        //@ts-ignore
        qq.onShareAppMessage(()=>{
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
        qq.shareAppMessage(
        {
            title: shareTitle ? shareTitle : this.appData.sharetitle,
            imageUrl: shareImageUrl ? shareImageUrl : this.appData.shareimageurl,
            query:query //分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
        });
    }

    showToast(title:string,successIcon:boolean = true ) {
        //@ts-ignore
        qq.showToast({
            title:title,
            icon:successIcon? "success":"none",
            duration:2000,//延迟,
            mask:true,//防触摸穿透
        });
    }

    chekcUpdateVersion() {
        //@ts-ignore
        let updateManager = qq.getUpdateManager();
        //请求新版本信息回调
        updateManager.onCheckForUpdate((res)=>{
            if(!res.hasUpdate){//没新版本
                return;
            }
            //@ts-ignore
            qq.showToast({
                title: '即将有更新'
            });

            updateManager.onUpdateReady(()=>{
                //@ts-ignore    
                qq.showModal({
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
                qq.showModal({
                    title:"已经有新版本了哟~",
                    content:"新版本已经上线,请重新启动后更新"
                })
            })
        });
    }

    launchMiniProgram(miniProgramAppId:string,callback) {
        //@ts-ignore
        qq.navigateToMiniProgram({
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

    login(callback){
         //@ts-ignore
        qq.login({
            success(userRes){
                MG_QQ.userCode = userRes.code;
                callback && callback();
            }
        });
    }

    getSetting(callback){
        //@ts-ignore
        qq.getSetting({
            success(res){
                if (res.authSetting["scope.userInfo"]){
                    //@ts-ignore
                    qq.getUserInfo({
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
        let button = qq.createUserInfoButton({
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
        qq.setUserCloudStorage({
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
        qq.getOpenDataContext().postMessage({
            text:message
        });
    }

    getOpenId(callback) {
        if(!MG_QQ.userCode){
            this.login(()=>{
               this.getOpenId(callback); 
            });
            return;
        }

        //let baseUrl = `https://api.q.qq.com/sns/jscode2session?appid=${this.appData.appid}&secret=${this.appData.appsecret}&js_code=${MG_QQ.userCode}&grant_type=authorization_code`;
        let url = `https://www.youzhikong.cn/server/getopenid.aspx?type=qq&&appid=${this.appData.appid}&secret=${this.appData.appsecret}&js_code=${MG_QQ.userCode}&grant_type=authorization_code`;
        console.log(url);
        //@ts-ignore
        qq.request({
            url:url,
            complete:function(res){
                callback(res);
            }
        });
    }

    createBanner() {
        //qq banner 没有onclose

        //@ts-ignore
        this.bannerAd = qq.createBannerAd({
            adUnitId: this.appData.bannerid,
            adIntervals:30,
            style:{
                left: 0,
                top: this.systemInfo.windowHeight - 120,
                width: this.systemInfo.windowWidth
            }
        });

        this.bannerAd.onResize((size)=>{
			if(this.bannerAd){
				this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width)/2;
				this.bannerAd.style.top = this.systemInfo.windowHeight - (size.height == 0 ? 100 : size.height) - 20;
			}
        });
        
        this.bannerAd.onLoad(() => {
            if(this.needShowBanner){
                this.bannerAd.show();
            }
        });

        this.bannerAd.onError(() => {
            this.needShowBanner = false;
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
            // this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        this.needShowBanner = false;
    }

    createVideoAd() {
        //@ts-ignore
        this.videoAd = qq.createRewardedVideoAd({
            adUnitId:this.appData.videoid
        });

        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_QQ.videoCallback){
                    MG_QQ.videoCallback(true);
                }
            }else{
                if(MG_QQ.videoCallback){
                    MG_QQ.videoCallback(false);
                }
            }
            MG_QQ.videoCallback = null;
        });

        this.videoAd.onLoad((res)=>{
            console.log("video load",res);
        });

        this.videoAd.onError((res)=>{
            console.log("video error",res);
        });

        this.videoAd.load();
    }

    showVideoAd(callback: any) {
        MG_QQ.videoCallback = callback;
        this.videoAd.show().catch(err => {
            callback && callback(false);
            console.log("video error", err);
        });
    }

    doVibrate(short: boolean = true) {
        if(short){
            //@ts-ignore
            qq.vibrateShort({});
        }else{
            //@ts-ignore
            qq.vibrateLong({});
        }
    }

    getMenuButtonWorldPos() {
        let screenSize = cc.view.getFrameSize();
        let worldPos;

        //@ts-ignore
        let menu =  qq.getMenuButtonBoundingClientRect();
        let pos = new cc.Vec2(menu.left + menu.width / 4 ,menu.bttom);

        let x = pos.x / screenSize.width * cc.winSize.width;
        let y = (1- pos.y / screenSize.height) * cc.winSize.height;
        worldPos = new cc.Vec2(x,y);
        return worldPos;
    }

    exitGame() {
        //@ts-ignore
        qq.exitMiniProgram({});
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
        return qq.request(object);
    }

    downloadFile(object) {
        //@ts-ignore
        return qq.downloadFile(object);
    }

    uploadFile(object) {
        //@ts-ignore
        return qq.uploadFile(object);
    }

    startAccelerometer(callback) {
        //@ts-ignore
        qq.startAccelerometer({
            interval:'ui'
        });
        //@ts-ignore
        qq.onAccelerometerChange((res)=>{
            callback && callback(res);   
        });
    }
 
    stopAccelerometer() {
        //@ts-ignore
        qq.stopAccelerometer({});
    }

    createAppBox(){
        if(!this.appData.video || !this.appData.insertid || this.appData.insertid == "") {
            return;
        }
        //@ts-ignore
        this.appBoxAd = qq.createAppBox({
            adUnitId:this.appData.insertid
        });
        
        this.appBoxAd.load();

        // this.appBoxAd.onError(()=>{
        //     console.log("app box error");
        // });
    }
    showAppBox(callback){
        this.appBoxAd.show().then(() => {
            callback && callback(true);
        })
        .catch(err => {
            callback && callback(false);
        });
    }
}
