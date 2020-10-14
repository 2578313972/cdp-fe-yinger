<template>
  <div ref="win" class="whole-order flex" style="flex-wrap: wrap">
    <!-- <Spin style="margin:auto;" v-if="loading" size="large"></Spin> -->
    <Row style="width: 100%; display: flex; justify-content: center">
      <Card dis-hover style="width: 48%">
        <no-data v-if="!allData" />
        <Row v-else>
          <i-col span="24">
            <div ref="chart_1" style="margin: auto"></div>
          </i-col>
          <i-col span="24">
            <div ref="chart_2" style="margin: auto"></div>
          </i-col>
        </Row>
      </Card>

      <Card dis-hover style="width: 48%">
        <no-data v-if="!allData" />
        <Row v-else>
          <i-col span="24">
            <div ref="chart_3" style="margin: auto"></div>
          </i-col>
          <i-col span="24">
            <div ref="chart_4" style="margin: auto"></div>
          </i-col>
        </Row>
      </Card>
    </Row>

    <Row style="width: 100%; margin-top: 15px">
      <i-col span="24" style="display: flex; flex-wrap: wrap">
        <Table
          class="smce-table-noscroll td-table-no-border"
          border
          style="margin: auto"
          :width="gaugeWidth * 0.98"
          :loading="loading"
          no-data-text="暂无数据"
          :columns="columns"
          :data="tableData"
        ></Table>
        <Page
          class="w100 mt16 padding16-18 ivu-row-flex ivu-row-flex-end"
          :current="current"
          :page-size="pageSize"
          :total="total"
          :page-size-opts="[10, 20, 40]"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          show-total
          show-sizer
        />
      </i-col>
    </Row>
  </div>
