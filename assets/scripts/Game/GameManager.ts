import SingleBase from "../YZKCocos/Tools/SingleBase";
import UIPanelManager from "../YZKCocos/UIFrame/UIPanelManager";
import { PanelName } from "../YZKCocos/UIFrame/UIPanelName";
import { event } from "../Tools/event";
import { SaveData } from "../YZKCocos/Tools/SaveData";
import { Random } from "../Tools/Random";
import Game, { PointDir } from "./Game";
import PowerManager from "../YZKCocos/Tools/PowerManager";
import GunDataManager from "../Data/GunDataManager";
import GameUI from "../UI/GameUI";
import GameParticle from "./GameParticle";
import RingPoint from "./RingPoint";
import YZK from "../YZKCocos/YZK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends SingleBase {

    private readonly saveKey:string = "savedatas";

    static ringColors = ["#7EB2FE","#FB8DDB","#FFC842","#B47CDC","#FF4F76","#91E162","#5DD1C5","#F5796D"];

    static onBestScoreChange:event = new event();
    static onDiamondChange:event = new event();

    game:Game = null;
    gameui:GameUI = null;

    get skinType():SkinType{
        return this.playerData.useSkin;
    }

    gameType:GameType;

    isGameRun:boolean = false;

    isTeach:boolean = false;

    private gameParticle:cc.Node = null;
    private gameParticleList:GameParticle[] = [];

    private _playerData:PlayerData = null;
  
    get playerData(){
        if(this._playerData == null){
            this._playerData = SaveData.get(this.saveKey,new PlayerData());
            // Object.defineProperty(this._playerData,"bestScore",{
            //     set(value){
            //         this._highScore = value;
            //         GameManager.getInstance().savePlayerData();
            //     },
            //     get(){
            //         return this._highScore;
            //     }
            // });

            Object.defineProperties(this._playerData,{
                diamond:{
                    configurable:true,
                    set(value){
                        this._diamond = value;
                        GameManager.onDiamondChange.Invoke(value);
                        GameManager.getInstance().savePlayerData();
                    },
                    get(){
                        return this._diamond;
                    }
                }
            });
        }
        return this._playerData;
    }

    set playerData(value){
        if(this._playerData == null){
            this._playerData = SaveData.get(this.saveKey,new PlayerData());
        }
        this._playerData = value;
    }

    onLoad(){
        super.onLoad();

        cc.director.getCollisionManager().enabled = true;

        UIPanelManager.showPanel(PanelName.MainUI);

        cc.loader.loadRes("GameParticle",cc.Prefab,(e,p)=>{
            this.gameParticle = cc.instantiate(p);
        });
    }

    onGameEnd(gameTime){

        UIPanelManager.showPanel(PanelName.EndUI,gameTime);


    }
    
    enterGame(gameType:GameType,callback = null){
        UIPanelManager.clearPanel();
        let sceneName = "";
        switch(gameType){
            case GameType.单环:
                sceneName = "game_single";
                break;
            case GameType.经典:
                sceneName = "game_classic";
                break;
            case GameType.十字:
                sceneName = "game_cross";
                break;
            case GameType.限时:
                sceneName = "game_time";
                break;
        }
        this.gameType = gameType;
        cc.director.loadScene(sceneName,()=>{
            callback && callback();
        });
    }

    exitGame(callback = null){
        this.game = null;
        UIPanelManager.clearPanel();
        cc.director.loadScene("kong",()=>{
            callback && callback();
        });
    }

    addPlayerBestScore(score){
        this.playerData.bestScore[this.gameType] += score;
        this.savePlayerData();
        GameManager.onBestScoreChange.Invoke(this.playerData.bestScore[this.gameType]);
    }

    setPlayerBestScore(score){
        this.playerData.bestScore[this.gameType] = score;
        this.savePlayerData();
        GameManager.onBestScoreChange.Invoke(score);
    }


    addPlayerSkin(skinType:SkinType){
        this.playerData.skin[skinType] = 1;
        this.savePlayerData();
    }


    savePlayerData(){
        SaveData.set(this.saveKey,this._playerData);
    }

    showGameParticle(dir:PointDir,points:RingPoint[],iconIndex:number){
        let par = this.gameParticleList.find(e=>{return !e.node.active});
        
        if(!par){
            let node:cc.Node = cc.instantiate(this.gameParticle);
            node.setParent(this.node);
            par = node.getComponent(GameParticle);
            this.gameParticleList.push(par);
        }
        par.playParticle(dir,points,iconIndex);
        par.node.active = true;

        this.doVibrate();
    }

    doVibrate(){
        if(this.playerData.vibrate){
            YZK.doVibrate();
        }
    }
}

export class PlayerData{
    bestScore:number[] = [0,0,0,0];

    diamond:number = 0;
    private _diamond:number = 0;

    skin:number[] = [1,0,0,0,0,0];

    useSkin:number = 0;

    vibrate:boolean = false;
}

export enum SkinType{
    经典,
    冰雪,
    星座,
    蛇,
    海洋,
    科学
}

export enum GameType{
    单环,
    经典,
    十字,
    限时
}