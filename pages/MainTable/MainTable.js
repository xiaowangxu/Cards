const util = require("../../utils/util.js")

// pages/Table.js

const app = getApp()
const startdate = new Date()
let date = new Date()
date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
const enddate = date

Page({

	data: {
		// app: getApp(),
		statusHeight: app.globalData.statusHeight,
		navHeight: app.globalData.navHeight,
		navButtonHeight: app.globalData.navButtonHeight,
		navButtonWidth: app.globalData.navButtonWidth,
		navButtonRight: app.globalData.navButtonRight,

		courses: [],

	},

	onLoad: function (options) {
		this.setData({
			courses: app.globalData.courses
		})
	},

	onReady: function () {},

	onShow: function () {

	},

	onHide: function () {
		// console.log(">>>>>")
	},

	onUnload: function () {
		// console.log(">>>>>")
	},

	onPullDownRefresh: function () {
		let coursetable = this.selectComponent('.CourseTableObject')
		coursetable.refresh()
		wx.stopPullDownRefresh()
	},

	onReachBottom: function () {

	},

	onShareAppMessage: function () {

	},

	tap_Setting: function () {
		let that = this
		wx.navigateTo({
			url: '../Setting/Setting',
			events: {
				refresh: function () {
					let data = app.globalData.courses
					if (data === undefined) {
						return
					} else {
						that.setData({
							courses: data,
						})
						let coursetable = that.selectComponent('.CourseTableObject')
						coursetable.refresh()
					}
				}
			}
		})
	},

	tap_Search: function () {
		let that = this
		wx.navigateTo({
			url: '../Search/Search'
		})
	},

	prevent_Scroll: function () {
		return false
	},

	scroll_PageToBottom: function () {
		let that = this
		wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
			if (rect) {
				that.staticData.lastPageTop = rect.top
				wx.pageScrollTo({
					scrollTop: rect.height,
					duration: 200
				})
			}
		}).exec()
	},

	scroll_PageTo: function (position) {
		wx.pageScrollTo({
			scrollTop: -position,
			duration: 200
		})
	},

	goto_Main: function () {
		app.navigateTo_Table('Main', '随手记', '课程表')
	},

	goto_Today: function () {
		wx.navigateTo({
			url: '../FileDate/FileDate?date=' + util.formatDate(new Date()),
		})
	}
})