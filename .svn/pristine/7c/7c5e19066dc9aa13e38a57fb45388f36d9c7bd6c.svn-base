<template>
  <div class="">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">数据下载</MenuItem>
      </Menu>
    </div>
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Charts

        />
        <!-- <Table
          class="smce-table-noscroll td-table-no-border"
          :loading="loading"
          no-data-text="暂无数据"
          :columns="columns"
          :data="data"
          ref="table"
        ></Table> -->
        <Page
          class="mt16 padding16-18 ivu-row-flex ivu-row-flex-end"
          :current="current"
          :page-size="pageSize"
          :total="allTableDataSize"
          @on-page-size-change="debouncePageSize"
          @on-change="debouncePage"
          show-sizer
        />
      </Card>
    </div>
  </div>
</template>
<script>
    import Charts from '@/components/chart/charts';

    export default {
        name: 'Group',
        data() {
            return {
                current: 1, // 当前页数
                pageSize: 10, // 每页数量
                loading: false, // table的loading
                columns: [],
                tableData: [],
                allTableDataSize: 0,
                calculate_status_item: ['未开始', '计算成功', '计算失败']
            };
        },
        components: { Charts },
        created() {
            this.columns = [
                {
                    title: '任务名',
                    key: 'display_name',
                    minWidth: 100
                },
                {
                    title: '任务状态',
                    align: 'center',
                    render: (h, params) => (
                  <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                )
                },
                {
                    title: '计算状态',
                    align: 'center',
                    render: (h, params) => (
                  <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                )
                },
                {
                    title: '创建人',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => (
                  <div>{new Date(params.row.create_time).toLocaleString()}</div>
                )
                },
                {
                    title: '完成时间',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => (
                  <div>{new Date(params.row.create_time).toLocaleString()}</div>
                )
                },
                {
                    title: '操作',
                    width: 70,
                    align: 'center',
                    render: (h, params) => h(
                        'a',
                        {
                            on: {
                                click: () => {
                                    this.deleteEvent(params);
                                }
                            }
                        },
                        '下载'
                    )
                }
            ];
            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
            this.debouncePageSize = this.$lodash.debounce(this.pageChangeSize, timer); // 每页数量
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                return this.$axios.get('/cdp-web/', {
                    params: {
                        displayName: this.name,
                        page: this.current,
                        rows: this.pageSize
                    }
                }).then((res) => {
                    console.log(res);
                    this.loading = false;
                });
            },
            /** 切换页码 */
            pageChange(ind) {
                this.current = ind;
                this.getData();
            },
            /** 改变页码数量 */
            pageChangeSize(ind) {
                console.log(ind);
            }
        }
    };
</script>
<style lang="less" scoped>
.top-font {
  color: #328ff1;
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
}
/deep/ .ivu-card-body {
  padding: 0 !important;
}
</style>
