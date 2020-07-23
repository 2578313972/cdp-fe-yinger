

/*
    判断条件的特性文件夹目录：
    1，事件触发：
    事件触发&我的：公共特性，我的特性，事件特性。
    事件触发&公共的：公共特性，事件特性。
    事件触发&运营组的：公共特性，运营组特性，事件特性。
    2，特性触发：
    特性触发&我的：我的特性，公共特性。
    特性触发&公共的：公共的。
    特性触发&运营组：运营组特性，公共特性。
    3，更新操作：
*/
// 第一级的model值，人群---我的---tab下。
const m = {
    m: '', // 选中的code 的 name
    typeCode: '', // 选中的条件code
    titleCatalog: [
        { // 目录面包屑
            name: '全部',
            id: ''
        }
    ],
    catalogParent: [ // 目录list
        {
            id: 'public_trait',
            name: '公共特性'
        },
        {
            id: 'my_trait',
            name: '我的特性'
        },
        {
            id: 'my_crowd',
            name: '我的人群'
        }
    ],
    catalogChild: [] // 触发/目录孩子list

};

export default {
    m
};
