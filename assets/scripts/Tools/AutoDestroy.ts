const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoDestroy extends cc.Component {

    @property
    delayTime:number = 1;

    onEnable(){
        this.scheduleOnce(()=>{
            this.node.destroy();
        },this.delayTime);
    }
}
