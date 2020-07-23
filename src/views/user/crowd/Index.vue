<template>
    <div class="h100 content-box">
        <div class="w100">
            <Menu class="pl24 bottom-shadow" mode="horizontal" theme="light" :active-name="tabActive" @on-select="debounceTab">
                <MenuItem
                    v-for="(item,index) in tabList"
                    v-role-button="`${item.name}_crowd_tab`"
                    :key="index"
                    :name="`${item.name}`">
                    {{item.value}}
                </MenuItem>
            </Menu>
        </div>
        <tab-content
             class="w100 tab-content"
            :columns="columns"
            :tabView="tabActive"
            @transGroupID="transGroupID">
        </tab-content>
    </div>
</template>

<script>
    import { Tooltip } from 'iview';
    import TabContent from './TabContent';
    import OprationList from '@/components/OprationList';

    export default {
        data() {
            return {
                tabActive: '',
                trans_group_ID: '',
                tabList: [
                    {
                        value: '私有的',
                        name: 'self'
                    },
                    {
                        value: '运营组的',
                        name: 'group'
                    },
                    {
                        value: '同节点其他的',
                        name: 'node'
                    },
                    {
                        value: '下级的',
                        name: 'subordinate'
                    }
                ],
                columns: [],
                showTooltip: false,
                columns_self_group_node: [
                    {
                        title: '人群名称',
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
                        title: '人群ID',
                        key: 'code',
                        width: 120,
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '人群数量',
                        key: 'crowd_scale_filter',
                        width: 120,
                        render: (h, params) => h('span', params.row.crowd_status == 'static' ? params.row.crowd_scale_filter : (params.row.estimated_scale_filter || 0))
                    },
                    {
                        title: '审核状态',
                        width: 120,
                        key: 'audit_status',
                        sortable: 'custom',
                        render: (h, params) => h('span', this.$config.status_config[params.row.audit_status]),
                        sortType: 'normal'
                    },
                    {
                        title: '最后更新时间',
                        key: 'last_update_time',
                        sortable: 'custom',
                        width: 180,
                        render: (h, params) => h('span', params.row.last_update_time ? this.$date(+`${params.row.last_update_time}`).format('YYYY-MM-DD HH:mm:ss') : ''),
                        sortType: 'normal'
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive,
                                groupID: this.trans_group_ID,
                                type: 'crowd',
                                pageType: 'list'
                            }
                        })
                    }
                ],
                columns_subordinate: [
                    {
                        title: '人群名称',
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
                        title: '人群ID',
                        key: 'code',
                        width: 120,
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '人群数量',
                        key: 'crowd_scale_filter',
                        width: 120,
                        render: (h, params) => h('span', params.row.crowd_status == 'static' ? params.row.crowd_scale_filter : (params.row.estimated_scale_filter || 0))
                    },
                    {
                        title: '审核状态',
                        width: 120,
                        key: 'audit_status',
                        sortable: 'custom',
                        render: (h, params) => h('span', this.$config.status_config[params.row.audit_status]),
                        sortType: 'normal'
                    },
                    {
                        title: '最后更新时间',
                        key: 'last_update_time',
                        sortable: 'custom',
                        width: 180,
                        render: (h, params) => h('span', params.row.last_update_time ? this.$date(+`${params.row.last_update_time}`).format('YYYY-MM-DD HH:mm:ss') : ''),
                        sortType: 'normal'
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => h(OprationList, {
                            props: {
                                row: params.row,
                                tabView: this.tabActive,
                                groupID: this.trans_group_ID,
                                type: 'crowd',
                                pageType: 'list'
                            }
                        })
                    }
                ]

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
            transGroupID(id) {
                this.trans_group_ID = id;
            }
        },
        components: {
            TabContent
        },
        created() {
            this.debounceTab = this.$lodash.debounce(this.changeTab, this.$config.debounce_wait);
        },
        mounted() {
        },
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
                    if ((vm.tabActive == 'self') || (vm.tabActive == 'group') || (vm.tabActive === 'node')) {
                        vm.columns = vm.columns_self_group_node;
                    } else {
                        vm.columns = vm.columns_subordinate;
                    }
                    next();
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
                next((vm) => {
                    routerReplace(vm.$router);
                });
            } else {
                this.tabActive = tabActive;
                if ((this.tabActive == 'self') || (this.tabActive == 'group') || (this.tabActive === 'node')) {
                    this.columns = this.columns_self_group_node;
                } else {
                    this.columns = this.columns_subordinate;
                }
                next();
            }
        },
        watch: {
            $route(to) {
                if (to.path == '/crowd') {
                    sessionStorage.removeItem('crowdReturn');
                    sessionStorage.removeItem('traitReturn');
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
            path: '/crowd',
            query: {
                tabView: 'self'
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
    }
</style>
