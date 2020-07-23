<template>
    <!-- 画像chart图 -->
    <div>
        <div ref="chart" :style="{width: '100%', height: '300px'}"></div>
    </div>
</template>

<script>
    import echartsConfig from '@/components/chart/echartsCommon';

    export default {
        name: '',
        props: {
            getBarData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                id: null,
                myChart: null,
                option: null
            };
        },
        components: {},
        mounted() {
            this.$tools.bus.$on('setChartData', () => {
                this.initData();
            });
        },
        methods: {
            chartResizeFn() {
                this.$nextTick(() => {
                    this.myChart.resize();
                });
            },
            // 根据类型判断，筛选操作
            initData() {
                const chartData = this.getBarData;
                const chartStyle = chartData.model;
                /**
                 * 切换后拿到type判断赋值
                 */
                if (chartData && chartStyle) {
                    switch (chartStyle) {
                    case 'pie':
                        this.pieStyle(chartData);
                        break;
                    case 'line':
                        this.lineStyle(chartData);
                        break;
                    case 'v_bar':
                        this.vBarStyle(chartData);
                        break;
                    case 'h_bar':
                        this.hBarStyle(chartData);
                        break;
                    default:
                        break;
                    }
                } else {
                    this.vBarStyle(chartData);
                }
            /**
                 * 首次进来后根据数据中配置的默认展示类型，展示的charts图类型
                 */
            },
            // 饼图样式配置
            pieStyle(val) {
                this.option = echartsConfig.pieOption;
                this.myChart = this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option.series = {
                    type: 'pie',
                    data: val.data.pieSeriesData
                //  tooltip 无效
                };
                this.option.tooltip = {
                    trigger: 'item',
                    backgroundColor: 'rgba(246,249,251,0.9)',
                    borderColor: '#d4e6f3',
                    textStyle: {
                        color: '#707070'
                    },
                    extraCssText: 'box-shadow: 0px 1px 4px rgba(57, 132, 170, 0.9);',
                    padding: [10, 10],
                    formatter(data) {
                        return `${data.data.name}:${data.data.value}`;
                    }
                };
                this.myChart.setOption(this.option);
                this.resizeChart();
            },
            // 折线图配置
            lineStyle(val) {
                this.myChart = this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = echartsConfig.lineOption;
                this.option.xAxis.data = val.data.xAxisData;
                this.option.series = [{
                    type: 'line',
                    data: val.data.seriesData
                }];
                this.myChart.setOption(this.option);
                this.resizeChart();
            },
            // 纵向柱状图
            vBarStyle(val) {
                this.myChart = this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = echartsConfig.barOption;
                this.option.xAxis.data = val.data.xAxisData;
                this.option.series = [{
                    type: 'bar',
                    barWidth: '50%',
                    data: val.data.seriesData
                }];
                this.myChart.setOption(this.option);
                this.resizeChart();
            },
            // 横向柱状图
            hBarStyle(val) {
                this.myChart = this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = echartsConfig.barLandscapeOption;
                this.option.yAxis.data = val.data.xAxisData;
                this.option.series = [{
                    type: 'bar',
                    // barWidth:"50%",
                    data: val.data.seriesData
                }];
                this.myChart.setOption(this.option);
                this.resizeChart();
            },
            // 绑定缩放
            resizeChart() {
                this.$nextTick(() => {
                    window.addEventListener('resize', this.chartResizeFn);
                });
            }
        },
        watch: {},
        destroyed() {
            // 销毁后解绑resize事件
            window.removeEventListener('resize', this.chartResizeFn);
        },
        beforeDestroy() {
            this.$tools.bus.$off('setChartData');
        }
    };
</script>

<style scoped>

</style>
