const {
	getCourse
} = require("../../utils/util")

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
		colorPalettes: app.globalData.colorPalettes,

		courses: [],
		deleteActive: false,
		week: [true, true, true, true, true, true, true, true, true, true],
		add_course: {},
		time: [],
		inputdata: "",
		name: "",
		place: "",
		teacher: "",
		addcourseActive: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			courses: app.globalData.courses
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

	Delete_Course: function (event) {
		let index = event.currentTarget.dataset.itemindex
		let newcourses = this.data.courses
		let collectionid = newcourses[index].name
		let that = this
		if (app.globalData.tables[collectionid] !== undefined && app.globalData.tables[collectionid].length > 0) {
			// warn user that whether they also want to delete cards
			wx.showModal({
				title: '警告',
				content: '删除' + collectionid + '会将其卡片集清空，是否继续？',
				success(con) {
					if (con.confirm) {
						newcourses.splice(index, 1)
						app.remove(collectionid)
						app.save_Data()
						app.save_Courses()
						that.setData({
							courses: newcourses
						})
					}
				}
			})
		}
		else {
			newcourses.splice(index, 1)
			app.save_Courses()
			this.setData({
				courses: newcourses
			})
		}
	},

	Add_Course: function () {
		this.setData({
			courses: this.data.courses,
			addcourseActive: true
		})
		app.save_Courses()
	},

	close_Course: function () {
		this.setData({
			addcourseActive: false,
		})
	},

	switch_Week: function (event) {
		let index = event.currentTarget.dataset.index
		this.setData({
			['week[' + index + ']']: !this.data.week[index]
		})
	},

	tap_CourseAdd: function (event) {
		let newweek = []
		let property = {}
		let newtime = this.data.time
		for (let i = 0; i < this.data.time.length; i++) {
			delete newtime[i].text
			delete newtime[i].finish
		}
		property['place'] = this.data.place
		property['teacher'] = this.data.teacher
		for (let i = 0; i < 10; i++) {
			if (this.data.week[i] == true) {
				newweek.push(i + 1)
			}
		}
		if (this.data.name != "" && newtime != []) {
			this.data.add_course['name'] = this.data.name
			this.data.add_course['week'] = newweek
			this.data.add_course['times'] = newtime
			this.data.add_course['property'] = property
			this.data.courses.push(this.data.add_course)
		}
		this.setData({
			courses: this.data.courses,
			addcourseActive: false,
			time: [],
			place: "",
			teacher: "",
			name: "",
			inputdata: "",
			add_course: {},
			week: [true, true, true, true, true, true, true, true, true, true]
		})
		console.log(this.data.courses)
		app.save_Courses()
	},

	hasnotime: function (value) {
		for (let i = 0; i < this.data.time.length; i++) {
			let item = this.data.time
			if (value.day == item[i].day && ((value.timestart >= item[i].timestart && value.timestart <= item[i].timeend) || (value.timeend >= item[i].timestart && value.timeend <= item[i].timeend))) return true
		}
		for (let i = 0; i < this.data.courses.length; i++) {
			let item = this.data.courses[i].times
			for (let index = 0; index < item.length; index++) {
				if (value.day == item[index].day && ((value.timestart >= item[index].timestart && value.timestart <= item[index].timeend) || (value.timeend >= item[index].timestart && value.timeend <= item[index].timeend))) return true
			}
		}
		return false
	},

	addtime: function (event) {
		let value = event.detail.value

		if (value === '') return
		for (let i = 0; i < value.length; i++) {
			if (value[i] == '，') value[i] = ','
		}
		if (this.hasnotime({
				day: parseInt(value.split(',')[0]),
				timestart: parseInt(value.split(',')[1]),
				timeend: parseInt(value.split(',')[2])
			})) return

		let newlist = this.data.time
		newlist.push({
			day: parseInt(value.split(',')[0]),
			timestart: parseInt(value.split(',')[1]),
			timeend: parseInt(value.split(',')[2]),
			finish: false,
			text: value
		})
		this.setData({
			time: newlist,
			inputdata: ''
		})
	},

	hasname: function (value) {
		for (let i = 0; i < this.data.courses.length; i++) {
			let item = this.data.courses[i].name
			if (item == value) return true
		}
		return false
	},
	addname: function (event) {
		let value = event.detail.value
		if (value === '') return
		if (this.hasname(value)) return
		this.setData({
			name: value,
		})
		console.log(this.data.name)
	},
	addplace: function (event) {
		let value = event.detail.value
		if (value === '') return
		this.setData({
			place: value,
		})
	},
	addteacher: function (event) {
		let value = event.detail.value
		if (value === '') return
		this.setData({
			teacher: value,
		})
	},
	addActive: function () {
		this.setData({
			addcourseActive: true,
			deleteActive: true,
		})
	}
})