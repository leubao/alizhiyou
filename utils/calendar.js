function util() {

}
var app = getApp();

util.prototype = {

    //数组去重
    arrUnique: function (arr) {//list去重
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    },
    // 将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // formatTime(new Date(),'yyyy-MM-dd hh:mm:ss.S'); ==> 2006-07-02 08:09:04.423   
    // ormatTime(new Date(),'yyyy-M-d h:m:s.S'); ==> 2006-7-2 8:9:4.18
    formatTime: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //获取秒数
    getTimestamp: function (date) {
        var timestamp;
        if ((typeof date) == 'object') {
            timestamp = Date.parse(date);
        } else if (date && (typeof date) == 'string') {
            timestamp = Date.parse(new Date(date.replace(/-/g, "/")));
        } else {
            timestamp = Date.parse(new Date());
        }
        return timestamp / 1000;
    },
    // obj对象转为json格式的字符串
    j2s: function (obj) {
        return JSON.stringify(obj);
    },
    // json格式的字符串转为obj
    s2j: function (str) {
        return JSON.parse(str);
    },
    // 设置本地缓存
    setLS: function (key, val) {
        try {
            wx.setStorageSync(key, val);
        } catch (e) {
            //console.log(e);
        }
    },
    // 获取本地缓存
    getLS: function (key) {
        return wx.getStorageSync(key);
    },
    rmLS: function (key) {
        try {
            wx.removeStorageSync(key);
        } catch (e) {
            //console.log(e);
        }
    },
    //删除本地缓存
    rmAllLS: function () {
        try {
            wx.clearStorageSync();
        } catch (e) {
            //console.log(e);
        }
    },
    //跳转页面
    toPage: function (url) {
        wx.navigateTo({
            url: url
        })
    },
    //跳转页面
    closeAndToPage: function (url) {
        wx.redirectTo({
            url: url
        });
    },
    //switch跳转页面
    switchToPage: function (url) {
        wx.switchTab({
            url: url
        });
    },
    goBack: function () {
        wx.navigateBack();
    },
    //获取百分百
    getPercent: function (s) {
        var per = parseInt(s);
        return (per * 10 / 100).toFixed(1);
    },
    //字符串切割成数组
    splitToList: function (str, flag) {
        if (!!!flag) {
            flag = ',';
        }
        var res = new Array();
        if (str) {
            var list = str.split(flag);
            list.forEach(function (val) {
                if (val && val != 'null') {
                    res.push(val);
                }
            });
        }
        return res;
    },
    /**
     * 创建日历(1个月)
     * @param date 日期
     * @param roomData 房源数据(显示价格/不可租日期)
     * @returns {{YAndM: *, calendarList: {}}}
     */
    createCalendar: function (date, roomData) {
        var nowDate = new Date();
        if (!date) {
            date = nowDate;
        }
        var dateFormat = this.formatTime(date, 'yyyy年MM月');
        var currYear = date.getFullYear();//当前年份
        var currMonth = date.getMonth() + 1;//当前月份
        var currDay = date.getDate();//当前日期
        var monthDays = new Date(currYear, currMonth, 0).getDate();//当前月份总天数
        var firstDayWeek = new Date(currYear, currMonth - 1, 1).getDay();//当前月份第一天是周几
        var weeks = Math.ceil((monthDays + firstDayWeek) / 7); //当前月份总共有多少周

        // 不可租日期
        var self = this;
        var rentedDay = {};
        if (roomData) {
            var banDay = roomData.BanDay;
            if (banDay) {
                if (banDay.length > 0) {
                    banDay.forEach(function (val, idx) {
                        val = self.formatTime(new Date(val.replace(/-/g, "/")), 'yyyy-MM-dd');
                        rentedDay[val] = 1;
                    });
                }
            }
            var orderDay = roomData.OrderDay;
            if (orderDay) {
                if (orderDay.length > 0) {
                    orderDay.forEach(function (val, idx) {
                        val = self.formatTime(new Date(val.replace(/-/g, "/")), 'yyyy-MM-dd');
                        rentedDay[val] = 1;
                    })
                }
            }
        }

        var calendarList = {};
        for (var i = 0; i < weeks; i++) {
            for (var j = 0; j < 7; j++) {
                var idx = i * 7 + j; //单元格自然序列号
                var dateStr = idx - firstDayWeek + 1; //计算日期
                var dateObj = {};
                var currDateStr = 'empty' + j;
                //过滤无效日期（小于等于零的、大于月总天数的）
                if (dateStr <= 0 || dateStr > monthDays) {
                    dateObj = {
                        currDate: '',
                        date: '',
                        status: 'before',
                        rentStatus: 'notRent',
                        between: 'noBetween',
                        cantap: 'not'
                    };
                } else {
                    currDateStr = currYear + '-' + currMonth + '-' + dateStr;
                    currDateStr = this.formatTime(new Date(currDateStr.replace(/-/g, '/')), 'yyyy-MM-dd');
                    var nowDateStr = this.formatTime(nowDate, 'yyyy-MM-dd');
                    var price = 0;
                    if (roomData) {
                        var roomPrice = roomData.Amount;
                        var separatePrices = roomData.SeparatePriceInfo;
                        price = this.getRoomPrice({
                            Amount: roomPrice,
                            SeparatePriceInfo: separatePrices,
                            Date: currDateStr
                        });
                    }

                    dateObj = {
                        currDate: dateStr,
                        date: currDateStr,
                        status: 'before',
                        price: price,
                        rentStatus: 'notRent',
                        between: 'noBetween',
                        cantap: 'not'
                    };
                    if (currDateStr == nowDateStr) {
                        dateObj = {
                            currDate: '今天',
                            date: currDateStr,
                            status: 'today',
                            price: price,
                            rentStatus: 'notRent',
                            between: 'noBetween',
                            cantap: 'can'
                        };
                    }
                    if (this.getTimestamp(currDateStr) > this.getTimestamp(nowDateStr.replace(/-/g, '/'))) {
                        dateObj = {
                            currDate: dateStr,
                            date: currDateStr,
                            status: 'after',
                            price: price,
                            rentStatus: 'notRent',
                            between: 'noBetween',
                            cantap: 'can'
                        };
                    }
                    if (this.getTimestamp(currDateStr) >= this.getTimestamp(nowDateStr.replace(/-/g, '/')) && rentedDay[currDateStr] == 1) {
                        dateObj = {
                            currDate: dateStr,
                            date: currDateStr,
                            status: 'after',
                            price: price,
                            rentStatus: 'rented',
                            between: 'noBetween',
                            cantap: 'not'
                        };
                        if (currDateStr == nowDateStr) {
                            dateObj.currDate = '今天';
                            dateObj.status = 'today';
                        }
                    }

                }
                calendarList[currDateStr] = dateObj;
            }
        }
        return {
            YAndM: dateFormat,
            calendarList: calendarList
        };
    },
    /**
     * 创建多个日历对象
     * @param count 数量
     * @param roomData 房源数据(显示价格/不可租日期使用)
     * @returns {Array}
     */
    createCalendars: function (count, roomData) {
        if (!count || count <= 0) {
            count = 1;
        }
        var self = this;
        var calendarLists = [];
        var cList = [];
        var date = new Date();
        for (var i = 0; i < count; i++) {
            cList = self.createCalendar(date, roomData);
            calendarLists.push(cList);
            date = new Date(date.setMonth(date.getMonth() + 1));
        }
        return calendarLists;
    },
    /**
     * 日历对象转换为数组
     * @param data 日历对象
     * @returns {Array}
     */
    transCalendarData: function (data) {
        var d = [];
        data.forEach(function (val, idx) {
            var ltObj = val.calendarList;
            var ltList = {};
            var lt1 = [];
            for (var key in ltObj) {
                lt1.push(ltObj[key]);
            }
            ltList.calendarList = lt1;
            ltList.YAndM = val.YAndM;
            ltList.idx = idx;
            d.push(ltList);
        });
        return d;
    },
    /**
     * 获取两天之间的日期列表
     * @param d1 日期(小)
     * @param d2 日期(大)
     * @returns {Array}
     */
    getTwoDateList: function (d1, d2) {
        var res = [];
        if (this.getTimestamp(new Date(d2.replace(/-/g, '/'))) > this.getTimestamp(new Date(d1.replace(/-/g, '/')))) {
            var d1Timstamp = this.getTimestamp(d1);
            var d2Timstamp = this.getTimestamp(d2);
            var a = (d2Timstamp - d1Timstamp) / 60 / 60 / 24 - 1;
            res.push(d1);
            for (var i = 0; i < a; i++) {
                res.push(this.formatTime(new Date((d1Timstamp + 60 * 60 * 24 * (i + 1)) * 1000), 'yyyy-MM-dd'));
            }
            res.push(d2);
            res = this.arrUnique(res);
        }
        return res;
    },
    /**
     * toast
     * @param msg String
     * @param type 'success' 'loading'
     */
    toast: function (msg, type) {
        if (!type) {
            type = 'success';
        }
        wx.showToast({
            title: msg,
            icon: type,
            duration: 1000
        });
    },
    /**
     * 获取随机字符串
     * @param len 长度
     * @returns {string}
     */
    randomString: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },
    arrIndexOf: function (arr, val) {
        var idx = 0;
        if (arr && val) {
            var a = arr;
            for (var i = 0; i < a.length; i++) {
                if (a[i] == val) {
                    idx = i;
                    break;
                }
            }
            return idx;
        } else {
            return idx;
        }
    }
};

util.prototype.constructor = util;
module.exports = new util();