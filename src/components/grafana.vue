<template>
    <div class="">
        <div ref="chart_1" style="width:300px;height:400px;"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        created() {

        },
        mounted() {
            // echarts的数量
            this.chartsSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;
            // 创建 echart 对象
            for (let i = 1; i <= this.chartsSize; i++) {
                this[`chart_${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }

            this.option_1 = {
                color: ['#BED7B6'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],


                    splitLine: { // 坐标轴在 grid 区域中的分隔线。
                        show: true,
                        lineStyle: {
                            color: '#E5E9ED',
                            opacity: 1
                        }
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    markLine: {
                        animation: true
                        // lineStyle: {
                        //     type: 'dashed'
                        // }
                    },
                    areaStyle: {}
                }]
            };
            this.chart_1.setOption(this.option_1);
        }
    };
</script>
