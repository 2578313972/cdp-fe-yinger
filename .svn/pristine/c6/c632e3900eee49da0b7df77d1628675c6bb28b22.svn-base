import Vue from 'vue';
import $config from '@/utils/config';

const roleMenuDirective = {
    bind(el, { value }) {
        if (!!$config && !!$config.login_info) {
            // 拥有登录信息
            if (!!$config.login_info.menuListArr && !!$config.login_info.menuListArr.length) {
                if (~$config.login_info.menuListArr.indexOf(value)) {
                    return;
                }
            }
        }
        el.style.display = 'none';
    }
};

export default Vue.directive('role-menu', roleMenuDirective);
