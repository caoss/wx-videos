const observer = require("../../libs/wechat-weapp-mobx/observer").observer;
// pages/home.js
Page(observer({
    props: {
        homeStore: require("../../store/index.js").homeStore,
    },
    data: {
        loadStatus: 'loading',
        scrollTop:0,
        id:'',
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
        console.log(data);
        const {
            homeStore
        } = this.props
        let id = data.id;
        this.setData({
            id:id
        })
        homeStore.getVideoDetail({id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id}).then(result=>{
            wx.hideLoading();
        });
    },
    /* 页面卸载钩子 */
    onUnload() {},
    _toDetail(e) {
        const {
            homeStore
        } = this.props
        let id = e.currentTarget.dataset.id;
        homeStore.getVideoDetail({id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id}).then(result=>{
            wx.hideLoading();
        });
        this.setData({
            scrollTop:0
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
    onshow(){
        const {
            homeStore
        } = this.props
        homeStore.getVideoDetail({id:this.data.id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id:this.data.id}).then(result=>{
            wx.hideLoading();
        });
    },
    _like(e){
        console.log('eee',e);
        let { id,liked } = e.currentTarget.dataset;
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
                homeStore.like({id,liked})
            },
            fail(){
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            homeStore.like({id,liked}).then(result=>{
                                self.onshow();
                            })
                        })
                    }
                })
            }
        })
    },
    _collect(e){
        console.log('eee',e);
        let { id,collected } = e.currentTarget.dataset;
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                homeStore.collect({id,collected}).then(result=>{
                    if(collected){
                        wx.showToast({
                            title: "从收藏页面移除",
                        })
                    }else{
                        wx.showToast({
                            title: "已加到收藏页面",
                        })
                    }
                });
            },
            fail(){
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            homeStore.collect({id,collected}).then(result=>{
                                self.onshow();
                            })
                        })
                    }
                })
            }
        })
    }
}))