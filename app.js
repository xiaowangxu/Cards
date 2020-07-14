//app.js
App({
  onLaunch: function () {
    this.load_MainTable()
    wx.getSystemInfo({
      success: res => {
        let menuButtonObject = wx.getMenuButtonBoundingClientRect()
        let statusBarHeight = res.statusBarHeight
        let navHeight = menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2
        this.globalData.navHeight = navHeight
        this.globalData.navButtonHeight = menuButtonObject.height
        this.globalData.navButtonRight = res.windowWidth - menuButtonObject.right
        // console.log(this.globalData.navButtonRight)
        this.globalData.navButtonWidth = menuButtonObject.width
        this.globalData.statusHeight = statusBarHeight
        this.globalData.windowHeight = res.windowHeight
      },
    })
  },

  load_MainTable: function () {
    let storage = wx.getStorageInfoSync()
    if (storage.keys.includes('test')) {
      let data = wx.getStorageSync('test')
      this.globalData.tables['test'] = data
    } else {
      this.globalData.tables['test'] = []
    }
  },

  globalData: {
    userInfo: null,
    navHeight: 0,
    statusHeight: 0,
    windowHeight: 0,
    navButtonHeight: 0,
    navButtonRight: 0,
    navButtonWidth: 0,
    tables: {}
  },

  navigateTo_Table: function (tableid, title, from) {
    let collectionid = String(tableid)
    if (!(collectionid in this.globalData.tables)) { // doesn't exist
      let storage = wx.getStorageInfoSync()
      if (storage.keys.includes(collectionid)) {
        let data = wx.getStorageSync(collectionid)
        this.globalData.tables[collectionid] = data
      } else {
        this.globalData.tables[collectionid] = []
      }
    }
    // console.log(this.globalData.tables)
    // return
    let url = '/pages/Table/Table?collectionid=' + tableid + "&title=" + title + "&from=" + from + "&data=" + JSON.stringify(this.globalData.tables[collectionid])
    wx.navigateTo({
      url: url
    })
  }
})