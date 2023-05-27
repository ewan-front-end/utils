/**
 * 获取指定月份的天数
 * @param {Number} myMonth 指定月份
 * @returns 天数
 */
export const getMonthDays = myMonth => {
    var now = new Date(); //当前日期
    var nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //

    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
};

/**
 * 获取本月的时间区间
 * @returns 数组[time1,time2]
 */
export const thisMonth = () => {
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //

    var time1 = new Date(nowYear, nowMonth, 1);
    var time2 = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return [time1, time2];
};

/**
 * 获取最近多少天的时间区间
 * @returns 数组[time1,time2]
 */
export const thisDays = days => {
    var end = new Date(); //当前日期
    let day = end.getDate();

    var start = new Date(); //上一次时间点
    start.setDate(day - days);
    //start.setHours(0, 0, 0, 0);

    return [start, end];
};

/**
 * 获取上月的时间区间
 * @returns 数组[time1,time2]
 */
export const lastMonth = () => {
    var now = new Date(); //当前日期
    var nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //
    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastMonth = lastMonthDate.getMonth();

    var time1 = new Date();
    if (lastMonth == 11) {
        time1 = new Date(nowYear - 1, lastMonth, 1);
    } else {
        time1 = new Date(nowYear, lastMonth, 1);
    }

    var time2 = new Date();
    if (lastMonth == 11) {
        time2 = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
    } else {
        time2 = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    }
    return [time1, time2];
};

/**
 * 格式化指定时间
 * @param {Datetime} date 时间
 * @param {String} fmt 格式
 * @returns 格式化后的字符串
 */
export const formatDate = function (date, fmt) {
    fmt = fmt || "yyyy-MM-dd";
    const o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "S+": date.getMilliseconds()
    };

    // 因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
        // 第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。

        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
        // eslint-disable-next-line no-console
        // console.log(date.getTime(), date.getFullYear())
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            // 第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(String(o[k]).length)
            );
        }
    }
    return fmt;
};

/**
 * 日期范围：时长算法
 */
export const rangeLatestDate = (num) => {
    if (typeof num !== 'number') throw 'rangeLatestDate: The wrong parameter was used'
    const now = new Date()
    const startStamp = now.getTime() - (num * 24 * 60 * 60 * 1000)
    return [new Date(startStamp), now];
};
export const rangeLatestDateStr = (num) => {
    const [s, e] = rangeLatestDate(num)
    return [formatDate(s, "yyyy-MM-dd HH:mm:ss"), formatDate(e, "yyyy-MM-dd HH:mm:ss")];
};

/**
 * 日期范围：跨天算法
 */
export const rangeDataStr = (num) => {
    const dateStampCurrent = new Date().getTime()
    const dateStampTarget = dateStampCurrent + (num * 24 * 60 * 60 * 1000)
    const dateTarget = new Date(dateStampTarget)
    const s = formatDate(dateTarget, "yyyy-MM-dd 00:00:00");
    const e = formatDate(dateTarget, "yyyy-MM-dd 23:59:59");
    return [s, e];
};
export const rangeData = (num) => {
    const [s, e] = rangeDataStr(num)
    return [new Date(s), new Date(e)];
};
export const rangeTodayDataStr = () => {
    return rangeDataStr(0);
};
export const rangeTodayData = () => {
    const [s, e] = rangeTodayDataStr()
    return [new Date(s), new Date(e)];
};
export const rangeYesterdayDataStr = () => {
    return rangeDataStr(-1);
};
export const rangeYesterdayData = () => {
    const [s, e] = rangeYesterdayDataStr()
    return [new Date(s), new Date(e)];
};


/**
 * 转化字符串为时间
 * @param {String} str 待转化的字符串
 * @returns 时间
 */
export const parseDateTime = str => {
    if (str === undefined) return "";
    let timestamp = Date.parse(str.replace(/-/gim, "/"));
    return new Date(timestamp);
};
