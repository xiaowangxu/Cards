//app.js
App({
	onLaunch: function () {
		this.load_Tables()
		wx.getSystemInfo({
			success: res => {
				let menuButtonObject = wx.getMenuButtonBoundingClientRect()
				let statusBarHeight = res.statusBarHeight
				let navHeight = menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2
				this.globalData.navHeight = navHeight
				this.globalData.navButtonHeight = menuButtonObject.height
				this.globalData.navButtonRight = res.windowWidth - menuButtonObject.right
				this.globalData.navButtonWidth = menuButtonObject.width
				this.globalData.statusHeight = statusBarHeight
				this.globalData.windowHeight = res.windowHeight
			},
		})
	},

	onHide: function () {
		console.log(">> save")
		this.save_Data()
	},

	globalData: {
		navHeight: 0,
		statusHeight: 0,
		windowHeight: 0,
		navButtonHeight: 0,
		navButtonRight: 0,
		navButtonWidth: 0,
		tables: {}
	},

	load_Tables: function () {
		let storage = wx.getStorageInfoSync()
		if (storage.keys.includes('tables')) {
			let data = wx.getStorageSync('tables')
			this.globalData.tables = data
		} else {
			this.globalData.tables = {}
		}
	},

	save: function (collectionid, data) {
		collectionid = String(collectionid)
		if (data.length <= 0) {
			this.remove(collectionid)
			return
		}
		this.globalData.tables[collectionid] = data
	},

	remove_Deep: function (collectionid) {
		let table = this.globalData.tables[collectionid]
		if (table !== undefined) {
			this.globalData.tables[collectionid].forEach((item) => {
				if (item.type === 'Collection') {
					this.remove_Deep(item.data.collectionid)
				}
			})
			delete this.globalData.tables[collectionid]
		}
	},

	remove: function (collectionid) {
		collectionid = String(collectionid)
		this.remove_Deep(collectionid)
		this.save_Data()
	},

	save_Data: function () {
		wx.setStorage({
			key: 'tables',
			data: this.globalData.tables
		})
	},

	navigateTo_Table: function (tableid, title, from) {
		let collectionid = String(tableid)
		let url = '/pages/Table/Table?collectionid=' + collectionid + "&title=" + title + "&from=" + from + "&data=" + JSON.stringify(this.globalData.tables[collectionid])
		wx.navigateTo({
			url: url
		})
	}
})