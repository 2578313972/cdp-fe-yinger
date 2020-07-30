<template>
  <div class="page-warpper">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="page-content page-content-tab">
        <!-- 顶部下载图标 -->
        <Row  class="page-title bottom-shadow page-title-tab" style="background:white;">
            <i-col span="6">
                <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
                    <MenuItem :key="0" :name="1">订单分析对比管理</MenuItem>
                </Menu>
            </i-col>
            <i-col span="6" offset="12" style="text-align:right;padding-right:20px;color:#3493FC;">
                <!-- <i style="font-weight:700;font-size:25px;margin-right:20px;cursor: pointer;" class="el-icon-download"></i>
                <Tooltip>
                    <i style="font-weight:700;font-size:25px;cursor: pointer;" class="el-icon-question"></i>
                    <div slot="content" style="padding:5px 5px;">
                        <ul style="width:200px;">
                            <li v-for="item in 'abcdefg'" :key="item" style="border-bottom:1px solid #;">item</li>
                        </ul>
                    </div>
                </Tooltip> -->
            </i-col>
        </Row>

        <Card dis-hover>
            <div class="content-text flex borbox" style="background:#F1F2F4;padding:11px;">
            <div class="content-text-left" >
                <h3 class="borbox title">总销售额</h3>
                <div class="user-info">
                    <div class="header-img" style="padding:8px 0;" >
                    <!--<Icon type="person-stalker" style="font-size:30px;color:#bbbdc6;"></Icon>-->
                    <img style="width:90px;height:90px;" src="@/assets/images/yinger.png" title="影儿时尚集团">
                    </div>
                    <h2 style="font-size:24px; margin-top:6px;color:#1890ff;padding:6px;"> {{(allData.sales_amount) | toFixed0 | allMoney}} </h2>
                </div>
            </div>
            <div class="content-text-right">
                <h3 class="borbox title">消费分析</h3>
                <div class="flex conten">
                    <div class="conten-child  two">
                        <div>
                            <p>平均客单价</p>
                            <p>{{allData.avg_transaction_value | toFixed0}}</p>
                        </div>
                        <div>
                            <p>平均客单件</p>
                            <p>{{allData.avg_transaction_unit | toFixed}}</p>
                        </div>
                    </div>
                    <div class="conten-child  two">
                        <div>
                            <p>平均件单价</p>
                            <p>{{allData.avg_unit_value | toFixed0}}</p>
                        </div>
                        <div>
                            <p>联单率</p>
                            <p>{{allData.joint_purchase_rate*100 | toFixed0}}%</p>
                        </div>
                    </div>
                    <div class="conten-child  two">
                        <div>
                            <p>新会员人数</p>
                            <p>{{allData.new_vip_count}}</p>
                        </div>
                        <div>
                            <p>新会员占比</p>
                            <p>{{allData.new_vip_rate*100 | toFixed0}}%</p>
                        </div>
                    </div>
                    <div class="conten-child  two">
                        <div>
                            <p>老会员人数</p>
                            <p>{{allData.old_vip_count}}</p>
                        </div>
                        <div>
                            <p>老会员占比</p>
                            <p>{{allData.old_vip_rate*100 | toFixed0}}%</p>
                        </div>
                    </div>
                    <div class="conten-child  two">
                        <div>
                            <p>新会员转化率</p>
                            <p>{{allData.new_vip_case_rate*100 | toFixed0}}%</p>
                        </div>
                        <div>
                            <p>平均折扣率</p>
                            <p>{{allData.avg_discount_rate*100 | toFixed0}}%</p>
                        </div>
                    </div>

                    <!-- <div class="conten-child two one">
                    <div>
                        <p>平均折扣率</p>
                    </div>
                    <div>
                        <p>{{allData.avg_discount_rate*100 | toFixed}}%</p>
                    </div>
                    </div> -->

                </div>
            </div>
            </div>


        </Card>

        <Card dis-hover class="conten">
            <p slot="title" class="rbg">订单分析-TOP排名</p>
            <div ref="content" class="padding16-18">
                <Table :width="conWidth" border :columns="columns" :data="tableData"></Table>
            </div>
        </Card>

        <div class="flex conten">
            <Card dis-hover ref="refund" style="width:25%;margin:7.5px auto">
                <p slot="title" class="rbg" style="text-indent:15px;">退货率</p>
                <div class="echarts" style="margin-top:15px;">
                    <div ref="chart_1"></div>
                    <div ref="chart_2"></div>
                </div>
            </Card>

            <Card dis-hover style="width:75%;margin:7.5px auto">
                <p slot="title" class="rbg" style="text-indent:15px;">占比</p>
                <div class="echarts" style="margin-top:15px;">
                    <div ref="chart_3"></div>
                    <div ref="chart_4"></div>
                    <div ref="chart_5"></div>
                </div>
            </Card>
        </div>

        <div style="width:calc(100% - 22px);margin:auto">
            <Card dis-hover style="width:100%;margin:7.5px auto">
                <p slot="title" class="rbg" style="text-indent:15px;">商品偏好系列</p>
                <div class="flex echarts" style="margin-top:15px;">
                    <div ref="chart_6" style="margin-bottom: 23px;"></div>
                    <div ref="chart_7"></div>
                    <div ref="chart_8"></div>
                    <div ref="chart_9"></div>
                </div>
            </Card>
        </div>

    </div>
  </div>
