<template>
    <div class="operation-tree">
        <Spin size="large" fix v-if="isLoading"></Spin>
        <div class="has-tree" v-if="initStatus && treeNum">
            <!-- 下拉列表 -->
            <Dropdown trigger="click" class="select-wrapper">
                <Button type="text" class="title">
                    <span class="content">{{ selectItem }}</span>
                    <span class="iconfont icon-nav_arrow_drop_down icon"></span>
                </Button>
                <DropdownMenu slot="list">
                    <div class="list-wrapper">
                        <DropdownItem
                            @click.native="handleSelect(item)"
                            v-for="item in rootList"
                            :key="item.org_id"
                            :class="{'selected': item.org_id===rootId}">{{ item.name }}</DropdownItem>
                    </div>
                    <DropdownItem divided @click.native="addTree" class="add-btn"><span class="iconfont icon-content_add"></span>新建架构</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <div class="tree-list">
                <!-- 树 -->
                <custom-tree
                    :data="initialData"
                    :max-level="5"
                    tid="org_id"
                    parent-id="org_parent_id"
                    confirm-modal-type="节点"
                    confirm-modal-content="删除后将无法恢复。"
                    isShowAddIcon
                    isShowDelIcon
                    :isShowNum="false"
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                    v-on:drop="drop"
                    v-on:get-table-tab-data="getTableData"
                    v-on:add-tree-node="addTreeNode"
                    v-on:remove-tree-node="removeTreeNode">
                </custom-tree>
            </div>
        </div>
        <div class="no-tree" v-if="initStatus && !treeNum">
            <img src="@/assets/images/operation-tree.svg">
            <p style="line-height:26px;height:26px;"></p>
            <Button type="primary" @click="addTree">新建运营架构</Button>
        </div>
        <!-- 添加架构页面 -->
        <Drawer
            v-model="isShowDrawPage"
            width="750"
            :mask-closable="false">
            <add-architect
                v-if="isShowDrawPage"
                :title="title"
                v-on:close-modal="closeModal"
                v-on:get-root-tree="getRootTree"
                v-on:get-root-tree-name="getRootTreeName">
            </add-architect>
        </Drawer>
    </div>
