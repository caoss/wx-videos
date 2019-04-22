const observer = require("../../libs/wechat-weapp-mobx/observer").observer;
const app = getApp()

// pages/home.js
Page(observer({
    props: {
        homeStore: require("../../store/index.js").homeStore,
    },
    data: {
        loadStatus: 'loading',
        isLogin:false,
        isNoData:false,
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
    /* 页面渲染完成钩子 */
    onLoad(data) {
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录',res);
                homeStore.getCollectData().then(result=>{
                    if(!result.more){
                        self.setData({
                            loadStatus:'noMore',
                        })
                    }
                    self.setData({
                        isNoData:(result.total<=0),
                    })
                });
                self.setData({
                    isLogin:true,
                })
            }
        })
    },
    onShow:function(){
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                const {
                    homeStore
                } = self.props
                self.setData({
                    isLogin:true,
                })
                homeStore.getCollectData({ pageNo:1 }).then(result=>{
                    if(!result.more){
                        self.setData({
                            loadStatus:'noMore',
                        })
                    }
                    self.setData({
                        isNoData:(result.total<=0),
                    })
                });
                return;
                if(self.data.isLogin){//已经登录，之前也已经登录了
                    return;
                }else{
                    const {
                        homeStore
                    } = self.props
                    self.setData({
                        isLogin:true,
                    })
                    homeStore.getCollectData({ pageNo:1 });
                }
            }
        })
    },
      
    /* 页面卸载钩子 */
    onUnload() {},
  
    _loadMoreData(e) {
        console.log(123);
    },

    _click(){
        wx.switchTab({
            url: '/index'
          })
    },

    _toDetail(e){
        const id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },
    redirect_neets(){
        wx.navigateToMiniProgram({
            appId:'wxf3f963b724069c29',
            success(){
                console.log('打开成功')
            }
        })
    },
    _loadMoreWallPaper(){
        const {
            homeStore
        } = this.props
        homeStore.getCollectData().then(result=>{
            if(!result.more){
                this.setData({
                    loadStatus:'noMore'
                })
            }
        });
    },
    getUserInfoFun(){
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
                            console.log('forLogin');
                            self.onShow();
                        })
                    }
                })
            }
        })
    }
}))