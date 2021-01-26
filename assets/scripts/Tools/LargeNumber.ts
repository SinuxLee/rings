const LargeNumberLength = 100;
const formatArray:string[] = ["","k","m","b","aa","ab","ac","ad","ae","af","ag","ah","ai","aj","ak","al","am","an","ao","ap","aq","ar","as","at","au","av","aw","ax","ay","az"];

export class LargeNumber{

    private value:number[];

    constructor(num:number | string){
        this.value = LargeNumber.numberToArray(num.toString());
    }

    toString(){
        let temp = "";
        let checkZero = true;
        this.value.forEach(e=>{
            if(e != 0 || !checkZero){
                temp += e;
                checkZero = false;
            }
        });
        temp = temp === "" ? temp = "0" : temp; 
        return temp;
    }

    /**
     * 转成后缀k m b aa ...的形式显示
     */
    toFormatString(){
        let str = this.toString();
        if(str.length <= 3){
            return str;
        }
        let inedx = Math.floor((str.length - 1) / 3);
        let intLen = str.length % 3;
        intLen = intLen == 0 ? 3 : intLen;

        let temp = "";
        for(let i = 0;i < intLen;i++){
            temp += this.value[this.value.length - str.length + i];
        }
        temp += ".";
        for(let i = intLen;i < intLen + 2;i++){
            temp += this.value[this.value.length - str.length + i];
        }
        return temp + formatArray[inedx];
    }

    private static numberToArray(numStr:string){
        if(numStr.indexOf(".") != -1 || numStr.indexOf("-") != -1 || numStr.indexOf(" ") != -1){
            throw("不允许出现'.' 、 '-' 和 ' '");
        }
        numStr = numStr.trim();
        let temp:number[] = new Array<number>(LargeNumberLength);
        temp.fill(0);
        for(let i = 0;i < numStr.length;i++){
            temp[temp.length - numStr.length + i] = (parseInt(numStr[i]));
        }
        return temp;
    }

    /**
     * 加法
     */
    add(num:number|LargeNumber|string){
        let str_num:number[];
        if(num instanceof LargeNumber){
            str_num = num.value;
        }else{
            str_num = LargeNumber.numberToArray(num.toString());
        }
        
        let c = 0;
        let d = 0;

        for(let i = LargeNumberLength - 1; i >= 0; i--){
            let a = this.value[i];
            let b = str_num[i];
            c = a + b + d;
            d = 0;
            if(c >= 10){
                c = c % 10;
                d = 1;
            }
            this.value[i] = c;
        }
        return this;
    }

    /**
     * 减法
     */
    sub(num:number|LargeNumber|string){
        
        let str_num:number[];
        if(num instanceof LargeNumber){
            str_num = num.value;
        }else{
            str_num = LargeNumber.numberToArray(num.toString());
        }
        
        let c = 0;
        let d = 0;

        for(let i = LargeNumberLength - 1; i >= 0; i--){
            let a = this.value[i];
            let b = str_num[i];

            c = a - b - d;
            d = 0;
            if(c < 0){
                c = c + 10;
                d = 1;
            }
            this.value[i] = c;
        }
        return this;
    }

    /**
     * 乘法
     */
    mul(num:number|LargeNumber|string){
        let temp:LargeNumber = new LargeNumber(0);

        let str_num:number[];
        if(num instanceof LargeNumber){
            str_num = num.value;
        }else{
            str_num = LargeNumber.numberToArray(num.toString());
        }

        for(let i = 0;i<str_num.length;i++){
            if(str_num[i] == 0){
                continue;
            }
            for(let j = 0;j<this.value.length;j++){
                if(this.value[j] == 0){
                    continue;
                }
                let bit = this.value.length - j - 1 + str_num.length - i - 1;
                let str = str_num[i] * this.value[j] +"";
                for(let m = 0; m < bit; m++){
                    str += "0";
                }
                temp.add(str);
            }
        }
        this.value = temp.value;
        return this;
    }
   
    /**
     * 判断a是否大于b
     */
    isLargeThan(b:number | LargeNumber | string){
        let str_a = this.toString();
        let str_b = b.toString();
        if(str_a.length > str_b.length){
            return true;
        }
        if(str_a.length < str_b.length){
            return false;
        }
        return str_a > str_b;
    }

    /**
     * 判断a是否小于b
     */
    isSmallThan(b:number | LargeNumber | string){
        let str_a = this.toString();
        let str_b = b.toString();
        if(str_a.length > str_b.length){
            return false;
        }
        if(str_a.length < str_b.length){
            return true;
        }
        return str_a < str_b;
    }

    /**
     * 判断a是否等于b
     */
    isEqual(b:number | LargeNumber | string){
        let str_a = this.toString();
        let str_b = b.toString();
        return str_a == str_b;
    }
}