</template>
<script>
    import CustomTree from '@/components/tree/CustomTree';
    import AddArchitect from './AddArchitect';

    export default {
        name: 'AddOperationTree',
        components: {
            CustomTree,
            AddArchitect
        },
        data() {
            return {
                rootId: '',
                isLoading: true,
                treeNum: 0,
                rootList: [],
                initialData: [],
                isShowDrawPage: false,
                title: '',
                detail: {},
                infoParams: {},
                rootInfo: {},
                initStatus: false,
                selectItem: ''
            };
        },
        created() {
            this.getRootTree();
            this.getRootTreeName();
        },
        mounted() {
            // 导入下级节点成功后刷新架构树数据
            this.$tools.bus.$on('finishUploadTreeData', (params) => {
                this.getRootTree(params);
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('finishUploadTreeData');
            this.$tools.bus.$off('watchRootId');
        },
        watch: {
            rootList() {
                this.showTableTab(this.rootList.length);
            },
            initialData: {
                handler() {
                    if (this.initialData.length) {
                        this.rootId = this.initialData[0].org_id;
                    }
                },
                immediate: true
            },
            rootId() {
                const _this = this;
                this.getSelectItem();
                this.$tools.bus.$on('watchRootId', (val) => {
                    if (val.org_id === _this.rootId) _this.getRootTreeName();
                });
            }
        },
        methods: {
            // 是否允许拖拽
            allowDrag(params) {
                if (params.nodeKey === 0 && !params.org_parent_id) {
                    return false;
                }
                return true;
            },
            // 是否允许拖拽后放置
            allowDrop(params) {
                return params.isSameParent;
            },
            // 拖拽后放置事件
            drop(params) {
                this.getChildren(params);
            },
            // 发送拖拽请求
            getChildren(nodedata) {
                const {
                    after, draggingNode, parentNode
                } = nodedata;
                const dest_org_id = !after ? '' : `&dest_org_id=${after.org_id}`;
                const url = `${this.$config.apiDomain}/sys/orgs/${draggingNode.org_id}/weight?org_parent_id=${parentNode.org_id}${dest_org_id}`;
                this.$axios
                    .put(url)
                    .then(({ data }) => {
                        const newChildren = data.children;
                        const oldChildren = parentNode.children;
                        this.$tools.replaceData(newChildren, oldChildren, 'org_id');
                        this.$set(parentNode, 'children', newChildren);
                    });
            },
            // 下拉列表默认显示项
            getSelectItem() {
                this.rootList.map((item) => {
                    if (item.org_id === this.rootId) {
                        this.selectItem = item.name;
                    }
                });
            },
            // 关闭滑窗
            closeModal(status) {
                this.isShowDrawPage = status;
            },
            // 显示添加根节点tree弹层
            addTree() {
                this.isShowDrawPage = true;
                this.title = '添加';
            },
            // 显示修改根节点tree弹层
            modifyTree() {
                this.isShowDrawPage = true;
                this.title = '修改';
                this.detail = {
                    name: this.initialData.name || '',
                    customerEvent: ''
                };
            },
            // 获取架构树
            getRootTree(params = {}) {
                this.isLoading = true;
                const apiUrl = '/sys/orgs/list-orgs';
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params: Object.assign(params, {
                            size: -1
                        })
                    })
                    .then(({ data }) => {
                        this.isLoading = false;
                        if (data && data.items && data.items.length) {
                            this.initialData = this.$tools.formatTreeData(data.items);
                        }
                    })
                    .catch(() => {
                        this.isLoading = false;
                    });
            },
            // 获取架构根节点名
            getRootTreeName() {
                const apiUrl = '/sys/orgs/list-root-orgs';
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params: {
                            size: -1
                        }
                    })
                    .then(({ data }) => {
                        this.initStatus = true;
                        this.rootList = data.items;
                        this.getSelectItem();
                        this.treeNum = (data && data.items && data.items.length) || 0;
                        this.treeNum && this.$emit('get-tree-num', this.treeNum);
                    })
                    .catch(() => {
                        this.initStatus = true;
                    });
            },
            // 新增架构树节点
            addTreeNode(dataObj) {
                const _this = this;
                const {
                    data, root, node, parent
                } = dataObj;
                const nodeData = data;
                const { name } = nodeData;
                const params = {
                    name
                };
                const apiUrl = `/sys/orgs/${parent.org_id}/child`;
                this.$axios
                    .post(`${this.$config.apiDomain}${apiUrl}`, params)
                    .then(({ data }) => {
                        this.$Message.destroy();
                        this.$Message.success('已添加');
                        _this.$set(nodeData, 'org_id', data.org_id);
                        _this.$set(nodeData, 'isEdit', false);
                    })
                    .catch(() => {
                        this.removeData(nodeData, node, root);
                    });
            },
            // 删除架构树节点
            removeTreeNode(dataObj) {
                const { data, root, node } = dataObj;
                const nodeData = data;
                const { org_id } = nodeData;
                const apiUrl = `/sys/orgs/${org_id}`;
                if (!org_id) {
                    this.removeData(nodeData, node, root);
                    return;
                }
                this.$axios
                    .delete(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已删除');
                        this.removeData(nodeData, node, root);
                    })
                    .catch(() => {

                    });
            },
            // 前端删除数据
            removeData(nodeData, node, root) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(nodeData);
                parent.children.splice(index, 1);
            },
            // 修改架构树节点
            editTreeNode(nodeData) {
                const _this = this;
                const { name, org_id } = nodeData;
                const params = {
                    name,
                    user_trait_values: '[]'
                };
                const apiUrl = `/sys/orgs/${org_id}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`, params)
                    .then(() => {
                        _this.$Message.destroy();
                        _this.$Message.success('已修改');
                        _this.$set(nodeData, 'isEdit', false);
                    })
                    .catch(() => {
                        _this.$set(nodeData, 'isEdit', false);
                    });
            },
            // 显示右侧tab页
            showTableTab(num) {
                this.$emit('show-table-tab-data', this.treeNum || num);
            },
            // 点击节点触发
            getTableData(params) {
                const {
                    name, res_code, res_name, org_id, ascription_type, customer_count
                } = this.initialData[0];
                this.rootInfo = {
                    name,
                    res_code,
                    org_id,
                    res_name,
                    ascription_type,
                    customer_count
                };
                // 处理&兼容节点编码数据格式
                const { user_trait_values } = params;
                if (user_trait_values && (typeof user_trait_values === 'string')) {
                    if (user_trait_values.indexOf('[') > -1
                        && user_trait_values.indexOf(']') > -1) {
                        params.user_trait_values = JSON.parse(user_trait_values);
                    } else {
                        const tempArr = [];
                        user_trait_values && user_trait_values.length && tempArr.push(user_trait_values);
                        params.user_trait_values = tempArr;
                    }
                }
                this.$tools.bus.$emit('loadNodeInfo', params, this.rootInfo, org_id);
                this.$tools.bus.$emit('handleClickTreeNode');
            },
            handleSelect(item) {
                const { org_id } = item;
                const params = {
                    org_id
                };
                this.rootId = org_id;
                this.getRootTree(params);
            },
            updateArchitectInfo(data) {
                if (data.org_id === this.rootId) {
                    const { name, user_trait_display_name, org_id } = data;
                    this.initialData[0] = Object.assign(this.initialData[0], {
                        name, user_trait_display_name, org_id
                    });
                }
            }
        }
    };
</script>
<style lang="less">
.operation-tree {
    position: relative;
    border-right: 1px solid #dcdee2;
    height: 100%;
    font-family: 'PingFangSC-Regular', sans-serif;
    font-size: 14px;
    color: #17233D;
    line-height: 22px;
    .has-tree {
        position: relative;
        height: 100%;
        .select-wrapper {
            width: 100%;
            height: 48px;
            cursor: pointer;
            .title {
                padding: 0 16px;
                width: 100%;
                height: 48px;
                text-align: left;
                .content {
                    font-family: 'PingFangSC-Medium', sans-serif;
                    font-weight: bold;
                }
                .icon {
                    float: right;
                    color: #17233D;
                }
            }
            .list-wrapper {
                height: 300px;
                overflow: auto;
                .selected {
                    color: #2185F0;
                    font-weight: bold;
                }
            }
            .add-btn {
                text-align: center;
                color: #2185F0;
                font-size: 14px;
                line-height: 22px;
                .iconfont {
                    margin-right: 6px;
                }
            }
        }
        .tree-list {
            height: calc(100% - 48px);
            #curTree {
                height: 100%;
            }
        }
    }
    .no-tree {
        height: 100%;
        text-align: center;
        img {
            margin-top: 50%;
            width: 60px;
            opacity: 0.5;
        }
        p {
            font-size: 15px;
            color: #bbb;
            line-height: 56px;
            text-align: center;
        }
    }
}
</style>
