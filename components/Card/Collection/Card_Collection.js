// components/Card_Text.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        idx: {
            type: Number,
            value: -1,
        },
        data: {
            type: Object,
            value: {
                collectionid: 'unknown',
                name: '123456'
            },
        }
    },

    lifetimes: {
        attached: function () {
            let date = Date.now()
            // console.log(this.properties.data.collectionid)
            if (this.properties.data.collectionid === 'unknown') {
                this.setData({
                    'data.collectionid': String(date)
                })
            }
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Collection',
                    data: this.properties.data
                }
            }, {})
            // console.log(this.properties.data)
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        imageList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        preventTap: function () {
            console.log(">>>>")
            return false
        },

        input: function (event) {
            let value = event.detail.value
            this.setData({
                'data.name': value
            })
        },

        blur: function () {
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Collection',
                    data: this.properties.data
                }
            }, {})
        },

        tap: function () {
            if (this.properties.data.collectionid !== 'template' && this.properties.data.collectionid !== 'unknown') {
                let url = '../../../Table?collectionid=' + this.properties.data.collectionid
                wx.navigateTo({
                    url: url
                })
            }
        }

    }
})