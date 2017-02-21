var u = require('../../utils/calendar');

Page({
    data: {
        startDate: '', //入住开始日
        endDate: '', //入住结束日
        dates: 0 //入住天数
    },
    onLoad: function () {
        // Do some initialize when page load.
        //console.log('search-index onLoad');
        this.initData();
        //显示遮罩提示
       	
    },
    confirmDate: function () {
        if (!this.data.startDate) {
            u.toast('请选择入住日期');
            return;
        }
        if (!this.data.endDate) {
            u.toast('请选择离开日期');
            return;
        }
        var self = this;
        var searchDateObj = {
            sDate: self.data.startDate,
            eDate: self.data.endDate,
            dates: self.data.dates
        };
        u.setLS('searchDate', searchDateObj);
        u.goBack();
    },
    initData: function () {
        var calendarObjs = u.createCalendars(6);//日历对象 对象形式
        var calendarLists = u.transCalendarData(calendarObjs);//日历对象 数组形式
        this.setData({
            calendarObjs: calendarObjs,
            calendarLists: calendarLists
        });
    },
    tapDate: function (ev) {
        var currDate = ev.currentTarget.dataset.date;//当前点击的时间
        var dataInfo = ev.currentTarget.dataset.dateinfo.split(',');//当前点击的时间对象下标
        var currMonIdx = dataInfo[0];
        var calendarLists = this.data.calendarLists;//日历对象
        var calendarObjs = this.data.calendarObjs;//日历对象
        var dateObj = calendarObjs[dataInfo[0]].calendarList[currDate];

        var startDate = this.data.startDate;//入住日期
        var endDate = this.data.endDate;//离开日期

        //判断是否可以点击
        if (dateObj.cantap == 'can') {
            //console.log('date be tapped ');

            var currDate1 = new Date(currDate).getDate();//原来显示的日期
            if (currDate == u.formatTime(new Date(), 'yyyy-MM-dd')) {//如果原来显示的今天,则显示回今天
                currDate1 = '今天';
            }

            //判断是否选中|入住日期是否选择,改变状态与文字
            //判断是否显示为入住
            if (dateObj.isSelect == 'selected' && dateObj.isCheckInDate == 'yes' && startDate) {
                this.initData();
                this.setData({
                    endDate: '',//离开日期
                    dates: 0,//离开日期
                    startDate: ''//入住日期
                });
                return;
            }
            if (dateObj.isSelect != 'selected' && !startDate) {
                dateObj.currDate = '入住';
                dateObj.isSelect = 'selected';
                dateObj.isCheckInDate = 'yes';
                var calendarLists = u.transCalendarData(calendarObjs);//日历对象 数组形式
                this.setData({
                    calendarLists: calendarLists,
                    calendarObjs: calendarObjs,
                    startDate: currDate//入住日期
                });
                this.setCanTapDate(currDate, 'checkIn');
                return;
            }
            //判断是否选中|入住日期是否选择|离开日期是否选择,改变状态与文字
            //判断是否显示为离开
            if (dateObj.isSelect == 'selected' && dateObj.isLeaveDate == 'yes' && endDate) {
                dateObj.currDate = currDate1;
                dateObj.isSelect = 'notSelected';
                dateObj.isLeaveDate = 'no';
                var calendarLists = u.transCalendarData(calendarObjs);//日历对象 数组形式
                this.setData({
                    calendarLists: calendarLists,
                    calendarObjs: calendarObjs,
                    dates: 0,
                    endDate: '' //离开日期
                });
                this.setCanTapDate(currDate, 'cancelCheckOut');
                return;
            }
            if (dateObj.isSelect != 'selected' && !endDate && startDate) {
                dateObj.currDate = '离开';
                dateObj.isSelect = 'selected';
                dateObj.isLeaveDate = 'yes';
                var calendarLists = u.transCalendarData(calendarObjs);//日历对象 数组形式
                this.setData({
                    calendarLists: calendarLists,
                    calendarObjs: calendarObjs,
                    endDate: currDate //离开日期
                });
                this.setCanTapDate(currDate, 'checkOut');
                return;
            }

            if (dateObj.isSelect != 'selected' && startDate && endDate) {
                this.initData();
                this.setData({
                    endDate: '',//离开日期
                    dates: 0,//离开日期
                    startDate: ''//入住日期
                });
                return;
            }
        } else {
            //console.log('date can not be tapped ');
            return;
        }
    },
    setCanTapDate: function (currDate, type) {
        var currDateTimeStamp = u.getTimestamp(currDate);//点击的日期
        var calendarObjs = this.data.calendarObjs;//日历对象
        var nowDate = u.formatTime(new Date(), 'yyyy-MM-dd');//当前日期
        var lastYM = calendarObjs[calendarObjs.length - 1].YAndM.split('-');//日历中最后一个月的'年-月'数组
        var lastDate = lastYM[0] + '-' + lastYM[1] + '-' + (Number(new Date(lastYM[0], lastYM[1], '-01').getDate()) + 1);//日历中最后一个月最后一天

        if (type == 'checkIn') {
            var banDayTimsStamp = this.data.banDayTimsStamp || [];//不可租日期

            //获取当前点击到今天日期之前的日期节点
            if (currDate != nowDate) {
                var currBefoerDates = u.getTwoDateList(nowDate, currDate);
                currBefoerDates.forEach(function (val, idx) {
                    if (idx + 1 != currBefoerDates.length) {
                        for (var j = 0; j < calendarObjs.length; j++) {
                            var monOobj1 = calendarObjs[j].calendarList;
                            if (monOobj1[val]) {
                                monOobj1[val].status = 'before';
                                monOobj1[val].cantap = 'not';
                            }
                        }
                    }
                });
            }
            var calendarLists = u.transCalendarData(calendarObjs);
            this.setData({
                calendarObjs: calendarObjs,
                calendarLists: calendarLists
            });
        }
        if (type == 'checkOut') {
            var sDate = this.data.startDate;
            var betweens = u.getTwoDateList(sDate, currDate);
            betweens.forEach(function (val, idx) {
                if (idx + 1 != 1 && idx + 1 != betweens.length) {
                    for (var j = 0; j < calendarObjs.length; j++) {
                        var monOobj1 = calendarObjs[j].calendarList;
                        if (monOobj1[val]) {
                            monOobj1[val].between = 'between';
                        }
                    }
                }
            });
            var calendarLists = u.transCalendarData(calendarObjs);
            this.setData({
                calendarObjs: calendarObjs,
                dates: betweens.length - 1,
                calendarLists: calendarLists
            });

        }
        if (type == 'cancelCheckOut') {
            var sDate = this.data.startDate;
            var betweens = u.getTwoDateList(sDate, currDate);
            betweens.forEach(function (val, idx) {
                if (idx + 1 != 1 && idx + 1 != betweens.length) {
                    for (var j = 0; j < calendarObjs.length; j++) {
                        var monOobj1 = calendarObjs[j].calendarList;
                        if (monOobj1[val]) {
                            monOobj1[val].between = 'boBetween';
                        }
                    }
                }
            });
            var calendarLists = u.transCalendarData(calendarObjs);
            this.setData({
                calendarObjs: calendarObjs,
                calendarLists: calendarLists
            });
        }
    }

});
