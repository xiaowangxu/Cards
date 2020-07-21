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

		state: 'Login',
		repos: [],

		userName: '',
		token: '',
		repo: '',
		sha: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let github = app.globalData.github
		// console.log(github)
		if (github.sha === 'unknown') {
			this.setData({
				userName: '',
				token: '',
				sha: 'unknown',
				repo: '',
				state: 'Login'
			})
		} else {
			this.setData({
				userName: github.user,
				token: github.token,
				sha: github.sha,
				repo: github.repo,
				state: 'Fin'
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

	tap_Back: function () {
		// console.log(getCurrentPages())
		wx.navigateBack({
			delta: getCurrentPages().length - 1,
		})
	},

	input_Name: function (event) {
		let value = event.detail.value
		this.setData({
			userName: value
		})
	},

	input_Token: function (event) {
		let value = event.detail.value
		this.setData({
			token: value
		})
	},

	login: function () {
		let that = this
		wx.showLoading({
			title: '加载中',
		})
		wx.request({
			url: 'https://api.github.com/users/' + this.data.userName + '/repos',
			success(res) {
				wx.hideLoading()
				if (res.statusCode === 200) {
					// console.log(res.data)
					that.setData({
						state: 'Select',
						repos: res.data.map((item) => {
							return item.name
						})
					})
				} else {
					wx.showModal({
						title: '错误',
						content: '无法连接至GitHub或用户名无效',
						showCancel: false
					})
				}
			},
			fail(res) {
				wx.hideLoading()
				wx.showModal({
					title: '错误',
					content: '无法连接至GitHub或用户名无效',
					showCancel: false
				})
			}
		})
	},

	load: function (res) {
		console.log(">>> Load", res)
		let that = this
		wx.showModal({
			title: '从GitHub同步',
			content: '在' + this.data.repo + '中发现Data.txt，是否加载，本地数据将丢失',
			success(con) {
				if (con.confirm) {
					let tables = decode(res.data.content)
					console.log(tables)
					app.globalData.tables = JSON.parse(tables).tables
					console.log(app.globalData.tables)
					app.save_Data()
					let sha = res.data.sha
					app.globalData.github = {
						user: that.data.userName,
						token: that.data.token,
						repo: that.data.repo,
						sha: sha
					}
					app.save_GitHub()
					that.setData({
						state: 'Fin'
					})
				} else if (con.cancel) {
					let sha = res.data.sha
					app.globalData.github = {
						user: that.data.userName,
						token: that.data.token,
						repo: that.data.repo,
						sha: sha
					}
					app.save_GitHub()
					that.setData({
						state: 'Fin'
					})
				}
			}
		})
	},

	init: function () {
		let target = this.data.repo
		let that = this
		wx.showLoading({
			title: '初始化中',
		})
		wx.request({
			url: 'https://api.github.com/repos/' + that.data.userName + '/' + target + '/contents/Data.txt',
			method: 'PUT',
			data: {
				message: 'Init CardsData',
				content: encode(JSON.stringify({time: new Date().getTime(), tables: {}}, null, 2)),
			},
			header: {
				Authorization: 'token ' + that.data.token
			},
			success(res) {
				if (res.statusCode === 201) {
					wx.hideLoading()
					that.setData({
						repo: target,
						state: 'Fin',
						sha: res.data.content.sha
					})
					app.globalData.github = {
						user: that.data.userName,
						token: that.data.token,
						repo: that.data.repo,
						sha: that.data.sha
					}
					app.save_GitHub()
				} else {
					wx.hideLoading()
					wx.showModal({
						title: '错误',
						content: '无法连接至GitHub/repos/' + target + '/Data.txt或token无效',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								that.setData({
									state: 'Login'
								})
							}
						}
					})
				}
			},
			fail(res) {
				wx.hideLoading()
				wx.showModal({
					title: '错误',
					content: '无法连接至GitHub/repos/' + target + '/Data.txt或token无效',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							that.setData({
								state: 'Login'
							})
						}
					}
				})
			}
		})
	},

	tap_Repos: function (event) {
		let target = event.currentTarget.dataset.target
		this.setData({
			repo: target
		})
		let that = this
		wx.showLoading({
			title: '验证中',
		})
		wx.request({
			url: 'https://api.github.com/repos/' + that.data.userName + '/' + target + '/contents/Data.txt',
			method: 'GET',
			header: {
				Authorization: 'token ' + this.data.token
			},
			success(res) {
				wx.hideLoading()
				console.log(res)
				if (res.data.message === 'Not Found') {
					that.init()
					return
				}
				if (res.statusCode === 200) {
					that.load(res)
				} else {
					wx.showToast({
						title: '验证失败',
						icon: 'none'
					})
				}
			},
			fail(res) {
				wx.showToast({
					title: '验证失败',
					icon: 'none'
				})
			}
		})
	},

	exit: function () {
		let that = this
		wx.showLoading({
			title: '删除中',
		})
		wx.request({
			url: 'https://api.github.com/repos/' + that.data.userName + '/' + that.data.repo + '/contents/Data.txt',
			method: 'DELETE',
			data: {
				message: 'Delete CardsData',
				sha: that.data.sha
			},
			header: {
				Authorization: 'token ' + that.data.token
			},
			success(res) {
				// console.log(res)
				if (res.statusCode === 200) {
					wx.hideLoading()
					that.setData({
						repo: '',
						sha: 'unknown',
						state: 'Login'
					})
					app.globalData.github = {
						user: '',
						token: '',
						repo: '',
						sha: 'unknown'
					}
					app.save_GitHub()
				} else {
					wx.hideLoading()
					wx.showModal({
						title: '错误',
						content: '无法连接至GitHub/repos/' + that.data.repo + '/Data.txt或token无效',
						showCancel: false
					})
				}
			},
			fail(res) {
				wx.hideLoading()
				wx.showModal({
					title: '错误',
					content: '无法连接至GitHub/repos/' + target + '/Data.txt或token无效',
					showCancel: false,
				})
			}
		})
	}
})