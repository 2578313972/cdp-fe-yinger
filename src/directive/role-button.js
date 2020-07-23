import Vue from 'vue';
import _ from 'lodash';
import $config from '@/utils/config';

const handleRoleProps = function (el, { value }, vnode) {
    el.style.display = 'none';
    if (!value) {
        return;
    }
    if (!!$config && !!$config.login_info) {
    // 拥有登录信息
        if ($config.login_info.buttonItems) {
            const buttonItem = $config.login_info.buttonItems[value];
            if (!!buttonItem && buttonItem.visible) {
                el.style.display = '';
            }
            const vm = vnode.componentInstance;
            if (vm) {
                const roleKeys = vm.roleKeys || [];
                roleKeys.forEach((key) => {
                    if (!!buttonItem && _.has(buttonItem, key)) {
                        vm.$set(vm, key, _.get(buttonItem, key, _.get(vm, key)));
                    }
                });
            }
            // if (!!buttonItem && buttonItem.disabled) {
            //     el.disabled = true;
            // }else{
            //     el.disabled = false;
            // }
        }
    }
};
const roleButtonDirective = {
    update(el, binding, vnode) {
        handleRoleProps(el, binding, vnode);
    },
    bind(el, binding, vnode) {
        handleRoleProps(el, binding, vnode);
    }
};

export default Vue.directive('role-button', roleButtonDirective);
