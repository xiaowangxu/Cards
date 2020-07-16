// pages/Table.js
const app = getApp()
import util from '../../utils/util.js';
Page({

	data: {
		// app: getApp(),
		statusHeight: app.globalData.statusHeight,
		navHeight: app.globalData.navHeight,
		navButtonHeight: app.globalData.navButtonHeight,
		navButtonWidth: app.globalData.navButtonWidth,
		navButtonRight: app.globalData.navButtonRight,

		isCardShopOpen: false,
		selectedCardIndex: 0,


		cardShopList: [],
		cards: [],

		courses: [],

		deleteActive: false
	},

	staticData: {
		collectionid: 'Main',
		lastPageTop: 0,
		cards: [],
		uid: 0,
		cardsTemplate: [],
		cardsTemplateBlank: [{
			type: 'Todo',
			data: []
		}, {
			type: 'Picture',
			data: []
		}, {
			type: 'Collection',
			data: {
				collectionid: 'template',
				name: ''
			}
		}]
	},

	onLoad: function (options) {
    var DATE_TIME = util.formatDate(new Date());
    this.setData({
      date_time: DATE_TIME,
      start_date_time: '2020/04/06', //开始时间
    })
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
		this.staticData.collectionid = 'Main'
		let data = app.globalData.tables['Main']
		if (data === undefined) {
			this.setData({
				courses: app.globalData.courses
			})
			return
		} else {
			let uiddata = this.get_Cards_with_UID(data)
			this.staticData.cards = uiddata
			this.setData({
				cards: uiddata,
				courses: app.globalData.courses
			})
		}
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
					let data = app.globalData.tables['Main']
					if (data === undefined) {
						return
					} else {
						let uiddata = that.get_Cards_with_UID(data)
						that.staticData.cards = uiddata
						that.setData({
							cards: uiddata,
						})
					}
				}
			}
		})
	},

	get_Cards_with_UID: function (cards) {
		return cards.map((item) => {
			let uid = this.staticData.uid
			this.staticData.uid++
			return {
				uid: uid,
				card: item
			}
		})
	},

	unwrap_Cards_with_UID: function (cards) {
		return cards.map((item) => {
			return item.card
		})
	},

	wrap_Card_with_UID: function (card) {
		let uid = this.staticData.uid
		this.staticData.uid++
		return {
			uid: uid,
			card: card
		}
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

	switch_DeleteActive: function () {
		this.setData({
			deleteActive: !this.data.deleteActive
		})
	},

	set_DeleteActive: function (active) {
		this.setData({
			deleteActive: active
		})
	},

	delete_Card: function (event) {
		let index = event.currentTarget.dataset.index
		let item = this.staticData.cards.splice(index, 1)
		if (item[0].card.type == 'Collection') {
			app.remove(item[0].card.data.collectionid)
			// this.remove(item[0].card.data.collectionid)
		}
		this.setData({
			cards: this.staticData.cards,
			deleteActive: this.staticData.cards.length === 0 ? false : true
		})
		app.save(this.staticData.collectionid, this.unwrap_Cards_with_UID(this.staticData.cards))
		// console.log(this.data.cards.length)
	},

	open_CardShop: function () {
		if (!this.data.isCardShopOpen) {
			// this.scroll_PageToBottom()
		}
		this.staticData.cardsTemplate = this.staticData.cardsTemplateBlank.filter((item) => {
			return true
		})
		// console.log(JSON.stringify(this.staticData.cardsTemplate))
		this.setData({
			isCardShopOpen: true,
			cardShopList: this.staticData.cardsTemplate,
			// selectedCardIndex: 0,
			deleteActive: false
		})
	},

	close_CardShop: function () {
		this.setData({
			isCardShopOpen: false,
			deleteActive: false
		})
	},

	sync_StaticCards: function () {
		this.staticData.cards = this.data.cards.filter((item) => {
			return true
		})
	},

	select_CardIndex: function (event) {
		this.data.selectedCardIndex = event.detail.current
	},

	add_Card: function () {
		this.close_CardShop()

		let item = this.staticData.cardsTemplate[this.data.selectedCardIndex]
		if (item.type === 'Collection') {
			if (getCurrentPages().length >= 10) {
				// console.log(">>>>>>>>")
				return
			}
			let date = Date.now()
			item.data.collectionid = String(date)
		}
		// this.staticData.cards.push(this.wrap_Card_with_UID(item))
		this.setData({
			['cards[' + this.staticData.cards.length + ']']: this.wrap_Card_with_UID(item)
		})
		this.sync_StaticCards()
		this.scroll_PageToBottom()
		app.save(this.staticData.collectionid, this.unwrap_Cards_with_UID(this.staticData.cards))
	},

	on_CardChanged: function (event) {
		let index = event.detail.idx
		let data = event.detail.data
		// console.log("!!!!!", index, JSON.stringify(data))
		this.staticData.cards[index].card = data
		// console.log(this.staticData.cards)
		app.save(this.staticData.collectionid, this.unwrap_Cards_with_UID(this.staticData.cards))
	},

	on_SelectedCardChanged: function (event) {
		// console.log(">>>>>")
		let index = event.detail.idx
		let data = event.detail.data
		this.staticData.cardsTemplate[index] = data
		// console.log(">>> ", JSON.stringify(this.staticData.cardsTemplate))
		// console.log(this.staticData.cardsTemplate[2] === undefined)
	}
})