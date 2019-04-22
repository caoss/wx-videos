/**
 * @author YM
 *
 */
/* 开发模式设定 */
export const Mode = {
    DEBUG: 'DEBUG', // 本地测试环境
    TEST: 'TEST', // 线上测试环境
    PREP: 'PREP', // 预生产环境
    RELEASE: 'RELEASE' // 线上生产环境
}
/* appId */
const appIds = {
    DEBUG: 'wxd590565ddc0e5f02',
    TEST: 'wx803e1ff83ebfb3c4',
    PREP: 'wx803e1ff83ebfb3c4',
    RELEASE: 'wx803e1ff83ebfb3c4'
}
/* 微信登录重定向地址 */
const redirectUris = {
    DEBUG: 'https://neets.cc/uc-wechat-callback/h5',
    TEST: 'https://neets.cc/UC_ADAPTER_CALLBACK/h5',
    PREP: 'https://neets.cc/uc-wechat-callback/h5',
    RELEASE: 'https://neets.cc/uc-wechat-callback/h5'
}
/* 社区管理 */
const apiDomains = {
    DEBUG: 'http://120.26.71.52:28080/',
    TEST: 'http://120.26.71.52:28080/',
    PREP:'https://app.neets.cc/',
    RELEASE:'https://app.neets.cc/'
}
/* UC域名管理 */
const apiDomainsUc = {
    DEBUG: 'http://47.97.0.114:28080/',
    TEST: 'http://47.97.0.114:28080/',
    PREP: 'https://uc.neets.cc/',
    RELEASE: 'https://uc.neets.cc/'
}
/* Main域名管理 */
const apiDomainsMain = {
    DEBUG: 'http://118.31.115.183:28080/',
    TEST: 'http://118.31.115.183:28080/',
    PREP: 'https://main.neets.cc/',
    RELEASE: 'https://main.neets.cc/'
}
/* Log域名管理 */
const apiDomainsLog = {
    DEBUG: 'https://log.neets.cc/',
    TEST: 'https://log.neets.cc/',
    PREP: 'https://log.neets.cc/',
    RELEASE: 'https://log.neets.cc/'
}
/* Log域名管理 */
const apiDomainsTem = {
    DEBUG: 'http://118.178.224.109:8088/api/',
    TEST: 'http://118.178.224.109:8088/api/',
    PREP: 'https://tcommunity.neets.cc/api/',
    RELEASE: 'https://tcommunity.neets.cc/api/'
}
/* 变量管理 */
export const currentMode = Mode.RELEASE

const EvnConst = {
    apiHost: apiDomains[currentMode],
    ucHost: apiDomainsUc[currentMode],
    mainHost: apiDomainsMain[currentMode],
    logHost: apiDomainsLog[currentMode],
    temHost: apiDomainsTem[currentMode],
    redirectUri: redirectUris[currentMode]
}
/* 导出数据 */
export default EvnConst