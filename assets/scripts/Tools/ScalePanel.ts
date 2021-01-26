const {ccclass, property} = cc._decorator;

@ccclass
export default class ScalePanel extends cc.Component {

    start(){
        let size = cc.view.getFrameSize();
        let ratio = size.height / size.width;

        if(ratio < 1.7){
            this.node.scale *= ratio / 1.77778;
        }
    }
}
