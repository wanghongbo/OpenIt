//index.js
//获取应用实例
const app = getApp()

wx.cloud.init({
  env: 'server-uko3f'
})
const db = wx.cloud.database()

var payArr = [0.5, 1, 2, 3, 4, 5, 10]
var gratuityArr = [
  { text: '1块钱', value: 1 },
  { text: '2块钱', value: 2 },
  { text: '5块钱', value: 5 },
]

var sum = 0
var managerName = '王鸿博'
var animationDuration = 2000
var interval = null

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    paperSrc: '../resources/paper.png',
    money: 0,

    showGratuityDialog: false,
    gratuityGroups: gratuityArr,

    actionDisable: true
  },
  onLoad: function () {
    console.log('----onLoad')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
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
  onReady() {
    console.log('----onReady')

    //设置登录用户，仅允许一个普通用户和一个管理员登录
    wx.cloud.callFunction({
      name: 'getLoginUser',
      success: function(res) {
        console.log(res.result)
      },
      fail: console.error
    })

    this.animation = wx.createAnimation({
      duration: animationDuration
    })
    this.setPayMoney()
  },
  setPayMoney() {
    this.setRandomMoney()
    this.rotate()
    interval = setInterval(this.setRandomMoney, 100)
  },
  setRandomMoney() {
    var m = 0
    do {
      var i = Math.floor(Math.random() * payArr.length)
      m = payArr[i]
    } while (m == this.data.money)
    sum = m
    this.setData({
      money: m
    })
  },
  rotate() {
    var _this = this
    this.animate('.papercontainer', [
      { rotate: 0 },
      { rotate: 720 },
    ], animationDuration, function () {
      this.clearAnimation('.papercontainer', function () {
        console.log("----动画结束")
        clearInterval(interval)
        _this.setData({
          actionDisable: false
        })
      })
    }.bind(this))
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  chooseGratuity: function(e) {
    var _this = this
    wx.showModal({
      title: '你愿意支付一点儿小费么？支付小费有助于提高运气，小费越高，运气越好',
      showCancel: true,
      confirmText: '愿意支付',
      cancelText: '直接打开',
      success(res) {
        if (res.confirm) {
          _this.openGratuityDialog()
        } else if (res.cancel) {
          _this.showConfimMoney()
        }
      }
    })
  },
  openGratuityDialog: function () {
    this.setData({
      showGratuityDialog: true
    })
  },
  closeGratuityDialog: function () {
    this.setData({
      showGratuityDialog: false
    })
  },
  selectGratuityDialog(e) {
    this.closeGratuityDialog()
    var gratuity = e.detail.value
    sum = this.data.money + gratuity
    console.log("----sum money: " + sum)
    this.showConfimMoney()
  },
  showConfimMoney() {
    this.setData({
      actionDisable: true
    })
    var _this = this
    wx.showModal({
      title: '你总共需要支付' + sum + '元钱给' + managerName,
      showCancel: false,
      confirmText: '去支付',
      success(res) {
        _this.showWaitingPay()
      }
    })
  },
  showWaitingPay() {
    this.setData({
      actionDisable: true
    })
    wx.showLoading({
      title: '等待支付...',
    })
    db.collection('OpenIt').doc('0ae2515c-181d-4e14-8fae-ff9ca975e372').get({
      success: function(res) {
        console.log("------")
        console.log(res.data)
      }
    })
    // var _this = this
    // setTimeout(function () {
    //   _this.setData({
    //     actionDisable: false
    //   })
    //   wx.hideLoading()
    //   _this.showContinue()
    // }, 1000)
  },
  showContinue() {
    wx.showModal({
      title: '再接再厉哟',
      showCancel: false,
      confirmText: '继续玩'
    })
  }
})
