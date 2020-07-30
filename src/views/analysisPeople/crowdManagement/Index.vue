<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">人群营销管理</MenuItem>
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
                @click="butStatus(index)"
                :type="butNum===index?'primary':null"
              >{{item}}</i-button>
            </Button-group>
            <i-input
              class="width300"
              v-model="name"
              icon="ios-search"
              placeholder="人群名称搜索"
              @input="debounceSearch"
            ></i-input>
            <span class="total-count">
              共
              <i>{{allDataSize}}</i>个人群（进行中的活动人群不超过10个）
            </span>
          </i-col>
          <i-col>
            <i-button size="large" @click="addData" icon="md-add" type="primary">添加人群</i-button>
          </i-col>
        </Row>
        <Table
          class="smce-table-noscroll td-table-no-border"
          :loading="loading"
          no-data-text="暂无数据"
          :columns="columns"
          :data="tableData"
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
      <create-event
        v-if="creatEvent"
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
                butNum: 0,
                current: 1, // 第几页
                pageSize: 10, // 每一页的数量
                butData: [],
                loading: false, // table的loading
                creatEvent: false,
                columns: [],
                tableData: [],
                allData: [],
                allDataSize: 0,
                calculate_status_item: [],
                statusName: []
            };
        },
        components: {
            CreateEvent
        },
        created() {
            this.butData = ['全部'];
            this.calculate_status_item = ['未开始', '计算成功', '计算失败'];
            this.statusName = ['nostarted', 'completed', 'failed'];
            this.columns = [ // 定义Table模板
                {
                    title: '人群名称',
                    key: 'display_name',
                    minWidth: 200,
                    render: (h, params) => (
                    <div style="display:flex;">
                        <icon style='color:#19be6b;margin:auto 0;' type='ios-radio-button-on'></icon>
                        <span> {params.row.crowd_name} </span>
                    </div>
                )
                },
                {
                    title: '人群ID',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '人群数量',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '状态',
                    align: 'center',
                    render: (h, params) => (
                      <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                    )
                },
                {
                    title: '时间',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => (
                      <div>{ this.$time(new Date(params.row.create_time))} 至 {params.row.end_time_day}</div>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
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
            /** 请求数据接口 */
            this.getData();
            const timer = this.$config.debounce_wait; // 节流的延迟时间
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 模糊查询
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                this.$https.crowdManagement.queryMarketingCrowdList({
                    displayName: this.name,
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    if (res.data.data) {
                        this.tableData = res.data.data;
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
            /** 按钮切换 */
            butStatus() {},
            /** click添加活动 */
            addData() {
                this.creatEvent = true;
            },
            /** 删除表格数据 */
            deleteEvent(params) {
                this.$Modal.confirm({
                    title: '确认删除此活动？',
                    content: `活动名称：${params.row.crowd_name}`,
                    loading: true,
                    onOk: () => {
                        this.$https.crowdManagement.deleteMarketingCrowd(params.row.code).then((res) => {
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
            pageChange(e) {
                this.current = e;
                this.getData();
            },
            // 关闭新建事件
            cancelCreat(status) {
                this.creatEvent = status;
            },
            // 提交新建事件
            submitCreat() {
                this.getData();
                this.creatEvent = false;
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
