
const {ccclass, property} = cc._decorator;

@ccclass
export default class IOSSDKManager extends cc.Component{

    static readonly NAME :string = "IOSSDK";

    @property({
        displayName:"AppKey"
    })
    public appKey:string ="484d7674e6db288bc84cc83131dff02b";

    @property({
        displayName:"AppId"
    })
    public appId:string="a5cf22e2443be5";

    @property({
        displayName:"BannerID"
    })
    public bannerPlacementId :string="b5cf22ec30e212";

    @property({
        displayName:"视频ID"
    })
    public videoPlacementId :string="b5cf22eabaa1df";

    @property({
        displayName:"插屏ID"
    })
    public insertPlacementId:string ="b5cf22e8d7dedb";

    @property({
        displayName:"开屏ID"
    })
    public splashPlacementId :string="b5cf22f0a4d82d";

    @property({
        displayName:"微信AppId(微信公众平台ID)"
    })
    public wxAppId :string="b5cf22f0a4d82d";

    @property({
        displayName:"AppStoreId(苹果商店ID)"
    })
    public appStoreId :string="b5cf22f0a4d82d";

    @property({
        displayName:"分享标题"
    })
    public shareTitle :string="b5cf22f0a4d82d";

    @property({
        displayName:"分享内容"
    })
    public shareContent :string="b5cf22f0a4d82d";

    @property({
        displayName:"分享的图片链接"
    })
    public shareSpriteUrl :string = "";

    private static shareCallBack = null;
    private outTime = -1;

    public static videoCallBack :Function = null;
	public static insertCallBack :Function = null;

    public static _instance:IOSSDKManager = null;
    public static Instance():IOSSDKManager{

        if(this._instance == null){
            let node= cc.find("IOSSDK");
            this._instance = node.getComponent(IOSSDKManager);
        }
        return this._instance;
    }

    onLoad(){

        IOSSDKManager._instance = this;
        cc.game.addPersistRootNode(this.node);

        cc.game.on(cc.game.EVENT_SHOW,()=>{
            this.onShareReturn();
        },this);
    }

    start(){
        
        if (CC_DEV){
            cc.log("如果是IOS平台，会在此执行初始化SDK") ;
        }  else if (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD){
            this.initSDK();
            this.loadBanner();
            this.loadVideo();
            this.loadInsert();

            this.initWx();
        }
       
    }

    public initSDK(){
        cc.log("初始化");
        this.sendMessageTwo("initSDK:appId:", this.appKey,this.appId);
    }

    public loadBanner(){
        cc.log("loadBanner");
       this.sendMessageOne("loadBanner:", this.bannerPlacementId);
    }
    public loadVideo(){
        cc.log("loadVideo");
       this.sendMessageOne("loadVideo:", this.videoPlacementId);
    }
    public loadInsert(){
        cc.log("loadInsert");
       this.sendMessageOne("loadInsert:", this.insertPlacementId);
    }

    public showBanner(bottom:boolean){
        cc.log("showBanner ");
        let position:number = 0;
        if(bottom){
			//position = 600;
			if(cc.sys.platform == cc.sys.IPHONE){
				position = 615;
			}else{
				position = 960;
			}
        }
        this.sendMessageTwo("showBanner:position:",this.bannerPlacementId,position.toString());
    }
    public showInsert(callback:Function = null){
        cc.log("showInsert ");
		
		IOSSDKManager.insertCallBack = callback;
        this.sendMessageOne("showInsert:",this.insertPlacementId);
    }
    public showVideo(callback:Function){
        cc.log("showVideo ");
        
        IOSSDKManager.videoCallBack = callback;
        this.sendMessageOne("showVideo:",this.videoPlacementId);
    }

    public hideBanner(){
        cc.log("hideBanner");
        this.sendMessageZero("hideBanner");
    }

    public showNSplash(){
        cc.log("native splash");
        this.sendMessageOne("showNSplash:",this.splashPlacementId);
    }

    public videoCallbackHandler(backString: string){
        cc.log("videoCallBack"+backString);
        let temp:string[] = backString.split('_');
        let code :number = Number.parseInt(temp[0]);
		let type : number = Number.parseInt(temp[1]);
 
		if(type === 0){ // insert
			if(IOSSDKManager.insertCallBack!=null){

				IOSSDKManager.insertCallBack(code === 0);
				IOSSDKManager.insertCallBack = null;
			}
		}else{
			if(IOSSDKManager.videoCallBack!=null){
				IOSSDKManager.videoCallBack(code === 0);
				IOSSDKManager.videoCallBack = null;
			}
		}
        
    }

    public isReadyAd(adType:AdType):boolean{
        let pid :string = "";
        switch(adType){
            case AdType.banner:
                pid = this.bannerPlacementId;
                break;
            case AdType.insert:
                pid = this.insertPlacementId;
                break;
            case AdType.video:
                pid = this.videoPlacementId;
                break;
        }
        if(pid === "") return false;
        let isReady = this.isAdReady(adType.toString(),pid)+"" === "true";
        return isReady;

    }


    sendMessageZero(method:string){
        jsb.reflection.callStaticMethod("YZK", method);
    }

    sendMessageOne(method:string,param:string){
        jsb.reflection.callStaticMethod("YZK", method, param);
    }

    sendMessageTwo(method:string,param1:string,param2:string) {
       jsb.reflection.callStaticMethod("YZK", method, param1,param2);
    }

    isAdReady(param1:string,param2:string) :string{
        return jsb.reflection.callStaticMethod("YZK", "canShowAd:placementId:", param1,param2);
    }

    doVibrate(){
        jsb.reflection.callStaticMethod("YZK", "doVibrate");
    }

    initWx(){
        jsb.reflection.callStaticMethod("YZK", "initWX:",this.wxAppId);
    }

    shareToWx(title:string = null,toScene:ShareType,callback = null){
        //let scene = Math.random() > 0.5 ? ShareType.好友 : ShareType.朋友圈;
        jsb.reflection.callStaticMethod("YZK", "shareApp:description:scene:imageUrl:appId:",title ? title : this.shareTitle,this.shareContent,toScene,this.shareSpriteUrl,this.appStoreId);

        IOSSDKManager.shareCallBack = callback;
        this.outTime = Date.now();
    }

    storeReview(){
        jsb.reflection.callStaticMethod("YZK", "storeReview:",this.appStoreId);
    }

    onShareReturn(){
        if(this.outTime < 0){
            return;
        }

        let delta = Date.now() - this.outTime;
        
        if(delta > 5000){
            //分享成功，发放奖励
            if(IOSSDKManager.shareCallBack){
                IOSSDKManager.shareCallBack();
                IOSSDKManager.shareCallBack = null;
                //this.showToast(true);
            }
        }else{
            //this.showToast(false);
        }
        this.outTime = -1;
    }   

    /**
     * 拉起微信小程序
     */
    launchMiniProgram(miniProgramId:string){
        jsb.reflection.callStaticMethod("YZK", "launchMiniProgram:type:",miniProgramId,"0");
    }
}

export enum AdType{
    insert = 0,
    video = 1,
    banner = 2
} 

export enum ShareType{
    好友 = 0,
    朋友圈 = 1
} 


