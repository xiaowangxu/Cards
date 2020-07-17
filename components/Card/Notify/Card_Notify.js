// components/Card_Text.js
Component({

    options: {
		addGlobalClass: true
	},
    /**
     * 组件的属性列表
     */
    properties: {
        idx:{
            type: Number,
            value: -1,
        },
        data: {
            type: Object,
            value: {
				name: '',
				startdate: '',
				enddate: '',
				starttime: '00:00',
				endtime: '23:59',
				week: [true, true,true, true, true, true, true]
			}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        week: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    },

    /**
     * 组件的方法列表
     */
    methods: {
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
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        },

        switch_Week: function (event) {
            let index = event.currentTarget.dataset.index
            this.setData({
                ['data.week[' + index + ']'] : !this.properties.data.week[index]
            })
            // console.log(this.properties.data)
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        },

        change_Starttime: function (event) {
            let time = event.detail.value
            this.setData({
                ['data.starttime'] : time
            })
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        },

        change_Endtime: function (event) {
            let time = event.detail.value
            this.setData({
                ['data.endtime'] : time
            })
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        },
        change_Startdate: function (event) {
            let date = event.detail.value
            this.setData({
                ['data.startdate'] : date
            })
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        },

        change_Enddate: function (event) {
            let date = event.detail.value
            this.setData({
                ['data.enddate'] : date
            })
            this.triggerEvent('datachange', {
                idx: this.properties.idx,
                data: {
                    type: 'Notify',
                    data: this.properties.data
                }
            }, {})
        }
    }
})