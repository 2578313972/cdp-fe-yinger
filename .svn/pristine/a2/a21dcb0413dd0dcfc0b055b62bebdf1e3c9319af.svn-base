<template>
    <Card dis-hover :padding="0" class="channel-table">
        <!-- 渠道数据集列表 -->
        <Row type="flex" justify="end" class="padding16-18">
            <Col>
                <Button type="primary" icon="md-add" @click="addChannel(true)">新建渠道数据集</Button>
            </Col>
        </Row>
        <Table class="smce-table-noscroll td-table-no-border" :no-data-text="loadingOrNoData" :loading="isLoading" :columns="columns" :data="tableData"></Table>
        <div class="padding16-18">
        <Pagination v-if="totalCount>10" :total="totalCount" :current="currentPage" v-on:get-data="debounceGetData"></Pagination>
        </div>
        <Drawer
            v-model="isShowAddChannel"
            width="750"
            :mask-closable="false">
            <add-channel v-if="isShowAddChannel" :isShowAddChannel="isShowAddChannel" v-on:add-channel="addChannel" v-on:get-data="getData"></add-channel>
        </Drawer>
        <Drawer
            v-model="isShowAuthManager"
            width="750"
            :mask-closable="false">
            <authorize-manager v-if="isShowAuthManager" :isShowAuthManager="isShowAuthManager" :channelId="channelId"></authorize-manager>
        </Drawer>
    </Card>
