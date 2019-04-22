// components/component-tag-name.js
const App = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        swipeVelocity: {
            type: Number,
            value: 1500
        },
        swipeThreshold: {
            type: Number,
            value: 30
        },
        doubletapVelocity: {
            type: Number,
            value: 500
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        touched: false,
        startTime: 0,
        startAngle: 0,
        startScale: 0,
        startTouch: null,
        tapCount: 0,
        startTabTime: 0,
        startPosition: {}
    },
    attached() {},
    /**
     * 组件的方法列表
     */
    methods: {
        start(evt) {
            // console.log('evt--------------',evt)
            let touches = evt.touches
            // 标记为已经触摸
            this.data.touched = true

            if (!this.data.startTouch) {
                // 标记开始触摸的时间，用于 swipe 的速度计算
                this.data.startTime = Date.now()
                this.data.startTouch = touches[0]
            }
            // 保存开始触摸的位置
            this.data.startPosition = this.getPosition(touches)

            if (touches.length > 1) {
                // 保存开始旋转的角度
                this.data.startAngle = this.getAngle(touches[0], touches[1]);
                // 保存开始缩放的比例
                this.data.startScale = this.getDistance(touches[0], touches[1]);
            }

            // 触发 touchstart 事件
            // if (events.touchstart) {
            //     events.touchstart.call(context, evt);
            // }
        },
        move(evt) {
            let moveTouches, position
            // console.log('move--------------', evt)
            // 当标记已经触摸了，才会执行
            if (this.data.touched) {
                moveTouches = evt.touches;

                // 当前所有的触摸点的中心位置 - 开始触摸的位置 = 平移的距离
                position = this.getPosition(moveTouches);
                evt.deltaX = position.x - this.data.startPosition.x;
                evt.deltaY = position.y - this.data.startPosition.y;
                // events.pressmove.call(context, evt);

                if (moveTouches.length > 1) {
                    // 开始旋转的角度 - 当前旋转的角度 = 实际旋转的角度
                    evt.angle = this.data.startAngle - this.getAngle(moveTouches[0], moveTouches[1]);
                    events.rotate.call(context, evt);

                    // 当前的缩放比例 / 开始的缩放比例 = 实际缩放比例
                    evt.scale = this.getDistance(moveTouches[0], moveTouches[1]) / this.data.startScale;
                    // events.pinch.call(context, evt);
                }
            }

            // 触发 touchmove 事件，
            // 此事件设计为最后触发，是为了使用 setData 时提高程序性能
            // if (events.touchmove) {
            //     events.touchmove.call(context, evt);
            // }
        },
        end(evt) {
            // console.log('end--------------', evt)
            // 当标记已经触摸了，才会执行
            if (this.data.touched) {
                // 限制滑动时间是否超时，超时则不执行
                if ((!this.data.swipeVelocity || Date.now() - this.data.startTime <= this.data.swipeVelocity)) {
                    let endTouch = evt.changedTouches[0],
                        deltaX = endTouch.clientX - this.data.startTouch.clientX,
                        deltaY = endTouch.clientY - this.data.startTouch.clientY,
                        // 调整滑动距离为正数
                        distanceX = Math.abs(deltaX),
                        distanceY = Math.abs(deltaY);

                    // 如果滑动的距离到达了阈值，才能够触发 swipe 事件
                    if (distanceX >= this.data.swipeThreshold || distanceY >= this.data.swipeThreshold) {
                        // 计算滑动方向，有两个方向取最长的滑动距离为准
                        evt.direction = distanceX > distanceY ? (deltaX > 0 ? "right" : "left") : deltaY > 0 ? "down" : "up";
                        // events.swipe.call(context, evt);
                        this.triggerEvent('onSwipe', evt)
                    }
                }

                // 如果没有触摸点了，就是所有的手指都已经离开屏幕，标记触摸点为 false
                if (evt.touches.length == 0) {
                    this.data.touched = false;
                    this.data.startTouch = null;

                } else {
                    // 如果还有手指触摸着屏幕，并且定义 pressmove 事件，需要重置开始触摸的中心位置
                    this.data.startPosition = this.getPosition(evt.touches);
                }
            }

            // 触发 touchend 事件
            // if (events.touchend) {
            //     events.touchend.call(context, evt);
            // }
        },
        cancel(evt) {
            // console.log('cancel--------------', evt)
            // 触发 touchcancel 事件
            // if (this.events.touchcancel) {
            //     this.events.touchcancel.call(context, evt);
            // }

            // 把中断触摸认为是触摸结束，去执行 touchend 的一系列行为
            this.end(evt);
        },
        tap(evt) {
            // console.log('tap--------------', evt)
            let now = Date.now();
            // 如果已经有了一个 tap，并且当前的 tap 在限制时间范围内
            // 触发 doubletap 事件
            if (this.data.tapCount > 0 && now - this.data.startTabTime <= this.data.doubletapVelocity) {

                // 重置 tap 次数
                this.data.tapCount = -1;
                // events.doubletap.call(context, evt);
            } else {

                // 如果已经存在一个 tap，但是第二次 tap 超时了，重置次数
                this.data.tapCount = 0;
            }
            // 标记第一次 tap 的时间
            this.data.startTabTime = now;
            // 增加触发 tap 次数
            this.data.tapCount++;
            // 触发 tap 事件，目前没有针对 doubletap 触发，取消 tap 事件的操作
            // if (events.tap) {
            //     events.tap.call(context, evt);
            // }
        },
        getAngle(a, b) {
            return 180 / Math.PI * Math.atan2(b.clientX - a.clientX, b.clientY - a.clientY);
        },
        getDistance(a, b) {
            return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
        },
        getPosition(touches) {
            let x = 0,
                y = 0,
                length = touches.length,
                index = length;

            while (index--) {
                x += touches[index].clientX;
                y += touches[index].clientY;
            }
            return {
                x: x / length,
                y: y / length
            }
        }
    }
})