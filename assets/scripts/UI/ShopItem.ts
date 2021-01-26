
const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {

    @property(cc.Node)
    diamondNode:cc.Node = null;

    @property(cc.Label)
    diamondLab:cc.Label = null;

    @property(cc.Node)
    useCheck:cc.Node = null;
}
