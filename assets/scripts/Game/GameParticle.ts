import { PointDir } from "./Game";
import RingPoint from "./RingPoint";
import GameManager from "./GameManager";
import SoundManager, { SoundName } from "../Tools/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameParticle extends cc.Component {

    @property(cc.Animation)
    private lineAni:cc.Animation = null;
    
    @property([cc.ParticleSystem])
    private pointPar:cc.ParticleSystem[] = [];

    private disableTime:number = 1;

    playParticle(dir:PointDir,points:RingPoint[],iconIndex:number){
        this.node.setWorldPos(points[0].node.getWorldP());

        let count = points.length;
        let color = cc.color();
        color.fromHEX(GameManager.ringColors[iconIndex]);
        
        if(count == 1){
            this.pointPar[0].startColor = color;
            this.pointPar[0].endColor = color;

            this.pointPar[0].node.active = true;
            return;
        }

        this.lineAni.node.color = color;
        this.lineAni.node.active = true;

        switch(dir){
            case PointDir.横向:
                this.node.angle = 90;
                break;
            case PointDir.纵向:
                this.node.angle = 0;
                break;
            case PointDir.左上右下:
                this.node.angle = 45;
                break;
            case PointDir.右上左下:
                this.node.angle = -45;
                break;
        }

        for(let i=0;i<3;i++){
            this.pointPar[i].startColor = color;
            this.pointPar[i].endColor = color;
            this.pointPar[i].node.setWorldPos(points[i].node.getWorldP());
            this.pointPar[i].node.active = true;
        }

        //cc.log(this.node.active);
        //this.node.active = true;
    }

    onEnable(){
        this.disableTime = 1.5;
        SoundManager.getInstance().playSound(SoundName.sound_clear_ring);
        
        this.lineAni.play();
        for(let i=0;i<3;i++){
            this.pointPar[i].resetSystem();
        }
      
    }

    update(dt){
        this.disableTime -= dt;
        if(this.disableTime < 0){
            this.node.active = false;
        }
    }

    onDisable(){
        this.lineAni.node.active = false;
        for(let i=0;i<3;i++){
            this.pointPar[i].node.active = false;
        }
    }
 
}
