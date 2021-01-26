import SingleBase from "./SingleBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsManager extends SingleBase {

    @property(cc.Node)
    tipsPrefab:cc.Node = null;

    @property({
        displayName:"使用托管动画"
    })
    useDefaultAnima:boolean = true;

    @property({
        displayName:"使用托管回收",
        visible(){
            return !this.useDefaultAnima;
        }
    })
    autoRecycle:boolean = false;

    @property({
        displayName:"托管回收时间",
        visible(){
            return !this.useDefaultAnima && this.autoRecycle;
        }
    })
    recycleTime:number = 1.5;

    tipsArray:cc.Node[] = [];

    onLoad(){
        super.onLoad();

        this.node.zIndex = 100;

        if(this.tipsPrefab){
            this.tipsPrefab.active = false;
        }
        this.initContentSize();
    }

    initContentSize(){
        this.node.setContentSize(720,1280);
        this.node.position = cc.v2(360,640);
        let widget = this.node.addComponent(cc.Widget);
        widget.isAlignRight = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignTop = true;
        widget.right = 0;
        widget.left = 0;
        widget.top = 0;
        widget.bottom = 0;
    }

    showTips(content:string){

        let tip = this.findTip();
        if(!tip){
            console.error("tips数量太多,停止制造!");
            return;
        }
        tip.getComponentInChildren(cc.Label).string = content;
        tip.opacity = 255;
        tip.position = cc.Vec2.ZERO;
        tip.active = true;

        if(this.useDefaultAnima){
            this.tipAnimation(tip);
        }else{
            if(this.autoRecycle){
                setTimeout(() => {
                    tip.active = false;
                }, this.recycleTime * 1000);
            }
        }
    }

    private findTip(){
        let tip:cc.Node = this.tipsArray.find(e => {
            return !e.active;
        });
        if(!tip){
            if(this.tipsArray.length >= 3){
                return null;
            }
            if(!this.tipsPrefab){
                this.createTipPrefab();
            }
            tip = cc.instantiate(this.tipsPrefab);
            tip.setParent(this.node);
            tip.position = cc.Vec2.ZERO;
            this.tipsArray.push(tip);
        }   
        return tip;
    }

    private tipAnimation(tip:cc.Node){
        cc.tween(tip)
        .delay(1)
        .by(0.5,{position:cc.v2(0,150),opacity:50},null)
        .set({active:false})
        .start();
    }

    private createTipPrefab(){
        this.tipsPrefab = new cc.Node();
        this.tipsPrefab.active = false;
        let child = new cc.Node();
        child.color = cc.Color.RED;
        child.setContentSize(600,50);
        let label = child.addComponent(cc.Label);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.lineHeight = 40;
        label.overflow = cc.Label.Overflow.SHRINK;
        let outLine = label.addComponent(cc.LabelOutline);
        outLine.width = 2;
        this.tipsPrefab.addChild(child);
    }
}
