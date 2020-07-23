<template>
    <div class="authorize-manager">
        <edit-title :is-show-btn="false" title="授权渠道管理员"></edit-title>
        <div class="content common-card">
            <Col class="select-wrapper">
                <Select
                    v-model="checkedData"
                    filterable
                    remote
                    clearable
                    :remote-method="(query) => debounceSearch(query)"
                    :loading="isLoading"
                    size="large"
                    @on-change="addManager"
                    placeholder="请输入姓名/邮箱">
                    <Option
                        v-for="(option, index) in options"
                        :value='`{"value": "${option.email}", "id": "${option.id}"}`'
                        :key="index"
                        :label="option.label+option.email">
                        <span>{{option.label}}</span>
                        <span class="email">{{option.email}}</span>
                    </Option>
                </Select>
            </Col>
            <Col class="list-wrapper">
                <h5>已授权渠道管理员<span class="tip">已添加&nbsp;{{total}}&nbsp;人</span></h5>
                <Table class="smce-table-noscroll"  :no-data-text="loadingOrNoData" :loading="isTableLoading" :columns="columns" :data="tableData"></Table>
            </Col>
        </div>
    </div>
</template>
<script>
    import { debounce } from 'lodash';
    import editTitle from '@/components/EditTitle';

    export default {
        name: 'AuthorizeManager',
        components: {
            editTitle
        },
        props: ['channelId', 'isShowAuthManager'],
        data() {
            return {
                isLoading: false,
                isTableLoading: false,
                checkedData: '',
                options: [],
                total: 0,
                columns: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '操作',
                        width: 100,
                        align: 'center',
                        render: (h, params) => h('a', {
                            on: {
                                click: () => {
                                    this.remove(params.row);
                                }
                            }
                        }, '取消授权')
                    }
                ],
                tableData: [],
                loadingOrNoData: '数据加载中...'
            };
        },
        created() {
            this.debounceSearch = debounce(this.getList, this.$config.throttle_wait);
        },
        mounted() {
            if (this.channelId) {
                this.getManager();
            }
        },
        watch: {
            channelId() {
                this.getManager();
            }
        },
        methods: {
            // 查询未授权渠道管理员
            getList(query) {
                const url = `${this.$config.apiDomain}/sys/channels/${this.channelId}/auth/users`;
                const params = {
                    size: -1,
                    q: query,
                    status: 0
                };
                this.isLoading = true;
                if (query !== '') {
                    this.$axios
                        .get(url, {
                            params
                        })
                        .then(({ data }) => {
                            this.isLoading = false;
                            this.options = this.dealData(data.items);
                        })
                        .catch((error) => {
                            this.isLoading = false;
                            console.log(error);
                        });
                }
            },
            // 处理数据
            dealData(data) {
                const temp = [];
                data && data.map((item) => {
                    temp.push({
                        label: item.name,
                        value: item.email,
                        id: item.user_id,
                        email: item.email
                    });
                });
                return temp;
            },
            // 查询已授权渠道管理员
            getManager() {
                this.loadingOrNoData = '数据加载中...';
                this.isTableLoading = true;
                const url = `${this.$config.apiDomain}/sys/channels/${this.channelId}/auth`;
                const params = {
                    size: -1
                };
                this.$axios
                    .get(url, {
                        params
                    })
                    .then(({ data }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.isTableLoading = false;
                        this.tableData = data.items;
                        this.total = data.total;
                    })
                    .catch(() => {
                        this.total = 0;
                        this.tableData = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isTableLoading = false;
                    });
            },
            // 授权渠道管理员
            addManager(data) {
                if (data) {
                    const newData = JSON.parse(data);
                    const userId = newData.id;
                    const url = `${this.$config.apiDomain}/sys/channels/${this.channelId}/auth`;
                    this.$axios
                        .post(url, {
                            role_id: 'ROLE_C_ADMIN',
                            user_id: userId
                        })
                        .then(() => {
                            this.checkedData = '';
                            this.$Message.success('已添加');
                            this.getManager();
                        });
                }
            },
            // 取消授权渠道管理员
            remove(params) {
                this.$Modal.confirm({
                    title: '确认取消授权此帐号？',
                    content: `名称：${params.name}<br><br>取消授权后，此账号将无法登陆当前渠道。`,
                    onOk: () => {
                        this.delManager(params);
                    }
                });
            },
            // 发送请求取消授权渠道管理员
            delManager(data) {
                const { user_id } = data;
                const url = `${this.$config.apiDomain}/sys/channels/${this.channelId}/users/${user_id}`;
                this.$axios
                    .delete(url)
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已取消授权');
                        this.getManager();
                    });
            }
        }
    };
</script>
<style lang="less">
.authorize-manager {
    width: 750px;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
    .content {
        height: calc(100% - 94px);
        padding: 24px 0;
        .select-wrapper {
            border-bottom: 1px solid rgba(23,35,61,0.10);
            padding: 0 24px 24px;
            .email {
                float: right;
            }
        }
        .list-wrapper {
            padding: 24px;
            height: calc(100% - 40px);
            overflow: auto;
            h5 {
                padding-bottom: 24px;
                font-size: 14px;
                .tip {
                    color: rgba(23,35,61,0.55);
                    padding-left: 24px;
                }
            }
        }
    }
}
</style>
