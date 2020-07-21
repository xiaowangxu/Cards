const { getCourse } = require("../../utils/util")

// pages/CourseEdit/CourseEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: app.globalData.statusHeight,
		navHeight: app.globalData.navHeight,
		navButtonHeight: app.globalData.navButtonHeight,
		navButtonWidth: app.globalData.navButtonWidth,
    navButtonRight: app.globalData.navButtonRight,
    
    courses:[],
    deleteActive: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courses : app.globalData.courses
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  tap_Back: function () {
		wx.navigateBack({
			delta: 0,
		})
  },
  
  Delete_Course:function(event){
    let index = event.currentTarget.dataset.itemindex
    let newcourses = this.data.courses
    newcourses.splice(index,1)
    this.setData({
      courses: newcourses
    })
  },
  
  Add_Course:function(){
    this.setData({
      courses: this.data.courses,
      deleteActive: !this.data.deleteActive
    })
  },

  close_Course: function () {
    this.setData({
        deleteActive: false,
    })
},
})