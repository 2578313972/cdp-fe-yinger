<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">数据下载</MenuItem>
      </Menu>
    </div>
    <!-- <iframe src="http://192.168.19.187:3000/d/sO-XfReWk/etl?orgId=1" width="750" height="500" frameborder="0"></iframe> -->
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row type="flex" justify="space-between" class="code-row-bg padding16-18">
          <i-col style="font-size:18px;" span="24">
            <i-input
              class="width300"
              v-model="name"
              icon="ios-search"
              placeholder="任务名搜索"
              @input="debounceSearch"
            ></i-input>
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
      <create-event v-if="creatEvent" :title="creatTitle" :code="creatCode" :showData="dataChild"></create-event>
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
                calculate_status_item: ['未开始', '计算完成', '计算失败'],
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
                    title: '任务名',
                    key: 'excel_name',
                    tooltip: true,
                    minWidth: 360
                },
                {
                    title: '计算状态',
                    minWidth: 100,
                    align: 'center',
                    render: (h, params) => (
          <div>{this.calculate_status_item[params.row.calculate_status]}</div>
        )
                },
                {
                    title: '创建人',
                    minWidth: 100,
                    key: 'creator_username',
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
                    title: '操作',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        const color = params.row.calculate_status === 1 || '#888';
                        const cursor = params.row.calculate_status === 1 || 'no-drop';
                        return h(
                            'a',
                            {
                                style: {
                                    color,
                                    cursor
                                },
                                attrs: {
                                    href: `/cdp-web/marketplugin/downLoad/downloadTaskFile?code=${params.row.code}`
                                },
                                on: {
                                    click() {
                                        this.downData();
                                    }
                                }
                            },
                            '下载'
                        );
                    }
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
                this.$https.dataDown
                    .queryDownLoadList({
                        page: this.current,
                        rows: this.pageSize,
                        displayName: this.name
                    })
                    .then((res) => {
                        if (res.data.data) {
                            this.showData = res.data.data;
                            this.allDataSize = res.data.pageInfo.total;
                        }
                        this.loading = false;
                    });
            },
            /** 模糊查询 */
            changeInput() {
                this.current = 1;
                this.getData();
            },
            /** 下载 */
            downData() {},
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
