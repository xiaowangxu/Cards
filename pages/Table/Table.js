// pages/Table.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.staticData.collectionid = options.collectionid
        let title = options.title
        // let from = options.from
        // let data = JSON.parse(options.data)
        // console.log(table)
        let data = app.globalData.tables[this.staticData.collectionid]
        let uiddata = this.get_Cards_with_UID(data)
        this.staticData.cards = uiddata
        this.setData({
            cards: uiddata,
            selectedCardIndex: 0,
            title: title
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
        // console.log(">>>>>")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            deleteActive: false
        })
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

    back: function () {
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
            this.remove(item[0].card.data.collectionid)
        }
        this.setData({
            cards: this.staticData.cards,
            // deleteActive: this.staticData.cards.length === 0 ? false : true
        })
        this.save()
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
        this.save()
    },

    on_CardChanged: function (event) {
        let index = event.detail.idx
        let data = event.detail.data
        // console.log("!!!!!", index, JSON.stringify(data))
        this.staticData.cards[index].card = data
        // console.log(this.staticData.cards)
        this.save()
    },

    on_SelectedCardChanged: function (event) {
        // console.log(">>>>>")
        let index = event.detail.idx
        let data = event.detail.data
        this.staticData.cardsTemplate[index] = data
        // console.log(">>> ", JSON.stringify(this.staticData.cardsTemplate))
        // console.log(this.staticData.cardsTemplate[2] === undefined)
    },

    save: function () {
        let collectionid = String(this.staticData.collectionid)
        if (this.staticData.cards.length <= 0) {
            this.remove(collectionid)
            delete app.globalData.tables[collectionid]
            return
        }
        let cards = this.unwrap_Cards_with_UID(this.staticData.cards)
        app.globalData.tables[collectionid] = cards
        wx.setStorage({
            key: collectionid,
            data: cards,
            success(res) {
                console.log(res)
            }
        })
    },

    remove: function (id) {
        let collectionid = String(this.staticData.collectionid)
        delete app.globalData.tables[collectionid]
        let storage = wx.getStorageInfoSync()
        if (storage.keys.includes(collectionid)) {
            wx.removeStorage({
                key: collectionid,
                success(res) {
                    console.log(res)
                }
            })
        }
    }
})