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
            data: []
        }]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(">>>>")
        let data = wx.getStorageSync('test')
        this.setData({
            cards: data
        })
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
        this.save()
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
        this.staticData.cards.splice(index, 1)
        this.setData({
            cards: this.staticData.cards,
            // deleteActive: this.staticData.cards.length === 0 ? false : true
        })
        // console.log(this.data.cards.length)
    },

    open_CardShop: function () {
        if (!this.data.isCardShopOpen) {
            // this.scroll_PageToBottom()
        }
        this.staticData.cardsTemplate = this.staticData.cardsTemplateBlank.filter((item) => {return true})
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
        this.staticData.cards.push(this.staticData.cardsTemplate[this.data.selectedCardIndex])
        console.log(this.staticData.cards)
        // console.log(this.staticData.cards)
        this.setData({
            cards: this.staticData.cards
        })
        this.sync_StaticCards()
        this.scroll_PageToBottom()
    },

    on_CardChanged: function (event) {
        let index = event.detail.idx
        let data = event.detail.data
        this.staticData.cards[index] = data
        console.log(this.staticData.cards)
    },

    on_SelectedCardChanged: function (event) {
        let index = event.detail.idx
        let data = event.detail.data
        this.staticData.cardsTemplate[this.data.selectedCardIndex] = data
        // console.log(this.staticData.cardsTemplate)
        // console.log(this.staticData.cardsTemplate[2] === undefined)
    },

    save: function () {
        wx.setStorageSync('test', this.staticData.cards)
    }
})