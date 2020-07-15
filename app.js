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
		colorPalettes: ['#D32F2F','#7B1FA2','#303F9F','#1976D2','#689F38','#FBC02D','#FFA000','#F57C00','#E64A19','#5D4037', '#111d5e', '#2f2519', '#c70039', '#184d47', '#f37121', '#ffbd69', '#b83b5e', '#3ec1d3', '#6c5b7b', '#455d7a', '#8f8787'],
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
		this.save_Data()
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

	remove_Card: function (collectionid, index) {
		console.log("????")
		collectionid = String(collectionid)
		let table = this.globalData.tables[collectionid]
		console.log(collectionid)
		if (table !== undefined) {
			console.log(">>>>")
			let card = table.splice(index, 1)[0]
			if (card !== undefined && card.type === 'Collection') {
				this.remove_Deep(card.data.collectionid)
			}
		}
		if (table.length <= 0) {
			this.remove(collectionid)
		}
		else {
			this.save_Data()
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