//index.js
//获取应用实例
var app = getApp();
var mtabW;
const observer = require("../../libs/wechat-weapp-mobx/observer").observer;
const idParse = ['A','B','C','D','E'];
Page(observer({
    props: {
        homeStore: require("../../store/index.js").homeStore,
    },
    data: {
        loadStatus:['loading','loading','loading','loading'],
        tabs: [],//tob标题
        activeIndex: 0,
        slideOffset: 0,
        tabW: 0,
        index:0,
        topView: idParse[0],
        isLogin:false
    },

    onLoad: function () {
        const {
            homeStore
        } = this.props
        var that = this;
        mtabW = app.globalData.windowWidth / 4;  
        homeStore.getTabs().then(result=>{
            homeStore.getVideosList({current:0});
            this.setData({
                tabs:result
            })
        });

        wx.getStorage({
            key: 'userInfo',
            success(res) {
                that.setData({
                    isLogin:true,
                })
            }
        })

        that.setData({
            tabW: mtabW
        });
    },
 
    tabClick: function (e) {
        var index = 0;
        for (var i = 0; i < this.data.tabs.length; i++) {
            if (this.data.tabs[i].id == e.currentTarget.id) {
                index = i
                break
            }
        }
        var offsetW = e.currentTarget.offsetLeft; 
        this.setData({
            activeIndex: index,
            slideOffset: offsetW
        });
    },

    bindChange: function (e) {
        const {
            homeStore
        } = this.props
        var current = e.detail.current;
        var offsetW = current * mtabW;  

        if(homeStore.videosListDatas[current].list.length<=0){
            homeStore.getVideosList({current});
        }
        this.setData({
            activeIndex: current,
            index: current,
            slideOffset: offsetW,
            topView: idParse[this.data.tabs[current].id]
        });
    },
    onshow(){
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                if(self.data.isLogin){
                    return;
                }else{
                    const {
                        homeStore
                    } = self.props
                    self.setData({
                        isLogin:true,
                    })
                    homeStore.getVideosList({current:self.data.activeIndex,pageNo:1});
                }
            }
        })
    },
    _toDetail(e){
        const id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },
    _loadMoreData(e){
        const {
            homeStore
        } = this.props
        let current = e.currentTarget.dataset.current;
        console.log('current',current);
        homeStore.getVideosList({current}).then(result=>{
            let arr =this.data.loadStatus;
            if(!result.more){
                arr[current] = 'noMore'
                this.setData({
                    loadStatus:arr//根据TABID-来判断
                })
            }else{
                arr[current] = 'loading'
                this.setData({
                    loadStatus:arr//根据TABID-来判断
                })
            }
        });
    },
    _like(e){
        return;
        let id = e.currentTarget.dataset.id;
        console.log('eeee',id);
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
            },
            fail(){
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            self.onshow();
                        })
                    }
                })
            }
        })
    },
    _collect(e){
        return;
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
            },
            fail(){
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            self.onshow();
                        })
                    }
                })
            }
        })
    },
    onShareAppMessage() {
        let title ='最新海量韩国流行文化、韩剧、韩综尽在韩剧video';
        let image = '../../images/shareImgs/share.png';
        return {
            title:title,
            imageUrl: image,
            path:'/pages/home/index'
        }
    },
    refresh(){
    //     const {
    //        homeStore
    //    } = this.props
    //    homeStore.getVideosList({current:this.data.activeIndex,pageNo:1})
    },
}))