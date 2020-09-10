<template>
  <div>
    <Poptip placement="left" @on-popper-show="ondown">
      <a>下载</a>
      <div slot="content">
        导出任务创建成功，请稍后到
        <a @click="$router.push('/dataDown')"> 数据下载 </a> 页面下载您需要的附件。
      </div>
    </Poptip>
  </div>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        props: {
            task_ids: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        methods: {
            /** 点击下载 */
            ondown() {
                this.$https.crowdKanban.exportCrowdTemplate({
                    taskIds: this.task_ids
                }).then((res) => {
                    console.log(res);
                });
            }
        }
    };
</script>
