<template>
    <div class="event-attr-box container-padding24">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col span="16">
                <Input class="width300" icon="ios-search" placeholder="请输入属性ID或属性名称" v-model="searInput" @keyup.native.enter="debounceSearch" @on-change="debounceSearch">
                </Input>
                <span class="total-count">共<i>{{total}}</i>个属性</span>
                </Col>
                <Col span="8" style="text-align:right;">
                <Button icon="md-add" type="primary" @click="editAttr({})">新建属性</Button>
                </Col>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data">
                </Table>
            </Row>
            <Row class="pageRow padding16-18" type="flex" justify="end">
                <Page :total="total" :pageSize="pageSize" :current="currentPage" show-elevator @on-change="debouncePage">
                </Page>
            </Row>
        </Card>
        <Drawer v-model="showAttr" width="800" :mask-closable="false">
            <CreateEventAttr :titleName="titleName" :editInfo="editInfo" v-if="showAttr"></CreateEventAttr>
        </Drawer>
    </div>
</template>

<script>
    import CreateEventAttr from './CreateEventAttr';

    export default {
        data() {
            return {
                statusConfig: this.$config.status_config,
                titleName: '',
                showAttr: false,
                editInfo: {},
                searInput: '',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                gridList: {
                    data: [],
                    columns: [
                        {
                            title: '属性ID',
                            key: 'code',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '属性名称',
                            key: 'name',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '属性类型',
                            render: (h, params) => h('span', this.statusConfig[params.row.data_type])
                        },
                        {
                            title: '可选值',
                            key: 'optional_config',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '描述',
                            key: 'description',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '关联事件',
                            render: (h, params) => h('span', `${params.row.referenced_by_event || 0} 个`)
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 120,
                            render: (h, params) => {
                                const statusFlag = params.row.referenced_by_event;
                                return h('div', [
                                    h(
                                        'a', {
                                            on: {
                                                click: () => {
                                                    this.editAttr(params.row);
                                                }
                                            }
                                        },
                                        '修改',
                                    ),
                                    h(
                                        'a', {
                                            style: statusFlag ? {
                                                'margin-left': '10px',
                                                color: '#999',
                                                cursor: 'not-allowed'
                                            } : {
                                                'margin-left': '10px'
                                            },
                                            on: {
                                                click: () => {
                                                    if (statusFlag) {
                                                        return;
                                                    }
                                                    this.confirmDelete(params.row);
                                                }
                                            }
                                        },
                                        '删除',
                                    )
                                ]);
                            }
                        }
                    ]
                },
                debouncePage: null,
                debounceSearch: null
            };
        },
        methods: {
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            // 确认删除
            confirmDelete(data) {
                this.$Modal.confirm({
                    title: '确认删除此属性？',
                    content: `属性名称：${data.name}<br/><br/>删除后将无法恢复。`,
                    onOk: () => {
                        this.deleteAttr(data.code);
                    }
                });
            },
            // 删除
            deleteAttr(code) {
                const apiUrl = `/properties/${code}`;
                this.$axios
                    .delete(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        // 删除最后一页的最后一条时，更新到前一页
                        if (this.currentPage > 1 && this.gridList.data.length == 1) {
                            this.currentPage--;
                        }
                        this.$Message.destroy();
                        this.$Message.success('已删除');
                        this.getData();
                    });
            },
            // 修改属性
            editAttr(itemData) {
                this.titleName = itemData.code ? '修改属性' : '新建属性';
                this.editInfo = itemData;
                this.showAttr = true;
            },
            // 获取列表数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/traits/event-traits';
                const params = {
                    q: this.searInput,
                    page: this.currentPage,
                    page_size: this.pageSize,
                    visibility: 'public'
                };
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        this.isLoading = false;
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        data.items.forEach((item) => {
                            item.description = item.description || '-';
                            if (!item.optional_config) {
                                item.optional_config = {
                                    values: ['-']
                                };
                            } else if (!item.optional_config.values.length) {
                                item.optional_config.values[0] = '-';
                            }
                            item.optional_config = item.optional_config.values.join(',');
                        });
                        this.gridList.data = data.items;
                        this.total = data.total;
                    })
                    .catch(() => {
                        this.gridList.data = [];
                        this.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            }
        },
        components: {
            CreateEventAttr
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateList');
            this.$tools.bus.$off('hideDrawer');
        },
        created() {
            this.getData();
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.debouncePage = this.$lodash.debounce(this.pageChange, this.$config.debounce_wait);
        },
        mounted() {
            this.$tools.bus.$on('updateList', (isAdd) => {
                isAdd && (this.searInput = '');
                this.currentPage = 1;
                this.getData();
            });
            this.$tools.bus.$on('hideDrawer', () => {
                this.showAttr = false;
            });
        }
    };
</script>

<style lang="less" scoped>
    .event-attr-box {
        height: 100%;
        overflow: auto;
    }
</style>
