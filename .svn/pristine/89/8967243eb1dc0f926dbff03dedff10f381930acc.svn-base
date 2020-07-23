<template>
    <div class="h100 content-box">
        <div class="w100">
            <Menu class="pl24 bottom-shadow" mode="horizontal" theme="light" :active-name="tabActive" @on-select="debounceTab">
                <MenuItem
                    v-for="(item,index) in tabList"
                    v-role-button="`${item.name}_trait_tab`"
                    :key="index"
                    :name="`${item.name}`">
                    {{item.value}}
                </MenuItem>
            </Menu>
            <div class="import_trait">
                <Button type="primary" ghost class="mr10" v-role-button="`import_trait_button`" @click="traitImport">导入特性</Button>
                <Drawer v-model="f_import" width="1200" :mask-closable="false">
                    <div slot="title"></div>
                    <trait-import
                        v-if="f_import">
                    </trait-import>
                </Drawer>
            </div>
        </div>
        <tab-content
            class="w100 tab-content"
            :columns="columns"
            :tabView="tabActive"
            @isAuthorized="isAuthorized">
        </tab-content>
    </div>
</template>

<script>
    import { Tooltip } from 'iview';
    import TabContent from './TabContent';
    import OprationList from '@/components/OprationList'; // 操作
    import TraitImport from '@/views/data/trait/TraitImport';
    // 特性管理/导入特性
    export default {
        data() {
            return {
                tabActive: '', // 数据可见性：public 公共的,group 运营组,selef 我的,subordinate 下级的。
                tabList: [
                    {
                        value: '公共的',
                        name: 'public'
                    },
                    {
                        value: '私有的',
                        name: 'self'
                    },
                    {
                        value: '运营组的',
                        name: 'group'
                    }, {
                        value: '同节点其他的',
                        name: 'node'
                    },
                    {
                        value: '下级的',
                        name: 'subordinate'
                    }
                ],
                columns_public: [
                    {
                        title: '特性名称',
                        key: 'name_lifecycle_status',
                        render: (h, params) => (
                            <div style="display:flex;">
                                <Tooltip placement="top" style="width:20px;" transfer content={this.$config.status_config[params.row.lifecycle_status]}>
                                    <icon style={(params.row.lifecycle_status == 'freeze') ? 'color:#c5c8ce' : 'color:#19be6b'} type='ios-radio-button-on'></icon>
                                </Tooltip>
                                <Tooltip placement="top" transfer content={ params.row.name } disabled={!this.showTooltip} max-width="250" class="ivu-table-cell-tooltip">
                                    <span id={`content${params.index}`} on-mouseenter={() => {
                                        this.handleTooltipIn(params.index);
                                    }} class="ivu-table-cell-tooltip-content">{ params.row.name}</span>
                                </Tooltip>
                            </div>
                        )
                    },
                    {
                        title: '特性ID',
                        width: 200,
                        key: 'code',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '类型',
                        width: 160,
                        key: 'data_type',
                        render: (h, params) => h('span', this.$config.status_config[params.row.data_type])
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive, // 下级什么都不可操作。
                                type: 'trait',
                                pageType: 'list',
                                authorized: this.authorized
                            }
                        })
                    }
                ],
                columns_self: [
                    {
                        title: '特性名称',
                        key: 'name_lifecycle_status',
                        render: (h, params) => (
                            <div style="display:flex;">
                                <Tooltip placement="top" style="width:20px;" transfer content={this.$config.status_config[params.row.lifecycle_status]}>
                                    <icon style={(params.row.lifecycle_status == 'freeze') ? 'color:#c5c8ce' : 'color:#19be6b'} type='ios-radio-button-on'></icon>
                                </Tooltip>
                                <Tooltip placement="top" transfer content={ params.row.name } disabled={!this.showTooltip} max-width="250" class="ivu-table-cell-tooltip">
                                    <span id={`content${params.index}`} on-mouseenter={() => {
                                        this.handleTooltipIn(params.index);
                                    }} class="ivu-table-cell-tooltip-content">{ params.row.name}</span>
                                </Tooltip>
                            </div>
                        )
                    },
                    {
                        title: '特性ID',
                        width: 200,
                        key: 'code',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '类型',
                        width: 160,
                        key: 'data_type',
                        render: (h, params) => h('span', this.$config.status_config[params.row.data_type])
                    },
                    {
                        title: '审核状态',
                        width: 110,
                        key: 'audit_status',
                        sortable: 'custom',
                        render: (h, params) => h('span', this.$config.status_config[params.row.audit_status])
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive, // 下级什么都不可操作。
                                type: 'trait',
                                pageType: 'list'
                            }
                        })
                    }
                ],
                columns_group: [
                    {
                        title: '特性名称',
                        key: 'name_lifecycle_status',
                        render: (h, params) => (
                            <div style="display:flex;">
                                <Tooltip placement="top" style="width:20px;" transfer content={this.$config.status_config[params.row.lifecycle_status]}>
                                    <icon style={(params.row.lifecycle_status == 'freeze') ? 'color:#c5c8ce' : 'color:#19be6b'} type='ios-radio-button-on'></icon>
                                </Tooltip>
                                <Tooltip placement="top" transfer content={ params.row.name } disabled={!this.showTooltip} max-width="250" class="ivu-table-cell-tooltip">
                                    <span id={`content${params.index}`} on-mouseenter={() => {
                                        this.handleTooltipIn(params.index);
                                    }} class="ivu-table-cell-tooltip-content">{ params.row.name}</span>
                                </Tooltip>
                            </div>
                        )
                    },
                    {
                        title: '特性ID',
                        width: 200,
                        key: 'code',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '类型',
                        width: 160,
                        key: 'data_type',
                        render: (h, params) => h('span', this.$config.status_config[params.row.data_type])
                    },
                    {
                        title: '审核状态',
                        width: 110,
                        key: 'audit_status',
                        sortable: 'custom',
                        render: (h, params) => h('span', this.$config.status_config[params.row.audit_status])
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive, // 下级什么都不可操作。
                                type: 'trait',
                                pageType: 'list'
                            }
                        })
                    }
                ],
                columns_subordinate: [
                    {
                        title: '特性名称',
                        key: 'name_lifecycle_status',
                        render: (h, params) => (
                            <div style="display:flex;">
                                <Tooltip placement="top" style="width:20px;" transfer content={this.$config.status_config[params.row.lifecycle_status]}>
                                    <icon style={(params.row.lifecycle_status == 'freeze') ? 'color:#c5c8ce' : 'color:#19be6b'} type='ios-radio-button-on'></icon>
                                </Tooltip>
                                <Tooltip placement="top" transfer content={ params.row.name } disabled={!this.showTooltip} max-width="250" class="ivu-table-cell-tooltip">
                                    <span id={`content${params.index}`} on-mouseenter={() => {
                                        this.handleTooltipIn(params.index);
                                    }} class="ivu-table-cell-tooltip-content">{ params.row.name}</span>
                                </Tooltip>
                            </div>
                        )
                    },
                    {
                        title: '特性ID',
                        width: 200,
                        key: 'code',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '类型',
                        width: 160,
                        key: 'data_type',
                        render: (h, params) => h('span', this.$config.status_config[params.row.data_type])
                    },
                    {
                        title: '审核状态',
                        width: 110,
                        key: 'audit_status',
                        sortable: 'custom',
                        render: (h, params) => h('span', this.$config.status_config[params.row.audit_status])
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive, // 下级什么都不可操作。
                                type: 'trait',
                                pageType: 'list'
                            }
                        })
                    }
                ],
                columns: [],
                authorized: false, // 是否是跨渠道，true只能查看详情
                f_import: false // 特性导入 show/hide
            };
        },
        methods: {
            handleTooltipIn(index) {
                this.$nextTick(() => {
                    const $content = document.querySelector(`#content${index}`);
                    this.showTooltip = $content.scrollWidth > $content.offsetWidth;
                });
            },
            changeTab(name) {
                this.$router.push({
                    query: {
                        tabView: name
                    }
                });
            },
            // 特性导入
            traitImport() {
                this.f_import = true;
            },
            // 是否是跨渠道
            isAuthorized(f) {
                this.authorized = f;
            }
        },
        components: {
            TraitImport,
            TabContent
        },
        created() {
            this.debounceTab = this.$lodash.debounce(this.changeTab, this.$config.debounce_wait);
        },
        mounted() {},
        /* eslint-disable no-undef */
        beforeRouteEnter(to, from, next) {
            const tabActive = to.query.tabView;
            if (!$session.getTabview()[tabActive]) { // 当前的tab不存在
                return next((vm) => {
                    routerReplace(vm.$router);
                });
            }

            if ($config.login_info.role_id == 'ROLE_C_OPERATOR' && tabActive == 'subordinate') {
                // 渠道运营专员访问下级
                next((vm) => {
                    routerReplace(vm.$router);
                });
            } else {
                next((vm) => {
                    vm.tabActive = tabActive;
                    /**
                     * 私有的和同节点其他的特性列表的表头一致
                     */
                    if (vm.tabActive === 'self' || vm.tabActive == 'node') {
                        vm.columns = vm.columns_self;
                    } else {
                        vm.columns = vm[`columns_${tabActive}`];
                    }
                // if(vm.$config.login_info.role_id=='ROLE_C_OPERATOR'){
                //     vm.tabList.splice(3,1);
                // }
                });
            }
        },
        /* eslint-disable no-undef */
        beforeRouteUpdate(to, from, next) {
            const tabActive = to.query.tabView;
            if (!$session.getTabview()[tabActive]) { // 当前的tab不存在
                return next((vm) => {
                    routerReplace(vm.$router);
                });
            }
            if ($config.login_info.role_id == 'ROLE_C_OPERATOR' && tabActive == 'subordinate') {
                // 渠道运营专员访问下级
                next((vm) => {
                    routerReplace(vm.$router);
                });
            } else {
                this.tabActive = tabActive;
                if (this.tabActive === 'self' || this.tabActive === 'node') {
                    this.columns = this.columns_self;
                } else {
                    this.columns = this[`columns_${tabActive}`];
                }
                console.log(this.columns);

                next();
            }
        },
        watch: {
            $route(to) {
                if (to.path == '/trait') {
                    sessionStorage.removeItem('traitReturn');
                    sessionStorage.removeItem('crowdReturn');
                }
            }
        }
    };

    /**
     * 解决人群、特性（trait => trait?tabView='xxx'）：
     * 路由钩子调用两遍的问题
     * 引起点击浏览器回退、前进按钮产生两次相同记录问题
     */
    function routerReplace(params) {
        params.replace({
            path: '/trait',
            query: {
                tabView: 'public'
            }
        });
    }
</script>

<style lang="less" scoped>
    .content-box{
        position: relative;
        overflow: hidden;
        .tab-content{
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
        }
        .import_trait{
            width:100px;
            line-height:60px;
            text-align: right;
            position: absolute;
            right:0;
            top:0;
            z-index:900;
        }
    }
</style>
