<template>
  <div ref="win" class="whole-order">
    <Row>
        <Row class="padding16-18" style="background:white;">
            <!-- <i-col span="6" style="font-size:18px;font-weight:600;">
                {{title}}
            </i-col> -->
            <!-- <i-col span="5" offset="19" style="text-align:right;padding-right:20px;color:#3398DB">
                <i style="font-weight:700;font-size:25px;margin-right:20px;cursor: pointer;" class="el-icon-download"></i>
                <i style="font-weight:700;font-size:25px;cursor: pointer;" class="el-icon-question"></i>
            </i-col> -->
        </Row>
        <Card dis-hover>
            <p slot="title">订单概览</p>
            <Table class="table-css" :width="gaugeWidth" border :columns="columns_1" :data="data_1"></Table>
        </Card>
        <Card dis-hover>
            <p slot="title">销售数量TOP10款色</p>
            <Table class="table-css" :width="gaugeWidth" border :columns="columns_2" :data="data_2"></Table>
        </Card>
        <Card dis-hover>
            <p slot="title">销售金额TOP10款色</p>
            <Table class="table-css" :width="gaugeWidth" border :columns="columns_2" :data="data_3"></Table>
        </Card>
        <Card dis-hover>
            <p slot="title">销售品类Top10</p>
            <Table class="table-css" :width="gaugeWidth" border :columns="columns_2" :data="data_4"></Table>
        </Card>
        <i-col class="padding16-18 echart" style="justify-content: space-between;flex-wrap: wrap;" span="24">
            <div class="flex" style="justify-content: space-around;" >
                <div ref="chart_1" style="height:450px"></div>
                <div ref="chart_4" style="height:450px"></div>
            </div>

            <div class="flex martop80" style="justify-content: space-around;" v-show="vip==='total'">
                <div ref="chart_2" style="height:450px"></div>
                <div ref="chart_3" style="height:450px"></div>
            </div>

            <div class="martop80">
                <Card dis-hover style="margin-top:30px;">
                    <p slot="title" class="rbg" style="text-indent:15px;">商品偏好系列</p>
                    <div class="flex" style="flex-wrap: wrap;justify-content: space-around;">
                        <div ref="chart_5" style="height:400px;"></div>
                        <div ref="chart_6" style="height:400px;"></div>
                        <!-- <Divider /> -->
                        <div ref="chart_7" style="height:450px;margin-top:50px;"></div>
                        <div ref="chart_8" style="height:450px;margin-top:50px;"></div>
                    </div>
                </Card>
            </div>

        </i-col>
    </Row>
  </div>
