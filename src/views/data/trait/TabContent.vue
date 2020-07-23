<template>
    <div class="crowd-manage-box">
        <div class="h100 crowd-manage-left">
            <div class="crowd-manage-left-Tree">
                <custom-tree
                    v-role-button="`catalog_tree_trait_${tabView}`"
                    v-if="!treeLoading"
                    ref="trait_tree"
                    :data="iniTreeList"
                    :children-data="childTreeList"
                    :max-level="5"
                    :isShowNum="false"
                    newNodeName="新增目录"
                    confirm-modal-type="目录"
                    confirm-modal-content="删除后将无法恢复。"
                    :tid="catalogIdKey"
                    :isShowAddIcon="(tabView!='subordinate')"
                    :isShowDelIcon="tabView!='subordinate'"
                    :isShowEditIcon="tabView!='subordinate'"
                    :load-data="(items,cb) => addTreeList(items,tabView,cb)"
                    :allowDrag="allowDrag"
                    :allowDrop="allowDrop"
                    @drop="drop"
                    @get-table-tab-data="findList($event,tabView)"
                    @add-tree-node="addTree($event,tabView)"
                    @remove-tree-node="removeTree($event,tabView)"
                    @edit-tree-node="editTree($event,tabView)">
                </custom-tree>
            </div>
        </div>
        <div class="h100 crowd-manage-right">
            <div class="crowd-manage-right-list">
                <Card dis-hover :padding="0">
                    <Row type="flex" justify="space-between" style="margin:16px">
                        <Col>
                            <ButtonGroup>
                                <Button
                                    v-for="(item,index) in buttonList" :key="index"
                                    :type="item.key==buttonActive?'primary':'default'"
                                    @click="debounceStatus(item.key)">
                                    {{item.value}}
                                </Button>
                            </ButtonGroup>
                            <Input class="width300 ml10" @on-change="debounceSearch" v-model="q" placeholder="请输入特性名称/ID搜索">
                                <Icon slot="suffix" type="ios-search"/>
                            </Input>
                            <span class="total-count">共<i>{{page.total}}</i>个特性</span>
                        </Col>
                        <Col v-if="!is_authorized">
                            <Button
                                icon="md-add"
                                v-role-button="'create_trait_button_' + tabView"
                                type="primary"
                                v-if="iniTreeList.length"
                                @click="f_add=true">新建特性</Button>
                            <Drawer v-model="f_add" width="1000" :mask-closable="false">
                                <div slot="title"></div>
                                <add-trait
                                    v-if="f_add"
                                    @cancel="cancel"
                                    :tabView="tabView"
                                    :groupID="groupID"
                                    :hierarchy_id="hierarchy_id"
                                    :groupName="groupName">
                                </add-trait>
                            </Drawer>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table class="smce-table-noscroll td-table-no-border" :columns="columns" :data="listData" :no-data-text="loadingOrNoData"  :loading="loading" @on-sort-change="debounceSort"></Table>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end" style="margin:16px">
                        <Col>
                            <Page :total="page.total" :current="page.current" show-elevator @on-change="debouncePage"></Page>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import AddTrait from '@/views/data/trait/Add';
    import CustomTree from '@/components/tree/CustomTree';

    export default {
        props: {
            columns: {
                default: [],
                type: Array
            },
            tabView: {
                default: '',
                type: String
            }
        },
        data() {
            return {
                trait_crowd: 'trait', // 查询目录type => trait-特性，crowd-人群，event-事件，campaign-活动
                f_add: false, // 新建人群 show/hide
                buttonActive: 'all', // 按钮状态
                buttonList: [
                    {
                        value: '全部',
                        key: 'all'
                    },
                    {
                        value: '激活',
                        key: 'active'
                    },
                    {
                        value: '冻结',
                        key: 'freeze'
                    }
                ],
                treeLoading: false, // tree的loading，防止切换运营组能看到树的‘暂无数据’字样。
                iniTreeList: [],
                childTreeList: [], // 更新子集tree data 绑定到组件
                curTreeID: '0', // 当前选中目录id，用于查询列表
                groupID: '', // 当前组id
                groupName: '', // 组name
                loading: false, // table list 的loading
                q: '', // 列表搜索框
                order: '', // desc  asc
                sortName: '', // 排序name
                listData: [],
                page: {
                    total: 0,
                    size: 10,
                    current: 1
                },
                isExpandFirstLeaf: false,
                is_authorized: false,
                node_visibility: '',
                loadingOrNoData: '数据加载中...',
                hierarchy_id: []

            };
        },
        methods: {

            getList() {
                if (!this.iniTreeList.length) return;
                this.loadingOrNoData = '数据加载中...';
                const get_params = {
                    visibility: this.tabView, // 数据可见性：public 公共的,group 运营组,selef 我的,subordinate 下级的。
                    lifecycle_status: this.buttonActive, // 生命周期, all:全部,freeze: 冻结,active:激活
                    q: this.q || undefined, // 搜索名称
                    page: this.page.current,
                    rows: this.page.size, // pagesize
                    sort: this.sortName || undefined, // 排序name
                    order: this.order || undefined, // desc  asc 后台没有做默认值，要前端初始不传此字段。
                    authorized: this.is_authorized || false,
                    node_visibility: this.node_visibility || undefined
                };
                if (this.tabView == 'self') get_params.catalog_id = this.curTreeID != 0 ? this.curTreeID : null;
                if (this.tabView == 'public') get_params.catalog_id = this.curTreeID != 0 ? this.curTreeID : null;
                // if(this.tabView=='subordinate') get_params.org_id=this.curTreeID;
                if (this.tabView == 'subordinate') get_params.org_id = (this.curTreeID == '') ? undefined : this.curTreeID;
                if (this.tabView == 'group') {
                    get_params.catalog_id = this.curTreeID != 0 ? this.curTreeID : null;
                    get_params.group_id = this.groupID || null;
                }
                this.loading = true;
                this.$api.trait.getTraits(get_params)
                    .then((data) => {
                        // 解决Bug【SMCERS-659】 ywchen 2019-04-05; 当API返回无列表且非第一页时重新发起请求；这种解决方案的结果就是当这个Case发生时，列表请求会发起两次；解决方案来自阿里云的未读消息列表
                        if ((!data.items || data.items.length == 0) && data.page > 1) {
                            this.page.current = data.page - 1;
                            this.getList();
                            return;
                        }
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.loading = false;
                        this.listData = data.items;
                        this.page.total = data.total;
                        this.page.size = data.size;
                        this.page.current = data.page;
                        if (this.isExpandFirstLeaf) {
                            this.expandFirstLeaf();
                        }
                    })
                    .catch(() => {
                        this.page.total = 0;
                        this.listData = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },

            expandFirstLeaf() {
                // 默认展开tree第一项
                this.$nextTick(() => {
                    document.querySelector('#cusTree .ivu-icon-ios-arrow-forward').click();
                });
                this.isExpandFirstLeaf = false;
            },

            // 获取tree
            getTreeList(isFirst, url = '', param = {}, ev) {
                this.loadingOrNoData = '数据加载中...';
                return this.$axios.get(url, { params: param })
                    .then((res) => {
                        const data = res.data.items;
                        data.forEach((item) => {
                            if (!item.is_leaf) {
                                item.loading = false;
                                item.children = [];
                            }
                            // 跨渠道授权的目录中不可增删改
                            if (param.authorized) {
                                item.isNotShowIcon = true;
                            }
                        });
                        this.loading = false;
                        if (isFirst) {
                            if (this.tabView === 'group') {
                                this.treeLoading = false;
                                this.iniTreeList = data;
                                if (!data.length) {
                                    this.listData = [];
                                    this.page.current = 1;
                                    this.page.total = 0;
                                    this.loadingOrNoData = '暂无数据';
                                    return;
                                }
                                data.forEach((catalog) => {
                                    catalog.tid = catalog.group_id;
                                });
                                this.curTreeID = 0;
                                this.groupID = data[0].group_id;
                                this.groupName = data[0].name;
                                this.$emit('transGroupID', data[0].group_id);
                            } else if (this.tabView === 'subordinate') {
                                this.treeLoading = false;
                                this.iniTreeList = data;
                                if (!data.length) {
                                    this.listData = [];
                                    this.page.current = 1;
                                    this.page.total = 0;
                                    this.loadingOrNoData = '暂无数据';
                                    return;
                                }
                                this.curTreeID = data[0].org_id;
                            }
                        } else {
                            this.childTreeList = data;
                            this.loadingOrNoData = '暂无数据';
                            return this.childTreeList;
                        }
                    })
                    .catch(() => {
                        this.listData = [];
                        this.page.current = 1;
                        this.page.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.treeLoading = false;
                        this.loading = false;
                        if (ev) {
                            ev.loading = false;
                        }
                    });
            },

            // click button status
            activeFn(status) {
                this.buttonActive = status;
                this.q = '';
                this.order = '';
                this.sortName = '';
                this.page.current = 1;
                this.resetSort();
                this.getList();
            },

            // 添加tree的list 展开目录，添加子集
            addTreeList(ev, tabView, cb) {
                // console.log(ev,'添加tree',tabView);
                let resultPromise = null;
                if (tabView === 'self') {
                    const param = {
                        parent_id: ev.id,
                        type: this.trait_crowd,
                        visibility: tabView,
                        rows: -1
                    };

                    resultPromise = this.getTreeList(false, `${this.$config.apiDomain}/catalogs`, param, ev);
                }
                // 公共树
                if ((tabView === 'public')) {
                    /**    authorized 跨渠道
                     * true -跨渠道
                     * false -非跨渠道
                     */

                    const param = {
                        parent_id: ev.id,
                        type: this.trait_crowd,
                        visibility: tabView,
                        rows: -1,
                        authorized: !!ev.authorized
                    };
                    resultPromise = this.getTreeList(false, `${this.$config.apiDomain}/catalogs`, param, ev);
                }
                if (tabView === 'group') {
                    const param = {
                        group_id: ev.group_id,
                        parent_id: ev.id ? ev.id : 0,
                        type: this.trait_crowd,
                        visibility: tabView,
                        rows: -1
                    };
                    resultPromise = this.getTreeList(false, `${this.$config.apiDomain}/catalogs`, param, ev)
                        .then((catalogs) => {
                            catalogs.forEach((catalog) => {
                                catalog.tid = catalog.group_id + catalog.id;
                            });
                            return catalogs;
                        });
                }
                if (tabView === 'subordinate') {
                    const param = {
                        org_id: (ev.org_id === '') ? undefined : ev.org_id,
                        rows: -1,
                        order: 'asc'
                    };
                    resultPromise = this.getTreeList(false, `${this.$config.apiDomain}/sys/orgs/children`, param, ev);
                }
                if (resultPromise) {
                    resultPromise.then((data) => {
                        if (data) {
                            cb(data);
                        }
                    });
                }
            },

            // 是否可以拖拽
            allowDrag(data) {
                // /渠道管理员：仅可公共的，私有的。
                if (this.$config.login_info.role_id == 'ROLE_C_ADMIN' && (this.tabView == 'public' || this.tabView == 'self')) {
                    // data.id== 0||data.id == ''。说明是公共的，跨渠道的根目录不可拖动；
                    if (data.id) return true;
                }
                // 节点管理员：仅私有的，运营组的。
                if (this.$config.login_info.role_id == 'ROLE_D_ADMIN' && (this.tabView == 'self' || this.tabView == 'group')) {
                    // data.id== 0。说明是私有的，根目录不可拖动；
                    if (data.id) return true;
                }
                // 节点运营专员：仅私有的，运营组的
                if (this.$config.login_info.role_id == 'ROLE_D_OPERATOR' && (this.tabView == 'self' || this.tabView == 'group')) {
                    if (data.id) return true;
                }
                return false;
            },

            // 拖拽时事件，返回true可以拖，false不可拖。
            allowDrop(data) {
                if (this.tabView == 'group') {
                    if (data.parentRootNode && data.parentDragRootNode && data.parentRootNode.group_id === data.parentDragRootNode.group_id) {
                        return true;
                    }
                    return false;
                }
                if (data.parentRootNode && data.parentDragRootNode && data.parentRootNode.id !== '' && data.parentRootNode.id === data.parentDragRootNode.id) {
                    return true;
                }
                return false;
            },

            // 拖拽完发起排序请求
            drop(nodedata) {
                const {
                    after, draggingNode, parentNode, parentDragNode
                } = nodedata;
                const dest_id = !after ? null : `dest_id=${after.id}`;
                const url = `${this.$config.apiDomain}/catalogs/${draggingNode.id}/order?${dest_id}&parent_id=${parentNode.id || 0}&direct=ahead`;
                this.$axios
                    .put(url)
                    .then(({ data }) => {
                        // removeData第二个参数表示有无目录箭头
                        this.$refs.trait_tree.removeData(draggingNode[this.catalogIdKey], parentDragNode && parentDragNode.children.length != 0);
                        const newChildren = data.items;
                        const oldChildren = parentNode.children;
                        this.$tools.replaceData(newChildren, oldChildren, 'id');
                        newChildren.find((item) => {
                            if (item.id === draggingNode.id && !item.is_leaf) {
                                item.loading = false;
                            }
                        });
                        this.$set(parentNode, 'children', newChildren);
                        this.updateHierarchyId();
                        this.getList(); // 加一句拖拽完更新列表，by pyz。
                    });
            },
            updateHierarchyId() {
                const hierarchy_id = this.$refs.trait_tree.getSelectNodeHierarchyId(this.curTreeID);
                this.hierarchy_id = hierarchy_id;
            },

            // click current tree
            findList(obj) {
                if (!obj) return;
                this.hierarchy_id = obj.hierarchy_id ? obj.hierarchy_id.split('-') : [];
                this.node_visibility = obj.type;
                this.buttonActive = 'all';
                this.q = '';
                this.page.current = 1;
                this.sortName = '';
                this.curTreeID = obj.id;
                this.$emit('transGroupID', '');
                if (this.tabView === 'group') {
                    if (obj.group_id) {
                        this.groupID = obj.group_id;
                        const curGroup = this.$lodash.find(this.iniTreeList, group => group.group_id == obj.group_id);
                        this.groupName = curGroup ? curGroup.name : '';
                        this.$emit('transGroupID', obj.group_id);
                    }
                }
                if (this.tabView === 'subordinate') this.curTreeID = obj.org_id;
                this.is_authorized = !!obj.authorized;
                this.$emit('isAuthorized', this.is_authorized);
                this.resetSort();
                this.getList();
            },

            // add tree  未区分
            addTree(v, tabView) {
                const {
                    data, root, node, parent
                } = v;
                const nodeData = data;
                // this.groupID = '';
                // if(nodeData.group_id) this.groupID = nodeData.group_id;
                this.$axios.post(`${this.$config.apiDomain}/catalogs`, {
                    name: nodeData.name, // 新增一个目录默认名称
                    type: this.trait_crowd,
                    visibility: tabView,
                    parent_id: parent.id || 0,
                    group_id: parent.group_id || null
                })
                    .then(({ data }) => {
                        if (tabView == 'group') {
                            data.tid = data.group_id + data.id;
                        }
                        this.$lodash.forEach(data, (v, k) => {
                            this.$set(nodeData, k, v);
                        });
                        this.$set(nodeData, 'isEdit', false);
                        this.$set(parent, 'loading', false);
                        this.$Message.destroy();
                        this.$Message.success('已添加');
                    })
                    .catch(() => {
                        this.removeData(nodeData, node, root);
                    });
            },

            // delete tree  未区分
            removeTree(v) {
                const { data, root, node } = v;
                const nodeData = data;
                if (!nodeData.id) {
                    this.removeData(nodeData, node, root);
                    return;
                }
                this.$axios.delete(`${this.$config.apiDomain}/catalogs/${nodeData.id}`)
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已删除');
                        this.removeData(nodeData, node, root);
                    })
                    .catch(() => {});
            },

            // 前端删除数据
            removeData(nodeData, node, root) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(nodeData);
                if (parent.children.length === 1) delete parent.loading;
                parent.children.splice(index, 1);
            },

            // edit tree  未区分
            editTree(ev, tabView) {
                const { data, oldData } = ev;
                this.$axios.put(`${this.$config.apiDomain}/catalogs/${data.id}`, {
                    name: data.name,
                    type: this.trait_crowd,
                    visibility: tabView,
                    catalog_id: data.id,
                    group_id: data.group_id
                })
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                        this.$set(data, 'isEdit', false);
                    })
                    .catch(() => {
                        this.$set(data, 'name', oldData.name);
                        this.$set(data, 'isEdit', false);
                    });
            },

            // 搜索人群
            search() {
                this.page.current = 1;
                this.order = ''; // desc  asc
                this.sortName = ''; // 排序name
                this.resetSort();
                this.getList();
            },

            // 排序
            sortChange(column) {
                if (!this.listData.length) return;
                this.sortName = column.key;
                this.order = column.order === 'normal' ? '' : column.order;
                this.page.current = 1;
                this.getList();
            },

            // 查询重置排序箭头,由于table组件不支持动态column数据，就先加在删回复箭头默认。
            resetSort() {
                this.columns.push({});
                this.columns.pop();
            },

            // change-page
            changePage(p) {
                this.page.current = p;
                this.getList();
            },

            // 取消弹窗
            cancel(f) {
                this.f_add = f;
            },

            tabViewFn(newV) {
                this.buttonActive = 'all';
                this.q = '';
                this.page.current = 1;
                this.sortName = '';
                this.order = '';
                this.groupID = '';
                this.treeLoading = false; // 解决频繁点击tab树组件消失问题
                if ((newV === 'public') || (newV === 'self')) {
                    this.isExpandFirstLeaf = true;
                    this.curTreeID = '0';
                    this.iniTreeList = [];
                    this.childTreeList = [];
                    this.$nextTick(() => {
                        this.iniTreeList.push({
                            name: this.$config.status_config[newV],
                            id: 0,
                            loading: false,
                            children: []
                        });
                        // 公共的添加“跨渠道授权”
                        if (newV === 'public') {
                            this.$axios.get(`${this.$config.apiDomain}/catalogs`, {
                                params: {
                                    type: 'trait',
                                    visibility: 'public',
                                    rows: -1,
                                    authorized: true
                                }
                            })
                                .then(({ data }) => {
                                    if (data.items.length) {
                                        this.$set(this.iniTreeList, 1, {
                                            name: '跨渠道授权', id: '', loading: false, children: [], authorized: true, isNotShowIcon: true
                                        });
                                    }
                                })
                                .catch(() => {});
                        }
                    });
                } else if (newV == 'group') {
                    this.treeLoading = true;
                    this.iniTreeList = [];
                    this.childTreeList = [];
                    this.getTreeList(true, `${this.$config.apiDomain}/user/groups`, { rows: -1 });
                } else if (newV == 'subordinate') {
                    this.iniTreeList = [];
                    this.childTreeList = [];
                    this.$nextTick(() => {
                        this.treeLoading = true;
                        this.getTreeList(true, `${this.$config.apiDomain}/sys/orgs/children`, { rows: -1 });
                    });
                }
                /**
                 * 同节点其他的权限控制
                 * 渠道管理员：只显示私有的
                 * 节点管理员：私有的+运营组的
                 */
                else if (newV === 'node') {
                    this.iniTreeList = [];
                    const role_view = this.$config.login_info.role_view.buttons;
                    for (let i = 0; i < role_view.length; i++) {
                        if (role_view[i].id === 'catalog_group_trait_in_node') {
                            if (role_view[i].visible) {
                                this.iniTreeList = [{
                                    name: '私有的',
                                    id: 0,
                                    type: 'self'
                                }, {
                                    name: '运营组的',
                                    id: 1,
                                    type: 'group'
                                }];
                            } else {
                                this.iniTreeList = [{
                                    name: '私有的',
                                    id: 0,
                                    type: 'self'
                                }];
                            }
                            break;
                        }
                    }
                    this.$nextTick(() => {
                        document.querySelector('#cusTree .ivu-icon-md-folder').click();
                    });
                    this.isExpandFirstLeaf = false;
                }
            }

        },
        computed: {
            // 未区分
            catalogIdKey() {
                if (this.tabView == 'group') {
                    return 'tid';
                }
                if (this.tabView == 'subordinate') {
                    return 'org_id';
                }
                return 'id';
            }
        },
        watch: {
            tabView(newV) {
                this.tabViewFn(newV);
            }
        },
        components: {
            CustomTree,
            AddTrait
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.search, timer); // 搜索
            this.debounceStatus = this.$lodash.debounce(this.activeFn, timer); // 激活冻结
            this.debounceSort = this.$lodash.debounce(this.sortChange, timer); // 排序
            this.debouncePage = this.$lodash.debounce(this.changePage, timer); // 分页
        },
        mounted() {
            // bus用于详情render组件删除激活等更新列表
            this.$tools.bus.$on('updateTraitList', () => {
                this.getList();
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateTraitList');
        }
    };
</script>

<style scoped lang="less">
    @import "~@/assets/styles/crowd.less";
</style>
