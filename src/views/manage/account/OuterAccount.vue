<template>
    <div class="account">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col span="16">
                <ButtonGroup>
                    <Button :type="buttonActive==''?'primary':'default'" @click="debounceChange('')">全部</Button>
                    <Button :type="buttonActive=='true'?'primary':'default'" @click="debounceChange('true')">在用</Button>
                    <Button :type="buttonActive=='false'?'primary':'default'" @click="debounceChange('false')">停用</Button>
                </ButtonGroup>
                <Input @keyup.native.enter="debounceSearch" @on-change="debounceSearch" class="width300 ml10" icon="ios-search" v-model="searInput" placeholder="请输入账号名称">
                </Input>
                <span class="total-count">共<i>{{total}}</i>个账号</span>
                </Col>
                <Col span="8" style="text-align:right;">
                <Button icon="md-add" type="primary" @click="creatAccount({})">新建账号</Button>
                </Col>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                <Row class="pageRow padding16-18" type="flex" justify="end">
                    <Page :total="total" :current="currentPage" show-elevator @on-change="debouncePage"></Page>
                </Row>
            </Row>
        </Card>
        <Drawer v-model="showEidt" width="700" :mask-closable="false">
            <creatAccount v-if="showEidt" :titleName="titleName" :accountInfo="accountInfo"></creatAccount>
        </Drawer>
    </div>
</template>

<script>
    /* eslint-disable vue/no-unused-components */
    import { Switch } from 'iview';
    import creatAccount from './CreatOuterAccount.vue';
    import Clipboard from '@/components/Clipboard';

    export default {
        data() {
            return {
                showEidt: false,
                titleName: '',
                accountInfo: {},
                searInput: '',
                buttonActive: '',
                searchContent: '',
                currentPage: 1,
                total: 0,
                pageSize: 10,
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                isShowInput: false,
                columnIndex: '',
                gridList: {
                    columns: [
                        {
                            title: 'AppID',
                            key: 'id',
                            ellipsis: true,
                            tooltip: true
                        }, {
                            title: '账号名称',
                            key: 'name',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: 'URL',
                            key: 'notify_url',
                            width: 300,
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '创建时间',
                            key: 'lastLoginTime'
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 250,
                            render: (h, params) => (
                        <div>
                            <Switch
                                value = { params.row.status }
                                on-on-change = { (val) => {
                                    this.changeSwitch(params, val);
                                } }>
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </Switch>
                            <span class={ ['a-token', { 'a-disabled': !params.row.status }] }
                                on-click= { () => {
                                    if (!params.row.status) {
                                        return;
                                    }
                                    this.creatAccount(params.row);
                                } }>修改</span>
                            <span class={ ['a-token', { 'a-disabled': !params.row.status }] }
                                on-click= { () => {
                                    if (!params.row.status) {
                                        return;
                                    }
                                    this.confirmPwd(params.row.userId, params.row.name);
                                } }>生成动态Token</span>
                        </div>
                    )
                        }
                    ],
                    data: []
                }
            };
        },
        components: {
            creatAccount,
            Clipboard
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceChange = this.$lodash.debounce(this.activeFn, timer);
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer);
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, timer);
        },
        mounted() {
            this.getData();
        },
        methods: {
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
                const {
                    userId,
                    newName
                } = item;
                const url = `/open-platform/modify/${userId}/base?sys_name=${newName}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${url}`)
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
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            // 生成动态Token
            confirmPwd(id, name) {
                const apiUrl = `/open-platform/generate/${id}/token`;
                this.$axios.post(`${this.$config.apiDomain}${apiUrl}`)
                    .then(({
                        data
                    }) => {
                        this.$Modal.success({
                            width: 600,
                            title: `账号名称：${name}`,
                            render: () => (
                            <div>
                                <span style="word-break: break-all;">Token：{ data.token } </span>
                                <Clipboard content = { data.token }></Clipboard>
                                <p class="pt20">请将此token应用于外部系统服务配置</p>
                            </div>
                        )
                        });
                    });
            },
            // 切换开关
            changeSwitch(itemData, val) {
                // 更新一下状态，否则直接更改导致值没变没有触发change事件
                itemData.row.status = val;
                const apiUrl = `/open-platform/modify/${itemData.row.userId}/status?is_enabled=${itemData.row.status}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        this.$Message.destroy();
                        if (val) {
                            this.$Message.success({
                                content: '已启用账号',
                                duration: 5
                            });
                        } else {
                            this.$Message.success({
                                content: '已停用账号<br/>将不再执行对此账号的特性授权及人群导出任务',
                                duration: 5
                            });
                        }
                        // 如果不是全部，删除最后一页的最后一条时，更新到前一页
                        if (this.currentPage > 1 && this.gridList.data.length == 1 && this.buttonActive != '') {
                            this.currentPage--;
                        }
                        this.getData();
                    })
                    .catch(() => {
                        itemData.row.status = !val;
                    });
            },
            // 新建
            creatAccount(itemData) {
                this.titleName = itemData.userId ? '修改外部系统账号' : '新建外部系统账号';
                this.accountInfo = itemData;
                this.showEidt = true;
            },
            // 点击筛选按钮
            activeFn(status) {
                this.buttonActive = status;
                this.searInput = '';
                this.currentPage = 1;
                this.getData();
            },
            // 获取数据
            getData() {
                this.isShowInput = false;
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/open-platform/list';
                const params = {
                    q: this.searInput,
                    page: this.currentPage,
                    rows: this.pageSize,
                    is_enabled: this.buttonActive
                };
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.gridList.data = this.clearData(data.items);
                        this.total = data.total;
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.total = 0;
                        this.gridList.data = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            clearData(data) {
                const newData = [];
                data.forEach((item) => {
                    newData.push({
                        lastLoginTime: item.create_time ? this.$date(+item.create_time).format('YYYY-MM-DD HH:mm:ss') : '-',
                        name: item.sys_name,
                        id: item.app_id,
                        notify_url: item.notify_url,
                        userId: item.sys_id,
                        status: item.enabled
                    });
                });
                return newData;
            },
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            }
        }
    };
</script>

<style lang="less">
    .a-token{
    cursor:pointer;
    color:#2d8cf0;
        margin-left: 10px;
        &.a-disabled{
            color: #999;
            cursor: not-allowed;
        }
    }

    .account {
        .icon-shape {
            position: relative;
            top: 2px;
            cursor: pointer;
            float: right;
            &:hover {
                color: #3399FF;
            }
        }
        .account-name {
            padding-right: 100px;
        }
    }
</style>
