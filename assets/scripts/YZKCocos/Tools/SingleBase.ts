
const {ccclass,property} = cc._decorator;

@ccclass
export default class SingleBase extends cc.Component {

    private _isInit:boolean = false;
    private static _instance = null;
    public static getInstance<T extends SingleBase>(this: new () => T):T{
        if(!(<any>this)._instance){
            let node = new cc.Node(this.name);
            node.active = false;
            node.setParent(cc.director.getScene());
            cc.game.addPersistRootNode(node);
            (<any>this)._instance = node.addComponent(this);
            (<any>this)._instance._isInit = true;
            node.active = true;
        }
        return (<any>this)._instance;
    }

    onLoad(){
        if(!this._isInit){
            this._isInit = true;
            cc.game.addPersistRootNode(this.node);
            let className = cc.js.getClassName(this);
            let com = cc.js.getClassByName(className);
            //@ts-ignore
            com._instance = this;
        }
    }
}
