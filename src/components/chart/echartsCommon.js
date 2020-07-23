/*
 * echarts全局配置项
 */

/**
  * 所有的chart图 饼图、纵向柱状图、折线图、横向柱状图、雷达图、矩形图、环形图
  * 进行了统一配置样式，样式最好走一套，如果有特殊的样式，覆盖即可
  */

/**
 * 饼状图(数据字典覆盖度,标签覆盖度,完整性,数据轮廓-完整性分析)
 */
import echarts from 'echarts/dist/echarts.min';

const COLOR = ['rgba(45,140,240,1)', 'rgba(0,210,179,1)', 'rgba(251,169,0,1)', 'rgba(242,112,54,1)', 'rgba(181,40,81,1)', 'rgba(45,51,138,1)', 'rgba(172,63,192,1)', 'rgba(102,58,183,1)', 'rgba(67,86,205,1)', 'rgba(16,157,88,1)', 'rgba(123,179,66,1)', 'rgba(191,197,33,1)'];
const tooltipbgColor = 'rgba(246,249,251,0.9)';
const tooltipborColor = '#d4e6f3';
const tooltipExtraCssText = 'box-shadow: 0px 1px 4px rgba(57, 132, 170, 0.9);';

const pieOption = {
    title: {
        text: '',
        subtext: '',
        textStyle: {
            fontSize: 14
        },
        x: 'center'
    },
    legend: {
        // type: 'scroll',
        // top: '10px',
        // itemHeight: 4,
        // textStyle: {
        //     padding: [0, 0, 2, 3],
        //     color: 'rgba(255,255,255,.75)',
        //     fontFamily: 'PingFangSC-Regular'
        // },
        // borderRadius: 4,
        show: false,
        data: []
    },

    color: COLOR,
    series: {}
};


/**
 * 折线图(数据总量，用户活跃度-用户访问度)
 */

