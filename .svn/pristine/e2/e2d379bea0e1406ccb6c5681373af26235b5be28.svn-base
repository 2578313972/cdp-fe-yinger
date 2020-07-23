<template>
    <div class="mask-bg">
        <edit-title :isShowBtn="false" title="审核控制"></edit-title>
        <div class="custom-dialog-content">
            <div class="dialog-padding20">
                <Card dis-hover class="item-box">
                    <Row style="font-weight:bold;">
                        <Col span="14">
                            <span class="pl5">私有/运营组资源审核</span>
                        </Col>
                        <Col span="5">
                            <span>节点初审</span>
                        </Col>
                        <Col span="5">
                            <span>渠道内审</span>
                        </Col>
                    </Row>
                    <Divider style="margin:16px 0;" />
                    <Row v-for="(item, index) in auditList" :key="index" class="mt20">
                        <Col span="14">
                            <span class="pl5">{{item.name}}（{{item.type}}）</span>
                        </Col>
                        <Col span="5" v-for="stage in item.stages" :key="stage.id">
                            <Switch v-model="stage.enabled" :loading="stage.loading" @on-change="(val)=>{changeStatus(val, stage)}">
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </Switch>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';

    export default {
        data() {
            return {
                auditList: []
            };
        },
        components: {
            editTitle
        },
        mounted() {
            this.getAuditConList();
        },
        methods: {
            // 获取列表数据
            getAuditConList() {
                const apiUrl = '/api/audit/query-configs';
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(({ data }) => {
                        this.auditList = this.clearData(data);
                    });
            },
            clearData(data) {
                return data.map((item) => {
                    const typeArr = item.operate_types.map(item => this.$config.status_config[item]);
                    const stageArr = item.stages.map((item) => {
                        item = Object.assign(item, {
                            loading: false
                        });
                        return item;
                    });
                    return {
                        type: typeArr.join(', '),
                        name: this.$config.status_config[item.review_type],
                        stages: stageArr
                    };
                });
            },
            changeStatus(val, item) {
                // 更新一下状态，否则直接更改导致值没变没有触发change事件
                item.loading = true;
                const apiUrl = `/api/audit/update-config?id=${item.id}&enabled=${val}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        item.loading = false;
                        item.enabled = val;
                        this.$Message.destroy();
                        const msgText = val ? '已开启' : '已关闭';
                        this.$Message.success(msgText);
                    })
                    .catch(() => {
                        item.loading = false;
                        item.enabled = !val;
                    });
            }
        }
    };
</script>

<style>
.item-box .pl5 {
    padding-left: 5px;
}
</style>
