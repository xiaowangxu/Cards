// components/CourseTable/CourseTable.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        courses: {
            type: Array,
            value: [{
                name: '汇编语言程序设计',
                week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                times: [{
                    day: 1,
                    timestart: 11,
                    timeend: 13
                }, {
                    day: 3,
                    timestart: 6,
                    timeend: 8
                }],
                color: 'tomato',
                prrperty: {}
            },{
                name: '组合数学',
                week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                times: [{
                    day: 1,
                    timestart: 6,
                    timeend: 8
                }],
                color: '#11aa45',
                prrperty: {}
            },{
                name: '形势与政策',
                week: [1, 6],
                times: [{
                    day: 3,
                    timestart: 11,
                    timeend: 12
                }],
                color: '#3466cc',
                prrperty: {}
            },{
                name: '操作系统(1)',
                week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                times: [{
                    day: 2,
                    timestart: 7,
                    timeend: 8
                },{
                    day: 4,
                    timestart: 1,
                    timeend: 2
                },{
                    day: 4,
                    timestart: 3,
                    timeend: 4
                }],
                color: '#cc3466',
                prrperty: {}
            },{
                name: '计算机图形学',
                week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                times: [{
                    day: 2,
                    timestart: 11,
                    timeend: 13
                },{
                    day: 5,
                    timestart: 7,
                    timeend: 8
                }],
                color: 'chocolate',
                prrperty: {}
            },{
                name: '计算机网络',
                week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                times: [{
                    day: 1,
                    timestart: 1,
                    timeend: 2
                },{
                    day: 1,
                    timestart: 3,
                    timeend: 4
                },{
                    day: 3,
                    timestart: 1,
                    timeend: 2
                },{
                    day: 3,
                    timestart: 3,
                    timeend: 4
                }],
                color: 'teal',
                prrperty: {}
            }]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentCourse: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tap_Course: function (event) {
            let name = event.currentTarget.dataset.coursename
            getApp().navigateTo_Table(name, name, '课程表')
        }
    }
})