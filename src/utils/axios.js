import config from '@/utils/config';
import axios from 'axios';
import iView from 'iview';

// 设置公共部分，请求头和超时时间
axios.defaults.headers = {
    'X-Requested-With': ''
};

// 让ajax携带cookie
axios.defaults.withCredentials = true;

// axios.defaults.timeout = 20000


// 防止第一次登录进到系统时弹出登录失效延迟跳转
let isLoadSession = false;
let timer = 2000;

const CancelToken = axios.CancelToken;
const requestSession = {};

// http request 拦截器
axios.interceptors.request.use(
    (config) => {
        iView.LoadingBar.config({
            color: '#00cc00'
        });
        iView.LoadingBar.start();
        // console.log('one: ', config);
        config.headers.Pragma = 'No-cache';
        config.headers['Cache-Control'] = 'no-cache';
        config.headers.Expires = 0;
        // console.log('two: ', config);
        // 增加请求组逻辑
        const groupName = (config.data && config.data.axiosGroupName) || (config.params && config.params.axiosGroupName);
        if (groupName) {
            if (requestSession[groupName] && requestSession[groupName].cancel) {
                requestSession[groupName].cancel();
            }
            config.cancelToken = new CancelToken((cfn) => {
                requestSession[groupName] = {};
                requestSession[groupName].cancel = cfn;
            });
        }
        // console.log(config);

        return config;
    },
    error => Promise.reject(error),
);

// http response 拦截器
axios.interceptors.response.use(
    (response) => {
        // console.log('response: ', response);

        if (/\/cdp\-web\/user\/session$/.test(response.config.url)) {
            isLoadSession = true;
        }
        iView.LoadingBar.finish();
        return response;
    },
    (error) => {
        // console.log(error);

        let msg = null;
        const message = {
            'Network Error': '网络连接错误，请稍候重试',
            Forbidden: '没有相关权限，请联系管理员'
        };

        // 请求被取消时, 程序中断
        if (error && error.toString && error.toString() === 'Cancel') {
            return Promise.reject(error);
        }

        if (error.response && error.response.status == 401) {
            iView.LoadingBar.error();
            timer = isLoadSession ? 2000 : 0;
            isLoadSession && axiosError('登录失效，请重新登录');
            setTimeout(() => {
                if (config.sys_config.login_url) {
                    window.location.replace(config.sys_config.login_url);
                }
            }, timer);
        } else if (error.response && error.response.status == 403
            && !/\/cdp\-web\/user\/session$/.test(error.config.url)) {
            iView.LoadingBar.error();
            axiosError('没有相关权限，请联系管理员');
        } else if (error.response && error.response.status == 509) {
            axiosError('请不要频繁操作');
        }
        // 人群/特性超出上限单独出弹层，跨渠道超上限单独显示7秒提示语。
        else if (error.response && error.response.status == 406 && ['ERROR_TRAIT_ACTIVE_THRESHOLD', 'ERROR_CROWD_ACTIVE_THRESHOLD', 'ERROR_CROSS_CHANNEL_TRAIT_ACTIVE_THRESHOLD'].includes(error.response.data.sub_code)) {
            iView.LoadingBar.error();
        }
        else if (error.response && error.response.data) {
            if (!/\/cdp\-web\/user\/session$/.test(error.response.data.path)) {
                msg = error.response.data.message || error.message;
                axiosError(message[msg] || msg);
            } else {
                // session接口请求错误时，不弹出message
                iView.LoadingBar.finish();
            }
        } else {
            axiosError(
                message[error.message]
                    || error.message
                    || '网络连接错误，请稍候重试',
            );
        }
        return Promise.reject(error);
    },
);


// 处理请求错误信息
function axiosError(errMsg) {
    // 防止多个Message同时弹出
    iView.Message.destroy();
    iView.LoadingBar.error();
    iView.Message.error({
        content: errMsg,
        duration: 5
    });
}

export default axios;
