<template>
    <!-- 画像chart图 -->

    <div>
        <div ref="chart" :style="{width: width, height: height}"></div>
        <div v-if="data.model == 'pie'" class="chart-data-box">
            <div class="chart-data-box-item" v-for="(item, index) in legendData" @click="legendClick(item)" @mouseenter="legendMouseenter(item.index)">
            <!-- <div class="chart-data-box-item" v-for="(item, index) in legendData" @click="legendClick(item)" @mouseenter="legendMouseenter(item.index)" @mouseleave1="legendMouseleave(item.index)"> -->
                <div class="chart-data-box-item-ico" :style="{'background':item.isDisabled ? '#c5c5c5' : item.color}"></div>
                <div class="chart-data-box-item-title" :class="{'disabled':item.isDisabled}" :style="{'color':lastPieHighlightIndex == index ? item.color : ''}" :index="index">
                    <span class="chart-data-box-item-title-row1">
                        <Tooltip :content="item.name" transfer :disabled="!(isShowTooltip && lastHoverIndex == item.index)" class="ivu-table-cell-tooltip">
                            <span class="ivu-table-cell-tooltip-content" @mouseenter="handleTooltipIn(item.index, $event)">{{item.name}}</span>
                        </Tooltip>
                    </span>
                    <span class="chart-data-box-item-title-row3">{{item.value | formatAmount}}</span>
                    <span class="chart-data-box-item-title-row2">{{item.percent}}%</span>
                </div>
            </div>
        </div>
        <div v-if="data.model == 'map' && isShowAddressDetail" class="chart-data-box chart-map-list">
            <div v-if="!mapList || mapList.length == 0" class="chart-data-box-empty" :style="{'line-height':height}">暂无列表数据</div>
            <div v-if="mapList && mapList.length > 1" class="chart-data-box-item" v-for="(item, index) in mapList" :key="index">
                <div class="chart-data-box-item-ico" :style="{'background':item.isDisabled ? '#c5c5c5' : item.color}"></div>
                <div class="chart-data-box-item-value">
                    <span class="chart-data-box-item-value-row1">
                        <Tooltip :content="item.name" transfer :disabled="!(isShowTooltip && lastHoverIndex == index)" class="ivu-table-cell-tooltip">
                            <span class="ivu-table-cell-tooltip-content" @mouseenter="handleTooltipIn(index, $event)">{{item.name}}</span>
                        </Tooltip>
                    </span>
                    <span class="chart-data-box-item-value-row2">{{item.value | formatAmount}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echartsConfig from '@/components/chart/echartsCommon';
    import 'echarts/map/js/china';
    import Vue from 'vue';

    // import {
    //     // 传入chart借基础类型和要设置的对象
    //     chartMerge,
    //     // 添加业务通用图表或者初始化覆盖业务组件
    //     insertChartConfig,
    //     // 重置theme色系改变成自己业务所需要的色系
    //     resetColorConfig
    // } from 'echarts-config';

    // // 初始化主题色系默认是light浅色系   light|dark
    // window._CHART_THEMETYPE_ = 'light';

    // console.log('chartMerge:', chartMerge);
    // console.log('insertChartConfig:', insertChartConfig);
    // console.log('resetColorConfig:', resetColorConfig);

    export default {
        name: '',
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            legendPaddingTop: {
                type: Number,
                default: 12
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            },
            hasLegend: {
                type: Boolean,
                default: true
            },
            isShowAddressDetail: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                id: null,
                myChart: null,
                option: null,
                legendData: [],
                lastPieHighlightIndex: 0, // 用于取消饼图文本显示
                isShowTooltip: false,
                lastHoverIndex: null,
                mapList: []
            };
        },
        components: {},
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', this.chartResizeFn);
            });
            this.initData();
        },
        computed: {
        },
        methods: {
            handleTooltipIn(index, ev) {
                this.lastHoverIndex = index;
                this.$nextTick(() => {
                    const element = ev.target;
                    this.isShowTooltip = element.scrollWidth > element.offsetWidth;
                });
            },
            getMapListData() {
                if (!this.myChart || !this.myChart.getOption) {
                    return [];
                }
                const result = [];
                const option = this.myChart.getOption();
                const seriesData = option.series || {};
                const data = seriesData[0] || {};
                const colors = echartsConfig.pieOption.color;
                const dt = data.data || [];
                dt.map((item, index) => {
                    item.color = colors[index % colors.length];
                    result.push(item);
                });
                return result;
            },
            getLegendData() {
                if (!this.myChart || !this.myChart.getOption) {
                    return [];
                }
                const result = [];
                const option = this.myChart.getOption();
                const legends = option.legend[0].selected;
                const data = option.legend[0].data;
                const colors = option.color || [];
                const seriesData = (option.series[0] || []).data || [];
                // console.log(option);
                data.map((name, index) => {
                    const dt = seriesData[index] || {};
                    const item = this.$lodash.cloneDeep(dt);
                    item.index = index;
                    item.color = colors[index % colors.length];
                    item.isDisabled = (legends[name] === false);
                    result.push(item);
                });

                return result;
            },
            legendMouseenter(index) {
                if (this.legendData[index].isDisabled) {
                    return;
                }
                this.lastPieHighlightIndex != index && this.myChart && this.myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: this.lastPieHighlightIndex
                });

                this.myChart && this.myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: index
                });

                this.lastPieHighlightIndex = index;
            },
            addChartsEvent() {
                let timer = null;
                this.myChart && this.myChart.on('mousemove', (param) => {
                    this.legendMouseenter(param.dataIndex);
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        this.legendMouseenter(param.dataIndex);
                    }, 500);
                });
            },
            legendMouseleave(index) {
                // legendMouseleave(item) {
                this.myChart && this.myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: index
                });
            },
            legendClick(item) {
                const option = this.myChart.getOption();
                const legends = option.legend[0].selected;
                item.isDisabled = (legends[item.name] !== false);

                // 切换图例的选中状态
                this.myChart && this.myChart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: item.name
                });

                this.myChart.setOption({});

                // 项目被禁用和激活时，默认设置激活项
                if (!item.isDisabled) {
                    // 被激活时，选中当前项目
                    this.legendMouseenter(item.index);
                } else {
                    // 当前项目被禁用时，自上而下选择一个未被禁用的项目
                    this.legendData.some((dt) => {
                        const isDisabled = dt.isDisabled;
                        !isDisabled && this.legendMouseenter(dt.index);
                        return !isDisabled;
                    });
                }
            },

            change() {
                this.initData();
            },

            chartResizeFn() {
                const chartData = this.data || {};
                const chartStyle = chartData.model;
                this.$nextTick(() => {
                    this.myChart.resize();
                    chartStyle == 'pie' && this.myChart && this.myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: this.lastPieHighlightIndex
                    });
                });
            },
            // 根据类型判断，筛选操作
            initData() {
                const chartData = this.data || {};
                const chartStyle = chartData.model;

                /**
                 * 切换后拿到type判断赋值
                 */
                // if (chartStyle) {
                switch (chartStyle) {
                case 'map':
                    this.mapStyle(chartData);
                    break;
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
                    this.vBarStyle(chartData);
                    break;
                }
                // } else {
                //     this.vBarStyle(chartData);
                // }

            /**
                 * 首次进来后根据数据中配置的默认展示类型，展示的charts图类型
                 */
            },
            // seriesData和legend互斥;isPie==true时，使用seriesData，而isPie==false时，使用legend
            addOtherOption({ opt, isPie, data }) {
                opt = opt || {};
                data = data || {};

                const element = this.$refs.chart;
                const seriesData = data.pieSeriesData || [];
                const legend = data.legend || [];
                let length = 0;
                const maxZoom = parseInt(element.getBoundingClientRect().width) || 20; // --- debug --- 根据容器的像素和个像比例来判断是否出缩放
                // const size = 'auto';
                let hasZoom = false;

                const legendHeight = 35;
                const legendPaddingTop = this.legendPaddingTop || 0;
                // const legendPaddingRight = 12;

                this.option.color = ['rgba(45,140,240,1)', 'rgba(0,210,179,1)', 'rgba(251,169,0,1)', 'rgba(242,112,54,1)', 'rgba(181,40,81,1)', 'rgba(45,51,138,1)', 'rgba(172,63,192,1)', 'rgba(102,58,183,1)', 'rgba(67,86,205,1)', 'rgba(16,157,88,1)', 'rgba(123,179,66,1)', 'rgba(191,197,33,1)'];

                opt.legend = opt.legend || {
                    data: []
                };


                if (!isPie) {
                    opt.tooltip = {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        showContent: true,
                        formatter: data.formatter ? data.formatter : function (data) {
                            let dt = data.data || {};
                            const result = [];

                            if (data instanceof Array) {
                                data.map((item, index) => {
                                    dt = item.data || {};
                                    index == 0 && result.push(item.name);
                                    result.push(`${item.marker + item.seriesName}: ${item.value}${dt.percent == null ? '' : `(${dt.percent}%)`}`);
                                });
                            } else {
                                result.push(data.seriesName);
                                result.push(`${data.marker + dt.name}: ${dt.value}${dt.percent == null ? '' : `(${dt.percent}%)`}`);
                            }
                            return result.join('<br>');
                        }
                    };

                    // 获取个数
                    (data.seriesData || []).map((item) => {
                        item = item || {};
                        length = Math.max(length, (item.data || []).length);
                    });


                    hasZoom = length * 10 > maxZoom;

                    // 暂时不考虑【横向柱状图】，因为目前业务还用不上
                    // 需要自动计算出是否要缩放
                    if (hasZoom) {
                        opt.dataZoom = [
                            {
                                type: 'slider',
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                handleStyle: {
                                    color: '#3d88f2'
                                },
                                fillerColor: '#edf1f5',
                                borderColor: '#e6e9ed',
                                showDataShadow: false, // 是否显示数据阴影 默认auto
                                textStyle: {
                                    color: '#3d88f2'
                                },
                                height: 16,
                                bottom: 0,
                                xAxisIndex: [0]
                            }
                        ];
                    } else {
                        opt.dataZoom = [];
                    }
                    opt.grid.bottom = hasZoom ? '25px' : '1%';

                    // console.log(data, 99);
                    // data.chartOpt && data.chartOpt.grid && Object.assign(opt.grid, data.chartOpt.grid);
                    data.chartOpt && data.chartOpt.xAxis && Object.assign(opt.xAxis, data.chartOpt.xAxis);
                    // data.chartOpt && data.chartOpt.yAxis && Object.assign(opt.yAxis, data.chartOpt.yAxis);

                    // 限定显示范围
                    this.hasLegend ? (opt.grid.top = `${legendHeight + legendPaddingTop}px`) : (opt.grid.top = legendPaddingTop);

                    opt.barMaxWidth = '60px';

                    // legend数据
                    opt.legend.data = legend;
                    opt.legend.show = this.hasLegend;
                } else {
                    // legend数据
                    seriesData.map((item) => {
                        opt.legend.data.push(item.name);
                    });
                }

            // opt = Object.assign({}, Object.create(opt), obj)
            },
            getSeriesData(data, type, barWidth) {
                data = data || [];
                const dt = JSON.parse(JSON.stringify(data));
                dt.map((item) => {
                    // item.radius = "60%";
                    item.type = type;
                });
                barWidth && (dt.barWidth = barWidth);
                return dt;
            },
            cloneOption(data) {
                data = data || {};
                return JSON.parse(JSON.stringify(data));
            },
            // 饼图样式配置
            pieStyle(val) {
                const formatAmount = Vue.filter('formatAmount');
                this.option = this.cloneOption(echartsConfig.pieOption);
                this.myChart = this.myChart || this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option.series = {
                    type: 'pie',
                    center: ['25%', '50%'],
                    radius: ['50%', '80%'],
                    // radius: ['30%', '80%'],
                    // radius: ['0', '75%'],
                    hoverAnimation: false,
                    startAngle: 0,
                    minAngle: 1,
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
                    formatter: val.formatter ? val.formatter : function (data) {
                        data = data || {};
                        data.data = data.data || {};

                        // data.data.value = Math.random() * 100000000;
                        // let percent =
                        // return data.data.name + ": " + data.data.value + (data.data.percent == null ? "" : "(" + data.data.percent + "%)");
                        return `${data.data.name}: ${formatAmount(data.data.value)}${data.percent == null ? '' : `(${data.percent}%)`}`;
                    }
                };

                this.addOtherOption({
                    opt: this.option,
                    isPie: true,
                    data: val.data
                });

                // this.option.series.stillShowZeroSum = false;
                this.option.series.avoidLabelOverlap = false;
                this.option.series = Object.assign(this.option.series, {
                    label: {
                        normal: {
                            position: 'center',
                            show: false,
                            lineHeight: 26,
                            // formatter: '{b}\n{c}\n{d}%',
                            formatter: (item) => {
                                item = item || {};
                                const dt = item.data || {};
                                const percent = dt.percent == null ? item.percent : dt.percent;
                                // dt.value = Math.random() * 100000000000;
                                return `${dt.name}\n${formatAmount(dt.value)}\n${percent}%`;
                            },
                            textStyle: {
                                fontSize: 13,
                                lineHeight: 26,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto-Regular'
                            }
                        },
                        emphasis: {
                            lineHeight: 26,
                            show: true,
                            textStyle: {
                                fontSize: 13,
                                lineHeight: 26,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto-Regular'
                            }
                        }
                    }
                });

                this.option.tooltip = {
                    show: false,
                    trigger: 'item'
                };
                this.myChart.setOption(this.option);

                this.legendData = this.getLegendData();

                this.addChartsEvent();
                this.legendMouseenter(0);
            },
            // 折线图配置
            lineStyle(val) {
                this.myChart = this.myChart || this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = this.cloneOption(echartsConfig.lineOption);
                this.option.xAxis.data = val.data.xAxisData;
                this.option.series = this.getSeriesData(val.data.seriesData, 'line');

                this.addOtherOption({
                    opt: this.option,
                    isPie: false,
                    data: val.data
                });

                this.myChart.setOption(this.option);
            },
            // 纵向柱状图
            vBarStyle(val) {
                this.myChart = this.myChart || this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = this.cloneOption(echartsConfig.barOption);
                this.option.xAxis.data = val.data.xAxisData;
                this.option.series = this.getSeriesData(val.data.seriesData, 'bar', '50%');
                this.option.tooltip = {
                // formatter: function(data, b, c, d) {
                //     console.log(data,b,c,d,":auio")
                //     return data.data.name + ":" + data.data.value + "(" + data.percent + "%)";
                // }
                };
                this.addOtherOption({
                    opt: this.option,
                    isPie: false,
                    data: val.data
                });

                this.myChart.setOption(this.option);
            },
            // 横向柱状图
            hBarStyle(val) {
                this.myChart = this.myChart || this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                this.option = this.cloneOption(echartsConfig.barLandscapeOption);
                this.option.yAxis.data = val.data.xAxisData;
                this.option.series = this.getSeriesData(val.data.seriesData, 'bar');

                this.addOtherOption({
                    opt: this.option,
                    isPie: false,
                    data: val.data
                });

                this.myChart.setOption(this.option);
            },
            mapStyle(val) {
                this.myChart = this.myChart || this.echarts.init(this.$refs.chart);
                this.myChart.clear();
                // this.option = this.cloneOption(val.mapOpt); // 不能使用这种方式，val.tooltip.formatter的配置会丢失
                this.option = val.mapOpt;

                // this.addOtherOption({
                //     opt:this.option,
                //     isPie:false,
                //     data:val.data
                // });


                this.myChart.setOption(this.option);
                this.mapList = this.getMapListData();
            }
        },
        watch: {
        },
        beforeDestroy() {
            this.myChart.clear();
            // 销毁后解绑resize事件
            window.removeEventListener('resize', this.chartResizeFn);
        }
    };
