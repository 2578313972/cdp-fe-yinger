<template>
    <div class="advertise-result">
        <div class="overview-box">
            <Row type="flex" justify="center" align="middle">
                <Col class="text-align-c" span="4" v-for="(item,index) in overViewData" :key="index" :class="'line'">
                <p class="f20 color-blue">{{item.value}}</p>
                <p class="f14 pt10">{{item.name}}</p>
                </Col>
                <Col span="1">
                <i style="color:#e8eaec;" class="fa f18 fa-caret-right"></i>
                </Col>
                <Col span="11">
                <Row class="f14 ov-ratio">
                    <Col span="1"></Col>
                    <Col span="6">排除人数：</Col>
                    <Col span="3" class="color-blue"><strong>4637</strong></Col>
                    <Col span="10">
                    <div class="orign-rat">
                        <div class="real-rat"></div>
                    </div>
                    </Col>
                    <Col span="2">50%</Col>
                </Row>
                <Row class="f14 ov-ratio">
                    <Col span="1"></Col>
                    <Col span="6">频控人数：</Col>
                    <Col span="3" class="color-blue"><strong>4637</strong></Col>
                    <Col span="10">
                    <div class="orign-rat">
                        <div class="real-rat"></div>
                    </div>
                    </Col>
                    <Col span="2">50%</Col>
                </Row>
                <Row class="f14 ov-ratio">
                    <Col span="1"></Col>
                    <Col span="6">不符合实时条件：</Col>
                    <Col span="3" class="color-blue"><strong>4637</strong></Col>
                    <Col span="10">
                    <div class="orign-rat">
                        <div class="real-rat"></div>
                    </div>
                    </Col>
                    <Col span="2">50%</Col>
                </Row>
                <Row class="f14 ov-ratio">
                    <Col span="1"></Col>
                    <Col span="6">发送失败：</Col>
                    <Col span="3" class="color-blue"><strong>856,566</strong></Col>
                    <Col span="10">
                    <div class="orign-rat">
                        <div class="real-rat"></div>
                    </div>
                    </Col>
                    <Col span="2">50%</Col>
                </Row>
                </Col>
            </Row>
        </div>
        <!-- 此处为了计算转化率三角左侧距离添加 -->
        <div class="word-width" ref="wordwidth">
            <div v-for="(item,index) in wordWidth" :key="index" v-html="formatter(item,'br')"></div>
        </div>
        <Row type="flex" justify="space-between">
            <Col span="10">
            <div class="step_warpper" :style="{left:ratioWidth+15+'px'}">
                <div :style="{opacity: 1-index/10,top:index*(topList[ratioList.length-2]['top'])+(topList[ratioList.length-2]['cTop'])+'px'}" v-for="(item,index) in ratioList" :key="index" class="step_ratio">{{item}}%</div>
            </div>
            <p class="last-ratio">
                <strong>最终转化率 70%</strong>
                <Tooltip max-width="320" content="最终转化率等于漏斗最后一步的“步骤转化人群”除以“触达成功人群”乘以100%" placement="top">
                    <i class="fa fa-question-circle-o"></i>
                </Tooltip>
            </p>
            <div ref="bar_chart" class="chart"></div>
            </Col>
            <Col span="14">
            <div class="sub_tab_list">
                <Tabs>
                    <TabPane v-for="(item,index) in tabList" :key="index" :label="item.label"></TabPane>
                </Tabs>
            </div>
            <div class="chart-title">
                <span>过去24小时每小时转化数量</span>
                <span v-if="false">历史转化数量</span>
                <!-- <Tooltip max-width="320" content="历史转化数量" placement="right">
                        <i class="fa fa-question-circle-o"></i>
                    </Tooltip> -->
            </div>
            <div class="box-flex" v-if="false">
                <div class="btn_list flex1">
                    <ButtonGroup>
                        <Button class="btn_width" size="small" v-for="(item,index) in buttonList" :key="index" :type="item.key==buttonActive?'primary':'default'" @click="buttonStatus(item.key)">
                                        {{item.value}}
                                    </Button>
                    </ButtonGroup>
                </div>
                <!-- <div class="down_box">
                        <Dropdown style="max-height:300px;" placement="bottom-end" transfer>
                            <a href="javascript:void(0)">
                                        下载CSV
                                        <Icon type="ios-arrow-down"></Icon>
                                    </a>
                            <DropdownMenu slot="list" style="width:180px;">
                                <Checkbox class="down_item" :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                                <div style="height:135px;overflow-y:auto;">
                                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                        <Checkbox class="down_item" v-for="item in downItemList" :key="item.value" :label="item.value">{{item.label}}</Checkbox>
                                    </CheckboxGroup>
                                </div>
                                <div class="down_btn">
                                    <Button size="small" type="primary">导出</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div> -->
            </div>
            <div ref="line_chart" class="chart line_chart"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
    const colorList = ['#FACC14', '#1890FF', '#2FC25B', '#223273', '#8453E0', '#13C2C2', '#3436C7'];
    const colorList2 = ['rgba(250,204,20, 0.65)', 'rgba(24,144,255, 0.65)', 'rgba(47,194,91, 0.65)', 'rgba(34,50,115, 0.65)', 'rgba(132,83,224, 0.65)', 'rgba(19,194,194, 0.65)', 'rgba(52,54,199, 0.65)'];
    export default {
        name: 'Result',
        data() {
            return {
                overViewData: [{
                                   name: '预计触达',
                                   value: '999,999'
                               }, {
                                   name: '实际触达',
                                   value: '856,566'
                               },
                               {
                                   name: '触达失败',
                                   value: '143,433'
                               }
                ],
                wordWidth: this.$lodash.clone(this.$activity.stepBarData.xData).sort((a, b) => b.length - a.length),
                ratioWidth: 0,
                downItemList: this.$activity.downItemList,
                indeterminate: true,
                checkAll: false,
                checkAllGroup: [1, 2, 3],
                tabList: [{
                              name: 'real',
                              label: '实时动态'
                          },
                          {
                              name: 'history',
                              label: '历史趋势'
                          }
                ],
                buttonList: [{
                    value: '日',
                    key: 'day'
                }, {
                    value: '周',
                    key: 'week'
                }, {
                    value: '月',
                    key: 'month'
                }],
                buttonActive: 'week',
                subTabList: this.$activity.subTabList,
                tabActive: 'putIn',
                topList: [{
                    top: 140,
                    cTop: 210
                }, {
                    top: 100,
                    cTop: 168
                }, {
                    top: 76,
                    cTop: 142
                }, {
                    top: 60,
                    cTop: 125
                }, {
                    top: 48,
                    cTop: 115
                }],
                ratioList: [],
                barChart: null,
                barOption: {
                    grid: {
                        top: 0,
                        left: '0',
                        right: '5%',
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: {
                        position: 'top',
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#e8eaec',
                                width: 1
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#e8eaec'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            },
                            formatter: val => `${Math.ceil(val / this.$activity.stepBarData.yData1[0] * 100)}%`
                        }
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: '#e8eaec',
                                width: 1
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#333'
                            },
                            formatter: value => this.formatter(value)
                        },
                        data: JSON.parse(JSON.stringify(this.$activity.stepBarData.xData)).reverse()
                    },
                    series: [{
                                 type: 'bar',
                                 stack: '总量',
                                 barWidth: '30',
                                 color: params => colorList[(this.$activity.stepBarData.yData1.length - 1) - params.dataIndex],
                                 label: {
                                     normal: {
                                         show: true,
                                         position: 'inside'
                                     }
                                 },
                                 data: JSON.parse(JSON.stringify(this.$activity.stepBarData.yData1)).reverse()
                             },
                             {
                                 type: 'bar',
                                 stack: '总量',
                                 color: params => colorList2[(this.$activity.stepBarData.yData1.length - 1) - params.dataIndex],
                                 label: {
                                     normal: {
                                         show: true,
                                         position: 'inside'
                                     }
                                 },
                                 data: JSON.parse(JSON.stringify(this.$activity.stepBarData.yData2)).reverse()
                             }
                    ]
                },
                lineChart: null,
                lineOption: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.$activity.stepLineData.yData.map(item => item.name),
                        top: 10,
                        right: 10
                    },
                    grid: {
                        left: '30',
                        right: '20',
                        bottom: '25',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#e8eaec',
                                width: 1
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#e8eaec'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            }
                        },
                        data: this.$activity.stepLineData.xData
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#e8eaec',
                                width: 1
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            }
                        }
                    },
                    series: this.$activity.stepLineData.yData,
                    dataZoom: [{
                        type: 'slider',
                        start: 0,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleStyle: {
                            color: '#3d88f2'
                        },
                        fillerColor: '#edf1f5',
                        borderColor: '#e6e9ed',
                        showDataShadow: false, // 是否显示数据阴影 默认auto
                        showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
                        textStyle: {
                            color: '#3d88f2'
                        },
                        height: 16,
                        bottom: 0
                    }]
                }
            };
        },
        methods: {
            formatter(value, split) {
                let ret = ''; // 拼接加\n返回的类目项
                const maxLength = 6; // 每项显示文字个数
                const valLength = value.length; // X轴类目项的文字个数
                const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
                if (rowN > 1) // 如果类目项的文字大于3,
                {
                    for (let i = 0; i < rowN; i++) {
                        let temp = ''; // 每次截取的字符串
                        const start = i * maxLength; // 开始截取的位置
                        const end = start + maxLength; // 结束截取的位置
                        if (i === 0) {
                            temp = value.substring(start, end);
                        } else {
                            temp = (split ? '<br>' : '\n') + value.substring(start, end);
                        }
                        ret += temp; // 凭借最终的字符串
                    }
                    return ret;
                }
                return value;
            },
            subTabActiveFn(status) {
                this.tabActive = status;
            },
            buttonActiveFn(status) {
                this.buttonActive = status;
            },
            chartResizeFn() {
                this.$nextTick(() => {
                    this.barChart.resize();
                    this.lineChart.resize();
                });
            },
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.checkAllGroup = this.downItemList.map(item => item.value);
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange(data) {
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            }
        },
        created() {
            const ratioArr = this.$activity.stepBarData.yData1;
            for (let index = 0; index < ratioArr.length; index++) {
                if (index > 0) {
                    // let count = ('' + (ratioArr[index] / ratioArr[index - 1])).split('.')
                    // this.ratioList.push((count[0] + '.' + count[1].substring(0, 4)) * 10000 / 100);
                    this.ratioList.push((ratioArr[index] * 100 / ratioArr[index - 1]).toFixed(2));
                }
            }
            const timer = this.$config.debounce_wait;
            this.subTabStatus = this.$lodash.debounce(this.subTabActiveFn, timer);
            this.buttonStatus = this.$lodash.debounce(this.buttonActiveFn, timer);
        },
        mounted() {
            this.barChart = this.barChart || this.echarts.init(this.$refs.bar_chart);
            this.barChart.setOption(this.barOption);
            this.lineChart = this.lineChart || this.echarts.init(this.$refs.line_chart);
            this.lineChart.setOption(this.lineOption);
            this.$nextTick(() => {
                this.ratioWidth = this.$refs.wordwidth.scrollWidth;
                // 绑定缩放
                window.addEventListener('resize', this.chartResizeFn);
            });
        },
        watch: {
            $route(to, from) {
                console.log(to, from);
            }
        },
        destroyed() {
            // 销毁后解绑resize事件
            window.removeEventListener('resize', this.chartResizeFn);
        }
    };
