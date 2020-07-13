// pages/Table.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusHeight: getApp().globalData.statusHeight,
        navHeight: getApp().globalData.navHeight,
        navButtonHeight: getApp().globalData.navButtonHeight,

        isCardShopOpen: false,
        selectedCardIndex: 0,


        cardShopList: [],

        cards: [],


        deleteActive: false
    },

    staticData: {
        collectionid: 'test',
        lastPageTop: 0,
        cards: [],
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
        let storage = wx.getStorageInfoSync()
        if (storage.keys.includes(options.collectionid)) {
            let data = wx.getStorageSync(options.collectionid)
            this.setData({
                cards: data,
                selectedCardIndex: 0
            })
        } else {
            this.setData({
                selectedCardIndex: 0
            })
        }
        this.sync_StaticCards()
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
        console.log(">>>>>")
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
        if (item[0].type == 'Collection') {
            this.remove(item[0].data.collectionid)
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
        console.log(this.data.selectedCardIndex, this.staticData.cardsTemplate, this.staticData.cardsTemplate[this.data.selectedCardIndex])
        let item = this.staticData.cardsTemplate[this.data.selectedCardIndex]
        if (item.type === 'Collection') {
            item.data.collectionid = 'unknown'
        }
        this.staticData.cards.push(item)
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
        this.staticData.cards[index] = data
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
        if (this.staticData.cards.length <= 0) {
            this.remove(this.staticData.collectionid)
            return
        }
        wx.setStorage({
            key: this.staticData.collectionid,
            data: this.staticData.cards,
            success(res) {
                console.log(res)
            }
        })
    },

    remove: function (id) {
        let storage = wx.getStorageInfoSync()
        // console.log(storage.keys, id)
        if (storage.keys.includes(String(id))) {
            wx.removeStorage({
                key: String(id),
                success(res) {
                    console.log(res)
                }
            })
        }
    }
})