</script>

<style scoped lang="less">
.chart-data-box{
    height: calc(100% - 24px);
    width: 48%;
    position: absolute;
    top: 0px;
    margin: 20px 18px 0px 52%;
    overflow-x: hidden;
    overflow-y: auto;

}
.chart-map-list{
    width:100%;
    margin: 0px;
    height: 100%;
    background: #fff;
    .chart-data-box-empty{
        line-height: 100%;
        height: 100%;
        text-align: center;
        color: #bbb;
    }
}


.chart-data-box-item{
    cursor: pointer;
    user-select: none;
    padding-left: 10px;
    margin-bottom: 4px;
    vertical-align: top;
    color: rgba(23,35,61,0.75);
    .chart-data-box-item-title{

        line-height: 26px;
        height: 26px;
        font-size: 13px !important;
        display: block;
        // padding-left: 5px;
        margin-left: 22px;
        max-width: calc(100% - 32px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .chart-data-box-item-title-row3,
        .chart-data-box-item-title-row2,
        .chart-data-box-item-title-row1{
            float: left;
            // background: red;
            display: inline-block;
            width: 42%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .chart-data-box-item-title-row2{
            // text-align: right;
            width: 20%;
        }
        .chart-data-box-item-title-row3{
            // text-align: right;
            width: 38%;
        }

        &.disabled{
            color: #c5c5c5 !important;
        }
    }
    .chart-data-box-item-value{

        line-height: 26px;
        height: 26px;
        padding-left: 10px;
        max-width: calc(100% - 16px);
        // line-height: 16px;
        // margin-top: -8px;
        font-size: 12px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .chart-data-box-item-value-row2,
        .chart-data-box-item-value-row1{
            display: inline-block;
            width: 60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            float: left;
        }
        .chart-data-box-item-value-row2{
            width: 36%;
        }
    }
    .chart-data-box-item-ico{
        float: left;
        display: inline-block;
        border-radius: 4px;
        margin-top: 5px;
        width: 14px;
        height: 14px;
        background: #ccc;
        opacity: 1;
    }
    &:hover{
        background: rgba(23, 35, 61, 0.06);
        border-radius: 4px;
        .chart-data-box-item-ico{
            opacity: 0.8;
        }
    }
}
</style>
