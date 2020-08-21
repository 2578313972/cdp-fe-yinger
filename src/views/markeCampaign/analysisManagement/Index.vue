<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">订单分析管理</MenuItem>
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
              placeholder="活动名称搜索"
            ></i-input>
          </i-col>
          <i-col>
            <i-button @click="addData" icon="md-add" type="primary">任务</i-button>
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

    <Drawer v-model="creatEvent" width="800" :mask-closable="false">
      <!-- <keep-alive> -->
        <create-event
          v-if="creatEvent"
          @cancelCreatEvent="cancelCreat"
          @submitCreatEvent="submitCreat"
        ></create-event>
      <!-- </keep-alive> -->
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
                butNum: 0,
                current: 1,
                pageSize: 10,
                butData: ['全部'],
                loading: false, // table的loading
                creatEvent: false,
                columns: [],
                data: [],
                allData: [],
                allDataSize: 0,
                calculate_status_item: ['未开始', '计算成功', '计算失败'],
                maxPage: 0
            };
        },
        components: {
            CreateEvent
        },
        created() {
            this.columns = [
                {
                    title: '任务名称',
                    key: 'display_name',
                    tooltip: true,
                    minWidth: 100
                },
                {
                    title: '任务ID',
                    key: 'code',
                    align: 'center',
                    tooltip: true,
                    minWidth: 40
                },
                {
                    title: '条件',
                    align: 'center',
                    key: 'ifItem',
                    width: '280px',
                    tooltip: true
                },
                {
                    title: '任务描述',
                    align: 'center',
                    key: 'descriptions',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    title: '交易起止时间',
                    align: 'center',
                    width: 220,
                    render: (h, params) => (
                  <div>{params.row.start_time_day} 至 {params.row.end_time_day}</div>
                )
                },
                {
                    title: '计算状态',
                    align: 'center',
                    minWidth: 60,
                    tooltip: true,
                    render: (h, params) => (
                  <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                )
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    align: 'center',
                    minWidth: 100,
                    tooltip: true
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
                        '删除'
                    )
                }
            ];

            this.getData();

            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 搜索
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                return this.$https.analysisManagement.queryOrderList({
                    displayName: this.name,
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    if (res.data.data) {
                        this.data = res.data.data;
                        this.allDataSize = res.data.pageInfo.total;
                        this.data.forEach((item) => {
                            item.create_time = new Date(item.create_time).toLocaleString();
                            item.ifItem += `[${item.channel}] `;
                            item.ifItem += `[${item.jlb}] `;
                            if (item.brand !== '') item.ifItem += `[${item.brand}] `;
                            if (item.area !== '') item.ifItem += `[${item.area}] `;
                            item.ifItem += `[${item.store}]`;
                            item.ifItem = item.ifItem.slice(9);
                        });
                        console.log(this.data);
                    }
                    this.loading = false;
                });
            },
            /** 模糊查询 */
            changeInput() {
                this.current = 1;
                this.getData();
            },
            /** click添加活动 */
            addData() {
                this.creatEvent = true;
            },
            /** 删除表格数据 */
            deleteEvent(params) {
                this.$Modal.confirm({
                    title: '确认删除此活动？',
                    content: `活动名称：${params.row.display_name}`,
                    loading: true,
                    onOk: () => {
                        this.$https.analysisManagement.deleteOrderAnalysis(params.row.code).then((res) => {
                            switch (res.data.success) {
                            case 'true':
                                this.getData();
                                break;
                            default:
                                break;
                            }
                            this.$Modal.remove();
                            this.$Message.destroy();
                            this.$Message.success('已删除');
                        });
                    },
                    onCancel: () => {}
                });
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
                this.creatEvent = false;
                this.getData();
                // this.allData.push(data);
            }
        },
        filters: {
            kou: (val) => {
                console.log(val);
                return val;
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
