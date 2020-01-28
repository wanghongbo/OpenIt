// pages/manager.js
//获取应用实例
const app = getApp()

wx.cloud.init({
  env: 'server-uko3f'
})
const db = wx.cloud.database()

var animationDuration = 2000
var interval = null

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    paperSrc: '../resources/papers/paper.png',

    id: '',
    money: 0,
    gratuity: 0,

    actionDisable: true
  },
  onLoad: function () {
    console.log('----onLoad')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady() {
    console.log('----onReady')
    wx.showLoading({
      title: '等待中...',
    })
    this.repeatWaiting()
  },
  repeatWaiting() {
    var _this = this
    db.collection('OpenIt_Record').where({
      paid: false
    }).orderBy('date', 'desc').limit(1).get({
      success: function (res) {
        console.log(res.data[0])
        const data = res.data[0]
        const id = data._id
        const money = data.money
        const gratuity = data.gratuity
        _this.setData({
          id: id,
          money: money,
          gratuity: gratuity,
          actionDisable: false
        })
        wx.hideLoading();
      },
      failed: function (res) {
        setTimeout(function () {
          _this.repeatWaiting()
        }, 3000)
      }
    })
  },
  pay() {
    console.log("----pay")
  }
})
