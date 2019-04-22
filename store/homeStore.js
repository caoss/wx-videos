const mobx = require('../libs/wechat-weapp-mobx/mobx')
const extendObservable = mobx.extendObservable
const http = require('../utils/http.js')
const EvnConst = require('../configs/EvnConst.js')
const ApiConst = require('../configs/ApiConst.js')
const mData = require('../common/data.js')

const DOMAIN = EvnConst.default.apiHost
const UCHOST = EvnConst.default.ucHost

const homeStore = function() {
    extendObservable(this, {
        tabs:[],
        videosListDatas:[
            {
                list: [],
                total: 0,
                more: true,
                pageNo: 1,
                orderBy:'',
                sortType:''
            },
            {
                list: [],
                total: 0,
                more: true,
                pageNo: 1,
                orderBy:'',
                sortType:''
            },
            {
                list: [],
                total: 0,
                more: true,
                pageNo: 1,
                orderBy:'',
                sortType:''
            },
            {
                list: [],
                total: 0,
                more: true,
                pageNo: 1,
                orderBy:'',
                sortType:''
            }
        ],
        collectListDatas:{
            list: [],
            total: 0,
            more: true,
            pageNo: 1,
        },
        videoRelative:[],
        videoDetail:{},
        getVideosList(params = {}) {
            wx.showLoading({
                title: '',
                mask: true
            });
            let {
                pageNo, pageSize=10,current
            } = params

            console.log(current);
            
            let timestamp = Date.parse(new Date())
            let tabId = this.tabs[current].id;
            if(!pageNo){
                pageNo = this.videosListDatas[current].pageNo;
            };
            let orderBy ='',sortType='';
            if(pageNo>1){
                orderBy = this.videosListDatas[current].orderBy;
                sortType = this.videosListDatas[current].sortType;
            }
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_LIST,{pageNo,pageSize,tabId,timestamp,orderBy,sortType}).then(result => {
                    console.log(result);
                    wx.hideLoading();
                    if (pageNo === 1) {
                        this.videosListDatas[current] = {
                            list:result.list,
                            total: result.total,
                            more: result.more,
                            pageNo: pageNo + 1,
                            orderBy:result.orderBy,
                            sortType:result.sortType
                        }
                        console.log('videosListDatas',this.videosListDatas);
                    }else{
                        this.videosListDatas[current].list =  this.videosListDatas[current].list.concat(result.list);
                        this.videosListDatas[current].total = result.total;
                        this.videosListDatas[current].more = result.more;
                        this.videosListDatas[current].pageNo = pageNo + 1;
                        this.videosListDatas[current].orderBy = result.orderBy;
                        this.videosListDatas[current].sortType = result.sortType;
                    }
                    r(result);
                });
            })
           
        },
        
        getTabs() {
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_TABS).then(result => {
                    this.tabs = result;
                    r(result);
                });
            })
           
        },
        getVideoDetail(params = {}) {
            let {
                id 
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_DETAIL,{ videoId:id } ).then(result => {
                    this.videoDetail = result;
                    r(result);
                });
            })
        },
        getVideoRelative(params = {}) {
            let {
                id 
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_RELATIVE,{ videoId:id } ).then(result => {
                    this.videoRelative = result;
                    r(result);
                });
            })
        },
        getCollectData(params = {}) {
            let { pageNo= this.collectListDatas.pageNo , pageSize=10 } =  params;
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.COLLECT_DATA,{pageNo,pageSize}).then(result => {
                    console.log(result);
                    if (pageNo === 1) {
                        this.collectListDatas = {
                            list:result.list,
                            total: result.total,
                            more: result.more,
                            pageNo: pageNo + 1,
                            orderBy:result.orderBy,
                            sortType:result.sortType
                        }
                    }else{
                        this.collectListDatas.list =  this.collectListDatas.list.concat(result.list);
                        this.collectListDatas.total = result.total;
                        this.collectListDatas.more = result.more;
                        this.collectListDatas.pageNo = pageNo + 1;
                    }

                    wx.hideLoading();
                    r(result);
                });
            })
        },
        loginStep( params = {} ){

            return new Promise((r, j) => {
                wx.login({
                    success(res) {
                        http.post(UCHOST + ApiConst.default.LOGIN_STEP1,{ "code":res.code,miniType:'1' } ).then(result => {
                            let { thirdSessionKey } = result;
                            let { rawData,signature,encryptedData,iv } = params;
                            http.post(UCHOST + ApiConst.default.LOGIN_STEP2,{ rawData,signature,encryptedData,iv,thirdSessionKey,miniType:1 } ).then(response => {
                                console.log(response);//得到response保存到本地
                                http.setHeader({'Authorization':'userId=' + response.aliasId });
                                wx.setStorage({
                                    key: 'userInfo',
                                    data: response
                                })
                                r(response);
                            });
                        });
                    }
                })
            })

        },


        like( params = {}  ){
            let {
                id , liked
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                let url = '';
                if(liked){
                    url = DOMAIN + ApiConst.default.CANCEL_LIKE
                }else{
                    url = DOMAIN + ApiConst.default.LIKE
                }
                http.post(url,{ videoId:id } ).then(result => {
                    if(liked){
                        this.videoDetail.likeCount = this.videoDetail.likeCount-1;
                    }else{
                        this.videoDetail.likeCount = this.videoDetail.likeCount-0+1;
                    }
                    this.videoDetail.liked = !this.videoDetail.liked;
                    wx.hideLoading();
                    r(!liked);
                });
            })
        },
        collect(params = {}){
            let {
                id , collected
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                let url = '';
                if(collected){
                    url = DOMAIN + ApiConst.default.CANCEL_COLLECT
                }else{
                    url = DOMAIN + ApiConst.default.COLLECT
                }
                http.post(url,{ videoId:id } ).then(result => {
                    if(collected){
                        this.videoDetail.collectCount = this.videoDetail.collectCount-1;
                    }else{
                        this.videoDetail.collectCount = this.videoDetail.collectCount-0+1;
                    }
                    this.videoDetail.collected = !this.videoDetail.collected;
                    wx.hideLoading();
                    r(!collected);
                });
            })
        }
        
    })
}

module.exports = homeStore