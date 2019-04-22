// components/component-tag-name.js
const App = getApp()
Component({
    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: 0,
        navgationHeight: 0
    },
    attached() {
        const {
            statusBarHeight = 0, navgationHeight = 0
        } = App.globalData
        this.setData({
            statusBarHeight: statusBarHeight,
            navgationHeight: navgationHeight
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {}
})