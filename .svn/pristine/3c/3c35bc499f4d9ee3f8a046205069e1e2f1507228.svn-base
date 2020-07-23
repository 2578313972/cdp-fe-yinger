<template>
    <div class="channel-manage page-warpper">
        <div class="page-title bottom-shadow page-title-tab">
            <Menu class="pl24" mode="horizontal" theme="light" active-name="insight">
                <MenuItem name="insight">租户洞察员</MenuItem>
            </Menu>
        </div>
        <div class="page-content page-content-tab container-padding24">
            <Card dis-hover :padding="0">
                <Row class="padding16-18">
                    <Col>
                    <Select @on-change="addSpecia" class="width300" placeholder="请输入姓名/邮箱" v-model="specialMember" filterable remote :remote-method="remoteMethod" :loading="searLoading">
                        <Option v-for="item in selectData"
                            :value='`{"label":"${item.email}","id":"${item.value}"}`'
                            :label="item.name"
                            :key="item.value">
                            <span>{{item.name}}</span>
                            <span class="name-email">{{item.email}}</span>
                        </Option>
                    </Select>
                    <span class="total-count">共<i>{{total}}</i>个租户洞察员</span>
                    </Col>
                </Row>
                <Row>
                    <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                    <Row class="pageRow padding16-18" type="flex" justify="end">
                        <Page :total="total" :current="currentPage" show-elevator @on-change="pageChange"></Page>
                    </Row>
                </Row>
            </Card>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                selectData: [],
                specialMember: '',
                searLoading: false,
                gridList: {
                    columns: [{
                                  title: '姓名',
                                  key: 'name'
                              },
                              {
                                  title: '邮箱',
                                  key: 'email'
                              },
                              {
                                  title: '操作',
                                  key: 'action',
                                  width: 200,
                                  render: (h, params) => h(
                                      'a', {
                                          on: {
                                              click: () => {
                                                  this.confirmDelete(params.row);
                                              }
                                          }
                                      },
                                      '取消授权',
                                  )
                              }
                    ],
                    data: []
                },
                query: ''
            };
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(this.remoteSearchMethod, this.$config.throttle_wait);
        },
        mounted() {
            this.getData();
        },
        methods: {
            addSpecia(item) {
                if (!item) {
                    return;
                }
                const id = JSON.parse(item).id;
                const apiUrl = `/sys/viewers/${id}`;
                this.$axios
                    .post(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        this.$Message.success('已添加');
                        this.currentPage = 1;
                        this.getData();
                        this.resetAddInput();
                    })
                    .catch(() => {
                        this.resetAddInput();
                    });
            },
            // 重置搜索添加
            resetAddInput() {
                this.specialMember = '';
                this.selectData = [];
            },
            // 确认取消授权
            confirmDelete(data) {
                this.$Modal.confirm({
                    title: '确认取消授权此帐号？',
                    content: `姓名：${data.name}<br/><br/>取消授权后，此账号将无法登陆当前渠道。`,
                    onOk: () => {
                        this.deleteAccount(data.user_id);
                    }
                });
            },
            // 取消授权
            deleteAccount(id) {
                const apiUrl = `/sys/viewers/${id}`;
                this.$axios
                    .delete(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已取消授权');
                        if (this.currentPage > 1 && this.gridList.data.length == 1) {
                            this.currentPage--;
                        }
                        this.getData();
                    });
            },
            // 获取数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/sys/viewers';
                const params = {
                    page: this.currentPage,
                    rows: this.pageSize
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
                        this.gridList.data = data.items;
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
            remoteMethod(query) {
                this.query = query;
            },
            remoteSearchMethod() {
                if (this.query !== '') {
                    this.searLoading = true;
                    const apiUrl = '/sys/viewers/users';
                    const params = {
                        q: this.query
                    };
                    this.$axios
                        .get(`${this.$config.apiDomain}${apiUrl}`, {
                            params,
                            size: -1
                        })
                        .then(({
                            data
                        }) => {
                            this.searLoading = false;
                            const selectData = data.items.map(item => ({
                                name: item.name,
                                email: item.email,
                                value: item.user_id
                            }));
                            this.selectData = selectData;
                        })
                        .catch(() => {
                            this.searLoading = false;
                        });
                } else {
                    this.selectData = [];
                }
            },
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            }
        },
        watch: {
            query() {
                this.debounceSearch();
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
