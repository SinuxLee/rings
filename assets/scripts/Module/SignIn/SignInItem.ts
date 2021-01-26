
const {ccclass, property} = cc._decorator;

@ccclass
export default class SignInItem extends cc.Component {

    countLabel: cc.Label = null;
    completeNode: cc.Node = null;

    onLoad(){
        this.countLabel = this.node.getChildByName("describe").getComponent(cc.Label);
        this.completeNode = this.node.getChildByName("mask");
    }
}
