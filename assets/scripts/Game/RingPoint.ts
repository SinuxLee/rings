import Ring, { RingType } from "./Ring";
import { Random } from "../Tools/Random";
import SpriteFrameManager from "../Tools/SpriteFrameManager";
import GameManager, { SkinType } from "./GameManager";
import { PointDir } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RingPoint extends cc.Component {
    @property(cc.Sprite)
    large:cc.Sprite = null;
   
    @property(cc.Sprite)
    mid:cc.Sprite = null;
   
    @property(cc.Sprite)
    small:cc.Sprite = null;
    

    private _ringsIndex:Array<number> = null;
    private get ringsIndex(){
        if(!this._ringsIndex){
            this._ringsIndex = new Array(3);
            this._ringsIndex.fill(-1);
        }
        return this._ringsIndex;
    }

    private set ringsIndex(value){
        this._ringsIndex = value;
    }

    private backupData:Array<number> = null;

    setRing(ring:Ring){
        let canPut = this.checkPut(ring);
        if(!canPut){
            return false;
        }

        let node:cc.Sprite = null;
        switch(ring.ringType){
            case RingType.large:
                node = this.large;
                break;
            case RingType.mid:
                node = this.mid;
                break;
            case RingType.small:
                node = this.small;
                break;
        }

        this.ringsIndex[ring.ringType] = ring.ringIconIndex;
        node.spriteFrame = SpriteFrameManager.Instance.getIcon(GameManager.getInstance().skinType,ring.ringType,ring.ringIconIndex);
        return true; 
    }

    private checkPut(ring:Ring){
        let type = ring.ringType;
        if(this.ringsIndex[type] != -1 ){
            return false; 
        }
        return true;
    }

    getRingsData(){
        return this.ringsIndex;
    }

    getRingDataByIndex(idnex){
        return this.ringsIndex[idnex];
    }

    getLackRingData(){
        let types = [];
        for(let i=0;i<this.ringsIndex.length;i++){
            if(this.ringsIndex[i] == -1){
                types.push(i);
            }
        }
        if(types.length == 0){
            return null;
        }

        if(types.length == 1){
            return types;
        }

        let count = Math.random() > 0.5 ? 1 : 2;
        if(count == 1){
            return [types[Random.RangeInt(0,types.length)]];
        }
        return [types.RemoveAt(Random.RangeInt(0,types.length)),types.RemoveAt(Random.RangeInt(0,types.length))];
    }

    removeRingAt(ringType:RingType){
        let node:cc.Sprite = null;
        switch(ringType){
            case RingType.large:
                node = this.large;
                break;
            case RingType.mid:
                node = this.mid;
                break;
            case RingType.small:
                node = this.small;
                break;
        }
        this.ringsIndex[ringType] = -1;
        node.spriteFrame = null;
    }

    clearRing(){
        this.large.spriteFrame = null;
        this.mid.spriteFrame = null;
        this.small.spriteFrame = null;
        this._ringsIndex.fill(-1);
    }

    setBackupData(){
        this.backupData = this._ringsIndex.slice();
    }

    recoveryBackupData(){
        this.ringsIndex = this.backupData;
      
        for(let i=0;i<this.ringsIndex.length;i++){
            let node:cc.Sprite = null;
            switch(i){
                case RingType.large:
                    node = this.large;
                    break;
                case RingType.mid:
                    node = this.mid;
                    break;
                case RingType.small:
                    node = this.small;
                    break;
            }
            if(this.ringsIndex[i] == -1){
                node.spriteFrame = null;
            }else{
                node.spriteFrame = SpriteFrameManager.Instance.getIcon(GameManager.getInstance().skinType,i,this.ringsIndex[i]);
                this.node.active = true;
            }
        }
    }

    onClearRing(){
        this.ringsIndex.forEach(e=>{
            if(e != -1){
                GameManager.getInstance().showGameParticle(PointDir.独点,[this],e);
            }
        });
       
        this.clearRing();
    }
}
