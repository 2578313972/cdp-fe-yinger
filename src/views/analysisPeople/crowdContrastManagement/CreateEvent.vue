<template>
  <div class="slide-create-box">
    <edit-title
      :loading="saveBtnStatus"
      @cancel-click="cancel"
      @ok-click="ok"
      :title="title"
      :disabled="hasChanged"
    ></edit-title>

    <div class="slide-scroll-box dialog-padding20">
      <Card dis-hover class="pl20 pr20">
        <p slot="title">新增成功后需要前往<span style="color:#57A3F3;display:inline-block;transform: translateY(-1.5px);">订单分析看板</span>查看</p>
        <!-- 新建事件 -->
        <p style="font-size:15px;font-weight: 600;" class="padding16-18">新增如下对比任务：</p>
        <Table
          class="smce-table-noscroll td-table-no-border"
          :loading="loading"
          no-data-text="没有可对比的数据"
          :columns="columns"
          :data="showData"
          ref="table"
        ></Table>
      </Card>
    </div>
  </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        data() {
            return {
                title: '订单分析-新增营销对比',
                saveBtnStatus: false,
                loading: false,
                columns: [],
                hasChanged: false,
                calculate_status_item: ['未开始', '计算成功', '计算失败']
            };
        },
        props: {
            showData: {
                type: Array,
                default: []
            }
        },
        components: {
            editTitle
        },
        created() {
            console.log(this.showData);
            this.columns = [
                {
                    title: '任务名称',
                    key: 'crowd_name',
                    minWidth: 120
                },
                {
                    title: '任务ID',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '交易起止时间',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => (
                <div>{params.row.start_time_day} 至 {params.row.end_time_day}</div>
                )
                },
                {
                    title: '状态',
                    align: 'center',
                    render: (h, params) => (
                        <div>{this.calculate_status_item[params.row.calculate_status]}</div>
                    )
                },
                {
                    title: '创建时间',
                    minWidth: 80,
                    align: 'center',
                    render: (h, params) => (
                    <div>{new Date(params.row.create_time).toLocaleString()}</div>
                    )
                }
            ];
        },
        mounted() {},
        methods: {
            cancel() {
                this.$emit('cancelCreatEvent', false);
            },
            ok() {
                this.saveBtnStatus = true;
                this.$emit('submitCreatEvent');
            }
        }
    };
</script>

<style lang="less" scoped>
.ivu-form-item-content {
  display: flex;
}
.pr20 {
  padding: 0;
}
</style>
