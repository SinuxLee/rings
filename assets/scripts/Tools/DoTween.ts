
const {ccclass, property} = cc._decorator;

const LoopType = cc.Enum({
    Restart: 0,
    PingPong:1
});

@ccclass
export default class DoTween extends cc.Component {
    
    //#region doMove动画
    
    @property({
        displayName:"开启DoMove"
    })
    isDoMove:boolean = false;

    @property({
        displayName:"相对移动",
        visible(){
            return this.isDoMove;
        }
    })
    isRelativeMove:boolean = false;

    @property({
        displayName:"开始位置",
        visible(){
            return this.isDoMove && !this.isRelativeMove;
        }
    })
    moveStartPos:cc.Vec2 = cc.Vec2.ZERO;

    @property({
        displayName:"结束位置",
        visible(){
            return this.isDoMove && !this.isRelativeMove;
        }
    })
    moveEndPos:cc.Vec2 = cc.Vec2.ZERO;

    @property({
        displayName:"位移变量",
        visible(){
            return this.isDoMove && this.isRelativeMove;
        }
    })
    moveDeltaPos:cc.Vec2 = cc.Vec2.ZERO;

    @property({
        displayName:"时间",
        visible(){
            return this.isDoMove;
        }
    })
    moveTime:number = 0;

    @property({
        displayName:"延时",
        visible(){
            return this.isDoMove;
        }
    })
    moveDelayTime:number = 0;

    @property({
        displayName:"是否循环",
        visible(){
            return this.isDoMove;
        }
    })
    moveIsLoop:boolean = false;

    @property({
        displayName:"循环次数",
        type:cc.Integer,
        visible(){
            return this.isDoMove && this.moveIsLoop;
        }
    })
    moveLoopTimes:number = 0;

    @property({
        displayName:"循环方式",
        type:cc.Enum(LoopType),
        visible(){
            return this.isDoMove && this.moveIsLoop;
        }
    })
    moveLoopType = LoopType.Restart;
    //#endregion

    //#region doRotate动画
    
     @property({
        displayName:"开启DoRotate"
    })
    isDoRotate:boolean = false;

    @property({
        displayName:"开始角度",
        visible(){
            return this.isDoRotate;
        }
    })
    rotateStartAngle:number = 0;

    @property({
        displayName:"结束角度",
        visible(){
            return this.isDoRotate;
        }
    })
    rotateEndAngle:number = 360;

    @property({
        displayName:"时间",
        visible(){
            return this.isDoRotate;
        }
    })
    rotateTime:number = 0;

    @property({
        displayName:"延时",
        visible(){
            return this.isDoRotate;
        }
    })
    rotateDelayTime:number = 0;

    @property({
        displayName:"是否循环",
        visible(){
            return this.isDoRotate;
        }
    })
    rotateIsLoop:boolean = false;

    @property({
        displayName:"循环次数",
        type:cc.Integer,
        visible(){
            return this.isDoRotate && this.rotateIsLoop;
        }
    })
    rotateLoopTimes:number = 0;

    @property({
        displayName:"循环方式",
        type:cc.Enum(LoopType),
        visible(){
            return this.isDoRotate && this.rotateIsLoop;
        }
    })
    rotateLoopType = LoopType.Restart;
    //#endregion

    //#region doScale动画
    
    @property({
        displayName:"开启DoScale"
    })
    isDoScale:boolean = false;

    @property({
        displayName:"开始大小",
        visible(){
            return this.isDoScale;
        }
    })
    scaleStart:number = 1;

    @property({
        displayName:"结束大小",
        visible(){
            return this.isDoScale;
        }
    })
    scaleEnd:number = 2;

    @property({
        displayName:"时间",
        visible(){
            return this.isDoScale;
        }
    })
    scaleTime:number = 0;

    @property({
        displayName:"延时",
        visible(){
            return this.isDoScale;
        }
    })
    scaleDelayTime:number = 0;

    @property({
        displayName:"是否循环",
        visible(){
            return this.isDoScale;
        }
    })
    scaleIsLoop:boolean = false;

    @property({
        displayName:"循环次数",
        type:cc.Integer,
        visible(){
            return this.isDoScale && this.scaleIsLoop;
        }
    })
    scaleLoopTimes:number = 0;

    @property({
        displayName:"循环方式",
        type:cc.Enum(LoopType),
        visible(){
            return this.isDoScale && this.scaleIsLoop;
        }
    })
    scaleLoopType = LoopType.Restart;
    //#endregion

    //#region doOpacity动画
    
    @property({
        displayName:"开启DoOpacity"
    })
    isDoOpacity:boolean = false;

    @property({
        displayName:"开始大小",
        visible(){
            return this.isDoOpacity;
        }
    })
    opacityStart:number = 1;

    @property({
        displayName:"结束大小",
        visible(){
            return this.isDoOpacity;
        }
    })
    opacityEnd:number = 2;

    @property({
        displayName:"时间",
        visible(){
            return this.isDoOpacity;
        }
    })
    opacityTime:number = 0;

    @property({
        displayName:"延时",
        visible(){
            return this.isDoOpacity;
        }
    })
    opacityDelayTime:number = 0;

