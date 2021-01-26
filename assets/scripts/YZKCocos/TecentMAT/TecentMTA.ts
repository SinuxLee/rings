import mtaSDK = require("./mta_analysis.js");

const {ccclass, property} = cc._decorator;

const mta = mtaSDK;

@ccclass
export default class TecentMTA extends cc.Component {
    
    @property({
        displayName:"appID"
    })
    appId:string = "";

    @property({
        displayName:"eventID"
    })
    eventId:string = "";
    
    private static _instance = null;
    static get Instance():TecentMTA{
        if(this._instance === null){
            let temp = new cc.Node("TecentMTA");
            this._instance = temp.addComponent(TecentMTA);
            temp.setParent(cc.director.getScene());
            temp.active = true;
        }
        return this._instance;
    }

    onLoad(){
        TecentMTA._instance = this;
        cc.game.addPersistRootNode(this.node);

        //@ts-ignore
        let options = wx.getLaunchOptionsSync();
        this.initMta(options);
    }

    initMta(options){
        mta.App.init({
           appID:this.appId,
           //高级功能-自定义事件统计ID，配置开通后字啊初始化处填写
           eventID:this.eventId,
           //渠道分析
           lauchOpts:options,
        //    //使用分析-下拉刷新次数/人数，必须先开通自定义事件，并配置了合法的eventID
        //    statPullDownFresh:true,
           //使用分析-分享次数/人数，必须先开通自定义事件，并配置了合法的eventID
           statShareApp:true,
        //     //使用分析-页面触底次数/人数，必须先开通自定义事件，并配置了合法的eventID
        //    statReachBottom:true,
           //开启自动上报
           autoReport:false,
           //每个页面均加入参数上报
           statParam:true,
           //statParam为True时，如果不想上报的参数可配置忽略
           ignoreParams:[]
       });
        mta.Page.init();
    }


}