</template>
<script>
    export default {
        name: 'whole-order',
        data() {
            return {
                columns_1: [],
                columns_2: [],
                data_1: [],
                data_2: [],
                data_3: [],
                data_4: [],

                gaugeWidth: 0,
                optionName: [],
                vipCount: [], // 订单数
                vipAmount: [], // 订单金额数
                jointCount: [] // 联动数
            };
        },
        props: {
            title: {
                type: String,
                required: true
            },
            allData: {
                type: Array,
                required: true
            },
            vip: {
                type: String,
                default: 'total'
            }
        },
        created() {
            // 订单数
            this.vipCount = this.allData.map(item => ([Math.round(item.vip_order_count), Math.round(item.non_vip_order_count)]));
            // 订单金额数
            this.vipAmount = this.allData.map(item => ([Math.round(item.vip_sales_amount), Math.round(item.non_vip_sales_amount)]));
            // 联动数
            this.jointCount = this.allData.map(item => ([Math.round(item.joint5_purchase_count), Math.round(item.joint3_purchase_count), Math.round(item.joint2_purchase_count), Math.round(item.joint1_purchase_count)]));
            // this.allData.map(item => ([Math.round(item.joint5_purchase_scale * 10000) / 100, Math.round(item.joint3_purchase_scale * 10000) / 100, Math.round(item.joint2_purchase_scale * 10000) / 100, Math.round(item.joint1_purchase_scale * 10000) / 100]));

            // echart 对象
            this.optionName = this.allData.map(item => item.display_name);

            // 制作表格格式
            this.columns_1 = [
                {
                    title: '对比任务名称',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => (
                    <div style="font-weight:600;">
                        <span> {params.row.display_name} </span>
                    </div>
                )
                },
                {
                    title: '总销售额',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => (
                        <span> {this.$kilobit(params.row.sales_amount)} </span>
                    )
                },
                {
                    title: '平均客单价',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => (
                        <span> {this.$kilobit(params.row.avg_transaction_value)} </span>
                    )
                },
                {
                    title: '平均客单件',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => (
                        <span> {Math.round(params.row.avg_transaction_unit * 10) / 10} </span>
                    )
                },
                {
                    title: '平均件单价',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => (
                        <span> {this.$kilobit(params.row.avg_unit_value)} </span>
                    )
                },
                {
                    title: '联单率',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => (
                        <span> {Math.round(params.row.joint_purchase_rate * 1000) / 10}% </span>
                    )
                },
                {
                    title: '平均折扣率',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => (
                        <span> {Math.round(params.row.avg_discount_rate * 1000) / 10}% </span>
                    )
                }

            ];

            switch (this.vip) {
            case 'total':
                this.columns_1.push(
                    {
                        title: '新会员人数',
                        key: 'new_vip_count',
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '新会员占比',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => (
                                <span> {Math.round(params.row.new_vip_rate * 1000) / 10}% </span>
                        )
                    },
                    {
                        title: '老会员人数',
                        key: 'old_vip_count',
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '老会员占比',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => (
                            <div>
                                <span> {Math.round(params.row.old_vip_rate * 1000) / 10}% </span>
                            </div>
                        )
                    }
                );
                break;
            case 'nonVip':
                break;
            case 'oldVip':
                this.columns_1.push(
                    {
                        title: '老会员人数',
                        key: 'old_vip_count',
                        align: 'center',
                        minWidth: 110
                    }
                );
                break;
            case 'newVip':
                this.columns_1.push(
                    {
                        title: '新会员人数',
                        key: 'new_vip_count',
                        align: 'center',
                        minWidth: 110
                    },
                );
                break;
            default:
                break;
            }

            this.columns_2 = [{
                title: '对比任务名称',
                align: 'center',
                minWidth: 220,
                fixed: 'left',
                render: (h, params) => (
                    <div style="font-weight:600;">
                        <span> {params.row.display_name} </span>
                    </div>
                )
            }];

            for (let i = 1; i <= 10; i++) {
                this.columns_2.push({
                    title: `Top${i}`,
                    key: `top${i}`,
                    minWidth: 280,
                    align: 'center',
                    render: (h, params) => {
                        if (params.row[`top${i}`]) {
                            return h('div', {}, [
                                h('span', params.row[`top${i}`].split(' ')[0]),
                                h('span', {
                                    style: {
                                        color: '#1890ff'
                                    }
                                }, ` ${params.row[`top${i}`].split(' ')[1] || ''}`)
                            ]);
                        }
                    }
                });
            }

            // 表格数据
            this.allData.forEach((item, index) => {
                this.data_2[index] = { display_name: item.display_name };
                item.top10_by_unit.forEach((item_2, index_2) => {
                    if ((Object.values(item_2)[0]) > 0) {
                        this.data_2[index][`top${+index_2 + 1}`] = `${Object.keys(item_2)[0]} (${(this.$kilobit(Object.values(item_2)[0]))}件)`;
                    }
                });

                this.data_3[index] = { display_name: item.display_name };
                item.top10_by_value.forEach((item_2, index_2) => {
                    if ((Object.values(item_2)[0]) > 0) {
                        this.data_3[index][`top${+index_2 + 1}`] = `${Object.keys(item_2)[0]} (${this.$kilobit(Object.values(item_2)[0])}元)`;
                    }
                });

                this.data_4[index] = { display_name: item.display_name };
                item.category_distribution.forEach((item_2, index_2) => {
                    if (index_2 > 10) return;
                    if ((Object.values(item_2)[0]) > 0) {
                        this.data_4[index][`top${+index_2 + 1}`] = `${Object.keys(item_2)[0]} (${this.$kilobit(Object.values(item_2)[0])}件)`;
                    }
                });
            });

            // data_1 的数据
            this.data_1 = this.allData.map(item => item);
        },

        mounted() {
            this.chartsSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;

            for (let i = 1; i <= this.chartsSize; i++) {
                this[`chart_${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }

            this.resize();

            // 提示框组件 （件）
            const tooltipNum = {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (item) => {
                    let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                    for (let i = 0; i < item.length; i++) {
                        context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(item[i].value)} 件`;
                    }
                    return context;
                }
            };
            // top 值
            const top = 60 + (this.allData.length - 1) * 10;

            const option_1 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '退货率',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${item[i].value}%`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '3%',
                    top: 10 + top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [`订单销售额${this.nbsp}退货率`, `订单总销量${this.nbsp}退货率`]
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}%'
                    },
                    max: 100
                },
                series: []
            };

            const option_2 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
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
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.vipCount[i][item[i].dataIndex])} 单`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '5%',
                    right: '7%',
                    bottom: '3%',
                    top,
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
                    data: ['会\n员\n订\n单', '非\n会\n员\n订\n单']
                },
                series: []
            };

            const option_3 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
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
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.vipAmount[i][item[i].dataIndex])} 元`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '4.3%',
                    right: '7%',
                    bottom: '3%',
                    top,
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
                    data: ['会\n员\n订\n单', '非\n 会\n员\n订\n单']
                },
                series: []
            };

            const option_4 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
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
                    formatter: (item) => {
                        let context = `${item[0].axisValue.replace(/\n/g, '')}`;
                        for (let i = 0; i < item.length; i++) {
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.jointCount[i][item[i].dataIndex])} 单`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '3%',
                    top: 10 + top,
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}%'
                    },
                    max: 100
                },
                xAxis: {
                    type: 'category',
                    data: [`联单5件及以上${this.nbsp}占比`, `联单3-4件${this.nbsp}占比`, `联单2件${this.nbsp}占比`, `联单1件${this.nbsp}占比`]
                },
                series: []
            };

            const option_5 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '季节分布（单位:件）',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: tooltipNum,
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '2.7%',
                    right: '7%',
                    bottom: '3%',
                    top,
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.allData[0].season_distribution.map(item => Object.keys(item)[0])
                },
                series: []
            };
            if (!this.allData[0].season_distribution.length) {
                delete option_5.legend;
                option_5.title = {
                    text: '季节分布\n\n\n( 暂无数据 )',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: '#bbb'
                    }
                };
            }
            const option_6 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '价格带分布（单位:件）',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: tooltipNum,
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'
                },
                grid: {
                    left: '3.4%',
                    right: '7%',
                    bottom: '3%',
                    top,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.allData[0].price_range_distribution.map(item => Object.keys(item)[0])
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}'
                    }
                },
                series: []
            };
            if (!this.allData[0].price_range_distribution.length) {
                delete option_6.legend;
                option_6.title = {
                    text: '价格带分布\n\n\n( 暂无数据 )',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: '#bbb'
                    }
                };
            }
            const option_7 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '色系分布（单位:件）',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: tooltipNum,
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'

                },
                grid: {
                    left: '3.7%',
                    right: '7%',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: this.allData[0].color_distribution.map(item => Object.keys(item)[0]),
                    axisLabel: {
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: '{value}'
                    }
                },
                series: []
            };
            if (!this.allData[0].color_distribution.length) {
                delete option_7.legend;
                option_7.title = {
                    text: '色系分布\n\n\n( 暂无数据 )',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: '#bbb'
                    }
                };
            }
            const option_8 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '面料分布（单位:件）',
                    textStyle: {
                        fontSize: 15
                    }
                },
                tooltip: tooltipNum,
                legend: {
                    data: this.optionName,
                    right: '7%',
                    orient: 'vertical'

                },
                grid: {
                    left: '3.4%',
                    right: '7%',
                    bottom: '5%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: this.allData[0].fabric_distribution.map(item => Object.keys(item)[0]),
                    axisLabel: {
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: []
            };
            if (!this.allData[0].fabric_distribution.length) {
                delete option_8.legend;
                option_8.title = {
                    text: '面料分布\n\n\n( 暂无数据 )',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: '#bbb'
                    }
                };
            }
            this.allData.forEach((data, index) => {
                // 退货率
                option_1.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    data: [(Math.round(data.total_sales_return_rate * 1000)) / 10, (Math.round(data.total_count_return_rate * 1000)) / 10]
                };

                // 会员订单占比
                option_2.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{@score}%'
                    },
                    data: [Math.round(data.vip_order_scale * 100), Math.round(data.non_vip_order_scale * 100)]
                };
                // 会员金额占比
                option_3.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{@score}%'
                    },
                    data: [Math.round(data.vip_sales_scale * 100), Math.round(data.non_vip_sales_scale * 100)]
                    // data: [Math.round(data.vip_sales_amount), Math.round(data.non_vip_sales_amount)]
                };
                // 联单件数占比分析
                option_4.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{@score}%'
                    },
                    data: [Math.round(data.joint5_purchase_scale * 100), Math.round(data.joint3_purchase_scale * 100), Math.round(data.joint2_purchase_scale * 100), Math.round(data.joint1_purchase_scale * 100)]
                };

                // 商品偏好-季节分布
                option_5.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    data: data.season_distribution.map(item => (item[Object.keys(item)[0]] > 0 ? Math.round(item[Object.keys(item)[0]]) : 0))
                };

                // 商品偏好-价格带分布
                option_6.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    data: data.price_range_distribution.map(item => (item[Object.keys(item)[0]] > 0 ? Math.round(item[Object.keys(item)[0]]) : 0))
                };

                // 商品偏好-色系分布
                option_7.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    data: data.color_distribution.map(item => (item[Object.keys(item)[0]] > 0 ? Math.round(item[Object.keys(item)[0]]) : 0))
                };

                // 商品偏好-面料分布
                option_8.series[index] = {
                    name: this.optionName[index],
                    barWidth: '20%',
                    barGap: '30%',
                    legendHoverLink: true,
                    type: 'bar',
                    data: data.fabric_distribution.map(item => (item[Object.keys(item)[0]] > 0 ? Math.round(item[Object.keys(item)[0]]) : 0))
                };
            });

            this.chart_1.setOption(option_1);
            this.chart_2.setOption(option_2);
            this.chart_3.setOption(option_3);
            this.chart_4.setOption(option_4);
            this.chart_5.setOption(option_5);
            this.chart_6.setOption(option_6);
            this.chart_7.setOption(option_7);
            this.chart_8.setOption(option_8);
            // 监听 窗口大小
            window.addEventListener('resize', this.resize);
            // 销毁 resize监听事件
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            toFixed_1: val => Math.round(val * 10) / 10,
            resize() {
                this.gaugeWidth = this.$refs.win.clientWidth - 38;
                this.nbsp = this.gaugeWidth < 1800 ? '\n' : '';
                for (let i = 1; i <= this.chartsSize; i++) {
                    this.$refs[`chart_${i}`].style.width = `${this.gaugeWidth * 0.45}px`;
                    this[`chart_${i}`].resize();
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.whole-order{
    background-color: white ;
    min-height: 400px;
    /deep/ .echart .ivu-card-head{padding:0}
    /deep/ .echart .ivu-card-body{padding:0;margin-top: 15px;}
    .rbg{
      font-size: 16px;
      text-indent: 30px;
      height: 40px;
      line-height: 40px;
    //   background-color: #D7D7D7;
    }
.martop80{margin-top: 80px;}


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
}
</style>
