<template>
    <!-- 积分使用 -->
    <div class="IntegralUse">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData"></Table>
        <div ref="chart_1" class="auto" style="margin: 30px 0 60px 0;height:360px;"></div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                columns: [],
                tableData: [],
                chart_1: null,
                chart_2: null,
                chart_3: null,
                chart_4: null,
                chartSize: 0,
                loading: false,
                spinLoading: true
            };
        },
        props: {
            allData: {
                type: Array,
                required: true
            },
            names: {
                type: Array,
                required: true
            },
            winWidth: {
                type: Number,
                required: true
            }
        },
        created() {
            this.columns = [
                {
                    title: '人群名称',
                    key: 'crowd_name',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '使用积分人数',
                    key: 'use_point_vip_cont',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '积分消耗总量',
                    key: 'total_point',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 80
                },
                {
                    title: '人均积分消耗量',
                    key: 'avg_point',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 90
                },
                {
                    title: '积分使用率',
                    key: 'point_user_rate',
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
                use_point_vip_cont: this.$kilobit(item.use_point_vip_cont),
                total_point: this.$kilobit(item.total_point),
                avg_point: Math.round(item.avg_point),
                point_user_rate: `${Math.round(item.point_user_rate * 10000) / 100}%`,
                starttime_day: item.starttime_day,
                endtime_day: item.endtime_day
            }));
        },
        mounted() {
            this.chart_1 = this.echarts.init(this.$refs.chart_1);
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;
            const option_1 = {
                color: ['#3398DB', '#67E0E3', '#FFDB5C'],
                title: {
                    text: '  会员等级占比分析',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}'
                    },
                    show: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        rotate: 40
                    }
                },
                series: []
            };

            this.allData.forEach((data, index) => {
                if (data.vip_level_count) {
                    option_1.xAxis.data = data.vip_level_count.map(item => Object.keys(item)[0]);
                    option_1.series[index] = {
                        name: this.names[index],
                        barWidth: '30%',
                        barGap: '0%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.vip_level_count.map(item => Object.values(item)[0])
                    };
                }
            });

            this.chart_1.setOption(option_1);

            this.spinLoading = false;

            // echarts响应式
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            resize() {
                this.$refs.chart_1.style.width = `${this.winWidth * 0.98}px`;
                this.chart_1.resize();
            }
        }
    };
</script>

<style lang="less" scoped>
    .IntegralUse{
        position: relative;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        background-color: white;
    }
    /** th */
    /deep/ .ivu-table th {
        background-color: #3398DB;
    }

    /* 滚动条 */
    /deep/ .ivu-table-overflowY::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #D6D6D6;
    }
    /deep/ .ivu-table-overflowX::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #D6D6D6;
    }
</style>
