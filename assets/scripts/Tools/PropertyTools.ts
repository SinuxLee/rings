import { Random } from "./Random";


/***********************************************************
 * Component 
 */
cc.Component.prototype.SetActive=function (active:boolean) {
    this.node.active = active;
}


/***********************************************************
 * Node 
 */
cc.Node.prototype.SetActive=function (active:boolean) {
    this.active = active;
}

cc.Node.prototype.addPosX = function(x:number, posType:PositionType)
{
    if (posType == PositionType.local)
    {
        let localPosition:cc.Vec2 = this.position;
        localPosition.x += x;
        this.position = localPosition;
    }
    else
    {
        let position = this.parent.convertToWorldSpaceAR(this.position);
        position.x += x;
        this.position = this.parent.convertToNodeSpaceAR(position);
    }
}

cc.Node.prototype.addPosY= function(y:number, posType:PositionType)
{
    if (posType == PositionType.local)
    {
        let localPosition:cc.Vec2 = this.position;
        localPosition.y += y;
        this.position = localPosition;
    }
    else
    {
        let position = this.parent.convertToWorldSpaceAR(this.position);
        position.y += y;
        this.position = this.parent.convertToNodeSpaceAR(position);
    }
}

cc.Node.prototype.setPosX = function(x:number, posType:PositionType)
{
    if (posType == PositionType.local)
    {
        let localPosition:cc.Vec2 = this.position;
        localPosition.x = x;
        this.position = localPosition;
    }
    else
    {
        let position = this.parent.convertToWorldSpaceAR(this.position);
        position.x = x;
        this.position = this.parent.convertToNodeSpaceAR(position);
    }
}

cc.Node.prototype.setPosY= function(y:number, posType:PositionType)
{
    if (posType == PositionType.local)
    {
        let localPosition:cc.Vec2 = this.position;
        localPosition.y = y;
        this.position = localPosition;
    }
    else
    {
        let position = this.parent.convertToWorldSpaceAR(this.position);
        position.y = y;
        this.position = this.parent.convertToNodeSpaceAR(position);
    }
}

cc.Node.prototype.setWorldPos = function(pos:cc.Vec2)
{
    if(this.parent){
        this.position = this.parent.convertToNodeSpaceAR(pos);
    }else{
        this.position = pos;
    }
}

cc.Node.prototype.getWorldP = function():cc.Vec2
{
    if(!this.parent){
        return cc.v2(this.position.x,this.position.y);
    }else{
        let pos = this.parent.convertToWorldSpaceAR(this.position);
        return cc.v2(pos.x,pos.y);
    }
}


cc.Node.prototype.transform = function(){
    return this;
}

cc.Node.prototype.moveTo = function(duration: number, x:number, y: number, type:PositionType):cc.ActionInterval{
    if(type === PositionType.local || this.parent== null){
        return cc.moveTo(duration,x,y);
    }else{
        let worldP = cc.v2(x,y);
        let localP = this.parent.convertToNodeSpaceAR(worldP);
        return  cc.moveTo(duration,localP.x,localP.y);
    }
}

cc.Node.prototype.moveBy = function(duration: number, x:number, y: number, type:PositionType):cc.ActionInterval{
    if(type === PositionType.local || this.parent== null){
        return cc.moveBy(duration,x,y);
    }else{
        let worldP = this.getWorldP().addSelf(cc.v2(x,y));
        let localP = this.parent.convertToNodeSpaceAR(worldP);
        return cc.moveBy(duration,localP.x,localP.y);
    }
}

cc.Node.prototype.addListener = function(handler:Function,target:cc.Component,customData = "") {
    let eventHandler = new cc.Component.EventHandler();
    // eventHandler.target = target;
    // if(!component){
    //     component = target.name; 
    // }
    // eventHandler.component = component;
    // eventHandler.customEventData = customData;
    
    let button = this.getComponent(cc.Button);
    if(!button){
        button = this.addComponent(cc.Button);
    }

    let emit = function (params){
        handler.apply(target,[params[0],customData]);
    }

    eventHandler.emit = emit;
    button.clickEvents.push(eventHandler);
    eventHandler = null;
}

/**
 * 获取当前节点的路径
 */
cc.Node.prototype.getPath = function () {
    let p:string = this.name;
    let parent = this.parent;
    while(parent.parent){ //查找到场景中的节点，（最上层是场景名称，所以不需要查到最顶端）
        p = parent.name + "/" + p;
        parent = parent.parent;
    }
    return p;
}

/**
 * 通过相对路径查找
 * eg. 
 * 
 * this.node.getChildByPath("top/lab");
 */
cc.Node.prototype.getChildByPath = function (relativePath:string):cc.Node {
    if(relativePath.indexOf('/') == -1){
        return this.getChildByName(relativePath);
    }

    let basePath = this.getPath();
    basePath = `${basePath}/${relativePath}`;
    let node = cc.find(basePath);
    if(!node){
        console.error("查找路径错误，path => " + basePath );
        return null;
    }
    return node;
}

export enum PositionType{
    local,
    world    
}

/***********************************************************
 * Array 
 */
Array.prototype.Add = function(value){
    this.push(value);
}

Array.prototype.AddRange = function(values){
    for(let i=0;i<values.length;i++){
        this.push(values[i]);
    }
}

