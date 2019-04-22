// components/component-tag-name.js
const App = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer(newVal, oldVal, changedPath) {

            }
        },
        showBack: {
            type: Boolean,
            value: true,
        },
        backgroundColor: {
            type: String,
            value: '',
        },
        left: {
            type: Object,
            value: null,
        },
        type: {
            type: Number,
            value: 0,
        },
        leftIcon: {
            type: String,
            value: '../../images/back.png',
        },
        titleIcon: {
            type: String,
            value: null,
        },
        titleIconR: {
            type: Boolean,
            value: false
        },
        showLeft: {
            type: Boolean,
            value: true
        },
        setColor:{
            type:String,
            value:'',  
        } 
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: 0,
        navgationHeight: 0,
        showClean:false,
        inputValue:'',
    },

    created() {

    },

    attached() {
        // console.log(this.data)
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
    methods: {
        _goBack() {
            wx.navigateBack({
                delta: 1
            })
        },
        _leftIconTap() {
            this.triggerEvent('onLeftTap')
        },
        _titleTap() {
            this.triggerEvent('onTitleTap')
        },
        _bindconfirm(e){
            this.triggerEvent('onBindconfirm',e)
        },
        _bindInput(e){
            console.log(e);
            let value = e.detail.value;
            this.setData({
                showClean:value.length>0
            })
        },
        _clean(e){
            console.log('clean');
            this.setData({
                inputValue:'',
            })
            this.triggerEvent('onBindconfirm',e)
        },
       
    }
})
