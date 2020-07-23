import Vue from 'vue';
import Vuex from 'vuex';
import iView from 'iview';
import echarts from 'echarts';
import dayjs from 'dayjs';
import lodash from 'lodash';
// 引入js文件
import Scrollbar from 'smooth-scrollbar';
import CollapseTransition from 'iview/src/components/base/collapse-transition';
import VueClipboard from 'vue-clipboard2';
import tools from '@/utils/common';
import config from '@/utils/config';
// import api from '@/api';
import '@/directive';
import '@/filter';

// 引入css文件
import 'iview/dist/styles/iview.css';
import 'font-awesome/css/font-awesome.min.css';
// import '@/assets/styles/common.css';

// 引入iView折叠面板动画组件
import axios from '@/utils/axios';
import App from './App';

Vue.use(iView);
Vue.use(Vuex);
Vue.use(VueClipboard);

Vue.config.productionTip = false;

Vue.prototype.echarts = echarts;
Vue.prototype.Scrollbar = Scrollbar;
Vue.prototype.$axios = axios;
Vue.prototype.$tools = tools;
Vue.prototype.$config = global.$config = config;
Vue.prototype.$date = dayjs;
Vue.prototype.$lodash = lodash;

Vue.component('CollapseTransition', CollapseTransition);

new Vue({
    render: h => h(App)
}).$mount('#app');
