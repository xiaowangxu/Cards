// pages/Table.js
const app = getApp()

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
        this.staticData.collectionid = 'Main'
        let title = '课程表'
        let data = app.globalData.tables['Main']
        let uiddata = this.get_Cards_with_UID(data)
        this.staticData.cards = uiddata
        this.setData({
            cards: uiddata,
            selectedCardIndex: 0,
            title: title
        })
    },

    onReady: function () {
    },

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

    tap_Setting: function () {
        console.log(">> Setting")
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
            // deleteActive: this.staticData.cards.length === 0 ? false : true
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
        // console.log(this.data.selectedCardIndex, this.staticData.cardsTemplate, this.staticData.cardsTemplate[this.data.selectedCardIndex])
        let item = this.staticData.cardsTemplate[this.data.selectedCardIndex]
        if (item.type === 'Collection') {
            if (getCurrentPages().length >= 10) {
                // console.log(">>>>>>>>")
                return
            }
            let date = Date.now()
            item.data.collectionid = String(date)
        }
        this.staticData.cards.push(this.wrap_Card_with_UID(item))
        // console.log(this.staticData.cards)
        // console.log(this.staticData.cards)
        this.setData({
            cards: this.staticData.cards
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