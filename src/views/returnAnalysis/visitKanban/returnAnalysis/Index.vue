<template>
  <div class="page-warpper">
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row
          type="flex"
          justify="space-between"
          class="code-row-bg padding16-18"
        >
          <i-col style="font-size: 18px" span="24">
            <i-input
              class="width200"
              v-model="source_type"
              icon="ios-search"
              placeholder="回访类型搜索"
              @input="debounceSearch"
            ></i-input>
            <i-input
              class="width200"
              v-model="batch_num"
              icon="ios-search"
              placeholder="回访批次号搜索"
              @input="debounceSearch"
            ></i-input>
            <i-input
              class="width200"
              v-model="department"
              icon="ios-search"
              placeholder="回访组织搜索"
              @input="debounceSearch"
            ></i-input>
            <DatePicker type="daterange" @on-change="timeChange" :value="timeQuantum" placement="bottom-end" placeholder="回访时间区间" style="width: 220px"></DatePicker>


            共<a href="javascript:void(0)" style="cursor: default">{{
              allDataSize
            }}</a
            >个对比任务
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
    import CreateOut from '@/components/CreateOut';

    export default {
        name: 'Group',
        data() {
            return {
                source_type: '',
                batch_num: '',
                department: '',
                timeQuantum: [],
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
                    minWidth: 100
                },
                {
                    title: '回访批次号',
                    key: 'batch_num',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '回访组织',
                    key: 'department',
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
          <span>{params.row.creator ? params.row.creator : '系统创建'}</span>
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
                    width: 100,
                    align: 'center',
                    render: (h, params) => h(
                        'div',
                        {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-around'
                            }
                        },
                        [
                            h(
                                'a',
                                {
                                    on: {
                                        click: () => {
                                            this.analysis(params);
                                        }
                                    }
                                },
                                '分析'
                            ),
                            h(CreateOut, {
                                props: {
                                    data: params
                                }
                            })
                        ]
                    )
                }
            ];
            this.getData();
            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 模糊查询
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            timeChange(e) {
                this.timeQuantum = e;
                this.changeInput();
            },
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                this.$https.visitKanban
                    .queryTaskList({
                        page: this.current,
                        rows: this.pageSize,
                        sourceType: this.source_type,
                        batchNum: this.batch_num,
                        department: this.department,
                        startTime: this.timeQuantum[0],
                        endTime: this.timeQuantum[1]
                    })
                    .then((res) => {
                        if (res.data.data) {
                            this.showData = res.data.data;
                            this.allDataSize = res.data.pageInfo.total;
                        }
                        this.loading = false;
                    });
            },
            /** 点击分析 */
            analysis(params) {
                this.$router.push(
                    `visitKanban/ReturnAnalysisPage?f_id=${params.row.f_id}`
                );
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
.page-content.page-content-tab.padding16-18 {
  min-height: 800px;
}
/deep/ .ivu-card-body {
  padding: 0 !important;
}
</style>
