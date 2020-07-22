const util = require("../../utils/util.js")

// pages/Table.js

const app = getApp()
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()

Page({

	data: {
		// app: getApp(),
		statusHeight: app.globalData.statusHeight,
		navHeight: app.globalData.navHeight,
		navButtonHeight: app.globalData.navButtonHeight,
		navButtonWidth: app.globalData.navButtonWidth,
		navButtonRight: app.globalData.navButtonRight,

		courses: [],
		voiceinputActive: false,
		voiceinputFin: false,
		currentText: '语音输入中...'
	},

	onLoad: function (options) {
		this.initRecord()
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
	},

	streamRecord: function () {
		this.setData({
			voiceinputActive: true,
			voiceinputFin: false,
			currentText: '语音输入中...'
		})
		manager.start({
			lang: 'zh_CN',
		})
	},

	streamRecordEnd: function () {
		manager.stop()
	},

	initRecord: function () {
		//有新的识别内容返回，则会调用此事件
		manager.onRecognize = (res) => {
			let text = res.result
			this.setData({
				currentText: text,
			})
		}
		// 识别结束事件
		manager.onStop = (res) => {
			wx.hideLoading()
			let text = res.result
			if (text == '') {
				// 用户没有说话，可以做一下提示处理...
				return
			}
			this.setData({
				voiceinputFin: true,
				currentText: text,
			})
		}
	},

	add_VoiceInput: function () {
		if (app.globalData.tables['Main'] === undefined) {
			app.globalData.tables['Main'] = []
		}
		let startdate = new Date()
		let enddate = new Date()
		enddate.setTime(startdate.getTime() + 24 * 60 * 60 * 1000)
		app.globalData.tables['Main'].push({
			type: 'Passage',
			start: util.formatTime(startdate, false),
			end: util.formatTime(enddate, false),
			week: [true, true, true, true, true, true, true],
			data: {
				title: '由语音输入 ' + util.formatTime(startdate, false),
				passage: this.data.currentText,
				path: ''
			}
		})
		app.save_Data()
		this.setData({
			voiceinputActive: false,
			voiceinputFin: false,
			currentText: '语音输入中...'
		})
		setTimeout(function () {
			app.navigateTo_Table('Main', '随手记', '课程表')
		}, 300)
	},

	close_Cover: function () {
		this.setData({
			voiceinputActive: false,
			voiceinputFin: false,
			currentText: '语音输入中...'
		})
	}
})