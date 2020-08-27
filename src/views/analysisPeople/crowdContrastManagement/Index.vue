<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">营销人群对比管理</MenuItem>
      </Menu>
    </div>
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row type="flex" justify="space-between" class="code-row-bg padding16-18">
          <i-col>
            <Button-group>
              <i-button
                v-for="(item,index) in butData"
                :key="item"
                :type="butNum===index?'primary':null"
              >{{item}}</i-button>
              </Button-group>
            <i-input
              class="width300"
              @input="debounceSearch"
              v-model="name"
              icon="ios-search"
              placeholder="输入人群名称"
            ></i-input>
            <span class="total-count">
              共
              <i>{{allDataSize}}</i>个人群（可选对比人群不超过3个）
            </span>
          </i-col>
          <i-col>
            <i-button :disabled="!dataChild.length" @click="addData" icon="md-add" type="primary">对比</i-button>
          </i-col>
        </Row>
        <Table
          class="smce-table-noscroll td-table-no-border"
          :loading="loading"
          no-data-text="暂无数据"
          :columns="columns"
          :data="data"
          ref="table"
        ></Table>
        <Page
          class="mt16 padding16-18 ivu-row-flex ivu-row-flex-end"
          :current = "current"
          :page-size="pageSize"
          :total="allDataSize"
          @on-change="debouncePage"
          show-elevator
        ></Page>
      </Card>
    </div>

    <Drawer v-model="creatEvent" width="1100" :mask-closable="false">
      <create-event
        v-if="creatEvent"
        :showData="dataChild"
        @cancelCreatEvent="cancelCreat"
        @submitCreatEvent="submitCreat"
      ></create-event>
    </Drawer>
  </div>
</template>
<script>
    import CreateEvent from './CreateEvent';

    export default {
        name: 'Group',
        data() {
            return {
                name: '',
                current: 1,
                butNum: 0,
                pageSize: 10,
                butData: ['全部'],
                loading: false, // table的loading
                creatEvent: false,
                calculate_status_item: ['未开始', '计算成功', '计算失败'],
                columns: [],
                data: [],
                allData: [],
                allDataSize: 0,
                dataChild: []
            };
        },
        components: {
            CreateEvent
        },
        created() {
            this.getData();

            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 搜索
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                return this.$https.crowdContrastManagement.queryMarketingCrowdList({
                    displayName: this.name,
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    if (res.data.data) {
                        this.data = res.data.data;
                        this.data.forEach((item) => {
                            item.action = false;
                        });
                        if (this.dataChild.length > 0) {
                            this.dataChild.forEach((item) => {
                                const act = this.data.find(item_2 => item_2.code === item.code);
                                act && (act.action = true);
                            });
                        }
                        this.tableColumn();
                        this.allDataSize = res.data.pageInfo.total;
                        const usecode = this.data.find(item => item.code === 'ct00001');
                        if (usecode) {
                            const nowDateArr = new Date().toLocaleDateString().split('/');
                            nowDateArr[2] = +nowDateArr[2] < 15 ? 1 : 15;
                            usecode.start_time_day = new Date(nowDateArr[0] - 1, nowDateArr[1] - 1, nowDateArr[2]).valueOf();
                            usecode.end_time_day = `${nowDateArr[0]}-${nowDateArr[1]}-${nowDateArr[2]}`;
                        }
                    }
                    this.loading = false;
                });
            },
            /** 重新渲染Table结构 */
            tableColumn() {
                this.columns = [
                    {
                        title: '人群名称',
                        key: 'crowd_name',
                        minWidth: 140,
                        tooltip: true
                    },
                    {
                        title: '人群ID',
                        key: 'code',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '人群数量',
                        key: 'crowd_scale',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => (
                        <div>{this.$kilobit(params.row.crowd_scale)}</div>
                        )
                    },
                    {
                        title: '描述',
                        key: 'descriptions',
                        align: 'center',
                        minWidth: 200,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => (
                        <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                        )
                    },
                    {
                        title: '时间',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => (
                        <div>{ this.$time(new Date(params.row.start_time_day))} 至 {params.row.end_time_day}</div>
                        )
                    },
                    {
                        title: '选择',
                        minWidth: 90,
                        align: 'center',
                        render: (h, params) => h('Checkbox', {
                            on: {
                                'on-change': () => {
                                    this.checkChange(params);
                                }
                            },
                            props: {
                                value: params.row.action,
                                disabled: params.row.calculate_status !== 1 || params.row.crowd_scale <= 0
                            }
                        })
                    }
                ];
            },
            /** 模糊查询 */
            changeInput() {
                this.current = 1;
                this.getData();
            },
            /** 复选框选择 */
            checkChange(params) {
                this.data[params.index].action = !this.data[params.index].action;
                if (this.data[params.index].action) {
                    this.dataChild.push(this.data[params.index]);
                } else {
                    const id = this.data[params.index].code;
                    this.dataChild.splice(this.dataChild.findIndex(item => item.code === id), 1);
                }
            },
            /** click添加活动 */
            addData() {
                if (this.dataChild.length > 3) {
                    this.$Message.error({
                        background: true,
                        content: '最大对比条数不得超过3条~~'
                    });
                    return;
                }
                this.creatEvent = true;
            },
            /** 切换页码 */
            pageChange(ind) {
                this.current = ind;
                this.getData();
            },
            // 关闭新建事件
            cancelCreat(status) {
                this.creatEvent = status;
            },
            // 提交新建事件
            submitCreat() {
                this.$https.crowdContrastManagement.addCrowdComparedTask({
                    taskIds: this.dataChild.map(item => item.code).toString()
                }).then((res) => {
                    switch (res.data.success) {
                    case 'true':
                        this.$Message.success({ background: true, content: res.data.msg });
                        break;
                    default:
                        this.$Message.error({ background: true, content: res.data.msg });
                        break;
                    }
                    this.creatEvent = false;
                });
            }
        }
    };
</script>
<style lang="less" scoped>
/deep/ .ivu-checkbox-wrapper,/deep/ .ivu-checkbox{margin: 0 ;}
/deep/ .ivu-card-body {
  padding: 0 !important;
}
</style>
