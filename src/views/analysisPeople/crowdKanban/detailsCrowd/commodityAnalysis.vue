<template>
    <div class="commodityAnalysis">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <!-- <div style="margin:0 auto"> -->
            <!-- <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData_1"></Table>
            <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData_2"></Table>
            <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData_3"></Table> -->

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

        <div ref="chart_1" class="auto" style="margin-bottom: 23px;height:360px;"></div>
        <div ref="chart_2" class="auto" style="height:430px;"></div>
        <div ref="chart_3" class="auto" style="height:430px;"></div>
        <div ref="chart_4" class="auto" style="height:430px;"></div>

        <!-- </div> -->
    </div>
</template>

<script>

    export default {
        data() {
            return {
                names: ['a', 'b'],
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
            winWidth: {
                type: Number,
                required: true
            }
        },
        created() {
            console.log(this.allData);
            // this.names = this.allData.map(item => item.crowd_name);
            this.columns = [
                {
                    title: '人群名称',
                    align: 'center',
                    ellipsis: true,
                    minWidth: 200,
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
                    ellipsis: true,
                    minWidth: 230
                });
            }
            this.allData.forEach((data, index) => {
                this.tableData_1[index] = { crowd_name: data.crowd_name };
                data.color_distribution.forEach((item, ind) => {
                    this.tableData_1[index][`top${+ind + 1}`] = Object.keys(item)[0];
                });

                this.tableData_2[index] = { crowd_name: data.crowd_name };
                data.top10_by_value.forEach((item, ind) => {
                    this.tableData_2[index][`top${+ind + 1}`] = Object.keys(item)[0];
                });

                this.tableData_3[index] = { crowd_name: data.crowd_name };
                data.top10_by_unit.forEach((item, ind) => {
                    this.tableData_3[index][`top${+ind + 1}`] = Object.keys(item)[0];
                });
            });

            // this.tableData = this.allData.map(item => ({
            //     crowd_name: item.crowd_name,
            //     new_vip_count: item.new_vip_count,
            //     new_vip_case_rate: item.new_vip_case_rate,
            //     starttime_day: item.starttime_day,
            //     endtime_day: item.endtime_day
            // }));
        },
        mounted() {
            this.chartSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;
            for (let i = 1; i <= this.chartSize; i++) {
                this[`chart_${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;
            const option_1 = {
                color: ['#3398DB', '#67E0E3', '#FFDB5C'],
                title: {
                    text: '\n\n季节分布',
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
                    left: '95%'
                },
                grid: {
                    left: '3%',
                    right: '3%',
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

            const option_2 = {
                color: ['#3398DB', '#67E0E3', '#FFDB5C'],
                title: {
                    text: '价格分布',
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
                    left: 'right'
                },
                grid: {
                    left: '3%',
                    right: '3%',
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

            const option_3 = {
                color: ['#3398DB', '#67E0E3', '#FFDB5C'],
                title: {
                    text: '色系分布',
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
                    left: 'right'
                },
                grid: {
                    left: '3%',
                    right: '3%',
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

            const option_4 = {
                color: ['#3398DB', '#67E0E3', '#FFDB5C'],
                title: {
                    text: '面料分布',
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
                    left: 'right'
                },
                grid: {
                    left: '3%',
                    right: '3%',
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
                if (data.season_distribution) {
                    option_1.yAxis.data = data.season_distribution.map(item => Object.keys(item)[0]);
                    option_1.series[index] = {
                        name: this.names[index],
                        barWidth: '30%',
                        barGap: '0%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.season_distribution.map(item => Object.values(item)[0])
                    };
                }

                if (data.price_range_distribution) {
                    option_2.xAxis.data = data.price_range_distribution.map(item => Object.keys(item)[0]);
                    option_2.series[index] = {
                        name: this.names[index],
                        barWidth: '30%',
                        barGap: '0%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.price_range_distribution.map(item => Object.values(item)[0])
                    };
                }

                if (data.color_distribution) {
                    option_3.xAxis.data = data.color_distribution.map(item => Object.keys(item)[0]);
                    option_3.series[index] = {
                        name: this.names[index],
                        barWidth: '30%',
                        barGap: '0%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.color_distribution.map(item => Object.values(item)[0])
                    };
                }

                if (data.fabric_distribution) {
                    option_4.xAxis.data = data.fabric_distribution.map(item => Object.keys(item)[0]);
                    option_4.series[index] = {
                        name: this.names[index],
                        barWidth: '30%',
                        barGap: '0%',
                        legendHoverLink: true,
                        type: 'bar',
                        data: data.fabric_distribution.map(item => Object.values(item)[0])
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
                this.$refs.chart_1.style.width = `${this.winWidth * 0.95}px`;
                this.$refs.chart_2.style.width = `${this.winWidth * 0.3}px`;
                this.$refs.chart_3.style.width = `${this.winWidth * 0.3}px`;
                this.$refs.chart_4.style.width = `${this.winWidth * 0.3}px`;
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
        // .auto{
        //     margin: auto !important;
        // }
    }
</style>