    @property({
        displayName:"是否循环",
        visible(){
            return this.isDoOpacity;
        }
    })
    opacityIsLoop:boolean = false;

    @property({
        displayName:"循环次数",
        type:cc.Integer,
        visible(){
            return this.isDoOpacity && this.opacityIsLoop;
        }
    })
    opacityLoopTimes:number = 0;

    @property({
        displayName:"循环方式",
        type:cc.Enum(LoopType),
        visible(){
            return this.isDoOpacity && this.opacityIsLoop;
        }
    })
    opacityLoopType = LoopType.Restart;
    //#endregion

    private moveTween:cc.Tween = null;
    private rotateTween:cc.Tween = null;
    private scaleTween:cc.Tween = null;
    private opacityTween:cc.Tween = null;

    onEnable(){
        this.doMove();
        this.doRotate();
        this.doScale();
        this.doOpacity();
    }

    doMove(){
        if(this.isDoMove){
            if(this.isRelativeMove){ //相对移动
                this.moveStartPos = this.node.position;
                this.moveEndPos = this.moveStartPos.add(this.moveDeltaPos);
            }
            
            this.node.position = this.moveStartPos;
            this.moveTween = cc.tween(this.node)/*.delay(this.moveDelayTime)*/;
            if(!this.moveIsLoop){
                this.moveTween.to(this.moveTime,{position:this.moveEndPos},null);
            }else{
                if(this.moveLoopType == LoopType.Restart){
                    this.moveTween.then(cc.tween().to(this.moveTime,{position:this.moveEndPos},null).set({position:this.moveStartPos}));
                }else{
                    this.moveTween.then(cc.tween().to(this.moveTime,{position:this.moveEndPos},null).to(this.moveTime,{position:this.moveStartPos},null));
                }

                if(this.moveLoopTimes == -1){
                    this.moveTween.repeatForever();
                }else{
                    this.moveTween.repeat(this.moveLoopTimes);
                }
            }
            this.moveTween.start();
        }
    }

    doRotate(){
        if(this.isDoRotate){
            this.node.angle = this.rotateStartAngle;
            this.rotateTween = cc.tween(this.node).delay(this.rotateDelayTime);
            if(!this.rotateIsLoop){
                this.rotateTween.to(this.rotateTime,{angle:this.rotateEndAngle},null);
            }else{
                if(this.rotateLoopType == LoopType.Restart){
                    this.rotateTween.then(cc.tween().to(this.rotateTime,{angle:this.rotateEndAngle},null).set({angle:this.rotateStartAngle}));
                }else{
                    this.rotateTween.then(cc.tween().to(this.rotateTime,{angle:this.rotateEndAngle},null).to(this.rotateTime,{angle:this.rotateStartAngle},null));
                }
                
                if(this.rotateLoopTimes == -1){
                    this.rotateTween.repeatForever();
                }else{
                    this.rotateTween.repeat(this.rotateLoopTimes);
                }

            }
            this.rotateTween.start();
        }
    }

    doScale(){
        if(this.isDoScale){
            this.node.scale = this.scaleStart;
            this.scaleTween = cc.tween(this.node).delay(this.scaleDelayTime);
            if(!this.scaleIsLoop){
                this.scaleTween.to(this.scaleTime,{scale:this.scaleEnd},null);
            }else{
                if(this.scaleLoopType == LoopType.Restart){
                    this.scaleTween.then(cc.tween().to(this.scaleTime,{scale:this.scaleEnd},null).set({scale:this.scaleStart}));
                }else{
                    this.scaleTween.then(cc.tween().to(this.scaleTime,{scale:this.scaleEnd},null).to(this.scaleTime,{scale:this.scaleStart},null));
                }
                
                if(this.scaleLoopTimes == -1){
                    this.scaleTween.repeatForever();
                }else{
                    this.scaleTween.repeat(this.scaleLoopTimes);
                }

            }
            this.scaleTween.start();
        }
    }

    doOpacity(){
        if(this.isDoOpacity){
            this.node.opacity = this.opacityStart;
            this.opacityTween = cc.tween(this.node).delay(this.opacityDelayTime);
            if(!this.opacityIsLoop){
                this.opacityTween.to(this.opacityTime,{opacity:this.opacityEnd},null);
            }else{
                if(this.opacityLoopType == LoopType.Restart){
                    this.opacityTween.then(cc.tween().to(this.opacityTime,{opacity:this.opacityEnd},null).set({opacity:this.opacityStart}));
                }else{
                    this.opacityTween.then(cc.tween().to(this.opacityTime,{opacity:this.opacityEnd},null).to(this.opacityTime,{opacity:this.opacityStart},null));
                }
                
                if(this.opacityLoopTimes == -1){
                    this.opacityTween.repeatForever();
                }else{
                    this.opacityTween.repeat(this.opacityLoopTimes);
                }

            }
            this.opacityTween.start();
        }
    }

    onDisable(){
        this.moveTween && this.moveTween.stop();
        this.rotateTween && this.rotateTween.stop();
        this.scaleTween && this.scaleTween.stop();
        this.opacityTween && this.opacityTween.stop();
    }
}
