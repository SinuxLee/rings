import PushAPI from "./PushAPI";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Payment {

    public static _instance: Payment = null;
    public static getInstance(): Payment {
        if (this._instance == null) this._instance = new Payment();
        return this._instance;
    }

    public buy(goodsId: string, month: boolean, callback: Function) {
        PushAPI.getInstance().printLog("buy: " + goodsId + ", " + month);

        if (!cc.sys.isNative || !cc.sys.isMobile) {
            cc.warn("�����ƶ��豸��ʹ�� buy����");
            return;
        }
        //@ts-ignore
        cc.buyResult = function (code: string) {
            PushAPI.getInstance().printLog("buy: " + code);
            if (callback != null) callback.call(null, code);
        }
        switch (cc.sys.platform) {
            case cc.sys.ANDROID: {
                jsb.reflection.callStaticMethod("com/yzk/sdk/gp/pay/Payment", "BuyCocos", "(Ljava/lang/String;ZLjava/lang/String;)V", goodsId, month, "buyResult");
                break;
            }
            default: {
                cc.warn("ֻ֧��Adnroid�豸");
                break;
            }
        }
    }

}
