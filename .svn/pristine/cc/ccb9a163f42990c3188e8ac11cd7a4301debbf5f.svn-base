import Vue from 'vue';

const regInput = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g;

const trigger = (el, type, reg) => {
    el.value = el.value.replace(reg || regInput, '');

    // 修复value改变，vue中对应的v-model未修改
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
};

const roleMenuDirective = {
    bind(el, { value }) {
        const input = el.getElementsByTagName('input')[0];
        input.onkeyup = function () {
            trigger(input, 'input', value);
        };
        input.onblur = function () {
            trigger(input, 'input', value);
        };
    }
};

export default Vue.directive('replace', roleMenuDirective);
