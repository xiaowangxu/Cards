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
        type: ''
    },

    onLoad: function (options) {
        let type = options.type
        this.staticData.type = type
        let tables = app.globalData.tables
        // console.log(type)
        // console.log(tables)
        let uiddata = this.file_Cards_with_UID(tables, type, this.get_MainAndCourseCollectionID())
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
        console.log(">>>>")
        let uiddata = this.file_Cards_with_UID(app.globalData.tables, this.staticData.type, this.get_MainAndCourseCollectionID())
        this.staticData.cards = uiddata
        this.setData({
            cards: uiddata
        })
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    },

    get_MainAndCourseCollectionID: function () {
        let array = [{
            collectionid: 'Main',
            path: '随手记'
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

    file_Cards_with_UID: function (tables, type, list = [{
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
                    if (item.type === type) {
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
        // for (let collectionid in tables) {
        //     let table = tables[collectionid]
        //     // console.log(JSON.stringify(table))
        //     table.forEach((item, index) => {
        //         if (item.type === type) {
        //             let uid = this.staticData.uid
        //             this.staticData.uid++
        //             filecards.push({
        //                 uid: uid,
        //                 card: {
        //                     type: 'text',
        //                     text: collectionid
        //                 }
        //             })
        //             filecards.push({
        //                 uid: uid,
        //                 collectionid: collectionid,
        //                 index: index,
        //                 card: item
        //             })
        //         }
        //     })
        // }
        return filecards
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