<template>
    <!-- 商品分析 -->
    <div class="commodityAnalysis">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <Card dis-hover class="card">
            <p slot="title" class="rbg">TOP10销量款色分析</p>
            <Table border :loading="loading" :width="winWidth*0.98-32" :columns="columns" :data="tableData_1"></Table>
        </Card>
        <Card dis-hover class="card">
            <p slot="title" class="rbg">TOP10销售额款色分析</p>
            <Table border :loading="loading" :width="winWidth*0.98-32" :columns="columns" :data="tableData_2"></Table>
        </Card>
        <Card dis-hover class="card">
            <p slot="title" class="rbg">TOP10销量品类分析</p>
            <Table border :loading="loading" :width="winWidth*0.98-32" :columns="columns" :data="tableData_3"></Table>
        </Card>

        <div ref="chart_1" class="auto" style="margin: 30px 0 60px 0;height:400px;"></div>
        <div ref="chart_2" class="auto" style="height:450px;"></div>
        <div ref="chart_3" class="auto" style="height:450px;"></div>
        <div ref="chart_4" class="auto" style="height:450px;"></div>

        <!-- </div> -->
    </div>
</template>

<script>

    export default {
        data() {
            return {
                columns: [],
                tableData_1: [],
                tableData_2: [],
                tableData_3: [],
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
                    align: 'center',
                    tooltip: true,
                    minWidth: 200,
                    fixed: 'left',
                    render: (h, params) => (
                        <div style="font-weight:600;">{params.row.crowd_name}</div>
                    )
                }
            ];
            for (let i = 1; i <= 10; i++) {
                this.columns.push({
                    title: `top${i}`,
                    key: `top${i}`,
                    align: 'center',
                    tooltip: true,
                    minWidth: 280,
                    render: (h, params) => {
                        if (params.row[`top${i}`]) {
                            return (
                                <div>{params.row[`top${i}`].split(' ')[0]} <span style="color:#1890ff">{(params.row[`top${i}`].split(' ')[1])}</span></div>
                            );
                        }
                    }
                });
            }
            this.allData.forEach((data, index) => {
                this.tableData_1[index] = { crowd_name: data.crowd_name };
                data.color_distribution.forEach((item, ind) => {
                    this.tableData_1[index][`top${+ind + 1}`] = `${Object.keys(item)[0]} (${this.$kilobit(Object.values(item)[0])}件)`;
                });

                this.tableData_2[index] = { crowd_name: data.crowd_name };
                data.top10_by_value.forEach((item, ind) => {
                    this.tableData_2[index][`top${+ind + 1}`] = `${Object.keys(item)[0]} (${this.$kilobit(Object.values(item)[0])}元)`;
                });

                this.tableData_3[index] = { crowd_name: data.crowd_name };
                data.top10_by_unit.forEach((item, ind) => {
                    this.tableData_3[index][`top${+ind + 1}`] = `${Object.keys(item)[0]} (${this.$kilobit(Object.values(item)[0])}件)`;
                });
            });
        },
        mounted() {
            this.chartSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;
            for (let i = 1; i <= this.chartSize; i++) {
                this[`chart_${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;
            let option_1 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '季节分布（单位:件）',
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
                    left: '2.5%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}'
                    },
                    show: true
                },
                yAxis: {
                    type: 'category',
                    data: []
                },
                series: []
            };

            let option_2 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '价格分布（单位:件）',
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
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        rotate: 40
                    },
                    boundaryGap: true
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value} '
                    },
                    boundaryGap: true,
                    show: true
                },
                series: []
            };

            let option_3 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '色系分布（单位:件）',
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

            let option_4 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '面料分布（单位:件）',
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


            let chart_1; let chart_2; let chart_3; let chart_4;
            this.allData.forEach((data) => {
                if (data.season_distribution.length) chart_1 = true;
                if (data.price_range_distribution.length) chart_2 = true;
                if (data.color_distribution.length) chart_3 = true;
                if (data.fabric_distribution.length) chart_4 = true;
            });
            const barWidth = `${60 / this.allData.length}%`;
            this.allData.forEach((data, index) => {
                if (chart_1) {
                    option_1.yAxis.data = data.season_distribution.map(item => Object.keys(item)[0]);
                    option_1.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.season_distribution.map(item => (Object.values(item)[0] > 0 ? Object.values(item)[0] : 0))
                    };
                } else {
                    this.$refs.chart_1.classList.add('shadow');
                    option_1 = {
                        title: {
                            text: '季节分布',
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

                if (chart_2) {
                    option_2.xAxis.data = data.price_range_distribution.map(item => Object.keys(item)[0]);
                    option_2.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.price_range_distribution.map(item => (Object.values(item)[0] > 0 ? Object.values(item)[0] : 0))
                    };
                } else {
                    this.$refs.chart_2.classList.add('shadow');
                    option_2 = {
                        title: {
                            text: '价格分布',
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
                    option_3.xAxis.data = data.color_distribution.map(item => Object.keys(item)[0]);
                    option_3.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.color_distribution.map(item => (Object.values(item)[0] > 0 ? Object.values(item)[0] : 0))
                    };
                } else {
                    this.$refs.chart_3.classList.add('shadow');
                    option_3 = {
                        title: {
                            text: '色系分布',
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

                if (chart_4) {
                    option_4.xAxis.data = data.fabric_distribution.map(item => Object.keys(item)[0]);
                    option_4.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.fabric_distribution.map(item => (Object.values(item)[0] > 0 ? Object.values(item)[0] : 0))
                    };
                } else {
                    this.$refs.chart_4.classList.add('shadow');
                    option_4 = {
                        title: {
                            text: '面料分布',
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
            this.chart_2.setOption(option_2);
            this.chart_3.setOption(option_3);
            this.chart_4.setOption(option_4);

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
                this.$refs.chart_2.style.width = `${this.winWidth * 0.31}px`;
                this.$refs.chart_3.style.width = `${this.winWidth * 0.31}px`;
                this.$refs.chart_4.style.width = `${this.winWidth * 0.31}px`;
                for (let i = 1; i <= this.chartSize; i++) {
                    this[`chart_${i}`].resize();
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .commodityAnalysis{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        background-color: white;
        .card{
            margin: auto;
            ~ .card{
                margin-top: 20px;
            }
        }
    }
    .auto.shadow{
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
