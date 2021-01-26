
const {ccclass, property} = cc._decorator;

@ccclass
export default class DontDestroy extends cc.Component {

    onLoad(){
        cc.game.addPersistRootNode(this.node);
    }

}
