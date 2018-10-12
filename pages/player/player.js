Page({
  data: {
    isplayhidden: 'block',
    ispushhidden: 'none',
    fullscreenwidth: '100px',
    fullscreenheight: '150px',
    isIconShow: true, 
    pusherwidth: '100px',
    pusherheight: '150px',
    ispusherfullscreen: false,//是否全屏
    screenHeight:'',//获取手机屏幕高度
    screenWidth: '',//获取手机屏幕宽度
    top:'0px',
    right:'0px',
    openid:"",
    roomid:"",
    muteStatus:'1'
  },
  onReady(res) {
    this.pusher = wx.createLivePusherContext('pusher') 
    this.ctx = wx.createLivePlayerContext('player')
    console.log(this.player);
  },
  onLoad(option) {
    console.log(option.roomid);
    var app = getApp();
    this.setData({
      openid: app.globalData.openid, 
      roomid: option.roomid,   
    })

    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });
  },
  //推流拖动小屏幕
  touchMoveEvent(e){
    console.log(e)
    
  },
  //推流全屏显示
  pusherFullScreen(e) {
    var that = this;
    console.log(e),
      console.log(this.data.isplayerexit)
    if (!(this.data.ispusherfullscreen)) {
      that.setData({
        pusherwidth: '100%',
        pusherheight: '100vh',
        fullscreenwidth: '100%',
        fullscreenheight: '100vh',
        ispusherfullscreen: true,
        isIconShow: false
      })
    } else {
      that.setData({
        pusherwidth: '100px',
        pusherheight: '150px',
        fullscreenwidth: '100px',
        fullscreenheight: '150px',
        ispusherfullscreen: false
      })
    }
  },
  //状态码
  statechange(e) {
    console.log('live-player code:', e.detail.code)
    if (e.detail.code=='2001'){
      console.log("已经连接服务器")
    }
    if (e.detail.code=='2103'){
      console.log("网络断连, 已启动自动重连");
    }
    if (e.detail.code =='3005'){
      console.log("RTMP 读/写失败");
    }
    if (e.detail.code == '-2301' || e.detail.code == '-2302'|| e.detail.code == '3002' || e.detail.code =='2103'){
        wx.showLoading({
          title: '努力加载中...',
        })
    } else if (e.detail.code =='2003'){
      wx.hideLoading()
    }
  },
  pushstatechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindPlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
 
  //关闭（挂断）
  bindStop() {
    this.pusher.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  //转换摄像头
  bindSwitchCamera() {
    this.pusher.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  },
  
  //静音
  bindMute() {
    if (this.data.muteStatus=='1'){
      this.setData({
        muteStatus:'0'
      })
    }else{
      this.setData({
        muteStatus:'1'
      })
    }
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  }
 
})