const lineOption = {
    grid: {
        top: '7%',
        left: '1%',
        right: '1%',
        bottom: '0',
        containLabel: true
    },
    color: COLOR,
    title: {
    // text: '未来一周气温变化',
        subtext: ''
    },
    textStyle: {
        fontSize: 13
    },
    tooltip: {
        // trigger: 'axis',
        // backgroundColor: tooltipbgColor,
        // borderColor: tooltipborColor,
        // textStyle: {
        //     color: '#707070'
        // },
        // extraCssText: tooltipExtraCssText,
        // padding: [10, 10],
        // axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'cross',
        //     crossStyle: {
        //         color: '#999'
        //     }
        // }

        show: true,
        trigger: 'axis'
    },
    legend: {
        type: 'scroll',
        top: '10px',
        itemHeight: 4,
        textStyle:
        {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular'
        },
        borderRadius: 4,
        data: []
    },
    xAxis: {
        // type: 'category',
        // axisLabel: {
        //     fontSize: 13
        // },
        // boundaryGap: false

        type: 'category',
        boundaryGap: true,
        axisLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick:
        {
            show: false
        },
        splitLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisLabel:
        {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    yAxis: {
        // type: 'value',
        // axisLabel: {
        //     fontSize: 13,
        //     formatter: '{value} '
        // }

        type: 'value',
        boundaryGap: ['0', '23%'],
        axisLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        splitLine:
        {
            show: true,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick:
        {
            show: false
        },
        axisLabel:
        {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    series: {
        name: '',
        type: 'line'
        // areaStyle: {
        //     normal: {
        //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //             offset: 0,
        //             color: '#a8cbf7'
        //         }, {
        //             offset: 1,
        //             color: '#ffffff'
        //         }])
        //     }
        // }
    }
};


/**
 * 横向柱状图(数据轮廓-top10-bottom10，用户活跃度-用户访问分布情况)
 */
const barLandscapeOption = {
    title: {
        textStyle: {
            fontSize: 14
        }
    },
    textStyle: {
        fontSize: 13
    },
    color: COLOR,
    legend: {
        type: 'scroll',
        top: '10px',
        itemHeight: 4,
        textStyle:
        {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular'
        },
        borderRadius: 4
    },
    tooltip: {
        // trigger: 'axis',
        // backgroundColor: tooltipbgColor,
        // borderColor: tooltipborColor,
        // textStyle: {
        //     color: '#707070'
        // },
        // extraCssText: tooltipExtraCssText,
        // padding: [10, 10],
        // axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'cross',
        //     crossStyle: {
        //         color: '#999'
        //     }
        // }

        show: true,
        trigger: 'axis'

    },
    grid: {
        top: '7%',
        left: '1%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: true,
        axisLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick:
        {
            show: false
        },
        splitLine:
        {
            show: true,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisLabel:
        {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    yAxis: {
        type: 'category',
        boundaryGap: ['0', '23%'],
        axisLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        splitLine:
        {
            show: false,
            lineStyle:
            {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick:
        {
            show: false
        },
        axisLabel:
        {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    series: [{ // For shadow
        type: 'bar',
        itemStyle: {
            normal: { color: '#d6e3f7' }
        },
        barGap: '-100%',
        barCategoryGap: '50%',
        animation: false
    }, {
        type: 'bar',
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    1, 1, 0, 1, [
                        { offset: 0, color: '#0889fe' },
                        { offset: 1, color: '#2ebdf9' }
                    ],
                )
            },
            emphasis: {
                color: '#1e78ef',
                shadowColor: 'rgba(30, 120, 239, 0.5)',
                shadowBlur: 2
            }
        },
        label: {
            normal: {
                show: false,
                position: 'right'

            }
        }
    }]
};


/**
 * 雷达图(数据地图)
 */
const barRadarOption = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: tooltipbgColor,
        borderColor: tooltipborColor,
        textStyle: {
            color: '#707070'
        },
        extraCssText: tooltipExtraCssText,
        padding: [13, 10]
    },
    legend: {
        orient: 'vertical',
        align: 'left',
        right: 0,
        bottom: 10,
        itemGap: 18,
        data: [{
            icon: 'circle',
            textStyle: {
                color: '#707070'
            }
        }, {
            icon: 'circle',
            textStyle: {
                color: '#707070'
            }
        }]
    },
    radar: {
        nameGap: 8,
        radius: '100%',
        startAngle: 0,
        name: {
            textStyle: {
                color: '#707070'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['#fff', '#deeafa']
            }
        },
        indicator: []
    },
    series: [{
        name: '',
        type: 'radar',
        symbolSize: 7,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        label: {
            normal: {
                show: true,
                position: 'top',
                textStyle: {
                    fontSize: 18
                }
            }
        },
        data: [{
            value: [],
            name: '',
            itemStyle: {
                normal: {
                    color: '#0172d6'
                }
            },
            lineStyle: {
                normal: {
                    color: '#0172d6'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        1, 1, 0, 1, [{
                            offset: 1,
                            color: '#0174d9'
                        }, {
                            offset: 0,
                            color: '#0087fe'
                        }],
                    ),
                    opacity: 0.6
                }
            },
            zlevel: 0,
            z: 0
        }, {
            value: [],
            name: '',
            itemStyle: {
                normal: {
                    color: '#2dcbf3'
                }
            },
            lineStyle: {
                normal: {
                    color: '#7fddfe'
                }
            },
            areaStyle: {
                normal: {
                    color: '#2dcbf3',
                    opacity: 0.6
                },
                emphasis: {
                    color: '#2dcbf3',
                    opacity: 0.6
                }
            },
            zlevel: 10,
            z: 10
        }]
    }]
};


/*
 * 矩形图（数据地图）
 * */
const treemapOption = {
    tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipbgColor,
        borderColor: tooltipborColor,
        textStyle: {
            color: '#707070'
        },
        extraCssText: tooltipExtraCssText,
        padding: [10, 10],
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    series: [{
        type: 'treemap',
        breadcrumb: { show: false },
        visibleMin: 300,
        roam: false,
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        label: {
            show: true,
            formatter: '{b}'
        },
        itemStyle: {
            normal: {
                borderColor: '#fff'
            }
        },
        levels: [{
            itemStyle: {
                normal: {
                    borderWidth: 0,
                    gapWidth: 5
                }
            }
        }],
        data: []
    }]
};


/**
 * 环形图(数据轮廓-类型检查统计)
 */

const ringOption = {
    title: {
        textStyle: {
            fontSize: 14
        }
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: tooltipbgColor,
        borderColor: tooltipborColor,
        textStyle: {
            color: '#707070'
        },
        extraCssText: tooltipExtraCssText,
        padding: [13, 10]
    },
    grid: {
        left: '0',
        right: '0',
        containLabel: true
    },
    legend: {
        orient: 'vertical',
        top: '0px',
        right: '0px',
        itemHeight: 14,
        textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 14
        },
        selectedMode: false
    },
    series: [{
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: true,
                formatter(param) {
                    return `${param.percent}%`;
                },
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            }
        },
        labelLine: {
            normal: {
                show: true
            }
        }
    }]
};

/**
 * 纵向柱状图
 */
const barOption = {
    title: {
        textStyle: {
            fontSize: 14
        }
    },
    textStyle: {
        fontSize: 13
    },
    color: COLOR,

    tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipbgColor,
        borderColor: tooltipborColor,
        textStyle: {
            color: '#707070'
        },
        extraCssText: tooltipExtraCssText,
        padding: [10, 10],
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    legend: {
        type: 'scroll',
        top: '10px',
        itemHeight: 4,
        textStyle: {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular'
        },
        borderRadius: 4
    },
    legendData: {
        icon: 'rect'
    },
    grid: {
        top: '7%',
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false,
            lineStyle: {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisLabel: {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: ['0', '23%'],
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(23,35,61,0.10)'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            fontSize: 13,
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
        }
    },
    // animationDurationUpdate: 1200,
    series: {
        type: 'bar', // 如为折线图，type改为line
        barWidth: '20%',
        itemStyle: {
            normal: {
                color: '#42aaf3'
            },
            emphasis: {
                color: '#1e78ef',
                shadowColor: 'rgba(30, 120, 239, 0.5)',
                shadowBlur: 2
            }
        }

    }
};

export default {
    pieOption,
    lineOption,
    barLandscapeOption,
    ringOption,
    barRadarOption,
    treemapOption,
    barOption
};
