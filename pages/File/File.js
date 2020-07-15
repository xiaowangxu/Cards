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

        title: '',
        cards: [],

        deleteActive: false
    },

    staticData: {
        lastPageTop: 0,
        cards: [],
        uid: 0,
    },

    onLoad: function (options) {
        let type = options.type
        let tables = app.globalData.tables
        let uiddata = this.file_Cards_with_UID(tables, type)
        this.staticData.cards = uiddata
        this.setData({
            cards: uiddata,
            title: type
        })
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

    file_Cards_with_UID: function (tables, type) {
        let filecards = []
        for (let collectionid in tables) {
            let table = tables[collectionid]
            // console.log(JSON.stringify(table))
            table.forEach((item, index) => {
                if (item.type === type) {
                    let uid = this.staticData.uid
                    this.staticData.uid++
                    filecards.push({
                        uid: uid,
                        collectionid: collectionid,
                        index: index,
                        card: item
                    })
                }
            })
        }
        return filecards
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

    sync_StaticCards: function () {
        this.staticData.cards = this.data.cards.filter((item) => {
            return true
        })
    },

    on_CardChanged: function (event) {
        let index = event.detail.idx
        let data = event.detail.data
        let card = this.staticData.cards[index]
        let collectionid = card.collectionid
        let idx = card.index
        // console.log(collectionid, idx, data)
        app.globalData.tables[collectionid][idx] = data
        // console.log(app.globalData.tables)
        app.save_Data()
    }
})