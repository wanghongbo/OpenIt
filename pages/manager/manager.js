// pages/manager.js
//获取应用实例
const app = getApp()

wx.cloud.init({
  env: 'server-uko3f'
})
const db = wx.cloud.database()

var animationDuration = 2000

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    paperSrc: 'cloud://server-uko3f.7365-server-uko3f-1301157543/papers/paper.png',

    recordId: '',
    money: 0,
    gratuity: 0,

    tip: '',
    bindtap: 'openPaper',
    buttonText: '收到，打开纸团',
    actionDisabled: true
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
    this.start()
  },
  start() {
    wx.showLoading({
      title: '游戏中...',
      mask: true
    })
    this.repeatWaiting()
  },
  repeatWaiting() {
    var _this = this
    db.collection('OpenIt_Record').where({
      paid: false,
      valid: true,
    }).orderBy('date', 'desc').limit(1).get({
      success: function (res) {
        if (res.data.length > 0) {
          console.log(res.data[0])
          const data = res.data[0]
          const id = data._id
          const money = data.money
          const gratuity = data.gratuity
          _this.setData({
            recordId: id,
            money: money,
            gratuity: gratuity,
            tip: '玩家需要支付' + money + '+' + gratuity + '=' + (money + gratuity) + '元钱',
            actionDisabled: false
          })
          wx.hideLoading();
        } else {
          setTimeout(function () {
            _this.repeatWaiting()
          }, 1000)
        }
      },
      failed: function (res) {
        setTimeout(function () {
          _this.repeatWaiting()
        }, 1000)
      }
    })
  },
  openPaper() {
    wx.showLoading({
      title: '打开纸团...',
      mask: ture
    })
    this.setData({
      actionDisabled: true
    })
    var _this = this
    console.log('----recordId: ' + this.data.recordId)
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        id: this.data.recordId
      },
      success: function(data) {
        const resultId = data.result.resultId
        console.log('----resultId: ' + resultId)
        if (resultId) {
          _this.open(resultId)
        } else {
          _this.reset()
        }
      },
      fail: function(data) {
        console.log(data)
        _this.reset()
      }
    })
  },
  open(resultId) {
    var _this = this
    db.collection('OpenIt_Result').doc(resultId).get({
      success: function (res) {
        const fileName = res.data.name
        const bonus = res.data.bonus
        _this.setData({
          paperSrc: 'cloud://server-uko3f.7365-server-uko3f-1301157543/papers/' + fileName,
          tip: '需要支付' + bonus + '元奖励给玩家',
          bindtap: 'reset',
          buttonText: '支付完成，重新开始',
          actionDisabled: false
        })
        wx.hideLoading()
      },
      fail: function(res) {
        _this.reset()
      }
    })
  },
  reset() {
    wx.hideLoading()
    this.setData({
      paperSrc: 'cloud://server-uko3f.7365-server-uko3f-1301157543/papers/paper.png',

      recordId: '',
      money: 0,
      gratuity: 0,

      tip: '',
      bindtap: 'openPaper',
      buttonText: '收到，打开纸团',
      actionDisabled: true
    })
    this.start()
  },
  onUnload() {
    console.log('----onUnload')
  },
  onHide() {
    console.log('----onHide')
  },
  onShow() {
    console.log('----show')
  }
})
