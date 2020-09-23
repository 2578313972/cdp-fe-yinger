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
<!-- <Icon type="ios-information-circle-outline" /> -->
<!-- <Icon type="ios-information-circle" /> -->
        <Card dis-hover>
            <div class="content-text flex borbox" style="background:#F1F2F4;padding:11px;">
                <div class="content-text-left" >
                    <h3 class="borbox title">总销售额</h3>
                    <div class="user-info">
                        <p style="font-weight:600;">{{useTime}}<br/>线上线下</p>
                        <div class="header-img" style="padding:8px 0;" >
                            <img style="width:90px;height:90px;" src="@/assets/images/yinger.png" title="影儿时尚集团">
                        </div>
                        <h2 style="font-size:24px;color:#1890ff;padding:6px;">
                        {{(allData.sales_amount) | toFixed_0 | allMoney}}
                        <!-- <Tooltip>
                            <i style="vertical-align: middle;font-size: 18px;color: #666;cursor:pointer;position: relative;top: -10px;left:-3px;" class="el-icon-info"></i>
                            <div slot="content" style="padding:3px;">
                                <p>{{useTime}}</p>
                                <p>线上线下</p>
                            </div>
                        </Tooltip> -->
                        </h2>
                    </div>
                </div>
                <div class="content-text-right">
                    <h3 class="borbox title">消费分析</h3>
                    <div class="flex conten">
                        <div class="conten-child  two">
                            <div>
                                <p>平均客单价</p>
                                <p>{{allData.avg_transaction_value | toFixed_0 | allMoney}}</p>
                            </div>
                            <div>
                                <p>平均客单件</p>
                                <p>{{allData.avg_transaction_unit | toFixed_2 | allMoney}}</p>
                            </div>
                        </div>
                        <div class="conten-child  two">
                            <div>
                                <p>平均件单价</p>
                                <p>{{allData.avg_unit_value | toFixed_0 | allMoney}}</p>
                            </div>
                            <div>
                                <p>联单率</p>
                                <p>{{allData.joint_purchase_rate*100 | toFixed_1}}%</p>
                            </div>
                        </div>
                        <div class="conten-child  two">
                            <div>
                                <p>新会员人数</p>
                                <p>{{allData.new_vip_count | allMoney}}</p>
                            </div>
                            <div>
                                <p>新会员占比</p>
                                <p>{{Math.round(allData.new_vip_rate*100)}}%</p>
                            </div>
                        </div>
                        <div class="conten-child  two">
                            <div>
                                <p>老会员人数</p>
                                <p>{{allData.old_vip_count | allMoney}}</p>
                            </div>
                            <div>
                                <p>老会员占比</p>
                                <p>{{Math.round(allData.old_vip_rate*100)}}%</p>
                            </div>
                        </div>
                        <div class="conten-child  two">
                            <div>
                                <p>平均折扣率</p>
                                <p>{{Math.round(allData.avg_discount_rate*100)}}%</p>
                            </div>
                            <div>
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <Card dis-hover class="conten">
            <p slot="title" class="rbg">销售商品分析</p>
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
                <p slot="title" class="rbg" style="text-indent:15px;">订单情况分析</p>
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
                useTime: '', // 时间间隔
                vipCount: [], // 订单数
                vipAmount: [], // 订单金额数
                jointCount: [] // 联动数
            };
        },
        created() {
            const nowDateArr = new Date().toLocaleDateString().split('/');
            nowDateArr[2] = +nowDateArr[2] < 15 ? 1 : 15;
            this.useTime = `${nowDateArr[0] - 1}/${nowDateArr[1]}/${nowDateArr[2]} - ${nowDateArr[0]}/${nowDateArr[1]}/${nowDateArr[2]}`;
            // table 格式
            this.columns = [
                {
                    title: '指标名称',
                    align: 'center',
                    minWidth: 200,
                    fixed: 'left',
                    render: (h, params) => (
                        <div style="font-weight:600;">
                            <span> {params.row.keyName} </span>
                        </div>
                    )
                }
            ];
            // tableData 格式
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
            // echarts的数量
            this.chartsSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;
            // 创建 echart 对象
            for (let i = 1; i <= this.chartsSize; i++) {
                this[`myChart${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }

            this.resize();
            // 调取数据接口
            this.$https.overallOverview.overview().then((res) => {
                this.allData = res.data.data[0];
                // 订单数
                this.vipCount = [this.allData.vip_order_count, this.allData.non_vip_order_count];
                // 订单金额
                this.vipAmount = [this.allData.vip_sales_amount, this.allData.non_vip_sales_amount];
                // 联单数
                this.jointCount = [this.allData.joint5_purchase_count, this.allData.joint3_purchase_count, this.allData.joint2_purchase_count, this.allData.joint1_purchase_count];
                // 表格数据
                this.tableData = [
                    { keyName: '销量款色TOP10排名' },
                    { keyName: '销售额款色TOP10排名' },
                    { keyName: '商品偏好-品类分布' }
                ];
                for (let i = 1; i <= 10; i++) {
                    if (this.allData.top10_by_unit.length > 0) {
                        this.tableData[0][`top${i}`] = `${Object.keys(this.allData.top10_by_unit[i - 1])[0]} (${this.$options.filters.allMoney(+(Object.values(this.allData.top10_by_unit[i - 1])[0]))}件)`;
                    }

                    if (this.allData.top10_by_value.length > 0) {
                        this.tableData[1][`top${i}`] = `${Object.keys(this.allData.top10_by_value[i - 1])[0]} (${this.$options.filters.allMoney(Math.round(Object.values(this.allData.top10_by_value[i - 1])[0]))}元)`;
                    }

                    if (this.allData.category_distribution.length > 0) {
                        this.tableData[2][`top${i}`] = `${Object.keys(this.allData.category_distribution[i - 1])[0]} (${this.$options.filters.allMoney(Math.round(Object.values(this.allData.category_distribution[i - 1])[0]))}件)`;
                    }
                }

                const label = {
                    show: true,
                    position: 'right',
                    formatter: '{@score}%'
                };

                const option1 = {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            name: '退货率',
                            type: 'gauge',
                            title: { color: '#333' },
                            detail: {
                                fontSize: 25,
                                offsetCenter: [0, '65%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: Math.round(this.allData.total_count_return_rate * 100), name: '\n订单销量' }],
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
                            detail: {
                                fontSize: 25,
                                offsetCenter: [0, '65%'],
                                formatter: '{value}%'
                            },
                            data: [{ value: Math.round(this.allData.total_sales_return_rate * 100), name: '\n订单销售额' }],
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
                        text: '\n会员订单占比',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(this.vipCount[item[0].dataIndex])} 单`
                    },
                    grid: {
                        left: 74,
                        right: '9%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value}%'
                        },
                        max: 100
                    },
                    yAxis: {
                        type: 'category',
                        data: ['会员订单', '非会员订单']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            label,
                            data: [Math.round(this.allData.vip_order_scale * 1000) / 10, Math.round(this.allData.non_vip_order_scale * 1000) / 10]
                        }
                    ]
                };

                const option4 = {
                    color: ['#3398DB'],
                    title: {
                        text: '\n会员金额占比',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(this.vipCount[item[0].dataIndex])} 元`
                    },
                    grid: {
                        left: 74,
                        right: '9%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value}%'
                        },
                        max: 100
                    },
                    yAxis: {
                        type: 'category',
                        data: ['会员订单', '非会员订单']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            label,
                            data: [Math.round(this.allData.vip_sales_scale * 1000) / 10, Math.round(this.allData.non_vip_sales_scale * 1000) / 10]
                        }
                    ]
                };

                const option5 = {
                    color: ['#3398DB'],
                    title: {
                        text: '\n联单件数占比分析',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.$kilobit(this.jointCount[item[0].dataIndex])} 单`
                    },
                    grid: {
                        left: 20,
                        right: '9%',
                        bottom: '3%',
                        containLabel: true,
                        backgroundColor: 'red'
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            formatter: '{value}%'
                        },
                        max: 100
                    },
                    yAxis: {
                        type: 'category',
                        data: ['联单件数5件及以上占比', '联单件数3-4件占比', '联单件数2件占比', '联单件数1件占比']
                    },
                    series: [
                        {
                            name: '整体概览',
                            barWidth: 30,
                            barGap: '10%',
                            legendHoverLink: true,
                            type: 'bar',
                            label,
                            data: [
                                this.toFixed_1(this.allData.joint5_purchase_scale * 100),
                                this.toFixed_1(this.allData.joint3_purchase_scale * 100),
                                this.toFixed_1(this.allData.joint2_purchase_scale * 100),
                                this.toFixed_1(this.allData.joint1_purchase_scale * 100)
                            ]
                        }
                    ]
                };

                const option6 = {
                    color: ['#3398DB'],
                    title: {
                        text: '  季节分布（单位:件）',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(item[0].value)} 件`
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
                            formatter: '{value}'
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
                        text: '价格带分布（单位:件）',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(item[0].value)} 件`
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
                        text: '色系分布（单位:件）',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(item[0].value)} 件`
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
                        text: '面料分布（单位:件）',
                        textStyle: {
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: item => `${item[0].marker}${item[0].axisValue}：${this.kilobit(item[0].value)} 件`
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
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            kilobit(num) {
                return num.toString(10).split('.')[0].split('').reduceRight((data, item) => {
                    data = data[0] && data[0].length % 3 ? data : ['', ...data];
                    data[0] = item + data[0];
                    return data;
                }, []).join(',');
            },
            toFixed_1: val => Math.round(val * 10) / 10,
            resize() {
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


                domChart1.style.width = `${setWidth * 0.9}px`;
                domChart1.style.height = '400px';

                domChart2.style.width = `${setWidth * 0.9}px`;
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
                if (!val) return '0';
                let num = (val.toString().split('.')[0] || 0).toString();
                let result = '';

                while (num.length > 3) {
                    result = `,${num.slice(-3)}${result}`;
                    num = num.slice(0, num.length - 3);
                }
                if (num) { result = num + result; }
                if (val.toString().split('.')[1]) {
                    result = `${result}.${val.toString().split('.')[1]}`;
                }
                return `${result}`;
            },

            toFixed_2: val => Math.round(val * 100) / 100,
            toFixed_1: val => Math.round(val * 10) / 10,
            toFixed_0: val => Math.round(val) // val => !!val && Math.round(val)
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
        background: #D6D6D6;
    }
    /deep/ .ivu-table-overflowX::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #D6D6D6;
    }
</style>
