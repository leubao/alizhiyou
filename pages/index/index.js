//index.js
//获取应用实例
var app = getApp()
var u = require('../../utils/calendar.js');
Page({
  data: {      
    logoUrl:'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
   
  },
   //程序分享设置
  onShareAppMessage: function () {
    return {
      title: '阿里智游',
      desc: '阿里智游',
      path: '/page/user?id=123'
    }
  },
  googleList:function(){
    wx.redirectTo({
      url: '../goods/google'
    })
  },
  //搜索 start
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
  },
  //搜索 end
  calendar: function () {
    u.toPage('/pages/calendar/calendar');
  }
})
