<template>
  <div ref="win" style="overflow: hidden;" class="whole-order flex">
    <!-- <Spin style="margin:auto;" v-if="loading" size="large"></Spin> -->
    <Row  style="width:100%;display:flex;">
        <Card dis-hover style="flex:1">
            <no-data v-if="!allData" />
            <Row v-else>
                <i-col span="24">
                    <div id="main_1" style="margin:auto"></div>
                </i-col>
                <i-col span="24">
                    <div id="main_2" style="margin:auto"></div>
                </i-col>
            </Row>

        </Card>

        <Card dis-hover style="flex:1">
            <no-data v-if="!allData"  />
            <Row v-else>
                <i-col span="24">
                    <div id="main_3" style="margin:auto"></div>
                </i-col>
                <i-col span="24">
                    <div id="main_4" style="margin:auto"></div>
                </i-col>
            </Row>
        </Card>
    </Row>
  </div>
</template>
<script>


    export default {
        name: 'whole-order',
        data() {
            return {
                gaugeWidth: 0
            };
        },
        props: {
            // title: {
            //     type: String,
            //     required: true
            // },
            allData: {
                type: Object,
                required: true
            },
            loading: {
                type: Boolean,
                default: true
            },
            vip: {
                type: String,
                default: 'total'
            }
        },
        mounted() {
            this.info();

            // 监听 窗口大小
            window.addEventListener('resize', this.resize);
        },
        beforeDestroy() {
            // 销毁 resize监听事件
            window.removeEventListener('resize', this.resize);
        },
        methods: {
            info() {
                // console.log('info');
                console.log(this.allData);
                if (!this.allData) {
                    this.loading = true;
                    return;
                }
                this.resize();
                //
                const myChart_1 = this.echarts.init(document.getElementById('main_1'));
                //
                const myChart_2 = this.echarts.init(document.getElementById('main_2'));
                //
                const myChart_3 = this.echarts.init(document.getElementById('main_3'));
                //
                const myChart_4 = this.echarts.init(document.getElementById('main_4'));

                const option_1 = {
                    color: 'red',
                    title: {
                        text: '任务回访率'
                    },
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            name: '回访任务量',
                            type: 'gauge',
                            title: { color: '#333' },
                            detail: {
                                fontSize: 20,
                                offsetCenter: [0, '55%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: ((this.allData.visited_rate || 0) * 100).toFixed(2), name: '完成率' }],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 30,
                                    shadowBlur: 0,
                                    color: [
                                        [(this.allData.visited_rate || 0).toFixed(2) || 0, '#0E7CE2'],
                                        [1, '#FF8352']
                                    ]
                                }
                            }
                        }
                    ]
                };

                const bgColor = '#fff';
                const color = ['#0E7CE2', '#FF8352'];
                const echartData_1 = [
                    {
                        name: '已回访',
                        value: this.allData.visited_vip_count || 0
                    },
                    {
                        name: '未回访',
                        value: this.allData.dispatched_vip_count - this.allData.visited_vip_count || 0
                    }
                ];

                const formatNumber = function (num) {
                    if (!num) return 0;
                    const reg = /(?=(\B)(\d{3})+$)/g;
                    return num.toString().replace(reg, ',');
                };
                // const total_1 = echartData_1.reduce((a, b) => a + b.value * 1, 0);
                const option_2 = {
                    backgroundColor: bgColor,
                    color,
                    title: [{
                        text: `{name|${'回访任务总量'}}\n{val|${this.allData.dispatched_vip_count || 0}}`,
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 14,
                                    fontWeight: 'normal',
                                    color: '#666666',
                                    padding: [10, 0]
                                },
                                val: {
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#333333'
                                }
                            }
                        }
                    }],
                    series: [{
                        type: 'pie',
                        radius: ['55%', '70%'],
                        center: ['50%', '50%'],
                        data: echartData_1,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: bgColor,
                                borderWidth: 2
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 100,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: params => (
                                    `{icon|●}{name|${params.name}}{value|${
                                        formatNumber(params.value)}}`
                                ),
                                padding: [0, -100, 25, -100],
                                rich: {
                                    icon: {
                                        fontSize: 16
                                    },
                                    name: {
                                        fontSize: 14,
                                        padding: [0, 10, 0, 4],
                                        color: '#666666'
                                    },
                                    value: {
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333333'
                                    }
                                }
                            }
                        }
                    }]
                };


                const option_3 = {
                    title: {
                        text: '导购参与率'
                    },
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            name: '导购参与率',
                            type: 'gauge',
                            title: { color: '#333' },
                            detail: {
                                fontSize: 20,
                                offsetCenter: [0, '55%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: ((this.allData.visited_guide_rate || 0) * 100).toFixed(2), name: '参与率' }],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 30,
                                    shadowBlur: 0,
                                    color: [
                                        [(this.allData.visited_guide_rate || 0).toFixed(2), '#0E7CE2'],
                                        [1, '#FF8352']
                                    ]
                                }
                            }
                        }
                    ]
                };

                const echartData_2 = [{
                                          name: '已回访导购人数',
                                          value: this.allData.visited_guide_count || 0
                                      },
                                      {
                                          name: '未回访导购人数',
                                          value: this.allData.total_guide_count - this.allData.visited_guide_count || 0
                                      }
                ];
                const total_2 = echartData_2.reduce((a, b) => a + b.value * 1, 0);
                const option_4 = {
                    backgroundColor: bgColor,
                    color,
                    title: [{
                        text: `{name|${'导购总人数'}}\n{val|${formatNumber(total_2)}}`,
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 14,
                                    fontWeight: 'normal',
                                    color: '#666666',
                                    padding: [10, 0]
                                },
                                val: {
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#333333'
                                }
                            }
                        }
                    }],
                    series: [{
                        type: 'pie',
                        radius: ['55%', '70%'],
                        center: ['50%', '50%'],
                        data: echartData_2,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: bgColor,
                                borderWidth: 2
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 130,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: params => (
                                    `{icon|●}{name|${params.name}}{value|${
                                        formatNumber(params.value)}}`
                                ),
                                padding: [0, -100, 25, -100],
                                rich: {
                                    icon: {
                                        fontSize: 16
                                    },
                                    name: {
                                        fontSize: 14,
                                        padding: [0, 10, 0, 4],
                                        color: '#666666'
                                    },
                                    value: {
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333333'
                                    }
                                }
                            }
                        }
                    }]
                };


                myChart_1.setOption(option_1);
                myChart_2.setOption(option_2);
                myChart_3.setOption(option_3);
                myChart_4.setOption(option_4);
            },
            resize() {
                this.gaugeWidth = this.$refs.win.clientWidth - 32;
                document.getElementById('main_1').style.width = `${this.gaugeWidth * 0.5}px`;
                document.getElementById('main_2').style.width = `${this.gaugeWidth * 0.5}px`;
                document.getElementById('main_1').style.height = '300px';
                document.getElementById('main_2').style.height = '300px';
                document.getElementById('main_3').style.width = `${this.gaugeWidth * 0.5}px`;
                document.getElementById('main_4').style.width = `${this.gaugeWidth * 0.5}px`;
                document.getElementById('main_3').style.height = '300px';
                document.getElementById('main_4').style.height = '300px';
            }

        }
    };
</script>
<style lang="less" scoped>
.whole-order{
    background-color: white;
    min-height: 400px;
}
</style>
