<template>
    <!-- 消费分析 -->
    <div class="consumptionAnalysis">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData" style="margin-bottom:40px;"></Table>
        <div class="flex">
            <Card dis-hover>
                <div ref="chart_1" style="height:300px;"></div>
                <div ref="chart_2" style="height:300px;"></div>
            </Card>
            <Card dis-hover>
                <div ref="chart_3" style="margin: 30px 0 60px 0;height:500px;"></div>
            </Card>
        </div>
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
                    minWidth: 160
                },
                {
                    title: '购买人数',
                    key: 'purchase_vip_count',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '购买转化率',
                    key: 'purchase_vip_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '总销售额',
                    key: 'order_amount',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '平均客单价',
                    key: 'avg_transaction_value',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '平均客单件',
                    key: 'avg_transaction_unit',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '平均件单价',
                    key: 'avg_unit_value',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '联单率',
                    key: 'joint_purchase_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '平均折扣率',
                    key: 'avg_discount_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '人均销售额',
                    key: 'avg_vip_amount_rate',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '活动开始日期',
                    key: 'starttime_day',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                },
                {
                    title: '活动结束日期',
                    key: 'endtime_day',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 160
                }
            ];
            this.tableData = this.allData.map(item => ({
                crowd_name: item.crowd_name,
                purchase_vip_count: this.$kilobit(item.purchase_vip_count),
                purchase_vip_rate: `${Math.round(item.purchase_vip_rate * 1000) / 10}%`,
                order_amount: `${this.$kilobit(item.order_amount)}`,
                avg_transaction_value: Math.round(item.avg_transaction_value),
                avg_transaction_unit: this.$kilobit(item.avg_transaction_unit),
                avg_unit_value: Math.round(item.avg_unit_value * 100) / 100,
                joint_purchase_rate: `${Math.round(item.joint_purchase_rate * 1000) / 10}%`,
                avg_discount_rate: `${Math.round(item.avg_discount_rate * 100)}%`,
                avg_vip_amount_rate: `${Math.round(item.avg_vip_amount_rate)}`,
                starttime_day: item.starttime_day,
                endtime_day: item.endtime_day
            }));
        },
        mounted() {
            this.spinLoading = false;
            this.chart_1 = this.echarts.init(this.$refs.chart_1);
            this.chart_2 = this.echarts.init(this.$refs.chart_2);
            this.chart_3 = this.echarts.init(this.$refs.chart_3);
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;
            const option_1 = {
                title: {
                    text: '订单销量'
                },
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [
                    {
                        name: '订单销量退货率',
                        type: 'gauge',
                        max: 98,
                        title: { color: '#333' },
                        detail: {
                            fontSize: 25,
                            offsetCenter: [0, '65%'],
                            formatter: '{value}%'
                        },
                        data: [{ value: 55, name: '\n退货率' }], /** parseInt(this.allData[0].total_sales_return_rate * 10000) / 100 */
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 30,
                                shadowBlur: 0,
                                color: [
                                    [0.5, '#FF8352'],
                                    [1, '#3398DB']
                                ]
                            }
                        }
                    }
                ]
            };

            const option_2 = {
                title: {
                    text: '订单销量'
                },
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [
                    {
                        name: '订单销量退货率',
                        type: 'gauge',
                        max: 98,
                        title: { color: '#333' },
                        detail: {
                            fontSize: 25,
                            offsetCenter: [0, '65%'],
                            formatter: '{value}%'
                        },
                        data: [{ value: 55, name: '\n退货率' }], /** parseInt(this.allData[0].total_sales_return_rate * 10000) / 100 */
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 30,
                                shadowBlur: 0,
                                color: [
                                    [0.5, '#FF8352'],
                                    [1, '#3398DB']
                                ]
                            }
                        }
                    }
                ]
            };

            const option_3 = {
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
                    option_3.xAxis.data = data.vip_level_count.map(item => Object.keys(item)[0]);
                    option_3.series[index] = {
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
            this.chart_2.setOption(option_2);
            this.chart_3.setOption(option_3);

            this.spinLoading = false;

            // echarts响应式
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            resize() {
                this.$refs.chart_1.style.width = `${this.winWidth * 0.25}px`;
                this.chart_1.resize();
                this.$refs.chart_2.style.width = `${this.winWidth * 0.25}px`;
                this.chart_2.resize();
                this.$refs.chart_3.style.width = `${this.winWidth * 0.68}px`;
                this.chart_3.resize();
            }
        }
    };
</script>

<style lang="less" scoped>
    .consumptionAnalysis{
        position: relative;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        background-color: white;
        .echarts{
            display: flex;
        }
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
