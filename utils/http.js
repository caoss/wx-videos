const api = '';

const config = {
    domain: {
        //debug: 'http://preprod.neetneet.cn/api',
        debug: '',
        release: ''
    }
};

const defaultHeader = {
    Accept: '*/*',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Neets-Version':'WXMPHJVIDEO:a-weixin:1.0.0',
    'X-Neets-Realm':'jdd-matrix'
};

function setHeader(header) {
    Object.assign(defaultHeader, header);
}

function replaceParam(url, params) {
    let result = /\$\{(.+?)\}/.exec(url);
    while (result) {
        if (params[result[1]] !== undefined) {
            url = url.replace(/\$\{(.+?)\}/, params[result[1]]);
            delete params[result[1]];
        }
        result = /\$\{(.+?)\}/.exec(url);
    }
    return {
        url: /^http:\/\//.test(url) ? url : config.domain.debug + url,
        params: params
    };
}

function toQueryString(obj) {
    return obj ?
        Object.keys(obj)
        .sort()
        .map(function(key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                return val
                    .sort()
                    .map(function(val2) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                    })
                    .join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        })
        .join('&') :
        '';
}

function get(url, params = {}) {
    const result = replaceParam(url, params);
    const queryString = toQueryString(result.params);

    result.url = `${result.url}${queryString == '' ? '' : '?' + queryString}`;

    console.log('发送get请求[%s]', result.url);

    return (new Promise((r, j) => {
        wx.request({
            url: result.url,
            header: defaultHeader,
            success: (res) => {
                r(res.data);
            },
            fail: (err) => {
                j(err);
            }
        });
    }));
}

function post(url, params = {}, header) {
    const userHeader = {};
    Object.assign(userHeader, defaultHeader, header);
    const result = replaceParam(url, params);
    // console.log('发送post请求[%s]', result.url);

    return (new Promise((r, j) => {
        wx.request({
            url: result.url,
            method: "POST",
            header: userHeader,
            data: result.params,
            success: (res) => {
                r(res.data);
            },
            fail: (err) => {
                j(err);
            }
        });
    }));
}

function uploadFile(url, params = {}, header) {
    const userHeader = {};
    Object.assign(userHeader, defaultHeader, header);
    const result = replaceParam(url, params);
    console.log('发送uploadFile请求[%s]', result.url);

    return (new Promise((r, j) => {
        wx.uploadFile({
            url: result.url,
            filePath: result.params.avterFile,
            header: userHeader,
            name: 'avterFile',
            success: (res) => {
                r(res.data);
            },
            fail: (err) => {
                j(err);
            }
        });
    }));
}
module.exports = {
    setHeader,
    get,
    post,
    uploadFile
};