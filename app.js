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
    tables: {},
    tablelist: []
  },

  load_Tables: function () {
    let storage = wx.getStorageInfoSync()
    if (storage.keys.includes('tables')) {
      let data = wx.getStorageSync('tables')
      this.globalData.tables = data
    } else {
      this.globalData.tables = {Main: []}
    }
    this.update_TableList()
  },

  save: function (collectionid, data) {
    collectionid = String(collectionid)
    if (data.length <= 0) {
      this.remove(collectionid)
      return
    }
    this.globalData.tables[collectionid] = data
    // this.update_TableList()
    this.save_Data()
  },

  remove: function (collectionid) {
    collectionid = String(collectionid)
    delete this.globalData.tables[collectionid]
    // this.update_TableList()
    this.save_Data()
  },

  update_TableList: function () {
    this.globalData.tablelist = []
    for (let collectionid in this.globalData.tables) {
      this.globalData.tablelist.push(String(collectionid))
    }
  },

  save_Data: function () {
    wx.setStorage({
      data: this.globalData.tables,
      key: 'tables',
    })
  },

  navigateTo_Table: function (tableid, title, from) {
    let collectionid = String(tableid)

    this.update_TableList()

    if (!this.globalData.tablelist.includes(collectionid)) {
      this.globalData.tables[collectionid] = []
    }

    let url = '/pages/Table/Table?collectionid=' + collectionid + "&title=" + title + "&from=" + from + "&data=" + JSON.stringify(this.globalData.tables[collectionid])
    wx.navigateTo({
      url: url
    })
  }
})