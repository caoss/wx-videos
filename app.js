//app.js
const observer = require('./libs/wechat-weapp-mobx/observer').observer
const http = require('./utils/http.js')

App(
    observer({
        props: {
            homeStore: require('./store/index.js').homeStore
        },
        onLaunch: function() {
            const {
                homeStore
            } = this.props
            const self = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    http.setHeader({'Authorization':'userId=' + res.data.aliasId});
                },
            })
            const sysInfo = wx.getSystemInfo({
                success(res) {
                    let statusBarHeight = res.statusBarHeight
                    let totalTopHeight = 68
                    if (res.model.indexOf('iPhone X') !== -1) {
                        totalTopHeight = 88
                    } else if (res.model.indexOf('iPhone') !== -1) {
                        totalTopHeight = 64
                    }
                    let navgationHeight = totalTopHeight - statusBarHeight
                    self.globalData = Object.assign({}, self.globalData, {
                        statusBarHeight,
                        navgationHeight,
                        ...res
                    })
                },
                fail(err) {
                    console.log('err-----------------------', err)
                    self.globalData = Object.assign({}, self.globalData, {
                        statusBarHeight: 0,
                        navgationHeight: 0
                    })
                }
            })
        },
        userData: {
            loading: true
        },
        globalData: {
        }
    })
)