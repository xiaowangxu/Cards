// components/Card_Text.js
Component({
    options: {
		addGlobalClass: true
	},
    /**
     * 组件的属性列表
     */
    properties: {
        idx: {
            type: Number,
            value: -1,
        },
        start: {
            type: String,
            value: 'unknown'
        },
        end: {
            type: String,
            value: 'unknown'
        },
        week: {
            type: Array,
            value: [true, true, true, true, true, true, true]
        },
        data: {
            type: Object,
            value: {
                title: '',
                passage: '',
                path: ''
            },
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        inputdata: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        input: function(event) {
            let value = event.detail.value
            this.setData({
                ['data.title']: value
            })
        },

        textarea: function(event) {
            let value = event.detail.value
            // console.log(value)
            this.setData({
                ['data.passage']: value
            })
        },

        blur: function(event) {
            this.triggerEvent('datachange', {idx: this.properties.idx, data: {type: 'Passage',start: this.properties.start, end: this.properties.end, week: this.properties.week, data: this.properties.data}}, {})
        },

        change_Time: function () {
            this.triggerEvent('timechange', {idx: this.properties.idx}, {})
        }   
    }
})