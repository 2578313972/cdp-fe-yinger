<template>
  <div>
    <Poptip placement="left" @on-popper-show="ondown">
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
            return {};
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
        methods: {
            /** 点击下载 */
            ondown() {
                if (this.data) {
                    console.log(this.data.row.f_id);
                    this.$https.visitKanban
                        .exportResourceDetail({
                            f_id: this.data.row.f_id,
                            batch_num: this.data.row.batch_num,
                            source_type: this.data.row.source_type
                        })
                        .then((res) => {
                            console.log(res);
                        });
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
