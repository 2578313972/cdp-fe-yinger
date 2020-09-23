import Vue from 'vue';
import Vuex from 'vuex';
import iView from 'iview';
import echarts from 'echarts';
import dayjs from 'dayjs';
import lodash from 'lodash';
import { Select, Option, OptionGroup } from 'element-ui';
// 引入js文件
import Scrollbar from 'smooth-scrollbar';
import tools from '@/utils/common';
import config from '@/utils/config';
import api from '@/api';
import './directive';
import './filter';
import VueClipboard from 'vue-clipboard2';

// 活动管理demo数据
import activityData from '@/api/activityData';

// 引入 td-component
import 'td-component';

// 引入css文件
// import 'iview/dist/styles/iview.css';
import 'font-awesome/css/font-awesome.min.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/td-component-icons/iconfont.css';
import '@/assets/styles/common.css';
import '../static/css/error_page.css';

// 引入iView折叠面板动画组件
import CollapseTransition from 'iview/src/components/base/collapse-transition';

// 引入 暂无数据 组件
import NoData from '@/components/NoData';

import store from './store';
import axios from './utils/axios';
import router from './router';
import App from './App';


// 引入所有接口
import * as https from '@/http';

/**
    const context = require.context('./api', false, /\.js$/);
    console.dir(context.keys().map(context));
*/

// 对iView进行部分全局配置
Vue.use(iView, {
    // select: {
    //   customArrow: 'i-td i-td-arrow_drop_down_px',
    //   arrowSize: 24
    // }
    cascader: {
        customArrow: 'i-td i-td-arrow_drop_down_px',
        arrowSize: 24
    }
});

Vue.use(Vuex);
Vue.use(VueClipboard);

// 按需引入element组件
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);

Vue.config.productionTip = false;

Vue.prototype.echarts = echarts;
Vue.prototype.Scrollbar = Scrollbar;
Vue.prototype.$axios = axios;
Vue.prototype.$tools = tools;
Vue.prototype.$config = global.$config = config;
Vue.prototype.$date = dayjs;
Vue.prototype.$lodash = lodash;
Vue.prototype.$api = api;
Vue.prototype.$https = https;

// 自定义组件
const requireComponents = require.context('./utils', true, /[^index]\.js/);

console.log([...requireComponents('./global.js')]);
// // 打印结果
// // 遍历出每个组件的路径
// requireComponents.keys().forEach((fileName) => {
//   // 组件实例
//   const reqCom = requireComponents(fileName);
//   console.log(fileName, reqCom);
// });


Vue.prototype.$time = function (date) {
    const timeArr = date.toLocaleDateString().replace(/\//g, '-').split('-');
    for (const i in timeArr) {
        if (timeArr[i].length <= 1) {
            timeArr[i] = `0${timeArr[i]}`;
        }
    }
    return timeArr.join('-');
};

Vue.prototype.$kilobit = function (num) {
    return (num || 0) && Math.round(num).toString(10).split('.')[0].split('').reduceRight((data, item) => {
        data = data[0] && data[0].length % 3 ? data : ['', ...data];
        data[0] = item + data[0];
        return data;
    }, []).join(',');
};


// 活动管理demo数据
const activeType = localStorage.getItem('activeType') || 'general';

Vue.prototype.$activitySelct = activityData || {};
// 为防止以前设置的Key现在没有了，引起问题
Vue.prototype.$activity = (activityData[activeType] || {}).data || {};
Vue.component('CollapseTransition', CollapseTransition);

Vue.component('NoData', NoData);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>',
    render(createElement) {
        if (
            '-ms-scroll-limit' in document.documentElement.style
            && '-ms-ime-align' in document.documentElement.style
        ) {
            window.addEventListener(
                'hashchange',
                () => {
                    const currentPath = window.location.hash.slice(1);
                    if (this.$route.path !== currentPath) {
                        this.$router.push(currentPath);
                    }
                },
                false
            );
        }
        return createElement(App);
    }
});
