Page({
  data:{
    ispusherexit:true,//推流是否存在
    isplayerexit:false,//拉流是否存在
    pusherwidth: '100%',
    pusherheight: '100vh',
    ispusherfullscreen:false,//是否全屏
    isIconShow:true, 
    fullscreenwidth:'',
    fullscreenheight:'',
    top:'0px',
    right:'0px',
    openid:"",
    roomid:"",
    setInterval:"",
    muteStatus:'1'
  },
 
  onHide(){
    var that=this;
    var app = getApp();
     clearInterval(this.data.setInterval)
     var openid=that.data.openid;
    wx.request({
      url: app.globalData.ip +'api/wx/room/delete?id=room_wx_'+openid,
      success:function(res){
        console.log(res);
        console.log("delete success==>onHide");
      }
    })
    console.log("onHide")
  },
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher') 
    console.log(this.ctx);
  this.player=wx.createLivePlayerContext('player')
   console.log(this.player);
  },
  onLoad(){
    //获取openid
    var app = getApp();
    this.setData({
      openid: app.globalData.openid,
    })
    var that = this; 
    console.log(that.data.openid)
   var hasPerson= setInterval(function () {
     wx.request({
       url: app.globalData.ip + 'api/wx/room/check?id=' + that.data.openid,
       success: function (res) {
         console.log(res)
         if (res.data.result) {
           console.log("有人进入房间")
           clearInterval(hasPerson)//关闭定时器
           wx.request({
             url: app.globalData.ip + 'api/wx/room/get?id=' + that.data.openid,
             success:function(res){
               console.log("获取房间")
               console.log(res);
               var roomid=res.data.result.persons[1].id;
               that.setData({
                 roomid:roomid
               })
             }
           })
           that.setData({
             ispusherexit: false,
             isplayerexit: true
           })
           
           setTimeout(function () {
             that.setData({
               ispusherexit: true,
               pusherwidth: '100px',
               pusherheight: '150px',
               isIconShow: false,
               fullscreenwidth: '100px',
               fullscreenheight: '150px'
             })
           }, 1000)
         } else {
           console.log("没有人进入房间")
         }
       },
       fail: function (err) {
         console.log(err);
       }
     })
    }, 500) 
    
    this.setData({
      setInterval: hasPerson
    })
  },
  //点击左上角的返回时调用
  onUnload() {
    var that=this;
    var app = getApp();
    clearInterval(this.data.setInterval);
    var openid=this.data.openid;
    wx.request({
      url: app.globalData.ip + 'api/wx/room/delete?id=room_wx_' + that.data.openid,
      success: function (res) {
        console.log(res);
        console.log("delete success==>onUnload");
      }
    })
    console.log("onUnload");
  },
  /*有人加入直播拉流*/
  
  //拖动推流小屏幕
  touchMoveEvent(e){
    console.log("拖动小屏幕");
    console.log(e);
  },
  //推流全屏显示
  pusherFullScreen(e){
      var that=this;
      console.log(e),
        console.log(this.data.isplayerexit) 
    if (this.data.isplayerexit && !(this.data.ispusherfullscreen) ){
      that.setData({     
        pusherwidth: '100%',
        pusherheight: '100vh',
        fullscreenwidth: '100%',
        fullscreenheight: '100vh',
        ispusherfullscreen:true,
        isIconShow:false
      })
    }else{
      that.setData({
        pusherwidth: '100px',
        pusherheight: '150px',
        fullscreenwidth: '100px',
        fullscreenheight: '150px',
        ispusherfullscreen: false
      })
    }
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
    if (e.detail.code=='1001'){
      wx.showToast({
        title:'开始直播' 
      })
    }
    if (e.detail.code == '1002') {
      console.log("开始推流")
    }
  },
  playstatechange(e){
    console.log('live-palyer code:', e.detail.code)
    if (e.detail.code == '2001') {
      console.log("已经连接服务器")
     
    }
    if (e.detail.code == '2103') {
      console.log("网络断连, 已启动自动重连");
    }
    if (e.detail.code == '3005') {
      console.log("RTMP 读/写失败");
    }
    if (e.detail.code == '-2301' || e.detail.code == '-2302' || e.detail.code == '3002' || e.detail.code == '2103') {
      wx.showLoading({
        title: '努力加载中...',
      })
    } else if (e.detail.code == '2003') {
      wx.hideLoading()
    }
  },
  
  bindStart() {
    this.ctx.start({
      success: res => {
        console.log('start success')
        console.log(res);
      },
      fail: res => {
        console.log('start fail')
        console.log(res);
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  //停止推流
  bindStop(e) {
    console.log(e);
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
    wx.reLaunch({
      url: '/pages/index/index'
    })

  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  //转换摄像头
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
   
  },
  //拉流静音
  bindMute() {
    if (this.data.muteStatus == '1') {
      this.setData({
        muteStatus: '0'
      })
    } else {
      this.setData({
        muteStatus: '1'
      })
    }
    this.player.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  }
})