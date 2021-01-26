
const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectGunItem extends cc.Component {

    @property(cc.Node)
    select:cc.Node = null;

    @property(cc.Sprite)
    icon:cc.Sprite = null;

    @property(cc.Node)
    lock:cc.Node = null;
	
}
