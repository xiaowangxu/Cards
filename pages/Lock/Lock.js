// pages/main/index.js
var wxlocker = require("../../utils/wxlocker.js");
var app = getApp();
Page({
	data: {
		statusHeight: app.globalData.statusHeight,
		navHeight: app.globalData.navHeight,
		navButtonHeight: app.globalData.navButtonHeight,
		navButtonWidth: app.globalData.navButtonWidth,
		navButtonRight: app.globalData.navButtonRight,
		title: '设置手势密码',
		titleColor: ""
	},
	onLoad: function (options) {
		// 页面初始化 options为页面跳转所带来的参数

		wxlocker.lock.init();
		this.initState();
	},
	onReady: function () {

	},
	onShow: function () {

		// 页面显示
	},
	onHide: function () {
		// 页面隐藏
	},

	onUnload: function () {
		// 页面关闭

	},
	//设置提示语与重置按钮
	initState: function () {
		var resetHidden = wxlocker.lock.resetHidden;
		var title = wxlocker.lock.title;
		var titleColor = wxlocker.lock.titleColor;
		this.setData({
			resetHidden: resetHidden,
			title: title,
			titleColor: titleColor
		});
	},
	touchS: function (e) { //touchstart事件绑定
		wxlocker.lock.bindtouchstart(e);
	},
	touchM: function (e) { //touchmove事件绑定
		wxlocker.lock.bindtouchmove(e);
	},
	touchE: function (e) { //touchend事件绑定
		wxlocker.lock.bindtouchend(e, this.lockSucc);
		this.initState();
	},
	lockSucc: function () { //解锁成功的回调函数
		//console.log("解锁成功！");
		app.navigateTo_Table('Privacy', '隐私空间', '')
	},
	tap_Back: function () {
		wx.navigateBack({
			delta: 0,
		})
	},
	lockreset: function () {
		wx.showModal({
			title: '重置手势密码',
			content: '重置密码将会删除隐私空间中的所有卡片，仍要继续？',
			success(con) {
				if (con.confirm) {
					wxlocker.lock.updatePassword();

					app.remove('Privacy')
					app.save_Data()

					wx.showToast({
						title: '重置成功',
						icon: 'success',
						duration: 1000,
					})
					setTimeout(function () {
						wx.navigateBack({
							delta: 0,
						})
					}, 1000);
				}
			}
		})

	}
})