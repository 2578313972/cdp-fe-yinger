<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">订单分析对比管理</MenuItem>
      </Menu>
    </div>
    <div class="page-content page-content-tab padding16-18">
      <Card dis-hover>
        <Row type="flex" justify="space-between" class="code-row-bg padding16-18">
          <i-col>
            <Button-group>
              <i-button
                v-for="(item) in butData"
                :key="item"
                type="primary"
              >{{item}}</i-button>
              </Button-group>
            <i-input
              class="width300"
              @input="debounceSearch"
              v-model="name"
              icon="ios-search"
              placeholder="输入任务名称"
            ></i-input>
            <span style="padding-left:10px;" v-if="dataChild.length">
                当前已选中的任务：
                <span style="font-weight:600;" v-for="(item,index) in dataChild" :key="index">
                {{ item.code }}、
                </span>
                <span :style="{color:dataChild.length>3?'red':'black'}">（可选对比人群不超过3个）</span>
            </span>
          </i-col>
          <i-col>
            <i-button size="large" :disabled="!dataChild.length" @click="addData" icon="md-add" type="primary">对比</i-button>
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
                this.$https.analysisContrastManagement.queryOrderList({
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
                        this.allDataSize = res.data.pageInfo.total;
                        this.tableColumn();
                    }
                    this.loading = false;
                });
            },
            /** 重新渲染Table结构 */
            tableColumn() {
                this.columns = [
                    {
                        title: '任务名称',
                        key: 'display_name',
                        width: '200px'
                    },
                    {
                        title: '任务ID',
                        key: 'code',
                        align: 'center'
                    },
                    {
                        title: '交易起止时间',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => (
                <div>{params.row.start_time_day} 至 {params.row.end_time_day}</div>
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
                        title: '创建时间',
                        align: 'center',
                        render: (h, params) => (
                    <div>{new Date(params.row.create_time).toLocaleString()}</div>
                    )
                    },

                    {
                        title: '选择',
                        width: 150,
                        align: 'center',
                        render: (h, params) => h('Checkbox', {
                            on: {
                                'on-change': () => {
                                    this.checkChange(params);
                                }
                            },
                            props: {
                                value: params.row.action,
                                disabled: params.row.calculate_status !== 1
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
                    this.dataChild.splice(this.dataChild.findIndex(item => item.id === id), 1);
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
            /** 关闭新建事件 */
            cancelCreat(status) {
                this.creatEvent = status;
            },
            /** 提交新建事件 */
            submitCreat() {
                this.$https.analysisContrastManagement.addOrderComparedTask({ taskIds: this.dataChild.map(item => item.code).toString() }).then((res) => {
                    switch (res.data.success) {
                    case 'true':
                        this.dataChild.forEach((item) => {
                            const act = this.data.find(item_2 => item_2.code === item.code);
                            act && (act.action = false);
                        });
                        this.dataChild = [];
                        this.tableColumn();
                        this.$Message.success({ background: true, content: res.data.msg });
                        break;
                    default:
                        this.$Message.error({ background: true, content: res.data.msg });
                        break;
                    }
                });
                this.creatEvent = false;
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
