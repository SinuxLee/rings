import { SaveData } from "../../YZKCocos/Tools/SaveData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingUI extends cc.Component {

    @property
    nextSceneName:string = "main";

    @property(cc.Node)
    startButton: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;
  
    onLoad(){

        if(this.startButton){
            this.startButton.active = false;
            this.startButton.on('click',this.btnOfStart.bind(this),this);
        }
    }

    start(){
        try{
            cc.loader.downloader.loadSubpackage("sub_main",(err)=>{
			    this.delayLogic();
            });
        }catch{
            this.delayLogic();
        }
    }

    delayLogic(){
        this.scheduleOnce(()=>{
            if(this.startButton){
                this.startButton.active = true;
            } else{
                this.loadScene();
            }
        },0.5);
    }

    btnOfStart(){
        this.startButton.active = false;
        this.loadScene(); 
    }

    loadScene(){
        this.label .string = "加载中...10%";
        cc.director.preloadScene(this.nextSceneName,(a,b,c)=>{
            if(a > b / 2 ){
                this.label .string = "加载中...80%";
            }
        },()=>{
            this.label .string = "加载中...99%";
            cc.director.loadScene(this.nextSceneName);
        });
    }
}
