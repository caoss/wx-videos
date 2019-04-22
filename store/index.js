const mobx = require("../libs/wechat-weapp-mobx/mobx");
const extendObservable = mobx.extendObservable;

const homeStore = require("./homeStore");

var Store = function() {
    extendObservable(this, {
        homeStore: new homeStore()
    });
};

module.exports = new Store();