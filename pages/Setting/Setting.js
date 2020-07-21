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

		githubLogined: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var TIME = util.formatTime(new Date());
		var DATE_TIME = util.formatDate(new Date());
		this.setData({
			time: TIME,
			date_time: DATE_TIME,
			start_date_time: '2020/04/06', //开始时间
		})
		console.log('time:', this.data.time);
		console.log('date_time:', this.data.date_time);
		console.log('start_date_time:', this.data.start_date_time);
		var date_time = new Date(this.data.date_time);
		var start_date_time = new Date(this.data.start_date_time);
		var days = date_time.getTime() - start_date_time.getTime();
		var day = parseInt(days / (1000 * 60 * 60 * 24));
		var num = Math.ceil(day / 7);
		if (day > 0) {
			this.setData({
				number: num
			})
			console.log('当前是春季学期第', this.data.number + '周');
		} else {
			console.log('日期出错了');
		}
		if (app.get_GitHubUrl() !== '') {
			this.setData({
				githubLogined: true
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

	edit_CourseTable:function(){
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
			url: '../GitHub/GitHub',
		})
	},

	upload_GitHub: function () {
		let url = app.get_GitHubUrl()
		let date = new Date()
		if (url !== '') {
			let data = {
				time: date.getTime(),
				tables: app.globalData.tables
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
						app.globalData.tables = JSON.parse(tables).tables
						// console.log(app.globalData.tables)
						app.save_Data()
						let sha = res.data.sha
						app.globalData.github.sha = sha
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
	}
})