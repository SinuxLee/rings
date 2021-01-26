
export enum DateType{
    Full,
    Year,
    Month,
    Day,
    Hour,
    Minute,
    Second,
    WeekDay,
    YY_MM_DD,
    HH_MM_SS,
}

export enum TimeType{
    Full,
    Year,
    Month,
    Day,
    Hour,
    Minute,
    Second
}

export class TimeManager{
    
    /**
     * 获取当前时间的时间戳
     */
    static getNow():number{
        return Date.now();
    }

     /**
     * 获取当前日期
     */
    static getDate():Date{
        return new Date();
    }

    /**
     * 获取制定日期的字符串形式，格式：yy-MM-DD-HH-mm-ss
     * @param type 获取类型
     */
    static getDateString(type:DateType,date:Date = new Date()):string{
        let dateStr:string = null;
        switch(type){
            case DateType.Full:
                dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
                break;
            case DateType.Year:
                dateStr = `${date.getFullYear()}}`;
                break;
            case DateType.Month:
                dateStr = `${date.getMonth()}}`;
                break;
            case DateType.Day:
                dateStr = `${date.getDate()}}`;
                break;
            case DateType.Hour:
                dateStr = `${date.getHours()}}`;
                break;
            case DateType.Minute:
                dateStr = `${date.getMinutes()}}`;
                break;
            case DateType.Second:
                dateStr = `${date.getSeconds()}}`;
                break;
            case DateType.WeekDay:
                dateStr = `${date.getDay()}}`;
                break;
            case DateType.YY_MM_DD:
                dateStr =`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                break;
            case DateType.HH_MM_SS:
                dateStr =`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                break;
        }
        return dateStr;
    }
   
    /**
     * 获取指定日期的时间戳
     * @param type 时间类型
     */
    static getDateTimestamp(type:TimeType, date = new Date()):number{
        let temp =null;
        let data:number = date.getTime();
        switch(type){
            case TimeType.Full:
                break;
            case TimeType.Year:
                temp = new Date(date.getFullYear(),0);
                data = temp.getTime();
                break;
            case TimeType.Month:
                temp = new Date(date.getFullYear(),date.getMonth());
                data = temp.getTime();
                break;
            case TimeType.Day:
                temp = new Date(date.getFullYear(),date.getMonth(),date.getDate());
                data = temp.getTime();
                break;
            case TimeType.Hour:
                temp = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours());
                data = temp.getTime();
                break;
            case TimeType.Minute:
                temp = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes());
                data = temp.getTime();
                break;
            case TimeType.Second:
                temp = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
                data = temp.getTime();
                break;
        }
        return data;
    }

    /**
     * 获取时间差，返回值单位：秒
     * @param date1 时间1
     * @param date2 时间2
     */
    static getDeltaBetween(date1:Date,date2:Date):number{
        let seconds = Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
        return seconds;
    }
    
    /**
     * 格式化时间戳 eg.05:00
     */
    static getFormatString(time:number):string{
        let t = time / 1000;
        return `${Math.floor(t / 60).toFillString(2) }:${Math.floor(t % 60).toFillString(2)}`;
    }
}
