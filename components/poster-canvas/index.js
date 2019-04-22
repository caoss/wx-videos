// components/component-tag-name.js
const App = getApp()
var Rpx = parseFloat((App.globalData.windowWidth / 375).toFixed(2))

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        posterData: {
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}// 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        height: {
            type: Number,
            value: 1000
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        posterContext: null,
        canvasHeight: 0,
        canvasWidth: 0,
    },
    ready() {
        const { posterData={} } = this.data
        const that = this
        const query = wx.createSelectorQuery()
        const ctx = wx.createCanvasContext("poater-canvas",this)
        this.data.posterContext = ctx

        query.in(this)
        query.select('#poater-canvas-con').boundingClientRect(function (res) {
            const canvasW = res && res.width ? res.width:0
            const canvasH = res && res.height ? res.height : 0
            that.data.canvasWidth = canvasW
            that.data.canvasHeight = canvasH

            wx.getImageInfo({
                src: posterData.imageUrl ? posterData.imageUrl : '',
                success(dat) {
                    let imgW = dat.width
                    let imgH = dat.height
                    let dx = 0
                    let dy = 0
                    let imgRatio = imgW / imgH
                    let canvasRatio = canvasW / canvasH

                    if(imgRatio >= canvasRatio) {
                        imgW = imgRatio * canvasH
                        imgH = canvasH
                        dx = (imgW - canvasW) / 2
                    } else {
                        imgH = canvasW / imgRatio  
                        imgW = canvasW
                        dy = (imgH - canvasH) / 2
                    }

                    that.generatePoster(ctx, {
                        image: { path: dat.path, width: imgW, height: imgH, dx: dx, dy: dy},    
                        ...that.data.posterData
                    })
                    // console.log(canvasH, imgW, imgH)
                }
            }) 
        }).exec()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        generatePoster(ctx,data) {
            ctx.drawImage(data.image.path, -data.image.dx, -data.image.dy, data.image.width, data.image.height)
            
            // ctx.fillText(data.text, 20, 20)
            this.drawDate(ctx)
            ctx.draw()
        },
        drawDate(ctx) {
            let time = new Date().toDateString().split(' ');
            let cx = this.data.canvasWidth
            let cy = this.data.canvasHeight
            let dFontSize = parseInt( Rpx * 48)
            let dLineHeight = dFontSize * 1.2
            let dY = parseInt(64 * Rpx)
            let dX = 16 * Rpx
            ctx.font = 'normal bold ' + dFontSize + 'px/' + dLineHeight + ' Roboto-Bold'
            console.log(time)
            ctx.setTextAlign('left')
            ctx.setFillStyle('#FFF')
            ctx.fillText(time[2], dX, dY)

            let mFontSize = parseInt(Rpx * 18)
            let mLineHeight = mFontSize * 1.2
            let mX = 16 * Rpx + this.getTextWidth(ctx, time[2])
            ctx.font = 'normal normal ' + mFontSize + 'px/' + mLineHeight + ' Roboto';
            ctx.fillText(time[1], mX, dY)

            let lineLen = mX + this.getTextWidth(ctx, time[1])
            let lineY = dY + Rpx * 10

            ctx.setLineWidth(1)
            ctx.setStrokeStyle('#FFF')
            ctx.moveTo(dX, lineY)
            ctx.lineTo(dX + lineLen, lineY)
            ctx.stroke()

            let wFontSize = parseInt(Rpx * 12)
            let wLineHeight = mFontSize
            let wY = 94 * Rpx
            ctx.font = 'normal normal ' + wFontSize + 'px/' + wLineHeight + ' Roboto';
            ctx.fillText(time[0], dX, wY)

            let fX = dX + 7 * Rpx + this.getTextWidth(ctx, time[0])
            // ctx.font = 'normal normal ' + wFontSize + 'px/' + wLineHeight + ' Roboto';
            ctx.fillText('/', fX, wY)            
            
            let yFontSize = parseInt(Rpx * 12)
            let yLineHeight = yFontSize
            let yX = fX + 7 * Rpx + this.getTextWidth(ctx,'/')
            ctx.font = 'normal normal ' + wFontSize + 'px/' + wLineHeight + ' Roboto';
            ctx.fillText(time[3], yX, wY)

        },
        getTextWidth(ctx,text) {
            let width = ctx.measureText(text).width
            console.log(width)
            return width
        },
        _tapDownload(e) {
            wx.canvasToTempFilePath({
                canvasId: 'poater-canvas',
                x: 0,
                y: 0,
                width: this.data.canvasWidth,
                height: this.data.canvasHeight,
                success(res) {
                    console.log('tempFilePath', res)
                    const url = res.tempFilePath
                    wx.showLoading({
                        title: '正在下载...',
                        mask: true
                    })
                    wx.getImageInfo({
                        src: url,
                        success(res) {
                            // console.log('res-----------',res)
                            wx.saveImageToPhotosAlbum({
                                filePath: res.path,
                                success(res) {
                                    wx.showToast({
                                        title: "下载完成"
                                    })
                                    // console.log('res1-----------', res)
                                },
                                fail(err) {
                                    wx.showToast({
                                        title: "下载失败",
                                        image: '../../images/download_fail_white.png',
                                    })
                                    //  console.log('err-----------', err)
                                }
                            })
                        },
                        fail(err) {
                            wx.showToast({
                                title: "下载失败",
                                image: '../../images/download_fail_white.png',
                            })
                        }
                    })                    
                },
                fail(err) {
                    console.log('err-----------', err)
                }
            }, this)
        }
    }
})