<template>
  <div class="page-warpper">
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row
          type="flex"
          justify="space-between"
          class="code-row-bg padding16-18"
        >
          <i-col style="font-size: 14px" span="24">
            <Select v-model="isOnline" @on-change="isOnlineChange" clearable placeholder="请选择渠道来源" style="width:150px">
                <Option v-for="item in isOnlineArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="sourceType" @on-change="sourceTypeChange" clearable placeholder="请选择资源类型" style="width:150px">
                <Option v-for="item in sourceTypeArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <DatePicker type="daterange" clearable @on-change="timeChange" :value="timeQuantum" placement="bottom-start" placeholder="回访时间区间" style="width: 220px"></DatePicker>

            <span style="padding-left:15px;">
              共<a href="javascript:void(0)" style="cursor: default;font-size:16px;">{{
              allDataSize
            }}</a
            >个对比任务</span>
            <Tooltip style="float:right" content="请先选择 时间区间 与 资源类型" placement="left" theme="light" :disabled="!disabled">
                <Button type="primary" :disabled="disabled" @click="analyse">分析</Button>
            </Tooltip>
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
    // import CreateOut from '@/components/CreateOut';

    export default {
        name: 'Group',
        data() {
            return {
                isOnline: '',
                isOnlineArr: ['线上', '线下'],
                sourceType: '',
                sourceTypeArr: ['线上', '线下'],
                disabled: true, // 显示Tooltip的提示
                timeQuantum: [],
                current: 1,
                pageSize: 10,
                loading: false, // table的loading
                creatEvent: false,
                columns: [],
                showData: [],
                allData: [],
                allFidsData: [],
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
                // {
                //     title: '回访批次号',
                //     key: 'batch_num',
                //     align: 'center',
                //     minWidth: 120
                // },
                {
                    title: '回访组织',
                    key: 'department',
                    align: 'center',
                    minWidth: 120
                },
                // {
                //     title: '分配人数',
                //     key: 'total_vip_count',
                //     align: 'center',
                //     minWidth: 150
                // },
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
                }
            ];
            this.getData();
            this.$https.statisticsKanban.querySourceType().then((res) => {
                this.sourceTypeArr = res.data.data;
            });
            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            timeChange(e) {
                this.current = 1;
                ((!!e[0] || !!e[1]) && !!this.sourceType) ? (this.disabled = false) : (this.disabled = true);
                this.timeQuantum = e;
                this.getData();
            },
            isOnlineChange() {
                this.current = 1;
                this.getData();
            },
            sourceTypeChange() {
                ((!!this.timeQuantum[0] || !!this.timeQuantum[1]) && !!this.sourceType) ? (this.disabled = false) : (this.disabled = true);
                this.current = 1;
                this.getData();
            },
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                this.$https.statisticsKanban
                    .queryTotalTaskList({
                        page: this.current,
                        rows: this.pageSize,
                        sourceType: this.sourceType,
                        isOnline: this.isOnline,
                        startTime: this.timeQuantum[0],
                        endTime: this.timeQuantum[1]
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.data.data) {
                            this.showData = res.data.data;
                            this.allFidsData = res.data.allFidsData;
                            this.allDataSize = res.data.pageInfo.total;
                        }
                        this.loading = false;
                    });
            },
            /** 点击分析 */
            analyse() {
                sessionStorage.setItem('sourceType', this.sourceType);
                sessionStorage.setItem('startTimeDay', this.timeQuantum[0]);
                sessionStorage.setItem('endTimeDay', this.timeQuantum[1]);
                this.$router.push({
                    name: 'statisticsAnalysisPage',
                    params: {
                        startTimeDay: this.timeQuantum[0],
                        endTimeDay: this.timeQuantum[1],
                        id: this.allFidsData.toString()
                    }
                });
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