Array.prototype.Remove = function(value){
    let index = this.indexOf(value);
    if(index!=-1){
        this.splice(index,1);
    }
}
Array.prototype.RemoveAt = function(index:number){
    if(index < 0 || index > this.length){
        throw("超出数组范围");
    }   
    return this.splice(index,1)[0]; 
}
Array.prototype.GetRandomIndexList = function(count:number):Array<number>{
    let targetList :Array<number> = new Array<number>();
    let indexList : Array<number> = new Array<number>();

    for(let i = 0;i< this.length;i++){
        indexList.Add(i);
    }

    while(targetList.length < count){
        let a = Random.RangeInt(0,indexList.length);
        targetList.Add(indexList[a]);
        indexList.RemoveAt(a);
    }
    return targetList;
}

Array.prototype.Insert = function(index:number,value){
    this.splice(index,0,value);
}

Array.prototype.RemoveRange = function(start:number,count?:number){
    if(count != -1){
       return this.splice(start,count);
    }
}

Array.prototype.Find = function(func:(ele)=>boolean):any{
   
    for(let i = 0;i<this.length;i++){
        if(func(this[i])){
            return this[i];
        }
    }
    return null;
}

Array.prototype.FindIndex = function(func:(ele)=>boolean){
   
    for(let i = 0;i<this.length;i++){
        if(func(this[i])){
            return i;
        }
    }
    return -1;
}


Array.prototype.FindAll = function(func:(ele)=>boolean):any[]{
   
    let temp = [];
    for(let i = 0;i<this.length;i++){
        if(func(this[i])){
            temp.push(this[i]);
        }
    }
    return temp;
}

Array.prototype.Has = function(value){
    return this.indexOf(value) !== -1;
}

/*String************************************ */
String.prototype.ToNumberArray = function(separator:string):Array<number> {
    let str :Array<string> = this.split(separator);
   
    let num: Array<number> = [];
    for(let i =0 ;i< str.length;i++){
        num.push(parseInt(str[i]));
    }
    return num;
}

String.prototype.contain = function(separator:string):boolean{
    return this.search(separator) != -1;
}

/*Sprite**************************************** */
cc.Sprite.prototype.setSpriteMaterial = function(material){
    this.setMaterial(0,material);
}

/*Number**************************************** */
Number.prototype.billion = 1000000000;
Number.prototype.million = 1000000;
Number.prototype.thousand = 1000;

/**
 * 不要四舍五入
 */
Number.prototype.toRoundString = function(count:number):string{
    let str = this.toString();
    str = str.slice(0,str.indexOf('.') + count + 1);
    return str;
}
/**
 * 转换成日期格式输出
 */
Number.prototype.toTimeString = function():string{
    let str = "";
    if(this > 3600){
        str = `${Math.floor(this / 3600).toFillString(2)}:${Math.floor(this % 3600 / 60).toFillString(2)}:${Math.floor(this % 60).toFillString(2)}`;
    }else{
        str = `${Math.floor(this / 60).toFillString(2)}:${Math.floor(this % 60).toFillString(2)}`;
    }
    return str;
}
/**
 * 补位输出
 */
Number.prototype.toFillString = function(count:number):string{
    let str = this.toString();
    while(str.length < count){
        str = "0" + str;
    }
    return str;
}


Number.prototype.toFormatKMB = function():string{
    let str = "";
    let temp = this;

    while(temp >= this.billion ){
        str = "b" + str;
        temp = temp/this.billion;
    }

    while(temp >= this.million ){
        str = "m" + str;
        temp = temp/this.million;
    }

    while(temp >= this.thousand ){
        str = "k" + str;
        temp = temp/this.thousand;
    }

    str = temp.toRoundString(1) + str;
    return str;
}

Number.prototype.degreesToVectors = function():cc.Vec2{
    let radian = cc.misc.degreesToRadians(this);    // 将角度转换为弧度
    let comVec = cc.Vec2.RIGHT;    // 一个水平向右的对比向量
    let dirVec = comVec.rotate(radian);    // 将对比向量旋转给定的弧度返回一个新的向量
    return dirVec;
}

/*cc.Vec2  ******************************************** */
cc.Vec2.prototype.toAngle = function():number{
    let radian = -cc.Vec2.UP.signAngle(this);
    return cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
}

cc.Vec2.prototype.getAngle = function(dir:cc.Vec2):number{
    let radian = -this.signAngle(dir);
    return cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
}


/*cc.Vec3  ******************************************** */
cc.Vec3.prototype.toAngle = function():number{
    let radian = -cc.Vec2.UP.signAngle(cc.v2(this));
  
    return cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
}

/** cc.Button ******************************************* */
cc.Button.prototype.AddListener = function(handler,target:cc.Component,customData = "") {
    let eventHandler = new cc.Component.EventHandler();
    /*eventHandler.target = target;
    if(!component){
        component = target.name; 
    }
    eventHandler.component = component;
    eventHandler.handler = handler;
    eventHandler.customEventData = cunstomData;*/
    let emit = function (params) {
        handler.apply(target,params[0],customData);
    }
    eventHandler.emit = emit;
    this.clickEvents.push(eventHandler);

    eventHandler = null;
}

// /**
//  * 
//  */

// /** 
//  * 
//  *导出 tween方法 
//     * 
//     * */
//    export  function tween(target?: any): Tween;

