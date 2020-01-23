//index.js
//获取应用实例
const app = getApp()

var sum = 0
var managerName = '王鸿博'

Page({
  data: {
    money: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    showGratuityDialog: false,
    gratuityGroups: [
      { text: '1块钱', value: 1 },
      { text: '2块钱', value: 2 },
      { text: '5块钱', value: 5 },
    ],

    actionDisable: false
  },
  onLoad: function () {
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
          _this.showWaitingPay()
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
    var _this = this
    setTimeout(function () {
      _this.setData({
        actionDisable: false
      })
      wx.hideLoading()
    }, 1000)
  }
})