</template>
<script>
    export default {
        name: 'whole-order',
        data() {
            return {
                gaugeWidth: 0,
                chart_1: null,
                chart_2: null,
                chart_3: null,
                chart_4: null,
                // table data
                columns: [],
                tableData: [],
                tableDataClone: [],
                current: 1,
                pageSize: 10,
                total: 0
            };
        },
        props: {
            allData: {
                type: Object,
                required: true
            },
            queryOptions: {
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
            this.columns = [
                {
                    title: '区域',
                    key: 'area',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100
                },
                {
                    title: '店铺数',
                    key: 'shop_num',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100
                },
                {
                    title: '推送会员数',
                    key: 'dispatched_vip_count',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100,
                    render: (h, params) => (
          <div>
            {this.$kilobit(Math.round(params.row.dispatched_vip_count))}
          </div>
        )
                },
                {
                    title: '未分配会员数',
                    key: 'non_dispatched_vip_count',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100
                },
                {
                    title: '回访会员数',
                    key: 'visited_vip_count',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100,
                    render: (h, params) => (
          <div>{this.$kilobit(Math.round(params.row.visited_vip_count))}</div>
        )
                },
                {
                    title: '回访率',
                    key: 'visited_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100,
                    render: (h, params) => (
          <div>{Math.round(params.row.visited_rate * 10000) / 100}%</div>
        )
                },
                {
                    title: '回访后销售会员数',
                    key: 'visited_vip_buyed_total',
                    align: 'center',
                    tooltip: true,
                    minWidth: 120,
                    render: (h, params) => (
          <div>
            {this.$kilobit(Math.round(params.row.visited_vip_buyed_total))}
          </div>
        )
                },
                {
                    title: '回访后销售额度',
                    key: 'visited_vip_sales_total',
                    align: 'center',
                    tooltip: true,
                    minWidth: 120,
                    render: (h, params) => (
          <div>
            {this.$kilobit(Math.round(params.row.visited_vip_sales_total))}
          </div>
        )
                },
                {
                    title: '店均销售',
                    key: 'shop_avg_sales',
                    align: 'center',
                    tooltip: true,
                    minWidth: 100,
                    render: (h, params) => (
          <div>{this.$kilobit(Math.round(params.row.shop_avg_sales))}</div>
        )
                }
            ];
            this.getTableData();
        },
        mounted() {
            // 初始化echart
            this.info();
            // 监听 窗口大小
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            /** table 数据 */
            getTableData() {
                this.$https.statisticsKanban
                    .queryTotalResultByFIds({
                        fids: this.$route.params.id,
                        startTimeDay: sessionStorage.getItem('startTimeDay'),
                        endTimeDay: sessionStorage.getItem('endTimeDay')
                    })
                    .then((res) => {
                        // sessionStorage.removeItem('sourceType');
                        // sessionStorage.removeItem('startTimeDay');
                        // sessionStorage.removeItem('endTimeDay');
                        this.tableDataClone = res.data.data;
                        this.total = this.tableDataClone.length;
                        this.pageChange(this.current);
                    });
            },
            /** page-change */
            pageChange(e) {
                this.current = e;
                const startPage = (this.current - 1) * this.pageSize;
                this.tableData = this.tableDataClone.slice(startPage, startPage + this.pageSize);
            },
            /** page-size-change */
            pageSizeChange(e) {
                this.pageSize = e;
                this.pageChange(this.current);
            },
            /** echart初始化 */
            info() {
                if (!this.allData) {
                    this.loading = true;
                    return;
                }

                this.chart_1 = this.echarts.init(this.$refs.chart_1);
                this.chart_2 = this.echarts.init(this.$refs.chart_2);
                this.chart_3 = this.echarts.init(this.$refs.chart_3);
                this.chart_4 = this.echarts.init(this.$refs.chart_4);
                this.resize();

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
                            data: [
                                {
                                    value: ((this.allData.visited_rate || 0) * 100).toFixed(2),
                                    name: '完成率'
                                }
                            ],
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
                        value:
                            this.allData.dispatched_vip_count
                            - this.allData.visited_vip_count || 0
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
                    title: [
                        {
                            text: `{name|${'回访任务总量'}}\n{val|${
                                this.allData.dispatched_vip_count || 0
                            }}`,
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
                        }
                    ],
                    series: [
                        {
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
                                    formatter: params => `{icon|●}{name|${params.name}}{value|${formatNumber(
                                        params.value
                                    )}}`,
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
                        }
                    ]
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
                            data: [
                                {
                                    value: ((this.allData.visited_guide_rate || 0) * 100).toFixed(
                                        2
                                    ),
                                    name: '参与率'
                                }
                            ],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 30,
                                    shadowBlur: 0,
                                    color: [
                                        [
                                            (this.allData.visited_guide_rate || 0).toFixed(2),
                                            '#0E7CE2'
                                        ],
                                        [1, '#FF8352']
                                    ]
                                }
                            }
                        }
                    ]
                };

                const echartData_2 = [
                    {
                        name: '已回访导购人数',
                        value: this.allData.visited_guide_count || 0
                    },
                    {
                        name: '未回访导购人数',
                        value:
                            this.allData.total_guide_count - this.allData.visited_guide_count
                            || 0
                    }
                ];
                const total_2 = echartData_2.reduce((a, b) => a + b.value * 1, 0);
                const option_4 = {
                    backgroundColor: bgColor,
                    color,
                    title: [
                        {
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
                        }
                    ],
                    series: [
                        {
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
                                    formatter: params => `{icon|●}{name|${params.name}}{value|${formatNumber(
                                        params.value
                                    )}}`,
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
                        }
                    ]
                };

                this.chart_1.setOption(option_1);
                this.chart_2.setOption(option_2);
                this.chart_3.setOption(option_3);
                this.chart_4.setOption(option_4);
            },
            /** echart响应式大小 */
            resize() {
                this.gaugeWidth = this.$refs.win.clientWidth - 32;
                this.$refs.chart_1.style.width = `${this.gaugeWidth * 0.44}px`;
                this.$refs.chart_2.style.width = `${this.gaugeWidth * 0.44}px`;
                this.$refs.chart_1.style.height = '300px';
                this.$refs.chart_2.style.height = '300px';
                this.$refs.chart_3.style.width = `${this.gaugeWidth * 0.44}px`;
                this.$refs.chart_4.style.width = `${this.gaugeWidth * 0.44}px`;
                this.$refs.chart_3.style.height = '300px';
                this.$refs.chart_4.style.height = '300px';
                this.chart_4.resize();
                this.chart_3.resize();
                this.chart_2.resize();
                this.chart_1.resize();
            }
        }
    };
</script>
<style lang="less" scoped>
.whole-order {
  background-color: white;
  min-height: 400px;
}
/** th */
/deep/ .ivu-table {
  border-left: 1px solid #e8eaec;
  th {
    background-color: #3398db;
  }
}

/* 滚动条 */
/deep/ .ivu-table-overflowY::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d6d6d6;
}
/deep/ .ivu-table-overflowX::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d6d6d6;
}
</style>
