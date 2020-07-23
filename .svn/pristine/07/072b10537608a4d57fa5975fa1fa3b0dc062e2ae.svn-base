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
            :data="tableList"
            :no-data-text="loadingOrNoData"
            :loading="loading">
        </Table>
        <Page class="page-style" :total="total" show-elevator :current="currentPage" @on-change="changePage"></Page>
    </div>
</template>

<script>
    import { Tooltip } from 'iview';

    export default {
        props: {
            traitCode: {
                type: String,
                default() {
                    return '';
                }
            },
            tabView: {
                type: String,
                default: ''
            },
            trait: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                tabName: 'dependant',
                tableList: [],
                total: 0,
                currentPage: 1,
                searchName: '',
                loading: false,
                placeholder: '',
                debounceSearch: null,
                debounceChangeTab: null,
                loadingOrNoData: '数据加载中...'
            };
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.debounceChangeTab = this.$lodash.debounce(this.tabChange, this.$config.debounce_wait);
        },
        computed: {
            tabList() {
                return [
                    {
                        name: 'dependant',
                        label: `引用的特性（${this.trait.quote_trait || 0}）`
                    },
                    {
                        name: 'be_dependant',
                        label: `被特性引用（${this.trait.quoted_by_trait || 0}）`
                    },
                    {
                        name: 'dependant_crowds',
                        label: `被人群引用（${this.trait.quoted_by_crowd || 0}）`
                    }
                ];
            },
            /** 表格的动态表头权限控制
             * 1.引用的特性/ 被特性引用
             * 2.下级没有“操作”表头
             */
            tableColumns() {
                if (this.tabName !== 'dependant_crowds') {
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
                            key: 'handle',
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
                // 被人群引用tab的表头
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
        mounted() {
            this.tabChange();
            this.status_config = this.$config.status_config;
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
                this.tableList = [];
                this.tabName = name || 'dependant';
                this.searchName = '';
                this.getData();
            },
            // 请求table 表格数据
            getData(searchName) {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                const params = {
                    page: this.current_page || 1,
                    q: searchName || ''
                };
                //  根据当前的tabName,去匹配不同的接口url地址
                let request_url;
                let type;
                const { tabName } = this;
                switch (this.tabName) {
                case 'be_dependant':
                    type = 'trait';
                    request_url = 'getTraitBeDependent';
                    break;
                case 'dependant':
                    type = 'trait';
                    request_url = 'getTraitDependant';
                    break;
                case 'dependant_crowds':
                    type = 'crowd';
                    request_url = 'getCrowdsBeDependentByTrait';
                    break;
                default:
                    break;
                }
                this.$api[type][request_url](this.traitCode, params)
                    .then((data) => {
                        if (this.tabName != tabName) {
                            return;
                        }
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.tableList = data.items;
                        this.total = data.total;
                        this.$nextTick(() => {
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        if (this.tabName != tabName) {
                            return;
                        }
                        this.tableList = [];
                        this.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },
            /** table 列表-详情
             * “dependant_crowds” 跳转到-人群详情
             * “dependant”  && “be_dependant” 跳转到-特性详情
             */
            openDetails(index, row) {
                switch (this.tabName) {
                case 'dependant_crowds':
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

                default:
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
                }
            },
            // 切换分页，重新渲染列表
            changePage(size) {
                this.currentPage = size;
                this.getData();
            },
            // 搜索框
            searIconClick() {
                this.current_page = 1;
                this.getData(this.searchName);
            }
        },
        watch: {
            // 点击依赖特性将依赖tab置为默认，并更新依赖列表.
            traitCode() {
                this.tabName = 'dependant';
                this.getData();
                document.getElementsByClassName('detail-content')[0].scrollTo(0, 0);
            }
        }
    };
</script>
