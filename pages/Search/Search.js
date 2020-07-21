const app = getApp()
const util = require("../../utils/util.js")

// pages/Search/Search.js
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

        testData: '',
        cards: []
    },

    staticData: {
        lastPageTop: 0,
        cards: [],
        uid: 0,
        type: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    tap_To: function (event) {
        wx.navigateTo({
            url: '../Table/Table?collectionid=' + event.currentTarget.dataset.collectionid + '&title=' + event.currentTarget.dataset.title,
        })
    },

    search: function (event) {
        let keyword = event.detail.value
        if (keyword === '') {
            this.staticData.cards = []
            this.setData({
                cards: []
            })
        } else {
            let tables = app.globalData.tables
            let uiddata = this.search_Cards_with_UID(tables, keyword, this.get_MainAndCourseCollectionID())
            this.staticData.cards = uiddata
            this.setData({
                cards: uiddata
            })
        }
    },

    get_MainAndCourseCollectionID: function () {
        let array = [{
            collectionid: 'Main',
            path: '主页'
        }]
        let courses = app.globalData.courses
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i]
            array.push({
                collectionid: course.name,
                path: course.name
            })
        }
        return array
    },


    search_Cards_with_UID: function (tables, keyword, list = [{
        collectionid: 'Main',
        path: '主页',
        name: '主页'
    }]) {
        let filecards = []
        for (let t = 0; t < list.length; t++) {
            let checktable = list[t]
            let subtable = []
            let pathtable = []
            let nametable = []
            subtable.push(checktable.collectionid)
            pathtable.push(checktable.path)
            nametable.push(checktable.path)
            while (subtable.length > 0) {
                let collectionid = subtable.pop()
                let path = pathtable.pop()
                let name = nametable.pop()
                let samelayer = false
                if (tables[collectionid] === undefined) continue
                let table = tables[collectionid]
                for (let i = 0; i < table.length; i++) {
                    let item = table[i]
                    if (util.searchCard(item, keyword)) {
                        if (!samelayer) {
                            let uid = this.staticData.uid
                            this.staticData.uid++
                            filecards.push({
                                uid: uid,
                                card: {
                                    type: 'text',
                                    text: path,
                                    title: name,
                                    collectionid: collectionid
                                }
                            })
                            samelayer = true
                        }
                        let uid = this.staticData.uid
                        this.staticData.uid++
                        filecards.push({
                            uid: uid,
                            collectionid: collectionid,
                            index: i,
                            card: item
                        })
                    }
                    if (item.type === 'Collection') {
                        subtable.push(item.data.collectionid)
                        pathtable.push(path + " + " + item.data.name)
                        nametable.push(item.data.name)
                    }
                }
            }
        }
        return filecards
    },

    load_ToMain: function (card) {
		// console.log(">>> Load", res)
		let that = this
		wx.showModal({
			title: '添加卡片',
			content: '不存在目标集合，是否添加至随手记？',
			success(con) {
				if (con.confirm) {
                    if (app.globalData.tables['Main'] === undefined) {
                        app.globalData.tables['Main'] = []
                    }
					app.globalData.tables['Main'].push(card)
                    app.save_Date()
				}
			}
		})
	},

    tap_Scan: function () {
        let that = this
        wx.scanCode({
            onlyFromCamera: false,
            success(res) {
                let data = JSON.parse(res.result)
                if (data['1'] === 'cards') {
                    let item = util.parseShareString(data['2'])
                    if (app.globalData.tables[item.collectionid] === undefined) {
                        wx.show
                        that.load_ToMain(item.card)
                    }
                    else {
                        wx.showToast({
                          title: '添加成功',
                          icon: 'success'
                        })
                        app.globalData.tables[item.collectionid].push(item.card)
                        app.save_Date()
                        
                    }
                }
                else {
                    wx.showToast({
                        title: '二维码无效',
                        icon: 'none'
                    })
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