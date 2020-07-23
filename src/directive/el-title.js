import Vue from 'vue';

// 超出容器显示省略号，并且添加title
function set(el, value) {
    if (!el) {
        return;
    }
    const showTitle = el.scrollWidth > el.offsetWidth;
    if (showTitle) {
        el.setAttribute('title', value);
    }
}
const elTitle = {
    bind(el, { value }) {
        el.addEventListener('mouseover', () => {
            set(el, value);
        });
    },
    unbind(el, { value }) {
        el.removeEventListener('mouseover', () => {
            set(el, value);
        });
    }
};

export default Vue.directive('el-title', elTitle);