</template>
<script>
    // import Charts from '@/components/chart/charts.vue';

    export default {
        name: 'Group',
        data() {
            return {
                spinShow: true,
                columns: [],
                tableData: [], // 表格数据
                allData: {}, // 所有数据内容
                conWidth: 0, // 内容宽度
                chartsSize: 0,
                charts: []
            };
        },
        // components: { Charts },
        created() {
            this.columns = [
                {
                    title: '指标名称',
                    align: 'center',
                    minWidth: 200,
                    render: (h, params) => (
                    <div style="font-weight:600;">
                        <span> {params.row.keyName} </span>
                    </div>
                )

                }
            ];

            for (let i = 1; i <= 10; i++) {
                this.columns.push({
                    title: `Top${i}`,
                    key: `top${i}`,
                    minWidth: 300,
                    align: 'center',
                    render: (h, params) => (
                        <div>
                        {params.row[params.column.key].split(' ')[0]}
                        <span style="color:#1890ff"> {params.row[params.column.key].split(' ')[1]}</span>
                        </div>
                        )
                });
            }
        },
        mounted() {
            this.chartsSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;

            for (let i = 1; i <= this.chartsSize; i++) {
                this[`myChart${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }
            this.resize1();

            this.$https.overallOverview.overview().then((res) => {
                this.allData = res.data.data[0];

                // 表格数据
                this.tableData = [
                    { keyName: '销量款色TOP10排名' },
                    { keyName: '销售额款色TOP10排名' },
                    { keyName: '商品偏好-品类分布' }
                ];
                for (let i = 1; i <= 10; i++) {
                    if (this.allData.top10_by_unit.length > 0) {
                        this.tableData[0][`top${i}`] = `${Object.keys(this.allData.top10_by_unit[i - 1])[0]} (${(Object.values(this.allData.top10_by_unit[i - 1])[0])}件)`;
                    }

                    if (this.allData.top10_by_value.length > 0) {
                        this.tableData[1][`top${i}`] = `${Object.keys(this.allData.top10_by_value[i - 1])[0]} (${this.$options.filters.allMoney(~~(Object.values(this.allData.top10_by_value[i - 1])[0]))}元)`;
                    }

                    if (this.allData.category_distribution.length > 0) {
                        this.tableData[2][`top${i}`] = Object.keys(this.allData.category_distribution[i - 1])[0];
                    }
                }

                const option1 = {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            name: '退货率',
                            type: 'gauge',
                            max: Math.min((~~this.allData.total_count_return_rate + 1) * 100 + 10, 100),
                            title: { color: '#333' },
                            detail: {
                                fontSize: 25,
                                offsetCenter: [0, '65%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: (this.allData.total_count_return_rate * 100).toFixed(0), name: '\n订单销量' }],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 30,
                                    shadowBlur: 0,
                                    color: [
                                        [this.allData.total_count_return_rate, '#FF8352'],
                                        [1, '#3398DB']
                                    ]
                                }
                            }
                        }
                    ]
                };
                const option2 = {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            name: '退货率',
                            type: 'gauge',
                            title: { color: '#333' },
                            max: Math.min((~~this.allData.total_sales_return_rate + 1) * 100 + 10, 100),
                            detail: {
                                fontSize: 25,
                                offsetCenter: [0, '65%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: (this.allData.total_sales_return_rate * 100).toFixed(0), name: '\n订单销售额' }],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 30,
                                    shadowBlur: 0,
                                    color: [
                                        [this.allData.total_sales_return_rate, '#FF8352'],
                                        [1, '#3398DB']
                                    ]
                                }
                            }
                        }
                    ]
                };

                const option3 = {
                    color: ['#3398DB'],
                    title: {
                        text: '会员订单占比',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}<span>%</span>`
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value} %'
                        },
                        show: true
                    },
                    yAxis: {
                        type: 'category',
                        data: ['                  会员订单', '非会员订单']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: [this.allData.vip_order_scale * 100, 100 - this.allData.vip_order_scale * 100]
                        }
                    ]
                };
                const option4 = {
                    color: ['#3398DB'],
                    title: {
                        text: '会员金额占比',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}<span>%</span>`
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value} %'
                        },
                        show: true
                    },
                    yAxis: {
                        type: 'category',
                        data: ['                  会员订单', '非会员订单']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: [this.allData.vip_sales_scale * 100, 100 - this.allData.vip_sales_scale * 100]
                        }
                    ]
                };
                const option5 = {
                    color: ['#3398DB'],
                    title: {
                        text: '联单件数占比分析',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}<span>%</span>`
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: true,
                        axisLabel: {
                            show: true,
                            formatter: '{value} %'
                        },
                        show: true
                    },
                    yAxis: {
                        type: 'category',
                        data: ['联单件数5件以上占比', '联单件数3件以上占比', '联单件数2件占比', '联单件数1件以上占比']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: [this.allData.joint5_purchase_scale * 100, this.allData.joint3_purchase_scale * 100, this.allData.joint2_purchase_scale * 100, this.allData.joint1_purchase_scale * 100]
                        }
                    ]
                };

                const option6 = {
                    color: ['#3398DB'],
                    title: {
                        text: '  季节分布',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}`
                    },
                    grid: {
                        left: '3.2%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value} '
                        },
                        show: true
                    },
                    yAxis: {
                        type: 'category',
                        data: this.allData.season_distribution.map(item => Object.keys(item)[0])
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: '60%',
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: this.allData.season_distribution.map((item, index) => item[this.allData.season_distribution.map(item => Object.keys(item)[0])[index]])
                        }
                    ]
                };

                const option7 = {
                    color: ['#3398DB'],
                    title: {
                        text: '价格带分布',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}`
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.allData.price_range_distribution.map(item => Object.keys(item)[0]),
                        axisLabel: {
                            rotate: 40
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value}'
                        },
                        show: true
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: '60%',
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: this.allData.price_range_distribution.map((item, index) => item[this.allData.price_range_distribution.map(item => Object.keys(item)[0])[index]])
                        }
                    ]
                };

                const option8 = {
                    color: ['#3398DB'],
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
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}`
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.allData.color_distribution.map(item => Object.keys(item)[0]),
                        axisLabel: {
                            rotate: 45
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value}'
                        },
                        show: true
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: '60%',
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: this.allData.color_distribution.map((item, index) => item[this.allData.color_distribution.map(item => Object.keys(item)[0])[index]])
                        }
                    ]
                };

                const option9 = {
                    color: ['#3398DB'],
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
                        },
                        formatter: item => `${item[0].axisValue} <br /> ${item[0].marker}${item[0].seriesName}:${item[0].value}`
                    },
                    grid: {
                        left: '1%',
                        right: '5.5%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.allData.fabric_distribution.map(item => Object.keys(item)[0]),
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
                    series: [
                        {
                            name: '整体概览',
                            barWidth: '60%',
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            data: this.allData.fabric_distribution.map((item, index) => item[this.allData.fabric_distribution.map(item => Object.keys(item)[0])[index]])
                        }
                    ]
                };


                this.myChart1.setOption(option1);
                this.myChart2.setOption(option2);
                this.myChart3.setOption(option3);
                this.myChart4.setOption(option4);
                this.myChart5.setOption(option5);
                this.myChart6.setOption(option6);
                this.myChart7.setOption(option7);
                this.myChart8.setOption(option8);
                this.myChart9.setOption(option9);

                this.spinShow = false;
            });
            // const timer = this.$config.debounce_wait; // 节流的延迟时间
            // this.debounceSearch = this.$lodash.debounce(this.resize1, timer); // 搜索
            window.addEventListener('resize', this.resize1);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize1);
            });
        },
        methods: {
            resize1() {
                this.conWidth = this.$refs.content.clientWidth - 47;
                const setWidth = this.conWidth / 3 - 36;
                // 仪表盘
                const domChart1 = this.$refs.chart_1;
                const domChart2 = this.$refs.chart_2;
                // 树状图 （横）
                const domChart3 = this.$refs.chart_3;
                const domChart4 = this.$refs.chart_4;
                const domChart5 = this.$refs.chart_5;
                const domChart6 = this.$refs.chart_6;
                // 树状图 （竖）
                const domChart7 = this.$refs.chart_7;
                const domChart8 = this.$refs.chart_8;
                const domChart9 = this.$refs.chart_9;


                domChart1.style.width = `${setWidth * 0.7}px`;
                domChart1.style.height = '400px';

                domChart2.style.width = `${setWidth * 0.7}px`;
                domChart2.style.height = '400px';

                domChart3.style.width = `${(this.conWidth) * 0.75}px`;
                domChart3.style.height = '200px';
                domChart4.style.width = `${(this.conWidth) * 0.75}px`;
                domChart4.style.height = '200px';
                domChart5.style.width = `${(this.conWidth) * 0.75}px`;
                domChart5.style.height = '350px';

                domChart6.style.width = `${this.conWidth + 36}px`;
                domChart6.style.height = '300px';

                domChart7.style.width = `${(this.conWidth + 36) * 0.32}px`;
                domChart7.style.height = '400px';

                domChart8.style.width = `${(this.conWidth + 36) * 0.32}px`;
                domChart8.style.height = '400px';

                domChart9.style.width = `${(this.conWidth + 36) * 0.32}px`;
                domChart9.style.height = '400px';
                for (let i = 1; i <= this.chartsSize; i++) {
                    this[`myChart${i}`].resize();
                }
            }
        },
        filters: {
            /** 每3位数字  加上 逗号 */
            allMoney: (val) => {
                if (!val) return '······';
                let num = (val.toString().split('.')[0] || 0).toString();
                let result = '';

                while (num.length > 3) {
                    result = `,${num.slice(-3)}${result}`;
                    num = num.slice(0, num.length - 3);
                }
                if (num) { result = num + result; }
                return `${result}`;
            },

            toFixed: (val) => {
                if (typeof (val) == 'undefined') {
                    return 0;
                }
                return val.toFixed(1);
            },
            // val => !!val && val.toFixed(1),
            toFixed0: (val) => {
                if (typeof (val) == 'undefined') {
                    return 0;
                }
                return parseInt(val);
            } // val => !!val && parseInt(val)
        }
    };
</script>
<style lang="less" scoped>
// .page-warpper{background-color: white;}
    .page-content-tab{
        height: 100%;
    }
    .content-text {
      width: 100%;
      overflow: hidden;
      // margin-top: 15px;

      > div{
        border-radius: 4px;
        background: white;
      }
      .content-text-left{
        min-width:200px;
        margin-right: 10px;
        text-align: center;
      }
      .content-text-right{
        flex: 1;
        .conten{
          height: calc( 100% - 45px);
          .conten-child{
            flex: 1;
            font-weight: 600;
            height: 100%;
            border-right: 1px solid #EEF0F3;
            &:last-child{border-right: 0px;}
          }
          .two{
            >div{
              font-size: 15px;
              height: 50%;
              box-sizing: border-box;
              &:first-child{
                box-sizing: border-box;
                padding-top: 5px;
                height: calc( 50% - 5px );
                border-bottom: 1px solid #EEF0F3;
              }
              &:last-child{
                box-sizing: border-box;
                padding-top: 10px;
              }
              p{
                &:first-child{
                  text-indent: 10px;
                  color: #666;
                }
                &:last-child{
                  padding-top: 15px;
                  text-indent: 15px;
                  color: #1890ff;
                }
              }
            }
          }
          .one>div{
            font-size: 18px;
            &:first-child{
              border-bottom: 1px solid transparent;
              p{
                color: #666;

              }
            }
          }
        }
      }
      .title{
        line-height: 35px;
        text-align: left;
        text-indent: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #EEF0F3;
        color:black;
      }
    }
    /deep/ .ivu-card-head{padding:0}
    /deep/ .ivu-card-body{padding:0}
    .rbg{
      font-size: 16px;
      text-indent: 10px;
      height: 40px;
      line-height: 40px;
    //   background-color: #D7D7D7;
    }
    .ivu-card-head{
        width: 100%;
        height: 40px;
    }
    .conten{
        width:calc(100% - 22px);
        margin:auto;
    }
    .echarts{
      justify-content: space-around;
      flex-wrap: wrap;
    }
    .echarts>div{
        margin:0 auto;
    }
    .hr{
        width: 100%;
        height: 0px;
        border: 1px solid transparent;
        border-top-color:black;
        margin: 30px 0;
    }

/** th */
/deep/ .ivu-table th {
    background-color: #3398DB;
}

/* 滚动条 */
    /deep/ .ivu-table-overflowY::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgb(243, 243, 243);
    }
    /deep/ .ivu-table-overflowX::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgb(243, 243, 243);
    }
</style>
