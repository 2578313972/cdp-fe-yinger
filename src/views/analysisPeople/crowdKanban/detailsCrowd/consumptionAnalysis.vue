<template>
    <div class="consumptionAnalysis">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <div style="margin:0 auto">
            <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                columns: [],
                tableData: [],
                loading: false,
                spinLoading: true
            };
        },
        props: {
            allData: {
                type: Array,
                required: true
            },
            winWidth: {
                type: Number,
                required: true
            }
        },
        created() {
            console.log(this.allData[0]);
            console.log(this.winWidth);
            this.columns = [
                {
                    title: '人群名称',
                    key: 'crowd_name',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '购买人数',
                    key: 'new_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '购买转化率',
                    key: 'new_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '总销售额',
                    key: 'new_vip_case_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '平均客单价',
                    key: 'new_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '平均客单件',
                    key: 'new_vip_case_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '平均件单价',
                    key: 'new_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '联单率',
                    key: 'new_vip_case_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '平均折扣率',
                    key: 'new_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '人均销售额',
                    key: 'new_vip_case_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '活动开始日期',
                    key: 'starttime_day',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '活动结束日期',
                    key: 'endtime_day',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                }
            ];
            this.tableData = this.allData.map(item => ({
                crowd_name: item.crowd_name,
                new_vip_count: item.new_vip_count,
                new_vip_case_rate: item.new_vip_case_rate,
                starttime_day: item.starttime_day,
                endtime_day: item.endtime_day
            }));
        },
        mounted() {
            this.spinLoading = false;
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
    .consumptionAnalysis{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        background-color: white;
    }
</style>
