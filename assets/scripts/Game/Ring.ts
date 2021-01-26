
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ring{

    ringType:RingType = 0;
    ringIconIndex:number = 0;
}

export enum RingType{
    large,
    mid,
    small
}
