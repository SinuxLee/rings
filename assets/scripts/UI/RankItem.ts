
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property(cc.Sprite)
    rankBg:cc.Sprite = null;

    @property(cc.Label)
    rankLab:cc.Label = null;
    
    @property(cc.Label)
    nameLab:cc.Label = null;

    @property(cc.Label)
    scoreLab:cc.Label = null;
}
