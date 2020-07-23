<template>
  <div ref="win" style="overflow: hidden;" class="whole-order flex">
    <!-- <Spin style="margin:auto;" v-if="loading" size="large"></Spin> -->
    <Row  style="width:100%;display:flex;">
        <Card dis-hover style="flex:1">
            <p slot="title">回访任务量统计</p>
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
            <p slot="title">回访导购统计</p>
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

// batch_num: "20200615003"
// create_time: 1592203705000
// creator: "admin"
// department: "新零售四群"
// fid: "291ee9c6-7552-4eea-81fc-0311d9b14a54"
// hierarchy: "1"
// source_type: "商城新粉"
// total_vip_count: 5000
// visited_guide_rate: 0
// visited_rate: 0
//
// //////
//
// batch_num: "20200615001"
// create_time: 1592203694000
// creator: "admin"
// department: "新零售一群"
// dispatched_vip_count: 4197 //
// fid: "d625548b-b0a8-4d88-8a7f-7cdcfd0607cb"
// hierarchy: "1"
// source_type: "商城新粉"
// total_guide_count: 18 //
// total_vip_count: 20000
// visited_guide_count: 9 //
// visited_guide_rate: 0.5
// visited_rate: 0
// visited_vip_count: 18 //

    export default {
        name: 'whole-order',
        data() {
            return {
                gaugeWidth: 0
            };
        },
        props: {
            title: {
                type: String,
                required: true
            },
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
        created() {
            console.log(this.allData);
        },

        mounted() {
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
                    text: '回访率'
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
                        data: [{ value: (((this.allData.visited_vip_count / this.allData.total_vip_count) || 0) * 100).toFixed(2), name: '完成率' }],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 30,
                                shadowBlur: 0,
                                color: [
                                    [((this.allData.visited_vip_count / this.allData.total_vip_count) || 0).toFixed(2) || 0, '#0E7CE2'],
                                    [1, '#FF8352']
                                ]
                            }
                        }
                    }
                ]
            };

            const bgColor = '#fff';
            const title = '回访任务总量';
            const color = ['#0E7CE2', '#FF8352'];
            const echartData_1 = [
                {
                    name: '已回访统计',
                    value: this.allData.visited_vip_count || 0
                },
                {
                    name: '未回访统计',
                    value: this.allData.total_vip_count - this.allData.visited_vip_count || 0
                }
            ];

            const formatNumber = function (num) {
                if (!num) return 0;
                const reg = /(?=(\B)(\d{3})+$)/g;
                return num.toString().replace(reg, ',');
            };
            const total_1 = echartData_1.reduce((a, b) => a + b.value * 1, 0);
            const option_2 = {
                backgroundColor: bgColor,
                color,
                title: [{
                    text: `{name|${title}}\n{val|${formatNumber(total_1)}}`,
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
                        data: [{ value: (((this.allData.visited_guide_count / this.allData.total_guide_count) || 0) * 100).toFixed(2), name: '完成率' }],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 30,
                                shadowBlur: 0,
                                color: [
                                    [((this.allData.visited_guide_count / this.allData.total_guide_count) || 0).toFixed(2), '#0E7CE2'],
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
                    text: `{name|${title}}\n{val|${formatNumber(total_2)}}`,
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

            // 监听 窗口大小
            window.addEventListener('resize', this.resize);
        },
        beforeDestroy() {
            // 销毁 resize监听事件
            window.removeEventListener('resize', this.resize);
        },
        methods: {
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
