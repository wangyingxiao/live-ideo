//index.js
//获取应用实例
var Api = require("../../utils/util.js");
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    playlist:[],
    hasData:true
  },

  // submit.js
  submit: function (e) {
    app.globalData.formId += e.detail.formId+","
    /*点击我要直播之后发出消息提醒 */
    // if (app.globalData.formId.length>40){
    //   app.globalData.formId = app.globalData.formId.substring(0, app.globalData.formId.length - 1);
    //   console.log(app.globalData.formId); 
    //   console.log("token=" + app.globalData.token);
      // wx.request({
      //   url: app.globalData.ip+'api/v1/wx/getFormId?token='+app.globalData.token,
      //   method:'POST',
      //   data:{
      //     "touser":"o1nWA4tZDrp87Sco9l8neNkAn4W8",
      //     "template_id": "L21HdT82MUqfUOhXIlmNSa6_opXIaNXl-fR5rWN0XIQ",
      //     "form_id": app.globalData.formId,
      //     "data": {
      //       "keyword1": {
      //         "value": "火灾救援现场"
      //       },
      //       "keyword2": {
      //         "value": "点击进入直播间查看现场直播"
      //       }
      //     }
      //   },
      //   success:function(res){
      //     console.log(res);
      //     app.globalData.formId=""
      //   }
      // })
    //}
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击进入直播间
  enterPlay:function(e){
    console.log(e);
    var roomid = e.currentTarget.dataset.roomid;
    var roomid1 = e.currentTarget.dataset.id;
    var name = app.globalData.userInfo.nickName;
    
    wx.request({
      url: app.globalData.ip +'api/wx/room/add?roomid='+roomid+"&id="+app.globalData.openid+"&name="+name,
      success:function(res){
        console.log("调用room/add success")
      }
    })
    wx.navigateTo({
      url: '/pages/player/player?roomid='+roomid1
    })
  },
  //点击进入我要直播
  enterPush:function(){
  var name=app.globalData.userInfo.nickName;
    wx.request({
      url: app.globalData.ip +'api/wx/room/new?id='+app.globalData.openid+"&name="+name,
      success:function(res){
        console.log("调用/room/new success");
      },
      fail:function(err){
        console.log(err);
      }
    })
    wx.navigateTo({
      url: '/pages/pusher/pusher'
    })
  },
  //获取直播列表
  getPlayList:function(){
    var that=this;
    wx.request({
      url: app.globalData.ip +'api/wx/room/list',
      success: function (res) {
        console.log(res);
        if(res.data.result[0]==null){
          res.data.result.length = 0
        }
        if(res.data.result.length==0){
          that.setData({
            hasData:false
          })
        }else{
          that.setData({
            hasData: true
          })
        }
        var datas = res.data.result;
        for (let i = 0; i < datas.length; i++) {
          datas[i]["timestamp"] = Api.formatTime(datas[i]["timestamp"])
        }
        that.setData({
          playlist: datas
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.getPlayList()
  },
  onLoad: function () {
    this.getPlayList();
    wx.login({
      success:function(msg){
          console.log(msg);
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + app.globalData.appid + "&secret="+ app.globalData.secret + "&js_code=" + msg.code+"&grant_type=authorization_code",
            success:function(res){
                console.log(res);
              app.globalData.openid=res.data.openid;
            }
          })
      }
    })
    if (app.globalData.userInfo) {
    //  console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
       this.getPlayList();
    setTimeout(this.getPlayList,1000)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
