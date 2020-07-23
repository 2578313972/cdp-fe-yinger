<template>
    <div style="border:1px #e8eaec solid; border-radius:5px; background:#fff;">
        <!--详情-关联的引用 -->
        <Tabs size="small" @on-click="debounceChangeTab" v-model="tabName" style="margin:10px 24px 0 24px;">
            <TabPane
                v-for="(item,index) in tabList"
                :key="index"
                :label="item.label"
                :name="item.name">
            </TabPane>
            <Input
                slot="extra"
                class="dependant-search"
                @keyup.native.enter="debounceSearch"
                @on-change="debounceSearch"
                v-model="searchName"
                :placeholder="placeholder"
                icon="ios-search">
            </Input>
        </Tabs>
        <Table
            class="smce-table-noscroll td-table-no-border"
            :columns="tableColumns"
            :data="tableData"
            :no-data-text="loadingOrNoData"
            :loading="loading">
        </Table>
        <Page class="page-style" :total="total" :current="currentPage" show-elevator @on-change="changePage"></Page>
    </div>
</template>

<script>
    import { Tooltip } from 'iview';

    export default {
        props: {
            crowdCode: {
                type: [String, Number],
                default: ''
            },
            tabView: {
                type: String,
                default: ''
            },
            lossAffiliatedId: {
                type: [String, Number],
                default: ''
            },
            increaseAffiliatedId: {
                type: [String, Number],
                default: ''
            },
            crowdListContent: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                tabName: 'depend_traits',
                tableData: [],
                searchName: '',
                currentPage: 1,
                loading: false,
                total: 0,
                placeholder: '',
                debounceSearch: null,
                debounceChangeTab: null,
                loadingOrNoData: '数据加载中...'
            };
        },
        computed: {
            tabList() {
                return [
                    {
                        name: 'depend_traits',
                        label: `引用的特性（${this.crowdListContent.ref_trait_count || 0}）`
                    },
                    {
                        name: 'reference_crowd',
                        label: `引用的人群（${this.crowdListContent.ref_crowd_count || 0}）`
                    },
                    {
                        name: 'crowd_reference',
                        label: `被人群引用（${this.crowdListContent.crowd_ref_count || 0}）`
                    }
                    // 本期先隐藏，下个版本添加 @晓晴5.17
                    //   {
                    //       name: 'crowd_increase',
                    //       label: '附属流入人群被人群引用'
                    //   },
                    //   {
                    //       name: 'crowd_loss',
                    //       label: '附属流出人群被人群引用'
                    //   }
                ];
            },

            /**
             * 表格的动态表头权限控制  引用的人群/被人群引用
             * 下级没有操作表头
             */
            tableColumns() {
                // -被人群引用
                if (this.tabName !== 'depend_traits') {
                    this.placeholder = '请输入人群名称/ID搜索';
                    const columns = [
                        {
                            title: '人群名称',
                            key: 'name',
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
                            key: 'code'
                        },
                        {
                            title: '人群数量',
                            key: 'crowd_scale'
                        },
                        {
                            title: '操作',
                            align: 'center',
                            key: 'handle',
                            render: (h, params) => {
                                const _this = this;
                                let status;
                                if (params.row.code !== _this.crowdCode) {
                                    status = true;
                                } else {
                                    status = false;
                                }
                                return h('a', {
                                    style: status ? {} : {
                                        color: '#999',
                                        cursor: 'not-allowed'
                                    },
                                    on: {
                                        click: () => {
                                            if (!status) {
                                                return;
                                            }
                                            this.openDetails(params.index, params.row);
                                        }
                                    }
                                }, '详情');
                            }
                        }
                    ];
                    return columns;
                }
                // 引用的特性tab表头
                this.placeholder = '请输入特性名称/ID搜索';
                const columns = [
                    {
                        title: '特性名称',
                        key: 'name',
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
                        key: 'code'
                    },
                    {
                        title: '类型',
                        key: 'data_type',
                        render: (h, params) => h('span', this.status_config[params.row.data_type])
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => h('a', {
                            on: {
                                click: () => {
                                    this.openDetails(params.index, params.row);
                                }
                            }
                        }, '详情')
                    }
                ];
                return columns;
            }
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.debounceChangeTab = this.$lodash.debounce(this.tabChange, this.$config.debounce_wait);
        },
        mounted() {
            this.tabChange(name);
            this.status_config = this.$config.status_config;
            this.$tools.bus.$off('update-crowd-dependant');
            this.$tools.bus.$on('update-crowd-dependant', () => {
                if (this.tabName === 'crowd_reference') {
                    this.getData();
                }
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('update-crowd-dependant');
        },
        methods: {
            handleTooltipIn(index) {
                this.$nextTick(() => {
                    const $content = document.querySelector(`#content${index}`);
                    this.showTooltip = $content.scrollWidth > $content.offsetWidth;
                });
            },
            // 切换tab
            tabChange(name) {
                this.loading = true;
                this.currentPage = 1;
                this.total = 0;
                this.tabName = name || 'depend_traits';
                this.tableData = [];
                this.searchName = '';
                this.getData();
            },
            // 请求table 表格数据
            getData(searchName) {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                const { tabName } = this;
                const param = {
                    page: this.currentPage || 1,
                    q: searchName || ''
                };

                // 根据当前的tabName,去匹配不同的接口url地址
                let requestUrl;
                switch (this.tabName) {
                case 'crowd_reference':
                    requestUrl = `${this.crowdCode}/crowd/reference`;
                    break;
                case 'reference_crowd':
                    requestUrl = `${this.crowdCode}/reference/crowd`;
                    break;
                case 'depend_traits':
                    requestUrl = `${this.crowdCode}/crowd/depend-traits`;
                    break;
                case 'crowd_loss':
                    if (this.lossAffiliatedId) {
                        requestUrl = `${this.lossAffiliatedId}/crowd/reference`;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                        this.loading = false;
                        return;
                    }
                    break;
                case 'crowd_increase':
                    if (this.increaseAffiliatedId) {
                        requestUrl = `${this.increaseAffiliatedId}/crowd/reference`;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                        this.loading = false;
                        return;
                    }
                    break;
                default:
                    break;
                }
                this.$axios.get(`${this.$config.apiDomain}/crowds/${requestUrl}`, {
                    params: param
                })
                    .then(({
                        data
                    }) => {
                        if (this.tabName != tabName) {
                            return;
                        }
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.total = data.total;
                        this.tableData = data.items;
                        this.$nextTick(() => {
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        if (this.tabName != tabName) {
                            return;
                        }
                        this.tableData = [];
                        this.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },
            // 点击搜索
            searIconClick() {
                this.currentPage = 1;
                this.getData(this.searchName);
            },
            /**
             * table 列表-详情
             * “depend_traits” 跳转到-特性详情
             * “reference_crowd” && “crowd_reference” 跳转到-人群详情
             */
            openDetails(index, row) {
                switch (this.tabName) {
                case 'depend_traits':

                    this.$router.push({
                        path: '/trait/detail',
                        query: {
                            name: 'detail',
                            code: row.code,
                            tabView: this.$session.getViewScope(row),
                            groupID: row.group_id
                        }
                    });
                    this.$tools.bus.$emit('updataTraitDetail', true);
                    break;

                default:

                    this.$router.push({
                        path: '/crowd/detail',
                        query: {
                            name: 'detail',
                            code: row.code,
                            tabView: this.$session.getViewScope(row),
                            groupID: row.group_id
                        }
                    });
                    this.$tools.bus.$emit('updataCrowdDetail', true);
                    break;
                }
            },
            // 切换分页，重新渲染列表
            changePage(size) {
                this.currentPage = size;
                this.getData();
            }
        },
        watch: {
            // 点击依赖人群将依赖tab置为默认，并更新依赖列表.
            crowdCode() {
                this.tabName = 'depend_traits';
                this.getData();
                document.getElementsByClassName('detail-content')[0].scrollTo(0, 0);
            }
        }
    };
</script>
