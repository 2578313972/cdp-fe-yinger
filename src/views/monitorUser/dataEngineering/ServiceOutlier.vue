<template>
    <!-- 业务异常值 -->
    <div class="ServiceOutlier">
        <Row class="padding16-18" style="background:white;">
            <i-col span="24" class="flex nav">
                <div class="select">
                    <span>表名</span>
                    <Select style="flex:1" size="large">
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>字段名称</span>
                    <Select style="flex:1" size="large">
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
            </i-col>
            <i-col class="echartContainers" span="24">
                <div ref="chart" style="height:600px"></div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                aaa: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            };
        },
        props: {
            screenWidth: {
                type: Number,
                require: true
            }
        },
        mounted() {
            this.chart = this.echarts.init(this.$refs.chart);
            this.option = {
                color: ['#5782C4'],
                title: {
                    text: '上线值检测',
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: true
                    },
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} k'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '40',
                    bottom: '6%',
                    containLabel: true
                },
                legend: {
                    left: '3%',
                    bottom: '0',
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    backgroundColor: '#DDE4ED',
                    borderWidth: 1,
                    borderColor: '#DDE4ED',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position(pos, params, el, elRect, size) {
                        const obj = { top: '40' };
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0] < size.viewSize[0] / 2 ? '5%' : '10%';
                        return obj;
                    },
                    extraCssText: 'width: 170px'
                },
                series: [{
                    name: '邮件营销',
                    type: 'line',
                    areaStyle: {
                        color: '#E7EDF7'
                    },
                    showSymbol: false,
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }]
            };

            this.resize();
            this.chart.setOption(this.option);


            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            resize() {
                this.$refs.chart.style.width = `${this.screenWidth}px`;
                this.chart.resize();
            }
        }
    };
</script>

<style lang="less" scoped>
    .ServiceOutlier{
        .nav{
            box-sizing: border-box;
            padding-left:6px;
            margin-bottom: 25px;
            .select{
                width:200px;
                display: flex;
                border-radius: 5px;
                border:1px solid #EAEEF3;
                span{
                    line-height: 38px;
                    display: inline-block;
                    background-color: #DDE4ED;
                    padding:0 10px;
                }
                ~.second{
                    margin-left:20px;
                }
            }
        }
        /deep/ .ivu-select-selection, /deep/ .ivu-select-selection-focused,/deep/ .ivu-select-selection:hover{
            border:0px;
            box-shadow: 0 0 0 0;
        }
        .echartContainers{
            display: flex;
            flex-wrap: wrap;
            div{
                margin:0 auto;
            }
        }
    }
</style>
