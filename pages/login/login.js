// pages/login/login.js
//获取应用实例
const app = getApp()

wx.cloud.init({
  env: 'server-uko3f'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    inputDisabled: false,
    actionDisabled: true,
    loading: false,
    pwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  input: function(e) {
    var pwd = e.detail.value
    this.setData({
      pwd: pwd,
      actionDisabled: e.detail.value.length != 6
    })
  },

  confirm: function(e) {
    if(!this.data.loading) {
      var pwd = this.data.pwd
      console.log("----密码：" + pwd)
      this.setData({
        loading: true,
        inputDisabled: true
      })
      var _this = this
      wx.cloud.callFunction({
        name: 'login',
        data: {
          'pwd': pwd
        },
        success: function(data) {
          // -1： 无权限 0：普通用户 1：管理员
          var access = data.result.access
          _this.setData({
            loading: false,
            inputDisabled: false
          })
          if (access == 0) {
            wx.redirectTo({
              url: '../user/user',
            })
          } else if (access == 1) {
            wx.redirectTo({
              url: '../manager/manager',
            })
          } else {
            wx.showToast({
              title: '密码错误',
              image: '../resources/error.png',
              duration: 1000
            })
          }
        },
        fail: function (data) {
          console.log(data)
          _this.setData({
            loading: false,
            inputDisabled: false
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})