</script>

<style lang="less" scoped>
    .word-width {
        height: 0;
        overflow: hidden;
        display: inline-block;
        float: left;
    }
    .last-ratio {
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 20px;
        & strong {
            color: #2d8cf0;
        }
    }
    .advertise-result {
        max-width: none!important;
        .chart {
            width: 100%;
            height: 500px;
        }
        .line_chart {
            height: 410px;
        }
        .step_warpper {
            position: absolute;
            top: 0;
        }
        .step_ratio {
            width: 80px;
            height: 20px;
            background: #2d8cf0;
            text-align: center;
            color: #fff;
            padding-top: 4px;
            border-radius: 5px 5px 4px 4px;
            position: relative;
            z-index: 10;
            opacity: 0.8;
        }
        .step_ratio::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 2px;
            border-left: 38px solid transparent;
            border-right: 38px solid transparent;
            border-top: 12px solid #2d8cf0;
        }
        .btn_list {
            margin: 0 0 0 35px;
        }
        .sub_tab_list {
            margin: 0 0 10px 30px;
        }
        .btn_width {
            padding: 0 15px;
        }
        .sub_tab_width {
            padding: 5px 20px 6px;
            font-weight: bold;
        }
        .down_box {
            padding-right: 10px;
        }
    }
    .chart-title {
        padding: 0 0 15px 35px;
        font-weight: bold;
    }
    .overview-box {
        border-bottom: 1px solid #e8eaec;
        margin-bottom: 30px;
        padding-bottom: 20px;
        .line {
            border-right: 1px solid #e8eaec;
            padding: 5px 0;
        }
        .ov-ratio {
            .orign-rat {
                background: #F7F6F7;
                height: 18px;
                margin-top: 1px;
                margin-right: 10px;
                position: relative;
            }
            .real-rat {
                width: 50%;
                position: absolute;
                background: red;
                height: 100%;
            }
        }
    }
</style>

<style lang="less">
    .down_item {
        display: block;
        padding: 2px 10px;
    }
    .down_btn {
        text-align: center;
        padding-top: 5px;
        border-top: 1px solid #eee;
    }
    .sub_tab_list .ivu-tabs-nav .ivu-tabs-tab {
        padding-top: 0px;
    }
</style>
