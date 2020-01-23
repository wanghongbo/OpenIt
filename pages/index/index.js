//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    showDialog: false,
    groups: [
      { text: '示例菜单', value: 1 },
      { text: '示例菜单', value: 2 },
      { text: '负向菜单', type: 'warn', value: 3 }
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
  openDialog: function () {
    this.setData({
      showDialog: true
    })
  },
  closeDialog: function () {
    this.setData({
      showDialog: false
    })
  },
  selectDialog(e) {
    console.log(e)
    this.closeDialog()
  },
  showLoading: function() {
    this.setData({
      actionDisable: true
    })
    wx.showLoading({
      title: '准备打开...',
    })
    var _this = this
    setTimeout(function () {
      _this.setData({
        actionDisable: false
      })
      wx.hideLoading()
      _this.showCost()
    }, 1000)
  },
  showCost() {
    var _this = this
    wx.showModal({
      title: '你需要支付以下费用才能打开纸团',
      content: '3元',
      showCancel: false,
      confirmText: '确定',
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
  }
})
