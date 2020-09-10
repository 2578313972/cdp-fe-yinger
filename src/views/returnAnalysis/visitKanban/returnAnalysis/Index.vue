<template>
  <div class="page-warpper">
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row type="flex" justify="space-between" class="code-row-bg padding16-18">
          <i-col style="font-size:18px;" span="24">
            <i-input
              class="width300"
              v-model="name"
              icon="ios-search"
              placeholder="回访类型搜索"
              @input="debounceSearch"
            ></i-input>
              共<a href="javascript:void(0)" style="cursor: default;">{{allDataSize}}</a>个对比任务
              </i-col>
        </Row>
        <Table
          class="smce-table-noscroll td-table-no-border"
          :loading="loading"
          no-data-text="暂无数据"
          :columns="columns"
          :data="showData"
          ref="table"
        ></Table>
        <Page
          class="mt16 padding16-18 ivu-row-flex ivu-row-flex-end"
          :current="current"
          :page-size="pageSize"
          :total="allDataSize"
          @on-change="debouncePage"
          show-elevator
        ></Page>
      </Card>
    </div>

    <Drawer v-model="creatEvent" width="800" :mask-closable="false">
      <create-event
        v-if="creatEvent"
        :title="creatTitle"
        :code="creatCode"
        :showData="dataChild"
      ></create-event>
    </Drawer>
  </div>
</template>
<script>
    export default {
        name: 'Group',
        data() {
            return {
                name: '',
                current: 1,
                pageSize: 10,
                loading: false, // table的loading
                creatEvent: false,
                columns: [],
                showData: [],
                allData: [],
                allDataSize: 0,
                dataChild: [],
                creatTitle: '',
                creatCode: ''
            };
        },
        created() {
            this.columns = [
                {
                    title: '回访类型',
                    key: 'source_type',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '回访批次号',
                    key: 'batch_num',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '分配人数',
                    key: 'total_vip_count',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '创建人',
                    key: 'creator',
                    align: 'center',
                    minWidth: 150,
                    render: (h, params) => (
                        <span>
                            {params.row.creator ? params.row.creator : '系统创建'}
                        </span>
                    )
                },
                {
                    title: '创建时间',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => (
                      <div>{new Date(params.row.create_time).toLocaleString()}</div>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => h('a', {
                        on: {
                            click: () => {
                                this.analysis(params);
                            }
                        }
                    }, '分析')
                }
            ];
            this.getData();
            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 模糊查询
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                this.$https.visitKanban.queryTaskList({
                    page: this.current,
                    rows: this.pageSize,
                    displayName: this.name
                }).then((res) => {
                    if (res.data.data) {
                        this.showData = res.data.data;
                        this.allDataSize = res.data.pageInfo.total;
                    }
                    this.loading = false;
                });
            },
            /** 点击分析 */
            analysis(params) {
                this.$router.push(`visitKanban/ReturnAnalysisPage?f_id=${params.row.f_id}`);
            },
            /** 模糊查询 */
            changeInput() {
                this.current = 1;
                this.getData();
            },
            /** 切换页码 */
            pageChange(ind) {
                this.current = ind;
                this.getData();
            }
        }
    };
</script>
<style lang="less" scoped>
  /deep/ .ivu-card-body {
    padding: 0 !important;
  }
</style>
