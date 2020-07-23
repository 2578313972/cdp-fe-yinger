<template>
    <div class="account">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col span="16">
                <ButtonGroup>
                    <Button :type="buttonActive==''?'primary':'default'" @click="debounceChange('')">全部</Button>
                    <Button :type="buttonActive=='0'?'primary':'default'" @click="debounceChange('0')">在用</Button>
                    <Button :type="buttonActive=='-1'?'primary':'default'" @click="debounceChange('-1')">停用</Button>
                </ButtonGroup>
                <Input @keyup.native.enter="debounceSearch" @on-change="debounceSearch" class="width300 ml10" icon="ios-search" v-model="searInput" placeholder="请输入用户名/姓名/邮箱">
                </Input>
                <span class="total-count">共<i>{{total}}</i>个账号</span>
                </Col>
                <Col span="8" style="text-align:right;">
                <Button :class="{'is-hidden': authBy}" icon="md-add" type="primary" @click="creatAccount({})">新建账号</Button>
                </Col>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                <Row class="pageRow padding16-18" type="flex" justify="end">
                    <Page :total="total" :current="currentPage" show-elevator @on-change="debouncePage"></Page>
                </Row>
            </Row>
        </Card>
        <Drawer v-model="showEidt" width="600" :mask-closable="false">
            <creatAccount v-if="showEidt" :titleName="titleName" :accountInfo="accountInfo"></creatAccount>
        </Drawer>
    </div>
</template>

<script>
    /* eslint-disable vue/no-unused-components */
    import creatAccount from './CreatAccount.vue';
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
                authBy: false,
                gridList: {
                    columns: [{
                                  title: '员工ID',
                                  key: 'employeeId',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '用户名',
                                  key: 'username',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '姓名',
                                  key: 'name',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '邮箱',
                                  key: 'email',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '电话',
                                  key: 'mobile'
                              },
                              {
                                  title: '授权',
                                  key: 'authDetails',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '最后登录时间',
                                  key: 'lastLoginTime',
                                  width: 150
                              },
                              {
                                  title: '操作',
                                  key: 'action',
                                  width: 200,
                                  render: (h, params) => h('div', [
                                      h(
                                          'i-switch', {
                                              props: {
                                                  value: params.row.status
                                              },
                                              on: {
                                                  'on-change': (val) => {
                                                      this.changeSwitch(params, val);
                                                  }
                                              }
                                          }, [
                                              h(
                                                  'span', {
                                                      slot: 'open'
                                                  },
                                                  '开',
                                              ),
                                              h(
                                                  'span', {
                                                      slot: 'close'
                                                  },
                                                  '关',
                                              )
                                          ],
                                      ),
                                      h(
                                          'a', {
                                              style: !params.row.status ? {
                                                  margin: '0 10px',
                                                  color: '#999',
                                                  cursor: 'not-allowed'
                                              } : {
                                                  margin: '0 10px'
                                              },
                                              on: {
                                                  click: () => {
                                                      if (!params.row.status) {
                                                          return;
                                                      }
                                                      this.creatAccount(params.row);
                                                  }
                                              }
                                          },
                                          '修改',
                                      ),
                                      h(
                                          'a', {
                                              style: !params.row.status ? {
                                                  color: '#999',
                                                  cursor: 'not-allowed'
                                              } : {},
                                              on: {
                                                  click: () => {
                                                      if (!params.row.status) {
                                                          return;
                                                      }
                                                      this.confirmPwd(params.row.userId, params.row.username);
                                                  }
                                              }
                                          },
                                          '重置密码',
                                      )
                                  ])
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
            // 是否使用企业自用账号体系
            if (this.$config.status_config
                && ((!this.$config.status_config.auth_by && (this.$config.status_config.auth_by !== ''))
                || this.$config.status_config.auth_by === 'cdp')) {} else {
                this.authBy = true;
                this.gridList.columns.pop();
            }
        },
        mounted() {
            this.getData();
            // 更新列表
            this.$tools.bus.$on('updateAccountList', (isAdd) => {
                isAdd && (this.searInput = '');
                this.currentPage = 1;
                this.getData();
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateAccountList');
        },
        methods: {
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            // 显示重置后的密码
            showPwd(pwd, username) {
                this.$Modal.success({
                    title: '已重置密码',
                    render: h => h('div', [
                        h('span', {
                            style: {
                                'word-break': 'break-all'
                            }
                        }, `随机密码：${pwd} `),
                        h(Clipboard, {
                            props: {
                                content: pwd
                            }
                        }),
                        h('p', {
                            style: {
                                'padding-top': '20px'
                            }
                        }, `已发送到账号 ${username} 邮箱`)
                    ])
                });
            },
            // 重置密码,重置密码出二次确认框，成功后出弹窗显示密码。
            confirmPwd(id, username) {
                this.$Modal.confirm({
                    title: '确认重置此帐号的密码？',
                    content: `用户名：${username}<br><br>将发送随机密码到账号邮箱`,
                    onOk: () => {
                        const apiUrl = `/sys/users/${id}/reset-pwd`;
                        this.$axios.post(`${this.$config.apiDomain}${apiUrl}`)
                            .then(({
                                data
                            }) => {
                                // 防止$Modal.confirm关闭时，$Modal.success也关闭
                                setTimeout(() => {
                                    this.showPwd(data.result, username);
                                }, 500);
                            });
                    }
                });
            },
            // 切换开关
            changeSwitch(itemData, val) {
                // 更新一下状态，否则直接更改导致值没变没有触发change事件
                itemData.row.status = val;
                const status = val ? 'active' : 'deactive';
                const apiUrl = `/sys/users/${itemData.row.userId}/${status}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        this.$Message.destroy();
                        if (val) {
                            this.$Message.success({
                                content: '已启用账号<br/>启用通知及随机密码已发送到邮箱',
                                duration: 5
                            });
                        } else {
                            this.$Message.success({
                                content: '已停用账号<br/>此帐号将无法登陆系统，停用通知已发送到邮箱',
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
            // 新建/修改(存在userId时)
            creatAccount(itemData) {
                this.titleName = itemData.userId ? '修改账号' : '新建账号';
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
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/sys/users';
                const params = {
                    q: this.searInput,
                    page: this.currentPage,
                    rows: this.pageSize,
                    status: this.buttonActive
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
                    const authDetails = [];
                    item.auth_details.forEach((authItem) => {
                        const split = authItem.channel_name ? ' - ' : '';
                        authDetails.push(`${authItem.channel_name || ''}${split}${authItem.role_name}`);
                    });
                    newData.push({
                        authDetails: authDetails.join('\n'),
                        email: item.email,
                        employeeId: item.employee_id,
                        lastLoginTime: item.last_login_time ? this.$date(+item.last_login_time).format('YYYY-MM-DD HH:mm:ss') : '-',
                        mobile: item.mobile,
                        name: item.name,
                        userId: item.user_id,
                        username: item.username,
                        status: +item.status === 0
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

<style lang="less" scoped>
    .account {
        .is-hidden {
            display: none
        }
    }
</style>
