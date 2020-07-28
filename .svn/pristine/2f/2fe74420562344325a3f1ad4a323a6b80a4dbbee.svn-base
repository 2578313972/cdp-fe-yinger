<template>
  <div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">生活日历看板</MenuItem>
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
              placeholder="活动名称搜索"
              @input="debounceSearch"
            ></i-input>
            <span class="total-count">
              共
              <i>{{allDataSize}}</i>个活动
            </span>
          </i-col>
          <i-col>
            <span class="top-font" @click="downloadExcel">下载模板</span>
            <i-button size="default">导入</i-button>
            <i-button size="default" @click="addData" icon="md-add" type="primary">添加活动</i-button>
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
                butData: ['全部', '未开始', '进行中', '结束'],
                loading: false, // table的loading
                creatEvent: false,
                columns: [],
                data: [],
                allData: [],
                allDataSize: 0,
                calculate_status_item: ['未开始', '进行中', '结束'],
                statusName: []
            };
        },
        components: {
            CreateEvent
        },
        created() {
            this.statusName = ['processing', 'nostarted', 'completed'];
            this.columns = [ // 定义Table模板
                {
                    title: '活动名称',
                    key: 'display_name',
                    render: (h, params) => (
                    <div style="display:flex;">
                        <icon style={(params.row.calculate_status === '0') ? 'color:#FFCD42;margin:auto 0;' : (params.row.calculate_status === '1') ? 'color:#19be6b;margin:auto 0;' : 'color:#c5c8ce;margin:auto 0;'} type='ios-radio-button-on'></icon>
                        <span> {params.row.display_name} </span>
                    </div>
                )
                },
                {
                    title: '活动ID',
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
                    title: '活动时间',
                    align: 'center',
                    render: (h, params) => (
                      <div>{params.row.starttime_day} 至 {params.row.endtime_day}</div>
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
            this.debounceSearch = this.$lodash.debounce(this.changeInput, timer); // 搜索
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        methods: {
            /** 获取接口数据 */
            getData() {
                this.loading = true;
                return this.$https.calendarLife.queryList({
                    calc_status: this.statusName[this.butNum - 1],
                    q: this.name,
                    page: this.current,
                    rows: this.pageSize
                }).then((res) => {
                    this.data = res.data.data;
                    this.allDataSize = res.data.pageInfo.total;
                    this.loading = false;
                });
            },
            /** 模糊查询 */
            changeInput() {
                this.current = 1;
                this.getData();
            },
            /** 按钮切换 */
            butStatus(e) {
                if (this.butNum === e) return;
                this.butNum = e;
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
                        this.$https.calendarLife.delete(params.row.code).then((res) => {
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
                // this.allData.push(data);
            },
            /** 下载Excel表格 */
            downloadExcel() {
                this.$refs.table.exportCsv({
                    filename: '原始数据'
                });
            }
        }
    };
</script>
<style lang="less" scoped>
.top-font {
  color: #328ff1;
  cursor: pointer;
  margin-right: 7px;
}
/deep/ .ivu-card-body {
  padding: 0 !important;
}
</style>
