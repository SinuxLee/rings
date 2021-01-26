const {ccclass, property} = cc._decorator;

export interface UIFrameInterface {

    uiRoot:cc.Node;

    getSpriteById(itemId:number):cc.SpriteFrame;

    getNameById(itemId:number):string;

    getCountById(itemId:number):number;

    addItems(itemIds:number[],itemCounts:number[],needShowWindow:boolean);

    useItems(itemIds:number[],itemCounts:number[]);

    isItemEnough(itemId:number):boolean;

    playClickSound();

    playExitSound();
}
