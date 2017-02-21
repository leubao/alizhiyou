// pages/user/user_info.js
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //程序分享设置
  onShareAppMessage: function () {
    return {
      title: '阿里智游',
      desc: '阿里智游',
      path: '/page/user?id=123'
    }
  },
  //弹出客服
  uinfoGuest: function () {
    wx.showActionSheet({
      itemList: ['18631451216', '呼叫'],
      success: function(res) {
        wx.makePhoneCall({
          phoneNumber: '18631451216', //仅为示例，并非真实的电话号码
        })
      },
      fail: function(res) {
       
      }
    })
  }
})