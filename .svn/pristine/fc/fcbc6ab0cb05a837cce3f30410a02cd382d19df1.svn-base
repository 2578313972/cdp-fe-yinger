<template>
    <div class="event-content-box container-padding24">
        <Card dis-hover :padding="0">
            <Row class="padding16-18" type="flex" justify="space-between">
                <Col>
                    <Input
                        class="width300"
                        icon="ios-search"
                        placeholder="请输入事件ID或事件名称"
                        v-model="searInput"
                        @keyup.native.enter="debounceSearch"
                        @on-change="debounceSearch">
                    </Input>
                    <span class="total-count">共<i>{{page.total}}</i>个事件</span>
                </Col>
                <Col>
                    <Button icon="md-add" type="primary" v-if="$config.login_info.role_id!='ROLE_D_OPERATOR'&&$config.login_info.role_id!='ROLE_D_ADMIN'" @click="addEvent({})">新建事件</Button>
                </Col>
            </Row>
            <Row>
                <Table
                    class="smce-table-noscroll td-table-no-border"
                    :loading="loading"
                    :no-data-text="loadingOrNoData"
                    :columns="eventColumns"
                    :data="eventData">
                </Table>
            </Row>
            <Row class="mt16 padding16-18" type="flex" justify="end">
                <Page
                    :total="page.total"
                    :pageSize="page.pageSize"
                    :current="page.currentPage"
                    show-elevator
                    @on-change="debouncePage">
                </Page>
            </Row>
        </Card>
        <Drawer v-model="creatEvent" width="800" :mask-closable="false">
            <create-event
                v-if="creatEvent"
                :title="evtntTitle"
                @cancelCreatEvent="cancelCreat"
                @submitCreatEvent="submitCreat">
            </create-event>
        </Drawer>
    </div>
</template>

<script>
    import qs from 'qs';
    import CreateEvent from './CreateEvent.vue';

    export default {
        data() {
            return {
                creatEvent: false,
                eventData: [],
                eventDetail: {},
                titleName: '',
                loading: true, // table的loading
                evtntTitle: '新建事件',
                loadingOrNoData: '数据加载中...',
                debounceSearch: null,
                debouncePage: null,
                searInput: '',
                page: {
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                }
            };
        },
        computed: {
            eventColumns() {
                const columns = [
                    {
                        title: '事件ID',
                        key: 'code',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    },
                    {
                        title: '事件名称',
                        key: 'name',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    },
                    // {
                    //     title: '事件类型',
                    //     ellipsis: true, // 超出省略
                    //     tooltip: true,
                    //     render: (h, params) => h('span', [
                    //         h('span', this.$config.status_config[params.row.event_type])
                    //     ])
                    // },
                    {
                        title: '描述',
                        key: 'description',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    }
                ];
                const operateColumns = {
                    title: '操作',
                    key: 'action',
                    width: 120,
                    render: (h, params) => {
                        const statusFlag = params.row.event_type === 'system_event';
                        return h('div', [
                            h(
                                'a', {
                                    on: {
                                        click: () => {
                                            this.openDetail(params.row.code);
                                        }
                                    }
                                },
                                '查看'
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
                                            this.deleteEvent(params.row);
                                        }
                                    }
                                },
                                '删除',
                            )
                        ]);
                    }
                };
                const operateColumnsRole = {
                    title: '操作',
                    key: 'action',
                    width: 120,
                    render: (h, params) => h('div', [
                        h(
                            'a', {
                                on: {
                                    click: () => {
                                        this.openDetail(params.row.code);
                                    }
                                }
                            },
                            '查看'
                        )
                    ])
                };
                // 根据当前角色判断是否添加“操作”按钮，只有渠道管理员有权限添加
                if (
                    this.$config.login_info.role_id === 'ROLE_C_ADMIN'
                    && this.eventDetail.event_type !== 'system_event'
                ) {
                    columns.push(operateColumns);
                }
                if (this.$config.login_info.role_id == 'ROLE_D_ADMIN' || this.$config.login_info.role_id == 'ROLE_D_OPERATOR') {
                    columns.push(operateColumnsRole);
                }
                return columns;
            }
        },
        components: {
            CreateEvent // 新建事件
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(
                this.searIconClick,
                this.$config.debounce_wait
            );
            this.debouncePage = this.$lodash.debounce(
                this.pageChange,
                this.$config.debounce_wait
            );
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取table 数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.$axios
                    .get(`${this.$config.apiDomain}/events`, {
                        params: {
                            authorized: false,
                            size: -1,
                            event_type: ['system_event', 'business_event'],
                            order: 'asc',
                            q: this.searInput,
                            page_size: this.page.pageSize,
                            page: this.page.currentPage
                        },
                        paramsSerializer: params => qs.stringify(params, {
                            indices: false
                        })
                    })
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loading = false;
                            this.loadingOrNoData = '暂无数据';
                            this.eventData = [];
                        } else {
                            this.loading = false;
                            this.eventData = data.items;
                            this.page.total = data.total;
                        }
                    })
                    .catch(() => {
                        this.eventData = [];
                        this.page.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },
            // 新建事件
            addEvent(itemData) {
                this.titleName = itemData.code ? '修改事件' : '新建事件';
                this.creatEvent = true;
            },
            // 关闭新建事件
            cancelCreat(status) {
                this.creatEvent = status;
            },
            // 删除自定义事件
            deleteEvent(row) {
                let isSubmited = false; // 为解决loading取消modal关闭时发送的请求
                this.$Modal.confirm({
                    title: '确认删除此事件？',
                    content: `事件名称：${row.name}`,
                    loading: true,
                    onOk: () => {
                        if (isSubmited) {
                            return;
                        }
                        this.$axios
                            .delete(`${this.$config.apiDomain}/events/${row.code}`)
                            .then(() => {
                                isSubmited = true;
                                this.$Modal.remove();
                                this.$Message.destroy();
                                this.$Message.success('已删除');
                                this.getData();
                            })
                            .catch(() => {
                                this.$Modal.remove();
                            });
                    },
                    onCancel: () => {}
                });
            },
            // 搜索
            searIconClick() {
                this.page.currentPage = 1;
                this.getData();
            },
            // 分页
            pageChange(page) {
                this.page.currentPage = page;
                this.getData();
            },
            openDetail(code) {
                this.$router.push({
                    path: '/event/detail',
                    query: {
                        code
                    }
                });
                this.$tools.bus.$emit('updataEventDetail', true);
            },
            // 提交新建事件 , 新增事件后，更新右侧详情
            submitCreat() {
                this.creatEvent = false;
                this.searInput = '';
                this.getData();
            },
            // 导出事件
            exportEventConfig() {
                window.location.replace(
                    `${this.$config.apiDomain}/events/${this.eventDetail.code}/export`
                );
            }
        },
        watch: {
            $route(to, from) {
                if (from.path === '/event/detail') {
                    this.getData();
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .event-content-box {
        height: 100%;
        overflow: auto;
    }
</style>