</template>
<script>
    import Pagination from '@/components/Pagination.vue';
    import AuthorizeManager from './AuthorizeManager.vue';
    import AddChannel from './AddChannel.vue';

    export default {
        name: 'ChannelTable',
        components: {
            Pagination,
            AddChannel,
            AuthorizeManager
        },
        data() {
            return {
                totalCount: 0,
                isShowInput: false,
                columnIndex: '',
                currentPage: 1,
                channelId: '',
                columns: [
                    {
                        title: '渠道名称',
                        key: 'name',
                        width: 300,
                        render: (h, params) => h('span', [
                            h('span', {
                                style: {
                                    display: this.isShowInput && this.columnIndex === params.index
                                        ? 'none'
                                        : 'inline-block'
                                }
                            }, params.row.name),
                            h('i-input', {
                                props: {
                                    value: params.row.name,
                                    maxlength: 20,
                                    placeholder: '请输入渠道数据集名称'
                                },
                                attrs: {
                                    id: `input${params.index}`
                                },
                                style: {
                                    width: '80%',
                                    display: this.isShowInput && this.columnIndex === params.index
                                        ? 'inline-block'
                                        : 'none'
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'md-create',
                                    size: '16'
                                },
                                style: {
                                    display: this.isShowInput && this.columnIndex === params.index
                                        ? 'none'
                                        : 'inline-block'
                                },
                                class: {
                                    'icon-shape': true
                                },
                                on: {
                                    click: (e) => { this.edit(e, params); }
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'md-close',
                                    size: '18'
                                },
                                style: {
                                    display: this.isShowInput && this.columnIndex === params.index
                                        ? 'inline-block'
                                        : 'none',
                                    position: 'relative',
                                    top: '7px'
                                },
                                class: {
                                    'icon-shape': true
                                },
                                on: {
                                    click: () => { this.cancelSaveData(params); }
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'md-checkmark',
                                    size: '18'
                                },
                                style: {
                                    display: this.isShowInput && this.columnIndex === params.index
                                        ? 'inline-block'
                                        : 'none',
                                    position: 'relative',
                                    top: '7px'
                                },
                                class: {
                                    'icon-shape': true
                                },
                                on: {
                                    click: (e) => { this.saveData(e, params); }
                                }
                            })
                        ])
                    },
                    {
                        title: '渠道类型',
                        key: 'channel_type_name'
                    },
                    {
                        title: '渠道ID',
                        key: 'channel_id',
                        tooltip: true
                    },
                    {
                        title: '事件总数',
                        key: 'event_count',
                        render: (h, params) => h('span', `${params.row.event_count} 个事件`)
                    },
                    {
                        title: '授权渠道管理员',
                        key: 'auth_count',
                        align: 'center',
                        render: (h, params) => h('a', {
                            on: {
                                click: () => { this.authChannel(params); }
                            }
                        }, params.row.auth_count === 0 ? '未授权' : `已授权${params.row.auth_count}位`)
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => h('a', {
                            on: {
                                click: () => {
                                    this.remove(params.row);
                                }
                            }
                        }, '删除')
                    }
                ],
                tableData: [],
                isLoading: true,
                isShowAddChannel: false,
                isShowAuthManager: false,
                tablePage: this.$config.table_page,
                loadingOrNoData: '数据加载中...'
            };
        },
        created() {
            this.getData();
            const timer = this.$config.debounce_wait;
            this.debounceGetData = this.$lodash.debounce(this.getData, timer);
        },
        methods: {
            // 新建渠道
            addChannel(status) {
                this.isShowAddChannel = status;
            },
            // 授权渠道管理员
            authChannel(params) {
                this.channelId = params.row.channel_id;
                this.isShowAuthManager = true;
            },
            // 请求获取数据
            getData(page) {
                this.loadingOrNoData = '数据加载中...';
                this.isShowInput = false;
                this.isLoading = true;
                this.currentPage = page;
                const url = `${this.$config.apiDomain}/sys/channels`;
                let params = this.tablePage;
                if (page) { params = Object.assign({}, params, {
                    page
                }); }
                this.$axios
                    .get(url, {
                        params
                    })
                    .then(({ data }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.tableData = data.items;
                        this.totalCount = data.total;
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.tableData = [];
                        this.totalCount = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            // 编辑
            edit(e, params) {
                this.isShowInput = true;
                this.columnIndex = params.index;
                this.inputFocus(params);
            },
            // input聚焦
            inputFocus(params) {
                const i = params.index;
                this.$nextTick(() => {
                    const input = document.getElementById(`input${i}`).getElementsByTagName('input')[0];
                    input.value = params.row.name;
                    input.focus();
                    this.$tools.moveToEnd(input);
                });
            },
            saveData(e, data) {
                this.$nextTick(() => {
                    const inputD = document.getElementById(`input${data.index}`);
                    const inputC = inputD.getElementsByTagName('input')[0];
                    const value = inputC.value;
                    const oldValue = data.row.name;
                    this.judgeEditData(data.row, oldValue, value);
                });
            },
            judgeEditData(data, oldValue, value) {
                if (value) {
                    const reg = this.$config.reg_input.reg;
                    if (!reg.test(value)) {
                        this.$Message.destroy();
                        this.$Message.error({
                            content: this.$config.reg_input.msg,
                            duration: 5
                        });
                        return;
                    }
                    if (oldValue === value) {
                        this.isShowInput = false;
                        return;
                    }
                    data.newName = value;
                    // 发送修改请求
                    this.editData(data);
                } else {
                    this.$Message.destroy();
                    this.$Message.error('请输入名称');
                }
            },
            // 请求修改数据
            editData(item) {
                const { channel_id, newName } = item;
                const url = `${this.$config.apiDomain}/sys/channels/${channel_id}`;
                const params = {
                    name: newName
                };
                this.$axios
                    .put(url, params)
                    .then(() => {
                        this.isShowInput = false;
                        this.$set(item, 'name', newName);
                        this.$Message.success('已修改');
                    })
                    .catch(() => {
                        this.isShowInput = true;
                    });
            },
            // 取消编辑
            cancelSaveData(data) {
                const inputD = document.getElementById(`input${data.index}`);
                const inputC = inputD.getElementsByTagName('input')[0];
                inputC.value = data.row.name;
                this.isShowInput = false;
            },
            // 删除
            remove(data) {
                const { channel_id, name } = data;
                this.$Modal.confirm({
                    title: '确认删除此渠道？',
                    content: `名称：${name}<br><br>删除后将无法恢复。`,
                    onOk: () => {
                        this.deleteData(channel_id);
                    }
                });
            },
            // 请求删除数据
            deleteData(id) {
                const url = `${this.$config.apiDomain}/sys/channels/${id}`;
                this.$axios
                    .delete(url)
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已删除');
                        this.getData(this.currentPage);
                    });
            }
        },
        watch: {
            isShowAuthManager() {
                !this.isShowAuthManager && this.getData(this.currentPage);
            }
        }
    };
</script>
<style lang="less">
.channel-table {
    .title {
        .ivu-btn {
            float: right;
            .ivu-icon {
                margin-right: 3px;
            }
        }
    }
    .icon-shape {
        position: relative;
        top: 2px;
        cursor: pointer;
        float: right;
        &:hover {
            color: #3399FF;
        }
    }
}
</style>
