<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
        <Menu class="pl24" mode="horizontal" theme="light" active-name="insight">
            <MenuItem name="insight">审核</MenuItem>
        </Menu>
    </div>
    <div class="page-content page-content-tab container-padding24">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col span="16">
                <ButtonGroup>
                    <Button :type="buttonActive=='all'?'primary':'default'" @click="debounceActive('all')">全部</Button>
                    <Button :type="buttonActive=='pending'?'primary':'default'" @click="debounceActive('pending')">待审核</Button>
                </ButtonGroup>
                <Input class="width300 ml10"
                    @keyup.native.enter="debounceSearch"
                    @on-change="debounceSearch"
                    v-model="searInput"
                    icon="ios-search"
                    placeholder="请输入名称"></Input>
                <span class="total-count">共<i>{{total}}</i>条审核</span>
                </Col>
                <Col span="8" style="text-align:right;">
                    <Button v-if="isShowBtn" type="primary" @click="auditController">审核控制</Button>
                </Col>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                <Row class="pageRow padding16-18" type="flex" justify="end">
                    <Page :total="total" :pageSize="pageSize" :current="currentPage" show-elevator @on-change="debouncePage"></Page>
                </Row>
            </Row>
        </Card>
        <Drawer v-model="showAuditController" width="600" :mask-closable="false">
            <auditController v-if="showAuditController"></auditController>
        </Drawer>
        <Drawer v-model="showDetail" width="1000" :mask-closable="false">
            <auditDetail v-if="showDetail" :auditId="auditId" :auditType="`audit`"></auditDetail>
        </Drawer>
    </div>
</div>
</template>

<script>
    import '@/components/strategy';
    import auditController from './AuditController';
    import auditDetail from '@/components/AuditDetail';

    export default {
        data() {
            return {
                isShowBtn: true,
                statusConfig: this.$config.status_config,
                showDetail: false,
                showAuditController: false,
                auditId: '',
                searInput: '',
                buttonActive: 'all',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                gridList: {
                    columns: [{
                                  title: '审核内容',
                                  key: 'title',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '名称',
                                  key: 'res_name',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '审核状态',
                                  key: 'status',
                                  width: 150,
                                  render: (h, params) => {
                                      const COLORS = {
                                          rejected: '#ed4014',
                                          pass: '#19be6b',
                                          pending: ''
                                      };
                                      // let STATUS = {
                                      //     "rejected": "已拒绝",
                                      //     "pass": "已通过",
                                      //     "pending": "未审核"
                                      // };
                                      return h('div', [h('span', {
                                          style: {
                                              color: COLORS[params.row.status]
                                          }
                                      }, this.statusConfig[params.row.status])]);
                                  }
                              },
                              {
                                  title: '申请人',
                                  key: 'submiter_name',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '提交时间',
                                  key: 'create_time',
                                  width: 200
                              },
                              {
                                  title: '操作',
                                  key: 'action',
                                  width: 200,
                                  render: (h, params) => {
                                      const statusFlag = params.row.status == 'pass' || params.row.status == 'rejected';
                                      return h('div', [
                                          h(
                                              'a', {
                                                  on: {
                                                      click: () => {
                                                          this.detailAudit(params.row.id);
                                                      }
                                                  }
                                              },
                                              '详情',
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
                                                          this.actionAudit(params, 'rejected');
                                                      }
                                                  }
                                              },
                                              '拒绝',
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
                                                          this.actionAudit(params, 'pass');
                                                      }
                                                  }
                                              },
                                              '通过',
                                          )
                                      ]);
                                  }
                              }
                    ],
                    data: []
                }
            };
        },
        components: {
            auditController,
            auditDetail
        },
        created() {
            const config = this.$config;
            const timer = this.$config.debounce_wait;
            const showedRole = 'ROLE_C_ADMIN';
            const currentRoleId = config.login_info.role_id;
            this.isShowBtn = currentRoleId === showedRole;
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, timer);
            this.debounceActive = this.$lodash.debounce(this.activeFn, timer);
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer);
        },
        beforeRouteEnter(to, from, next) {
            if (to.params && to.params.status === 'pending') {
                next((vm) => {
                    vm.activeFn(to.params.status);
                });
            } else {
                next((vm) => {
                    vm.getData();
                });
            }
        },
        methods: {
            // 审核控制
            auditController() {
                this.showAuditController = true;
            },
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            // 通过/拒绝
            actionAudit(itemData, status) {
                const apiUrl = `/api/audit/${itemData.row.id}/result?status=${status}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        itemData.row.status = status;
                        if (status == 'rejected') {
                            this.$Message.destroy();
                            this.$Message.success('已拒绝审核');
                        } else {
                            this.$Message.destroy();
                            this.$Message.success('已通过审核');
                        }
                        // 如果不是全部，删除最后一页的最后一条时，更新到前一页
                        if (this.currentPage > 1 && this.gridList.data.length == 1 && this.buttonActive != 'all') {
                            this.currentPage--;
                        }
                        this.getData();
                    })
                    .catch((error) => {
                        if (error.response.data.sub_code == 'ERROR_CROWD_ACTIVE_THRESHOLD' || error.response.data.sub_code == 'ERROR_TRAIT_ACTIVE_THRESHOLD') {
                            this.$Modal.warning({
                                title: '无法激活 :',
                                content: error.response.data.message
                            });
                        }
                    });
            },
            // 审核详情
            detailAudit(id) {
                this.auditId = id;
                this.showDetail = true;
            },
            // 点击筛选按钮
            activeFn(status) {
                this.buttonActive = status;
                this.currentPage = 1;
                this.getData();
            },
            // 获取列表数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/api/audit';
                const params = {
                    q: this.searInput,
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: this.buttonActive,
                    order_by: 'create_time',
                    order: 'desc'
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
                        data.items.forEach((item) => {
                            item.create_time = item.create_time ? this.$date(+item.create_time).format('YYYY-MM-DD HH:mm:ss') : '-';
                            item.title = this.statusConfig[item.title];
                        });
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
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
