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
        list: {
            type: Array,
            value: [{text: 'Hello', finish: false},{text: 'World', finish: false},{text: '!!!', finish: false}],
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
            let index = event.currentTarget.dataset.itemindex
            let value = event.detail.value
            let item = "list["+index+"].text"
            this.setData({
                [item]: value
            })
        },

        blur: function(event) {
            let newlist = this.properties.list.filter((item) => {return item.text === '' ? false : true})
            // console.log(newlist)
            this.setData({
                list: newlist,
                inputdata: ''
            })
            this.triggerEvent('datachange', {idx: this.properties.idx, data: {type: 'Todo',start: this.properties.start, end: this.properties.end, week: this.properties.week, data: this.properties.list}}, {})
        },

        has: function (value) {
            for (let i = 0; i< this.properties.list.length; i++) {
                let item = this.properties.list[i].text
                if (item === value) {
                    return true
                }
            }
            return false
        },

        add: function(event) {
            let value = event.detail.value
            
            if (value === '') return
            if (this.has(value)) return
            
            let newlist = this.properties.list
            newlist.push({text: value, finish: false})
            // console.log(newlist)
            this.setData({
                list: newlist,
                inputdata: ''
            })
            this.triggerEvent('datachange', {idx: this.properties.idx, data: {type: 'Todo',start: this.properties.start, end: this.properties.end, week: this.properties.week, data: this.properties.list}}, {})
        },

        switch_active: function (event) {
            let index = event.currentTarget.dataset.itemindex
            let value = this.properties.list[index].finish
            let item = "list["+index+"].finish"
            this.setData({
                [item]: !value,
                innerText: 666
            })
            this.triggerEvent('datachange', {idx: this.properties.idx, data: {type: 'Todo',start: this.properties.start, end: this.properties.end, week: this.properties.week, data: this.properties.list}}, {})
        },

        change_Time: function () {
            this.triggerEvent('timechange', {idx: this.properties.idx}, {})
        }    
    }
})