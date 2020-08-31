<template>
    <!-- 消费分析 -->
    <div class="consumptionAnalysis">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData" style="margin-bottom:40px;"></Table>
        <div class="flex">
            <Card dis-hover>
                <div ref="chart_3" class="auto" style="margin: 30px 0 60px 0;height:500px;"></div>
            </Card>
            <Card dis-hover>
                <div ref="chart_1" class="auto" style="margin: 30px 0 60px 0;height:500px;"></div>

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
                joint: [],
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
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '购买人数',
                    key: 'purchase_vip_count',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '购买转化率',
                    key: 'purchase_vip_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '总销售额',
                    key: 'order_amount',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '平均客单价',
                    key: 'avg_transaction_value',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '平均客单件',
                    key: 'avg_transaction_unit',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '平均件单价',
                    key: 'avg_unit_value',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '联单率',
                    key: 'joint_purchase_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '平均折扣率',
                    key: 'avg_discount_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '人均销售额',
                    key: 'avg_vip_amount_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '活动开始日期',
                    key: 'starttime_day',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '活动结束日期',
                    key: 'endtime_day',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                }
            ];
            this.return_rate = this.allData.map(item => ([item.joint2_purchase_count, item.joint3_purchase_count]));
            this.joint = this.allData.map(item => ([item.joint2_purchase_count, item.joint3_purchase_count, item.joint4_5purchase_count, item.joint6_purchase_count]));
            this.tableData = this.allData.map(item => ({
                crowd_name: item.crowd_name,
                purchase_vip_count: this.$kilobit(item.purchase_vip_count),
                purchase_vip_rate: `${Math.round(item.purchase_vip_rate * 1000) / 10}%`,
                order_amount: `${this.$kilobit(item.order_amount)}`,
                avg_transaction_unit: Math.round(item.avg_transaction_unit * 100) / 100,
                avg_transaction_value: this.$kilobit(item.avg_transaction_value),
                avg_unit_value: this.$kilobit(item.avg_unit_value),
                joint_purchase_rate: `${Math.round(item.joint_purchase_rate * 1000) / 10}%`,
                avg_discount_rate: `${Math.round(item.avg_discount_rate * 100)}%`,
                avg_vip_amount_rate: `${this.$kilobit(item.avg_vip_amount_rate)}`,
                starttime_day: item.starttime_day,
                endtime_day: item.endtime_day
            }));
        },
        mounted() {
            this.spinLoading = false;
            this.chart_1 = this.echarts.init(this.$refs.chart_1);
            // this.chart_2 = this.echarts.init(this.$refs.chart_2);
            this.chart_3 = this.echarts.init(this.$refs.chart_3);
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;

            let option_1 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '  订单退货率',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${item[i].value}%`;
                        }
                        return context;
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
                        formatter: '{value}%'
                    },
                    max: 100
                },
                xAxis: {
                    type: 'category',
                    data: ['订单销量\n退货率', '订单销售额\n退货率']
                },
                series: []
            };

            let option_3 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '联单件数占比分析',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.joint[i][item[i].dataIndex])} 人`;
                        }
                        return context;
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
                        formatter: '{value}%'
                    },
                    max: 100
                },
                xAxis: {
                    type: 'category',
                    data: ['联单件数1件占比', '联单件数2件占比', '联单件数3-4件占比', '联单件数5件及以上占比']
                },
                series: []
            };


            let chart_1; let chart_3;
            this.allData.forEach((data) => {
                if (data.total_count_return_rate || data.total_sales_return_rate) chart_1 = true;
                if (data.joint2_purchase_scale || data.joint3_purchase_scale || data.joint4_5purchase_scale || data.joint6_purchase_scale) chart_3 = true;
            });

            const barWidth = `${60 / this.allData.length}%`;
            this.allData.forEach((data, index) => {
                if (chart_1) {
                    option_1.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: [Math.round(data.total_count_return_rate * 100), Math.round(data.total_sales_return_rate * 100)]
                    };
                } else {
                    this.$refs.chart_1.classList.add('shadow');
                    option_1 = {
                        title: {
                            text: '订单退货率',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_3) {
                    option_3.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: [Math.round(data.joint2_purchase_scale * 100), Math.round(data.joint3_purchase_scale * 100), Math.round(data.joint4_5purchase_scale * 100), Math.round(data.joint6_purchase_scale * 100)]
                    };
                } else {
                    this.$refs.chart_3.classList.add('shadow');
                    option_3 = {
                        title: {
                            text: '联单件数占比分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }
            });

            this.chart_1.setOption(option_1);
            // this.chart_2.setOption(option_2);
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
                // this.$refs.chart_2.style.width = `${this.winWidth * 0.25}px`;
                // this.chart_2.resize();
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
    .shadow{
        box-shadow: 0px 0px 80px -65px;
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
