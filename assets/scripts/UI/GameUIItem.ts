import GameManager from "../Game/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUIItem extends cc.Component {

    canUse:boolean = false;

    useDiamond:boolean = true;

    @property(cc.Button)
    private buttonNode:cc.Button = null;
    
    @property(cc.Node)
    private videoNode:cc.Node = null;

    @property(cc.Node)
    private diamondNode:cc.Node = null;

    start(){
        GameManager.onDiamondChange.add(this.updateUi.bind(this),this.node.uuid);
    }

    onDestroy(){
        GameManager.onDiamondChange.remove(this.node.uuid);
    }

    setButtonInfo(_canUse:boolean){
        this.buttonNode.interactable = _canUse;
        this.canUse = _canUse;
        this.updateUi();
    }

    updateUi(){
        if(!this.canUse){
            this.diamondNode.active = false;
            this.videoNode.active = false;
            return;
        }

        let diamond = GameManager.getInstance().playerData.diamond;
        if(diamond >= 10){
            this.useDiamond = true;
        }else{
            this.useDiamond = false;
        }

        this.diamondNode.active = this.useDiamond;
        this.videoNode.active = !this.useDiamond;
    }
}
