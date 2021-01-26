import MiniGameBase from "./MiniGameBase";

const {ccclass, property} = cc._decorator;

@ccclass
export class MG_TouTiao extends MiniGameBase {

    getSystemInfo() {
        //@ts-ignore
        return tt.getSystemInfoSync();
    }

    showShareMenu() {
        //@ts-ignore
        tt.showShareMenu({
            withShareTicket:true
        });
    }

    setOnShareAppMessage() {
        //@ts-ignore
        tt.onShareAppMessage(()=>{
            return {
                // title: null,
                // imageUrl: null
                //query:this.shareString//分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            }
        });
    }

    shareApp(callback?: Function, shareTitle?: string, shareImageUrl?: string,query:string = "") {

        this.readyShare = this.isToutiaoLite();

        //@ts-ignore
        tt.shareAppMessage(
        {
            // title: shareTitle ? shareTitle : null,
            // imageUrl: null,
            query:query, //分享给别人顺带的信息，别人通过你的分享卡片点击进入游戏后可以通过getLaunchOptionsSync获取到query信息
            success() {
                //@ts-ignore
                tt.showToast({
                    title:"分享成功",
                    icon:"success",
                    duration:2000,//延迟,
                    mask:true,//防触摸穿透
                });
                if(callback){
                    callback();
                }
            },
            fail(e) {
                //@ts-ignore
                tt.showToast({
                    title:"分享失败",
                    icon:"none",
                    duration:2000,//延迟,
                    mask:true,//防触摸穿透
                });
            }
        });
        
    }

    showToast(title:string,successIcon:boolean = true ) {
        //@ts-ignore
        tt.showToast({
            title:title,
            icon:successIcon? "success":"none",
            duration:2000,//延迟,
            mask:true,//防触摸穿透
        });
    }

    chekcUpdateVersion() {
        //@ts-ignore
        let updateManager = tt.getUpdateManager();
        //请求新版本信息回调
        updateManager.onCheckForUpdate((res)=>{
            if(!res.hasUpdate){//没新版本
                return;
            }
            //@ts-ignore
            tt.showToast({
                title: '即将有更新'
            });

            updateManager.onUpdateReady(()=>{
                //@ts-ignore    
                tt.showModal({
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
                tt.showModal({
                    title:"已经有新版本了哟~",
                    content:"新版本已经上线,请重新启动后更新"
                })
            })
        });
    }

    launchMiniProgram(miniProgramAppId:string,callback) {
        //@ts-ignore
        tt.navigateToMiniProgram({
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

    login(callBack: any) {
        //@ts-ignore
        tt.login({
            success:(userRes)=>{
                MG_TouTiao.userCode = userRes.code;
                callBack && callBack();
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
        tt.authorize({
            scope: "scope.userInfo" ,
            success: (res) => {
                //@ts-ignore
                tt.getSetting({
                    success: (res) => {
                        callback && callback(res);
                    }
                })
              }
        });
    }

    setUserCloudStorage(key:string,value:string) {
        //@ts-ignore
        tt.setUserCloudStorage({
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
        tt.getOpenDataContext().postMessage({
            text:message
        });
    }

    getOpenId(callback) {
        if(!MG_TouTiao.userCode){
            this.login(()=>{
               this.getOpenId(callback); 
            });
            return;
        }

        let url = `https://developer.toutiao.com/api/apps/jscode2session?appid=${this.appData.appid}&secret=${this.appData.appsecret}&code=${MG_TouTiao.userCode}`;
        //@ts-ignore
        tt.request({
            url:url,
            complete:function(res){
                callback(res);
            }
        });
    }

    createBanner() {
        //tt banner 没有onclose

        //@ts-ignore
        this.bannerAd = tt.createBannerAd({
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
				this.bannerAd.style.top = this.systemInfo.windowHeight - (size.height == 0 ? 110 : size.height) - 20;
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
        //@ts-ignore
        this.videoAd = tt.createRewardedVideoAd({
            adUnitId:this.appData.videoid
        });

        this.videoAd.onClose(res =>{
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(MG_TouTiao.videoCallback){
                    MG_TouTiao.videoCallback(true);
                }
            }else{
                if(MG_TouTiao.videoCallback){
                    MG_TouTiao.videoCallback(false);
                }
            }
            MG_TouTiao.videoCallback = null;
        });

        this.videoAd.onError((res)=>{
            console.log("video error",res);
        });
    }

    showVideoAd(callback: any) {
        MG_TouTiao.videoCallback = callback;
        this.videoAd.show().catch(err => {
            callback(false);
        });
    }

    doVibrate(short: boolean = true) {
        if(short){
            //@ts-ignore
            tt.vibrateShort({});
        }else{
            //@ts-ignore
            tt.vibrateLong({});
        }
    }

    getGameRecorderManager() {
        //@ts-ignore
        return tt.getGameRecorderManager();
    }

    getMoreGamesButton(width:number, parentNode:cc.Node) {
        let screenSize = cc.view.getFrameSize();

        let worldPos:cc.Vec2 = parentNode.parent.convertToWorldSpaceAR(parentNode.position);
        let x = worldPos.x / cc.winSize.width * screenSize.width;
        let y = (1 - worldPos.y / cc.winSize.height) * screenSize.height;

        let pos = new cc.Vec2(x,y);

        //@ts-ignore
        let btn = tt.createMoreGamesButton({
            type: "text",
            //image: parentNode.getComponent(cc.Sprite).spriteFrame.getTexture().url,,
            text: "",
            style: {
              left: pos.x - width /2,
              top:  pos.y - width /2,
              width: width + 5,
              height: width + 5,
              lineHeight: width,
              backgroundColor: "#00000000",
              textColor: "#00000000",
              textAlign: "center",
              fontSize: 16,
              borderRadius: 0,
              borderWidth: 0,
              borderColor: '#00000000'
            },
            appLaunchOptions: [
              {
                appId: this.appData.appid,
                query: "",
                extraData: {}
              },
            ],
            onNavigateToMiniGame(res){
                console.log("跳转其他小游戏", res)
            }
        });
        return btn;
    }

    getMenuButtonWorldPos() {
        let screenSize = cc.view.getFrameSize();
        let worldPos;

        //@ts-ignore
        let menu =  tt.getMenuButtonBoundingClientRect();
        let pos = new cc.Vec2(menu.left + menu.width / 4 ,menu.bottom);

        let x = pos.x / screenSize.width * cc.winSize.width;
        let y = (1- pos.y / screenSize.height) * cc.winSize.height;
        worldPos = new cc.Vec2(x,y);
        return worldPos;
    }

    exitGame() {
        //@ts-ignore
        tt.exitMiniProgram({});
    }

    shareVideo(videoPath){
        //@ts-ignore
        tt.shareAppMessage({
            channel: 'video',
            title: '分享',
            //imageUrl: '',
            //path: '',
            extra: {
                videoPath: videoPath
            }
        });​
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
    
    private isDouyin(){
        return this.systemInfo.appName =='Douyin';
    }

    private isToutiaoLite(){
        return this.systemInfo.appName =='news_article_lite';
    }

    request(object) {
        //@ts-ignore
        return tt.request(object);
    }

    downloadFile(object) {
        //@ts-ignore
        return tt.downloadFile(object);
    }

    uploadFile(object) {
        //@ts-ignore
        return tt.uploadFile(object);
    }

    startAccelerometer(callback) {
        //@ts-ignore
        tt.startAccelerometer({});
        //@ts-ignore
        tt.onAccelerometerChange((res)=>{
            callback && callback(res);   
            //console.log(res);
        });
    }
   
    stopAccelerometer() {
        //@ts-ignore
        tt.stopAccelerometer({});
    }

    showMoreGamesModal(){
        //@ts-ignore
        tt.showMoreGamesModal({
            appLaunchOptions: [
              {
                appId: this.appData.appid,
                query: "",
                extraData: {}
              }
            ],
            fail(res) {
                console.log("show tt more game model fail", res.errMsg);
            }
          });
    }
    
}
