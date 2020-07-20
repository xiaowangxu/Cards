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

        isCardShopOpen: false,
        selectedCardIndex: 0,


        cardShopList: [],
        title: '',
        cards: [],


        deleteActive: false
    },

    staticData: {
        collectionid: 'test',
        lastPageTop: 0,
        cards: [],
        uid: 0,
        cardsTemplate: [],
        cardsTemplateBlank: [{
                type: 'Todo',
                start: '',
                end: '',
                data: []
            }, {
                type: 'Picture',
                start: '',
                end: '',
                data: []
            }, {
                type: 'Collection',
                start: '',
                end: '',
                data: {
                    collectionid: 'template',
                    name: ''
                }
            }
            // }, {
            // 	type: 'Notify',
            // 	data: {
            // 		name: '',
            // 		startdate: util.formatDate(startdate, '-'),
            // 		enddate: util.formatDate(enddate, '-'),
            // 		starttime: util.formatTimeOnly(startdate),
            // 		endtime: util.formatTimeOnly(enddate),
            // 		week: [true, true, true, true, true, true, true]
            // 	}
            // }]
        ]
    },

    onLoad: function (options) {
        this.staticData.collectionid = String(options.collectionid)
        let title = options.title
        let data = app.globalData.tables[this.staticData.collectionid]
        if (data !== undefined) {
            // console.log(data)
            let uiddata = this.get_Cards_with_UID(data)
            this.staticData.cards = uiddata
            this.setData({
                cards: uiddata,
                title: title
            })
        } else {
            this.setData({
                title: title
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

    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    },

    tap_Back: function () {
        if (this.data.deleteActive) {
            // console.log("close card shop")
            this.setData({
                deleteActive: false
            })
        } else {
            // console.log("back")
            wx.navigateBack({
                delta: 0,
            })
        }
    },

    tap_Share: function () {
        let sharearray = this.staticData.cards.filter((item) => {
            return item.selected
        })
        // console.log(this.unwrap_Cards_with_UID(sharearray))
        wx.navigateTo({
            url: '../QRcode/QRcode?data=' + JSON.stringify(util.getShareString(this.unwrap_Cards_with_UID(sharearray))),
        })
    },

    get_Cards_with_UID: function (cards) {
        return cards.map((item) => {
            let uid = this.staticData.uid
            this.staticData.uid++
            return {
                uid: uid,
                selected: false,
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
            selected: false,
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
        this.staticData.cards.forEach((item) => {
            item.selected = false
        })
        this.setData({
            deleteActive: !this.data.deleteActive,
            cards: this.staticData.cards
        })
    },

    set_DeleteActive: function (active) {
        this.staticData.cards.forEach((item) => {
            item.selected = false
        })
        this.setData({
            deleteActive: active,
            cards: this.staticData.cards
        })
    },

    select_Card: function (event) {
        let index = event.currentTarget.dataset.index
        this.staticData.cards[index].selected = !this.staticData.cards[index].selected
        this.setData({
            ['cards[' + index + '].selected']: this.staticData.cards[index].selected
        })
    },

    select_AllCards: function () {
        let allselected = true
        this.staticData.cards.forEach((item) => {
            if (!item.selected) {
                allselected = false
            }
        })
        this.staticData.cards.forEach((item) => {
            item.selected = !allselected
        })
        this.setData({
            cards: this.staticData.cards
        })
    },

    delete_Cards: function () {
        let i = 0
        while (i < this.staticData.cards.length) {
            let item = this.staticData.cards[i]
            if (item.selected) {
                let deleteitem = this.staticData.cards.splice(i, 1)
                if (deleteitem[0].card.type == 'Collection') {
                    app.remove(deleteitem[0].card.data.collectionid)
                }
            } else {
                i++
            }
        }
        this.setData({
            cards: this.staticData.cards,
            deleteActive: this.staticData.cards.length === 0 ? false : true
        })
        app.save(this.staticData.collectionid, this.unwrap_Cards_with_UID(this.staticData.cards))
        // console.log(this.data.cards.length)
    },

    sync_StaticCards: function () {
        this.staticData.cards = this.data.cards.filter((item) => {
            return true
        })
    },

    // Card Shop 
    open_CardShop: function () {
        if (!this.data.isCardShopOpen) {
            // this.scroll_PageToBottom()
        }
        this.staticData.cardsTemplate = this.staticData.cardsTemplateBlank.map((item) => {
                let startdate = new Date()
                let enddate = new Date()
                enddate.setTime(enddate.getTime() + 24 * 60 * 60 * 1000)
                item.start = util.formatTime(startdate)
                item.end = util.formatTime(enddate)
                return item
        })
        console.log(JSON.stringify(this.staticData.cardsTemplate))
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

    select_CardIndex: function (event) {
        this.data.selectedCardIndex = event.detail.current
    },

    add_Card: function () {
        this.close_CardShop()

        let item = this.staticData.cardsTemplate[this.data.selectedCardIndex]
        console.log(item)
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
        let index = event.detail.idx
        let data = event.detail.data
        this.staticData.cardsTemplate[index] = data
    }
})