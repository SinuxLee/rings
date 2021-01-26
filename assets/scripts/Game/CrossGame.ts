import Game, { PointDir } from "./Game";
import RingPoint from "./RingPoint";
import { Dictionary } from "../YZKCocos/Tools/Dictionary";
////特价9.9元一套cocoscreator代码联系Q2483367084 
//截图 链接：https://share.weiyun.com/leGAHpnB 密码：b9udtv
const {ccclass, property} = cc._decorator;

@ccclass
export default class CrossGame extends Game {

    getPointsByDir(pointDir:PointDir,index:number){
        let points:RingPoint[] = [];

        if(pointDir == PointDir.独点){
            points.push(this.ringPoints[index]);
            return points;
        }

        if(pointDir == PointDir.横向){
            if(index == 1 || index == 2 ||index == 3){
                points.push(this.ringPoints[1]);
                points.push(this.ringPoints[2]);
                points.push(this.ringPoints[3]);
            }else if(index == 4){
                points.push(this.ringPoints[4]);
                points.push(this.ringPoints[5]);
                points.push(this.ringPoints[6]);
            }else if(index == 5){
                points.push(this.ringPoints[4]);
                points.push(this.ringPoints[5]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[7]);
            }else if(index == 6){
                points.push(this.ringPoints[4]);
                points.push(this.ringPoints[5]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[7]);
                points.push(this.ringPoints[8]);
            }else if(index == 7){
                points.push(this.ringPoints[5]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[7]);
                points.push(this.ringPoints[8]);
            }else if(index == 8){
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[7]);
                points.push(this.ringPoints[8]);
            }else if(index == 9 || index == 10 || index == 11){
                points.push(this.ringPoints[9]);
                points.push(this.ringPoints[10]);
                points.push(this.ringPoints[11]);
            }
            return points;
        }

        if(pointDir == PointDir.纵向){
            if(index == 1 || index == 5 ||index == 9){
                points.push(this.ringPoints[1]);
                points.push(this.ringPoints[5]);
                points.push(this.ringPoints[9]);
            }else if(index == 0){
                points.push(this.ringPoints[0]);
                points.push(this.ringPoints[2]);
                points.push(this.ringPoints[6]);
            }else if(index == 2){
                points.push(this.ringPoints[0]);
                points.push(this.ringPoints[2]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[10]);
            }else if(index == 6){
                points.push(this.ringPoints[0]);
                points.push(this.ringPoints[2]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[10]);
                points.push(this.ringPoints[12]);
            }else if(index == 10){
                points.push(this.ringPoints[2]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[10]);
                points.push(this.ringPoints[12]);
            }else if(index == 12){
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[10]);
                points.push(this.ringPoints[12]);
            }else if(index == 3 || index == 7 || index == 11){
                points.push(this.ringPoints[3]);
                points.push(this.ringPoints[7]);
                points.push(this.ringPoints[11]);   
            }
            return points;
        }

        if(pointDir == PointDir.左上右下){
            if(index == 0 || index == 3 || index == 8){
                points.push(this.ringPoints[0]);
                points.push(this.ringPoints[3]);
                points.push(this.ringPoints[8]);
                
            }else if(index == 1 || index == 6 || index == 11){
                points.push(this.ringPoints[1]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[11]);
            }else if(index == 4 || index == 9 || index == 12){
                points.push(this.ringPoints[4]);
                points.push(this.ringPoints[9]);
                points.push(this.ringPoints[12]);
            }
            return points;
        }

        if(pointDir == PointDir.右上左下){
            if(index == 0 || index == 1 || index == 4){
                points.push(this.ringPoints[0]);
                points.push(this.ringPoints[1]);
                points.push(this.ringPoints[4]);
                
            }else if(index == 3 || index == 6 || index == 9){
                points.push(this.ringPoints[3]);
                points.push(this.ringPoints[6]);
                points.push(this.ringPoints[9]);
            }else if(index == 8 || index == 11 || index == 12){
                points.push(this.ringPoints[8]);
                points.push(this.ringPoints[11]);
                points.push(this.ringPoints[12]);
            }
            return points;
        }
    }

    getRemovePoint(dir:PointDir,index:number,iconIndex:number = -1){
        if(iconIndex != -1){
            let rowPoint = this.getPointsByDir(dir,index);
            if(rowPoint.length == 0){
                return null;
            }

            let count = 0;
            rowPoint.forEach(data=>{
                let ringDatas = data.getRingsData();
                for(let i=0;i<ringDatas.length;i++){
                    if(ringDatas[i] == iconIndex){
                        count ++;
                        break;
                    }
                }
            });
            if(count == 3){
                return ([{dir:dir,iconIndex:iconIndex}]);
            }

        }else{

            let rowPoint = this.getPointsByDir(dir,index);
            if(rowPoint.length == 0){
                return null;
            }

            if(rowPoint.length == 3){
                let result =[];
                let dic = this.findCanRemovePoints(rowPoint);
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });

                return result;
            }else if(rowPoint.length == 4){
                let result =[];
                let dic = this.findCanRemovePoints(rowPoint.slice(0,3));
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });
                dic = this.findCanRemovePoints(rowPoint.slice(1,4));
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });
                return result;
            } else if(rowPoint.length == 5){
                let result =[];
                let dic = this.findCanRemovePoints(rowPoint.slice(0,3));
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });
                dic = this.findCanRemovePoints(rowPoint.slice(1,4));
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });
                dic = this.findCanRemovePoints(rowPoint.slice(2,5));
                dic.forEach((k,v)=>{
                    if(v.length == 3){
                        result.push({dir:dir,iconIndex:k});
                    }
                });
                return result;
            }
        }
        return null;
    }

    findCanRemovePoints(rowPoint:RingPoint[]):Dictionary<number,number[]>{
        let dic:Dictionary<number,number[]> = new Dictionary<number,number[]>();

        for(let n =0;n<rowPoint.length;n++){
            let ringDatas = rowPoint[n].getRingsData();
            for(let i=0;i<ringDatas.length;i++){
                if(ringDatas[i] != -1){
                    let rCount:number[] = dic.getValue(ringDatas[i],[]);
                    if(!rCount.Has(n)){
                        rCount.push(n);
                        dic.add(ringDatas[i],rCount);
                    }
                }
            }
        }

        return dic;
    }
	
}
