/**
 * @author YM
 */
const ApiConst = {
    VIDEOS_LIST: 'short-videos/tabs/${tabId}/feed', // 列表
    VIDEOS_TABS: 'short-videos/tabs', // TAB列表
    VIDEOS_DETAIL: 'short-videos/${videoId}', // 详情
    VIDEOS_RELATIVE: 'short-videos/${videoId}/related-list',//相关
    LOGIN_STEP1: 'uc-wechat-callback/miniapp',//相关
    LOGIN_STEP2: 'uc-wechat-callback/mini-userinfo',//相关
    LIKE: 'short-videos/${videoId}/like',//点赞相关
    CANCEL_LIKE: 'short-videos/${videoId}/cancel-like',//取消点赞
    COLLECT: 'short-videos/${videoId}/collect',//收藏
    CANCEL_COLLECT: 'short-videos/${videoId}/cancel-collect',//取消收藏
    COLLECT_DATA: 'short-videos/collect-list',//取消收藏
}

export default ApiConst