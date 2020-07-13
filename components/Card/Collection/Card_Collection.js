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
                getApp().navigateTo_Table(this.properties.data.collectionid, this.properties.data.name)
            }
        }

    }
})