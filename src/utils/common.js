// 工具函数
import Vue from 'vue';

const bus = new Vue();

// sessionStorage
const session = {
    set(obj) {
        for (const key in obj) {
            sessionStorage.setItem(key, obj[key]);
        }
    },
    get(str) {
        return sessionStorage.getItem(str);
    },
    remove(str) {
        sessionStorage.removeItem(str);
    },
    clear() {
        sessionStorage.clear();
    }
};

function formatTreeData(data) {
    const len = data && data.length;
    if (len) {
        for (let i = 0; i < len; i++) {
            const tempObj = data[i];
            tempObj.expand = len === 1;
            tempObj.children && tempObj.children.forEach((item) => {
                item.expand = false;
                formatTreeData(item);
            });
        }
    }
    return data;
}

// 树组件拖拽后数据替换
function replaceData(newData, oldData, idName) {
    newData.forEach((newItem) => {
        const keyArr = Object.keys(newItem);
        oldData.forEach((oldItem) => {
            if (newItem[idName] == oldItem[idName]) {
                for (const key in oldItem) {
                    if (Object.prototype.hasOwnProperty.call(oldItem, key)) {
                        (keyArr.indexOf(key) < 0 || key === 'children') && (newItem[key] = oldItem[key]);
                        if (key === 'children' && oldItem[key].length > 0) {
                            replaceData(newItem[key], oldItem[key], idName);
                        }
                    }
                }
            }
        });
    });
}

// 比较2个对象是否相同(浅比较)
function isObjEqual(o1, o2) {
    const props1 = Object.getOwnPropertyNames(o1);
    const props2 = Object.getOwnPropertyNames(o2);
    if (props1.length != props2.length) {
        return false;
    }
    for (let i = 0, max = props1.length; i < max; i++) {
        const propName = props1[i];
        if (o1[propName] !== o2[propName]) {
            return false;
        }
    }
    return true;
}

// 文本框获取焦点时光标在尾部
function moveToEnd(el) {
    if (typeof el.selectionStart === 'number') {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange !== 'undefined') {
        el.focus();
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

export default {
    bus,
    session,
    formatTreeData,
    isObjEqual,
    moveToEnd,
    replaceData
};
