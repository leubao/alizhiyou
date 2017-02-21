// pages/goods/google.js
Page({
  data:{
     changeBtn: true, 
     submitBtn: false,
     inputVal: '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  //取消时返回来路页面
  getGoogleBack:function(){
    wx.switchTab({
       url: '../index/index'
    })
  },
  //监听搜索框内容
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value,

            changeBtn: false, 
            submitBtn: true,

      });
      
  },
  //情况文本框
  clearInput: function () {
      this.setData({
          inputVal: "",
          changeBtn: true, 
          submitBtn: false,
      });
  },
  //提交搜索
  postGoogel:function(){

  }
})