<template>
  <div class="page-warpper">
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row type="flex" justify="space-between" class="code-row-bg" style="padding:10px 0 0 10px;">
          <i-col style="font-size:18px;" span="24">共<a href="javascript:void(0)" style="cursor: default;">{{allDataSize}}</a>个对比任务</i-col>
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
  </div>
</template>
<script>
    import CreateOut from '@/components/CreateOut';

    export default {
        name: 'Group',
        data() {
            return {
                current: 1,
                pageSize: 10,
                loading: false, // table的loading
                columns: [],
                showData: [],
                allData: [],
                allDataSize: 0
            };
        },
        created() {
            this.columns = [
                {
                    title: '任务ID',
                    key: 'code',
                    width: 120
                },
                {
                    title: '人群列表',
                    align: 'center',
                    width: 650,
                    render: (h, params) => (
                      <div>[ {params.row.compare_task_name} ]</div>
                    )
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    align: 'center',
                    render: (h, params) => (
                      <div>{new Date(params.row.create_time).toLocaleString()}</div>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => (h('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-around'
                        }
                    }, [
                        h(
                            'a', {
                                on: {
                                    click: () => {
                                        this.analysis(params);
                                    }
                                }
                            },
                            '分析'
                        ),
                        h(
                            CreateOut,
                            {
                                props: {
                                    task_ids: params.row.task_ids
                                }
                            }
                        )
                    ]))
                }
            ];
            this.getData();
            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                return this.$https.crowdKanban.queryComparedTaskList({
                    page: this.current,
                    rows: this.pageSize
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
                this.$router.push(`crowdKanban/detailsCrowd?code=${params.row.task_ids}`);
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
.ivu-col{margin-bottom: 15px;}
/deep/ .ivu-checkbox-wrapper,/deep/ .ivu-checkbox{margin: 0 ;}
/deep/ .ivu-card-body {
  padding: 0 !important;
}
</style>
