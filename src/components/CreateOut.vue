<template>
  <div>
    <Poptip v-if="data" placement="left">
      <a>下载</a>
      <div slot="content">
          <div style="text-align:left;">注：如果下载条目超过 <span style="color:red;">50万条</span> 仅下载50万条！</div>
          <DatePicker
            :value="timeHorizon"
            @on-change="timeChange"
            format="yyyy-MM-dd"
            :options="options"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择下载内容的时间区间。"
            style="width: 250px"
          />
          <Tooltip :disabled="!disabled" content="时间区间必须在一个月内" placement="top">
            <Poptip placement="left" @on-popper-show="ondown">
                    <Button :disabled="disabled" type="primary">下载</Button>
                    <div slot="content">
                        导出任务创建成功，请稍后到
                        <a @click="$router.push('/dataDown')">数据下载</a>
                        页面下载您需要的附件。
                    </div>
            </Poptip>
          </Tooltip>
      </div>
    </Poptip>

    <Poptip v-else placement="left" @on-popper-show="ondown">
      <a>下载</a>
      <div slot="content">
        导出任务创建成功，请稍后到
        <a @click="$router.push('/dataDown')">数据下载</a>
        页面下载您需要的附件。
      </div>
    </Poptip>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                timeHorizon: [],
                options: {},
                disabled: true
            };
        },
        props: {
            task_ids: {
                type: String,
                default() {
                    return '';
                }
            },
            data: {
                type: Object
            }
        },
        created() {
            this.options = {
                disabledDate: date => date && date.valueOf() < this.data.row.create_time - (1000 * 60 * 60 * 24)
            };
        },
        methods: {
            timeChange(e) {
                this.timeHorizon = e;
                if (new Date(this.timeHorizon[1]).valueOf() - new Date(this.timeHorizon[0]).valueOf() <= 1000 * 60 * 60 * 24 * 30) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            /** 点击下载 */
            ondown() {
                if (this.data) {
                    if (new Date(this.timeHorizon[1]).valueOf() - new Date(this.timeHorizon[0]).valueOf() <= 1000 * 60 * 60 * 24 * 30) {
                        this.$https.visitKanban
                            .exportResourceDetail({
                                f_id: this.data.row.f_id,
                                batch_num: this.data.row.batch_num,
                                source_type: this.data.row.source_type,
                                startTimeDay: this.timeHorizon[0],
                                endTimeDay: this.timeHorizon[1]
                            })
                            .then((res) => {
                                console.log(res);
                            });
                    }
                } else {
                    this.$https.crowdKanban
                        .exportCrowdTemplate({
                            taskIds: this.task_ids
                        })
                        .then((res) => {
                            console.log(res);
                        });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
 /deep/ .ivu-poptip-body-content{
     overflow: visible;
 }
</style>
