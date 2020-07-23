import _ from 'lodash';

export default {
    props: {
        data: {
            type: Array
        },
        nodeNum: {
            type: String,
            default: 'num'
        },
        noData: {
            type: String,
            default: '暂无数据'
        },
        maxLevel: {
            type: Number,
            default: 100
        },
        newNodeName: {
            type: String,
            default: '新增节点'
        },
        isShowEditIcon: {
            type: Boolean,
            default: false
        },
        isShowAddIcon: {
            type: Boolean,
            default: false
        },
        isShowDelIcon: {
            type: Boolean,
            default: false
        },
        isShowDeep: {
            type: Boolean,
            default: false
        },
        isShowNum: {
            type: Boolean,
            default: true
        },
        tid: {
            type: String,
            default: 'id'
        },
        parentId: {
            type: String,
            default: 'parent_id'
        },
        confirmModalType: {
            type: String,
            default: '目录'
        },
        confirmModalContent: {
            type: String,
            default: ''
        },
        showTip: {
            type: Boolean,
            default: true
        },
        treeTypeArr: {
            type: Array,
            default() {
                return [];
            }
        },
        tooltipAlign: {
            type: String,
            default: 'bottom'
        },
        allowDrop: { // 拖拽时判定目标节点能否被放置
            type: Function,
            default() {
                return true;
            }
        },
        allowDrag: { // 判断节点能否被拖拽
            type: Function,
            default() { // 参数：draggingNode
                return true;
            }
        }
    },
    data() {
        return {
            iconKey: '',
            selectData: null,
            selectId: undefined,
            draggingNode: null,
            dropNode: null,
            dragType: null,
            treeRootNode: null,
            lastElement: null
        };
    },
    created() {
        this.debonceClick = _.debounce(this.showNodeData, this.$config.debounce_wait);
        this.debounceDelEvent = this.$lodash.debounce(this.emitRemove, this.$config.debounce_wait);
    },
    mounted() {
        if (this.data && this.data[0]) {
            this.changeSelectNode(this.data, this.data[0]);
        }
        this.initEvent();
    },
    watch: {
        data() {
            if (this.data && this.data[0] && !Object.prototype.hasOwnProperty.call(this.data[0], 'loading')) {
                this.changeSelectNode(this.data, this.data[0]);
            } else {
                this.setRootColor(this.data);
            }
        }
    },
    methods: {
        // selectId:被选中的id
        getSelectNodeHierarchyId(selectId) {
            const node = this.getTidData(selectId, this.data);
            if (node && node.hierarchy_id) {
                return node.hierarchy_id.split('-');
            }
            return [];
        },
        // 提供删除
        removeData(dataId) {
            const removeNode = this.getTidData(dataId, this.data);

            const baseRoot = this.data || [];

            let isFinded = false;
            baseRoot.map((curRoot, seq) => {
                if (isFinded) {
                    return;
                }
                if (curRoot[this.tid] == dataId) {
                    isFinded = true;
                    this.$delete(baseRoot, seq);
                    if (baseRoot.length == 0) delete baseRoot.loading;
                    return;
                }

                const root = this.findParentNode(removeNode, curRoot);

                // root非空时，是下级节点
                root && root.children && root.children.map((item, index) => {
                    if (isFinded) {
                        return;
                    }
                    if (dataId == item[this.tid]) {
                        isFinded = true;
                        this.$delete(root.children, index);
                        if (root.children.length == 0) delete root.loading;
                    }
                });
            });
        },
        isSelfOrChilds(dom) {
            const treeRootNode = this.treeRootNode;
            let node = dom;
            let isSelf = false;
            let maxLoopCnt = 1000;
            if (node == null) {
                return;
            }

            do {
                if (treeRootNode == node) {
                    isSelf = true;
                    break;
                }
                maxLoopCnt--;
                node = node.parentNode;
            }
            while (node && node.nodeName && node.nodeName.toUpperCase() != 'HTML' && maxLoopCnt > 0);
            return isSelf;
        },
        findParentDom(node, aClassName) {
            let result = null;
            let maxLoopCnt = 1000;
            if (node == null) {
                return;
            }

            do {
                // node.classList.contains(aClassName);
                // let className = node && node.className;
                // className = className || '';
                // if (className.split(' ').indexOf(aClassName) > -1) {
                if (node.classList.contains(aClassName)) {
                    result = node;
                    break;
                }
                maxLoopCnt--;
                node = node.parentNode;
            }
            while (node && node.nodeName && node.nodeName.toUpperCase() != 'HTML' && maxLoopCnt > 0);
            return result;
        },
        findParentNode(dt, pdata) {
            pdata = pdata || {};
            dt = dt || {};
            let isFinded = false;
            let result = null;
            (pdata.children || []).map((item) => {
                if (isFinded || !item) {
                    return;
                }
                if (item[this.tid] == dt[this.tid]) {
                    result = pdata;
                    isFinded = true;
                    return;
                }

                const node = this.findParentNode(dt, item);
                if (node) {
                    result = node;
                    isFinded = true;
                }
            });
            return result;
        },
        getTidData(tid, pdata) {
            let lastData = null;
            const curRoot = pdata || [];
            let isFinded = false;
            curRoot.map((item) => {
                if (isFinded) {
                    return;
                }
                let localTid = item[this.tid];

                // 防止公共的【0】和跨渠道授权的【空值】相等
                tid = tid == null ? '' : tid.toString();
                localTid = localTid == null ? '' : localTid.toString();
                if (tid === localTid) {
                    lastData = item;
                    isFinded = true;
                }

                const data = this.getTidData(tid, item.children);
                if (data) {
                    lastData = data;
                    isFinded = true;
                }
            });
            return lastData;
        },
        // 获取将要被放置的位置的前后节点数据
        getBeforeAndAfterData(data, type) {
            type = type || 'before'; // 默认before
            let lastData = null;
            let before = null;
            let after = null;
            const baseRoot = this.data || [];
            baseRoot.map((curRoot, seq) => {
                lastData = null;
                const root = this.findParentNode(data, curRoot);

                // root非空时，是下级节点
                root && root.children && root.children.map((item, index) => {
                    if (data[this.tid] == item[this.tid] && type == 'before') {
                        before = lastData;
                        after = item;
                    } else if (data[this.tid] == item[this.tid] && type == 'after') {
                        before = item;
                        after = root.children[index + 1];
                    }
                    lastData = item;
                });

                // 当root为空时，说明是根
                if (!root) {
                    if (data[this.tid] == curRoot[this.tid] && type == 'before') {
                        before = lastData;
                        after = curRoot;
                    } else if (data[this.tid] == curRoot[this.tid] && type == 'after') {
                        before = curRoot;
                        after = baseRoot[seq + 1];
                    }
                    lastData = curRoot;
                }
            });

            const result = {
                before,
                after
            };
            return result;
        },
        getParaments(aDropNode) {
            const dropNode = aDropNode || this.dropNode;
            let findedCount = 0;
            let parentNode_ab = null; // 放下时位置的父节点
            let parentRootNode_ab = null; // 放下时位置的Root节点（一级节点）
            let parentNode_drag = null; // 被拖拽节点的父节点
            let parentRootNode_drag = null; // 被拖拽节点的Root节点 （一级节点）
            let isSameParent = false;
            const baseRoot = this.data || [];
            const result = this.getBeforeAndAfterData(dropNode, this.dragType) || {};

            baseRoot.map((curRoot) => {
                if (findedCount >= 2) {
                    return;
                }
                // 前或后的父节点
                const baParentNode = this.findParentNode(result.before || result.after, curRoot);
                // 被拖拽的父节点
                const dragParentNode = this.findParentNode(this.draggingNode, curRoot);
                if (baParentNode) {
                    parentNode_ab = baParentNode;
                    parentRootNode_ab = curRoot;
                    findedCount++;
                }
                if (dragParentNode) {
                    parentNode_drag = dragParentNode;
                    parentRootNode_drag = curRoot;
                    findedCount++;
                }
            });

            if ((parentNode_ab != null && parentNode_drag == null) || (parentNode_ab == null && parentNode_drag != null)) {
                isSameParent = false;
            } else if ((parentNode_ab == null && parentNode_drag == null) || (parentNode_ab[this.tid] == parentNode_drag[this.tid])) {
                isSameParent = true;
            } else {
                isSameParent = false;
            }

            result.draggingNode = this.draggingNode;
            result.baseRootNode = baseRoot;
            result.parentNode = parentNode_ab;
            result.parentRootNode = parentRootNode_ab;

            result.parentDragNode = parentNode_drag;
            result.parentDragRootNode = parentRootNode_drag;

            result.isSameParent = isSameParent;

            // !aDropNode && console.log('mouseup=>',
            //     ' result:', result,
            //     ' isSameParent:', result.isSameParent,
            //     ' baseRootNode:', result.baseRootNode,
            //     ' parentNode:', parentNode_ab && parentNode_ab.name,
            //     ' parentDragNode:', parentNode_drag && parentNode_drag.name,
            //     ' draggingNode:', result.draggingNode.name,
            //     ' before:', result.before && result.before.name,
            //     ' after:', result.after && result.after.name);

            return result;
        },
        // 返回值：是否能被放下
        mousemove(ev) {
            const treeRootNode = this.treeRootNode;
            const node = ev.target;
            let dropNode = null;
            let lastElement = this.lastElement;
            let type = null;
            // lastElement && (lastElement.className = '');
            this.handleClass([], ['before', 'after'], lastElement);
            lastElement = null;

            // 没有拖拽起节点时 或 光标未在树容器中操作时中止程序
            if (!this.isSelfOrChilds(node)) {
                this.dropNode = null;
                return false;
            }

            const liElements = treeRootNode.querySelectorAll('li');
            const pageY = ev.pageY;

            for (const liElement of liElements) {
                const size = liElement.getBoundingClientRect();
                const top = size.top - 8;
                if (top <= pageY && top + 20 > pageY) {
                    type = 'before';
                    lastElement = liElement;
                    break;
                } else if (top + 20 <= pageY && top + 40 > pageY) {
                    type = 'after';
                    lastElement = liElement;
                    break;
                }
            }

            if (!lastElement) {
                const rootLiElement = treeRootNode.querySelectorAll('.ivu-tree>ul>li');
                const firtElement = rootLiElement[0];
                const size = firtElement.getBoundingClientRect();
                const top = size.top;
                if (top > pageY) {
                    lastElement = rootLiElement[0];
                    type = 'before';
                } else {
                    lastElement = rootLiElement[rootLiElement.length - 1];
                    type = 'after';
                }
            }

            // 此语句必须在this.getParaments方法调用之前
            this.dragType = type;
            const tid = lastElement && lastElement.querySelector('.file-name-identify').getAttribute('tid');
            dropNode = lastElement && this.getTidData(tid, this.data);
            const paraments = dropNode && this.getParaments(dropNode);

            let isAllowDrop = true;
            // 判定目标节点能否被放置
            if (dropNode && this.isAllowDrop(paraments) && this.allowDrop(paraments)) {
                isAllowDrop = true;
                // lastElement.className = type;
                this.handleClass([type], ['before', 'after'], lastElement);
            } else {
                isAllowDrop = false;
                dropNode = null;
            }

            this.lastElement = lastElement;
            this.dropNode = dropNode;
            return isAllowDrop;
        },
        // 节点的位置是否发生了变化，只有发生变化时，才允许被放下
        // 不能把父节点拖拽到子节点中，因为现在被拖拽的节点自动收起，所以没有这个问题了
        isAllowDrop(paraments) {
            const before = paraments.before;
            const after = paraments.after;
            const draggingNode = paraments.draggingNode;
            let btid = before && before[this.tid];
            let atid = after && after[this.tid];
            let dtid = draggingNode && draggingNode[this.tid];

            btid = btid == null ? '' : btid.toString();
            atid = atid == null ? '' : atid.toString();
            dtid = dtid == null ? '' : dtid.toString();

            if ((before && btid === dtid) || (after && atid === dtid)) {
                return false;
            }
            return true;
        },
        initEvent() {
            const treeRootNode = this.$refs[this.treeId];
            this.treeRootNode = treeRootNode;
        },
        dragstart() {
            document.addEventListener('dragover', this.dragover);
            document.addEventListener('drop', this.drop);
            document.addEventListener('dragend', this.dragend);
        },
        dragend() {
            // 释放相关资源
            this.endDragAndDrop();
        },
        drop(ev) {
            // 没有拖拽起节点时 或 光标未在树容器中操作时中止程序
            if (this.draggingNode && this.dropNode && this.isSelfOrChilds(ev.target)) {
                this.$emit('drop', this.getParaments());
            }
        },
        dragover(ev) {
            // ev.preventDefault();
            const isAllowDrop = this.mousemove(ev);
            if (isAllowDrop) {
                ev.preventDefault();
                this.handleClass(['cursor-move'], ['cursor-no-drop']);
            } else {
                this.handleClass(['cursor-no-drop'], ['cursor-move']);
            }
        },
        // 结束拖拽
        endDragAndDrop() {
            // 清除缓存数据和样式
            this.draggingNode = null;
            this.dropNode = null;
            // this.lastElement && (this.lastElement.className = '');

            this.handleClass([], ['before', 'after'], this.lastElement);

            document.removeEventListener('drop', this.drop);
            document.removeEventListener('dragover', this.dragover);
            document.removeEventListener('dragend', this.dragend);

            this.handleClass([], ['cursor-move', 'cursor-no-drop']);
            const dragMoveEl = document.querySelector('#drag-move-el');
            dragMoveEl && dragMoveEl.remove();
        },
        handleClass(addClasses, removeClasses, targetElement) {
            addClasses = addClasses || [];
            removeClasses = removeClasses || [];
            const element = arguments.length >= 3 ? targetElement : document.querySelector('body');
            const node = element && element.classList;
            node && node.remove && node.remove(...removeClasses);
            node && node.add && node.add(...addClasses);
        },
        // 触发滚动条自动滚动
        autoScroll() {
            const container = document.querySelector('#cusTree');
            const containerHeight = container.scrollHeight;
            const newElHeight = document.querySelector('.ivu-tree-children').scrollHeight;
            container.scrollTop = containerHeight + newElHeight;
        },
        // 渲染文件树
        renderTree(h, { root, node, data }) {
            const isSelected = !_.isNil(this.selectId) && this.selectId === data[this.tid];
            const iconStyle = {
                position: 'relative',
                top: '1px',
                marginLeft: '6px',
                color: isSelected ? '#2185F0' : 'rgba(23, 35, 61, 0.55)',
                cursor: 'pointer'
            };

            return h('span', {
                style: {
                    display: 'inline-block',
                    'user-select': 'none',
                    'padding-right': '16px'
                },
                class: {
                    color: isSelected,
                    'tree-is-draggable': true
                },
                attrs: {
                    draggable: true
                },
                on: {
                    mouseover: () => { this.showIcon(node); },
                    mouseleave: () => { this.hideIcon(); },
                    dragstart: (ev) => {
                        if (data.isEdit) {
                            ev.preventDefault();
                        }

                        // 解决FF下不能拖拽的问题
                        ev.dataTransfer.setData('name', 'Garven');

                        // 重写拖拽浮层（拖起的元素）
                        const crt = document.createElement('span');
                        crt.id = 'drag-move-el';
                        crt.style.backgroundColor = '#fff';
                        crt.style.padding = '0px 8px 0px 8px';
                        crt.style.borderRadius = '2px';
                        crt.innerHTML = `<i class="ivu-icon ivu-icon-md-folder file-color" style="margin-right: 8px; cursor: pointer;"></i>${data.name}`;
                        crt.style.position = 'absolute';
                        crt.style.top = '0px';
                        crt.style.left = `-${ev.target.offsetWidth + 2}px`;
                        document.body.appendChild(crt);
                        ev.dataTransfer.setDragImage(crt, ev.layerX, ev.layerY);

                        this.$set(data, 'expand', false);
                        this.dragstart();
                        this.draggingNode = data;
                    },
                    mousedown: (ev) => {
                        // 模拟取消选中文字引起拖拽bug
                        const crt2 = document.createElement('input');
                        crt2.style.position = 'fixed';
                        crt2.style.top = '-9999px';
                        crt2.style.left = '-9999px';
                        document.body.appendChild(crt2);
                        // 为了在编辑状态下，能移动输入框内的光标使用鼠标点击移动光标所以不能把光标从当前编辑框中移出
                        !data.isEdit && crt2.focus();
                        document.body.removeChild(crt2);

                        const dragElement = this.findParentDom(ev.target, 'tree-is-draggable');
                        dragElement.setAttribute('draggable', !data.isEdit && this.allowDrag(data) !== false);
                    }
                }
            }, [
                h('span', {
                    attrs: {
                        id: `parentId${data[this.tid]}`
                    },
                    on: {
                        click: () => { this.debonceClick(root, node, data, this.isShowDeep); }
                    }
                }, [
                    h('Icon', {
                        props: {
                            type: this.isShowDeep && this.getNodeLevel(root, node) === this.maxLevel
                                ? 'ios-paper'
                                : 'md-folder'
                        },
                        style: {
                            marginRight: '8px',
                            cursor: 'pointer'
                        },
                        class: {
                            'file-color': true,
                            color: isSelected
                        }
                    }),
                    h('span', {
                        class: {
                            'file-name-identify': true
                        },
                        style: {
                            display: data.isEdit ? 'none' : 'inline-block',
                            cursor: 'pointer'
                        },
                        attrs: {
                            tid: `${data[this.tid]}`
                        }
                    }, data.name),
                    h('i-input', {
                        style: {
                            display: data.isEdit ? 'inline-block' : 'none',
                            width: '80px'
                        },
                        attrs: {
                            maxlength: 20,
                            id: `inputId${data.nodeKey}`
                        },
                        props: {
                            value: data.name,
                            size: 'small'
                        },
                        on: {
                            'on-blur': (e) => { this.saveTreeNode(e, root, node, data); }
                        },
                        nativeOn: {
                            keyup: (e) => { this.saveTreeNode(e, root, node, data); }
                        },
                        ref: `inputId${data.nodeKey}`
                    }),
                    h('span', {
                        style: {
                            display: this.isShowNum ? 'inline-block' : 'none'
                        }
                    }, `（${data[this.nodeNum]}）`),
                    h('Tooltip', {
                        props: {
                            transfer: true,
                            content: data.tipContent,
                            placement: this.tooltipAlign,
                            disabled: !data.tipContent || data.tipContent.length === 0,
                            'max-width': 180
                        },
                        style: {
                            color: '#000',
                            display: this.treeTypeArr.indexOf(data.treeType) > -1 && this.getNodeLevel(root, node) === 1
                                ? 'inline-block'
                                : 'none'
                        }
                    }, [
                        h('span', {
                            class: {
                                iconfont: true,
                                'icon-action_help_outline': true
                            }
                        })
                    ])
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        marginLeft: '5px',
                        visibility: this.iconKey === data.nodeKey ? 'visible' : 'hidden'
                    }
                }, [
                    h('span', {
                        class: {
                            'hide-icon': this.getNodeLevel(root, node) == 1,
                            iconfont: true,
                            'icon-content_create': true
                        },
                        style: Object.assign({}, iconStyle, {
                            display: this.isShowIcon && this.isShowEditIcon && !data.isNotShowIcon ? 'inline-block' : 'none'
                        }),
                        on: {
                            click: () => { this.edit({ root, node, data }); }
                        }
                    }),
                    h('span', {
                        class: {
                            iconfont: true,
                            'icon-action_delete_outline': true,
                            'hide-icon': this.getNodeLevel(root, node) == 1
                        },
                        style: Object.assign({}, iconStyle, {
                            display: this.isShowIcon && this.isShowDelIcon && !data.isNotShowIcon ? 'inline-block' : 'none'
                        }),
                        on: {
                            click: () => { this.remove(root, node, data); }
                        }
                    }),
                    h('span', {
                        class: {
                            iconfont: true,
                            'icon-content_add_circle_outline': true,
                            'hide-icon': this.getNodeLevel(root, node) >= this.maxLevel
                        },
                        style: Object.assign({}, iconStyle, {
                            display: this.isShowIcon && this.isShowAddIcon && !data.isNotShowIcon ? 'inline-block' : 'none'
                        }),
                        on: {
                            click: () => { this.append(root, node, data); }
                        }
                    })
                ])
            ]);
        },
        // 获取当前节点树层级
        getNodeLevel(root, node) {
            let treeLevel = 1;
            let maxCnt = this.maxLevel;
            let tmpNode = node;
            while (tmpNode && tmpNode.parent && tmpNode.parent != 0 && maxCnt > 0) {
                treeLevel++;
                maxCnt--;
                tmpNode = root[tmpNode.parent];
            }
            if (tmpNode.parent == 0) {
                treeLevel++;
            }
            return treeLevel;
        },
        // input自动获取焦点
        inputFocus(node, isEdit) {
            const _this = this;
            this.$nextTick(() => {
                const inputD = document.getElementById(`inputId${node.nodeKey}`);
                const inputC = inputD.getElementsByTagName('input')[0];
                isEdit && (inputC.value = node.node.name);
                setTimeout(() => {
                    inputC.focus();
                    _this.$tools.moveToEnd(inputC);
                }, 0);
            });
        },
        // 自定义操作中-展开树节点
        expandTree(root, node, data) {
            if (!data.expand) {
                // 当前节点没有展开
                this.$set(data, 'expand', true);
                if (this.loadData && this.$lodash.isFunction(this.loadData)) {
                    this.loadData(data, (children) => {
                        this.$set(data, 'children', children);
                    });
                }
            }
        },
        // 增加子节点
        append(root, node, data) {
            if (data.selfAppend) {
                // 自定义增加操作
                this.expandTree(root, node, data);
                this.$emit('self-append', { root, node, data });
            } else if (!data.expand) {
                // 树节点默认添加操作-当前节点未展开
                this.$set(data, 'expand', true);
                if (Object.prototype.hasOwnProperty.call(data, 'loading') && this.loadData && this.$lodash.isFunction(this.loadData)) {
                    this.loadData(data, (children) => {
                        this.$set(data, 'children', children);
                        this.addChildNodeLocal(root, node, data);
                    });
                } else {
                    this.addChildNodeLocal(root, node, data);
                }
            } else {
                this.addChildNodeLocal(root, node, data);
            }
        },
        addChildNodeLocal(root, node, data) {
            const _this = this;
            const currentLevel = this.getNodeLevel(root, node);
            this.$emit('append', { root, node, data });

            if (currentLevel <= this.maxLevel) {
                // 前端静态增加节点
                const children = data.children || [];
                const childList = node.node.children;
                const name = childList && childList.length
                    ? this.getUnExistName(childList, this.newNodeName, 0)
                    : this.newNodeName;
                const newNode = {
                    name,
                    isNew: true
                };
                children.push(newNode);
                this.$set(data, 'children', children);
                this.$set(data, 'expand', true);

                // 新增的节点用 input 框显示
                this.$nextTick(() => {
                    _this.edit({ node: children }, true);
                    _this.inputFocus(node);
                });
            }
        },
        // 编辑节点
        edit(nodeObj, isAppend) {
            const { node } = nodeObj;
            // append添加后的编辑
            if (isAppend) {
                const len = node.length;
                const nodeData = node[len - 1];
                this.inputFocus(nodeData);
                this.$set(nodeData, 'isEdit', true);
            } else {
                this.$emit('edit', nodeObj);
                // 点击按钮编辑
                this.inputFocus(node, 'edit');
                this.$set(node.node, 'isEdit', true);
                this.$set(node.node, 'isNew', false);
            }
        },
        // 发送删除请求
        emitRemove(root, node, data) {
            this.$emit('remove-tree-node', { data, root, node });
        },
        // 移除节点
        remove(root, node, data) {
            const _this = this;
            this.$Modal.confirm({
                title: `确认删除此${this.confirmModalType}？`,
                content: `名称：${data.name}<br><br>${this.confirmModalContent}`,
                onOk: () => {
                    if (_.isEqual(_this.selectData, data)) {
                        _this.changeSelectNode(root[0], root[0].node);
                    }
                    _this.$set(data, 'isEdit', false);
                    _this.debounceDelEvent(root, node, data);
                }
            });
        },
        // 选中当前节点查询右侧列表
        showNodeData(root, node, data, isShowDeep) {
            if (!data.isEdit && Object.hasOwnProperty.call(data, this.tid)) {
                if (isShowDeep) {
                    if (this.getNodeLevel(root, node) === this.maxLevel) {
                        this.changeSelectNode(node, data);
                    }
                } else {
                    this.changeSelectNode(node, data);
                }
            }
        },
        // 点击当前节点后的操作
        changeSelectNode(node, data) {
            if (this.isShowDeep) {
                // 只允许叶子节点被选中
                if ((data.children && data.children.length > 0)
                    || (Object.prototype.hasOwnProperty.call(data, 'loading') && Object.prototype.hasOwnProperty.call(data, 'children'))) {
                    // 有孩子节点。
                    return;
                }
            }
            if (_.isEqual(this.selectData, data)) {
                return;
            }
            if (data) {
                this.selectId = data[this.tid];
            }
            this.selectData = data;
            this.$emit('get-table-tab-data', data);
        },
        // hover显示/隐藏icon
        showIcon(node) {
            this.iconKey = node.nodeKey;
        },
        hideIcon() {
            this.iconKey = '';
        },
        // 保存编辑的当前节点
        saveTreeNode(e, root, node, data) {
            this.$nextTick(() => {
                const inputD = document.getElementById(`inputId${data.nodeKey}`);
                const inputC = inputD.getElementsByTagName('input')[0];
                const value = inputC.value;
                const oldValue = data.name;
                if (e.keyCode === 13) {
                    inputC.blur();
                }
                if (e.type === 'blur') {
                    const { allow_empty_reg } = this.$config.reg_input;
                    if (!allow_empty_reg.test(value)) {
                        this.$Message.destroy();
                        this.$Message.error({
                            content: this.$config.reg_input.msg,
                            duration: 5
                        });
                        return;
                    }
                    this.saveCurrentNode(root, node, data, oldValue, value);
                }
            });
        },
        // 同级节点下名字判重
        getUnExistName(exists, newName, index) {
            const name = index ? `${newName}_${index}` : newName;
            if (!this.$lodash.find(exists, n => n.name === name)) {
                return name;
            }
            return this.getUnExistName(exists, newName, ++index);
        },
        // 保存当前修改
        saveCurrentNode(root, node, data, oldValue, value) {
            // 用来搜索父节点
            const findNode = (root, nodeKey) => {
                for (let i = 0; i < root.length; i++) {
                    const node = root[i];
                    if (_.isEqual(node.nodeKey, nodeKey)) {
                        return node.node;
                    } if (!!node.children && !!node.children.length) {
                        const result = findNode(node.children, nodeKey);
                        if (result) {
                            return result.node;
                        }
                    }
                }
                return null;
            };
            const oldData = _.cloneDeep(data);
            const parent = findNode(root, node.parent);
            if (!parent || !parent.children) {
                console.error('parent is null');
            }

            if (!data.isNew && oldValue === value) {
                this.$set(data, 'isEdit', false);
                return;
            }
            // 判断是否为新增/修改
            if (data.isNew) {
                // 新增
                if (value) {
                    this.judgeSameName(data, value, parent);
                } else {
                    this.judgeSameName(data, this.newNodeName, parent);
                    // value 值为空时重置为原值
                    this.recoverOldValue(data);
                }
                // 发送新增请求
                delete data.isNew;
                this.$emit('add-tree-node', {
                    data, node, root, parent
                });
            } else if (value) {
                // 修改
                this.judgeSameName(data, value, parent);
                this.$emit('edit-tree-node', {
                    data, oldData, node, root
                });
            } else {
                // value 值为空时重置为原值
                this.recoverOldValue(data);
            }
            this.$set(data, 'isEdit', false);
        },
        recoverOldValue(data) {
            const inputD = document.getElementById(`inputId${data.nodeKey}`);
            const inputC = inputD.getElementsByTagName('input')[0];
            inputC.value = data.name;
        },
        // 树节点名称判重
        judgeSameName(data, value, parent) {
            const children = parent ? _.cloneDeep(parent.children) : [];
            _.remove(children, n => n.nodeKey == data.nodeKey);
            const name = this.getUnExistName(children, value, 0);
            this.$set(data, 'name', name);
        },
        // 高亮根节点
        setRootColor(data) {
            const curFirst = data[0];
            if (!this.selectData && curFirst) {
                this.changeSelectNode(data, curFirst);
                return;
            }
            if (!curFirst && this.selectData) {
                this.changeSelectNode(data, curFirst);
            }
        }
    }
};
