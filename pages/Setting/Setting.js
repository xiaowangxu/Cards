// pages/Setting/Setting.js
const app = getApp()
import util from '../../utils/util.js';
import {
	encode,
	decode
} from '../../utils/Base64';

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
		number: app.globalData.date_number,
		githubLogined: false,
		startDate: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let startdatestr = app.globalData.startDate
		if (startdatestr === '') {
			this.setData({
				startDate: '',
				number: -1
			})
		} else {
			let startdate = new Date(startdatestr + ' 00:00:00')
			let num = util.getCourseWeek(startdate, new Date())
			this.setData({
				startDate: util.formatDate(startdate, '-'),
				number: num
			})
		}
		if (app.get_GitHubUrl() !== '') {
			this.setData({
				githubLogined: true,
			})
		}
		let storage = wx.getStorageInfoSync()
		if (storage.keys.includes('passwordxx')) {
			this.setData({
				hasPrivacy: true
			})
		}
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
		let storage = wx.getStorageInfoSync()
		this.setData({
			githubLogined: app.get_GitHubUrl() !== '',
			hasPrivacy: storage.keys.includes('passwordxx')
		})
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
		this.getOpenerEventChannel().emit('refresh')
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

	goto_File: function (event) {
		let type = event.currentTarget.dataset.file
		// console.log(event)
		let url = '../File/File?type=' + type
		wx.navigateTo({
			url: url,
		})
	},

	tap_Back: function () {
		wx.navigateBack({
			delta: 0,
		})
	},

	edit_CourseTable: function () {
		wx.navigateTo({
			url: '../CourseEdit/CourseEdit'
		})
	},

	goto_MainTable: function (event) {
		// console.log(event)
		let url = '../MainTable/MainTable'
		wx.navigateTo({
			url: url,
		})
	},

	goto_GitHub: function () {
		wx.navigateTo({
			url: '../GitHub/GitHub'
		})
	},

	upload_GitHub: function () {
		let url = app.get_GitHubUrl()
		let date = new Date()
		if (url !== '') {
			let data = {
				time: date.getTime(),
				tables: app.globalData.tables,
				courses: app.globalData.courses
			}
			let message = {
				message: 'Update Tables ' + util.formatTime(date),
				content: encode(JSON.stringify(data, null, 2)),
				sha: app.globalData.github.sha
			}
			wx.showLoading({
				title: '上传中'
			})
			wx.request({
				url: url,
				method: 'PUT',
				data: message,
				header: {
					Authorization: 'token ' + app.globalData.github.token
				},
				success(res) {
					wx.hideLoading()
					if (res.statusCode === 200) {
						let sha = res.data.content.sha
						app.globalData.github.sha = sha
						app.save_GitHub()
					} else {
						wx.showToast({
							title: '上传失败',
							icon: 'none'
						})
					}
				},
				fail(res) {
					wx.showToast({
						title: '上传失败',
						icon: 'none'
					})
				}
			})
		}
	},

	load_GitHub: function () {
		let url = app.get_GitHubUrl()
		if (url !== '') {
			wx.showLoading({
				title: '下载中'
			})
			wx.request({
				url: url,
				method: 'GET',
				header: {
					Authorization: 'token ' + app.globalData.github.token
				},
				success(res) {
					wx.hideLoading()
					// console.log(res)
					if (res.statusCode === 200) {
						let tables = decode(res.data.content)
						let tableobject = JSON.parse(tables)
						app.globalData.tables = tableobject.tables
						app.globalData.courses = tableobject.courses
						let sha = res.data.sha
						app.globalData.github.sha = sha
						app.save_Courses()
						app.save_Data()
						app.save_GitHub()
					} else {
						wx.showToast({
							title: '下载失败',
							icon: 'none'
						})
					}
				},
				fail(res) {
					wx.showToast({
						title: '下载失败',
						icon: 'none'
					})
				}
			})
		}
	},

	goto_PrivacyTable: function (event) {
		// console.log(event)
		//let url = '../PrivacyTable/PrivacyTable'
		let url = '../Lock/Lock'
		wx.navigateTo({
			url: url,
		})
	},

	select: function (event) {
		let date = event.detail.date
		wx.navigateTo({
			url: '../FileDate/FileDate?date=' + date,
		})
	},

	bindStartDateChange(event) {
		let startdatestr = event.detail.value.replace(/-/g, '/')
		app.globalData.startDate = startdatestr
		app.save_StartDate()
		if (startdatestr === '') {
			this.setData({
				number: -1
			})
		} else {
			let startdate = new Date(startdatestr + ' 00:00:00')
			let num = util.getCourseWeek(startdate, new Date())
			if (app.get_GitHubUrl() !== '') {
				this.setData({
					githubLogined: true,
					number: num
				})
			}
		}
	}
})