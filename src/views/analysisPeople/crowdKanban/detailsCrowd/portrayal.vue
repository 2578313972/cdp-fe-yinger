<template>
    <!-- 人群画像 -->
    <div class="portrayal">
        <Spin size="large" fix v-if="spinLoading"></Spin>
        <Table border :loading="loading" :width="winWidth*0.98" :columns="columns" :data="tableData" style="margin-bottom:40px;margin:0 auto;"></Table>
        <div class="box">
            <div ref="chart_6" class="auto" style="height:450px;"></div>
            <div ref="chart_1" class="auto" style="height:450px;"></div>
            <div ref="chart_2" class="auto" style="height:450px;"></div>
            <div ref="chart_3" class="auto" style="height:600px;"></div>
            <div ref="chart_4" class="auto" style="height:600px;"></div>
            <div ref="chart_5" class="auto" style="height:300px;"></div>
            <div ref="chart_7" class="auto" style="height:450px;"></div>
            <div ref="chart_8" class="auto" style="height:450px;"></div>
            <div ref="chart_9" class="auto" style="height:450px;"></div>
            <div ref="chart_10" class="auto" style="height:300px;"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                columns: [],
                tableData: [],
                allVipBill: [], // 新老会员人数
                allVipGradeBill: [], // 会员等级量
                chart_1: null,
                chart_2: null,
                chart_3: null,
                chart_4: null,
                chart_5: null,
                chart_6: null,
                chart_7: null,
                chart_8: null,
                chart_9: null,
                chart_10: null,
                option_1: {},
                chartSize: 0,
                loading: false,
                spinLoading: true
            };
        },
        props: {
            allData: {
                type: Array,
                required: true
            },
            names: {
                type: Array,
                required: true
            },
            winWidth: {
                type: Number,
                required: true
            }
        },
        created() {
            // 新老会员
            this.allVipBill = this.allData.map(item => [item.new_vip_count, item.old_vip_count]);
            // 会员等级
            this.allVipGradeBill = this.allData.map(item => item.vip_level_count.map(item_2 => Object.values(item_2)[0]));
            // CLV
            this.clv = this.allData.map(item => item.vip_credit_count.map(item_2 => Object.values(item_2)[0]));
            // RFM
            this.rfm = this.allData.map(item => item.vip_clv_count.map(item_2 => Object.values(item_2)[0]));
            // 会员年龄段
            this.vipAge = this.allData.map(item => item.vip_age_count.map(item_2 => Object.values(item_2)[0]));
            // 性别
            this.sex = this.allData.map(item => item.vip_gender_count.map(item_2 => Object.values(item_2)[0]));
            // 折扣敏感
            this.discounts = this.allData.map(item => item.vip_discount_sensitve_count.map(item_2 => Object.values(item_2)[0]));
            // 新款敏感
            this.sensitive = this.allData.map(item => item.vip_new_sensitve_count.map(item_2 => Object.values(item_2)[0]));
            // 积分敏感
            this.integral = this.allData.map(item => item.vip_point_sensitive_count.map(item_2 => Object.values(item_2)[0]));
            // 消费情况
            this.consumptionSituation = this.allData.map(item => ([item.purchase_3m_vip_rate * item.total_vip_count, item.purchase_3_6m_vip_rate * item.total_vip_count, item.purchase_6_12m_vip_rate * item.total_vip_count]));

            this.columns = [
                {
                    title: '人群名称',
                    key: 'crowd_name',
                    align: 'center',
                    tooltip: true,
                    minWidth: 80
                },
                {
                    title: '新会员数',
                    key: 'new_vip_count',
                    align: 'center',
                    tooltip: true,
                    minWidth: 80,
                    render: (h, params) => (
                        <span>{this.$kilobit(params.row.new_vip_count)}</span>
                    )
                },
                {
                    title: '新会员转化率',
                    key: 'new_vip_case_rate',
                    align: 'center',
                    tooltip: true,
                    minWidth: 80,
                    render: (h, params) => (
                        <span>{parseInt(params.row.new_vip_case_rate * 1000) / 10}%</span>
                    )
                },
                {
                    title: '活动开始日期',
                    key: 'starttime_day',
                    align: 'center',
                    tooltip: true,
                    minWidth: 80
                },
                {
                    title: '活动结束日期',
                    key: 'endtime_day',
                    align: 'center',
                    tooltip: true,
                    minWidth: 80
                }
            ];

            this.tableData = this.allData.map(item => ({
                crowd_name: item.crowd_name,
                new_vip_count: item.new_vip_count,
                new_vip_case_rate: item.new_vip_case_rate,
                starttime_day: item.starttime_day,
                endtime_day: item.endtime_day
            }));
        },
        mounted() {
            this.chartSize = Object.keys(this.$refs).filter(item => item.indexOf('chart_') !== -1).length;
            for (let i = 1; i <= this.chartSize; i++) {
                this[`chart_${i}`] = this.echarts.init(this.$refs[`chart_${i}`]);
            }
            this.resize();
            const top = 60 + (this.allData.length - 1) * 10;

            const valueType = {
                type: 'value',
                axisLabel: {
                    show: true,
                    formatter: '{value}%'
                },
                max: 100
            };

            this.option_1 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '新老会员占比',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.allVipBill[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: ['新会员占比', '老会员占比'],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_2 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '会员等级占比',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.allVipGradeBill[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_3 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '会员信用等级分布',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.clv[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: 69,
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                xAxis: valueType,
                series: []
            };

            this.option_4 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '会员CLV',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.rfm[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                xAxis: valueType,
                series: []
            };

            this.option_5 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '会员年龄段分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.vipAge[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: 43,
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_6 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '性别分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.sex[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: 50,
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_7 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '折扣敏感分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.discounts[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: 48,
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_8 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '新款敏感分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.sensitive[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_9 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '积分敏感分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.integral[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    boundaryGap: true
                },
                yAxis: valueType,
                series: []
            };

            this.option_10 = {
                color: ['#3398DB', '#FFDB5C', '#67E0E3'],
                title: {
                    text: '消费情况分析',
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
                            context += `<br /> ${item[i].marker}${item[i].seriesName}：${this.$kilobit(this.consumptionSituation[i][item[i].dataIndex])} 人`;
                        }
                        return context;
                    }
                },
                legend: {
                    data: this.names,
                    right: '30',
                    orient: 'vertical'
                },
                grid: {
                    left: '3%',
                    right: '30',
                    bottom: '3%',
                    top,
                    containLabel: true,
                    backgroundColor: 'red'
                },
                yAxis: {
                    type: 'category',
                    data: ['最近消费在近3个月内会员占比', '最近消费在近3-6个月内会员占比', '最近消费在近6-12个月内会员占比'],
                    boundaryGap: true
                },
                xAxis: valueType,
                series: []
            };

            let chart_1; let chart_2; let chart_3; let chart_4; let chart_5; let chart_6; let chart_7; let chart_8; let chart_9; let chart_10;
            this.allData.forEach((data) => {
                if (data.new_vip_rate || data.old_vip_rate) chart_1 = true;
                if (data.vip_level_count.length) chart_2 = true;
                if (data.vip_credit_count.length) chart_3 = true;
                if (data.vip_clv_count.length) chart_4 = true;
                if (data.vip_age_count.length) chart_5 = true;
                if (data.vip_gender_count.length) chart_6 = true;
                if (data.vip_discount_sensitve_count.length) chart_7 = true;
                if (data.vip_new_sensitve_count.length) chart_8 = true;
                if (data.vip_point_sensitive_count.length) chart_9 = true;
                if (data.purchase_3m_vip_rate || data.purchase_3_6m_vip_rate || data.purchase_6_12m_vip_rate) chart_10 = true;
            });
            const barWidth = `${60 / this.allData.length}%`;
            this.allData.forEach((data, index) => {
                if (chart_1) {
                    this.option_1.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        max: 100,
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: [Math.round(data.new_vip_rate * 100), Math.round(data.old_vip_rate * 100)]
                    };
                } else {
                    this.$refs.chart_1.classList.add('shadow');
                    this.option_1 = {
                        title: {
                            text: '性别分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_2) {
                    this.option_2.xAxis.data = data.vip_level_count.map(item => Object.keys(item)[0]);
                    this.option_2.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_level_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_2.classList.add('shadow');
                    this.option_2 = {
                        title: {
                            text: '会员等级占比',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_3) {
                    this.option_3.yAxis.data = data.vip_credit_count.map(item => Object.keys(item)[0]);
                    this.option_3.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{@score}%'
                        },
                        data: data.vip_credit_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_3.classList.add('shadow');
                    this.option_3 = {
                        title: {
                            text: '会员CLV',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }
                    };
                }

                if (chart_4) {
                    this.option_4.yAxis.data = data.vip_clv_count.map(item => Object.keys(item)[0]) || [];
                    this.option_4.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{@score}%'
                        },
                        data: data.vip_clv_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_4.classList.add('shadow');
                    this.option_4 = {
                        title: {
                            text: '会员RFM',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_5) {
                    this.option_5.xAxis.data = data.vip_age_count.map(item => Object.keys(item)[0]);
                    this.option_5.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_age_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_5.classList.add('shadow');
                    this.option_5 = {
                        title: {
                            text: '会员年龄段分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_6) {
                    this.option_6.xAxis.data = data.vip_gender_count.map(item => Object.keys(item)[0]);
                    this.option_6.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_gender_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_6.classList.add('shadow');
                    this.option_6 = {
                        title: {
                            text: '会员CLV',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_7) {
                    this.option_7.xAxis.data = data.vip_discount_sensitve_count.map(item => Object.keys(item)[0]);
                    this.option_7.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_discount_sensitve_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_7.classList.add('shadow');
                    this.option_7 = {
                        title: {
                            text: '折扣敏感分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_8) {
                    this.option_8.xAxis.data = data.vip_new_sensitve_count.map(item => Object.keys(item)[0]);
                    this.option_8.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_new_sensitve_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_8.classList.add('shadow');
                    this.option_8 = {
                        title: {
                            text: '折扣敏感分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_9) {
                    this.option_9.xAxis.data = data.vip_point_sensitive_count.map(item => Object.keys(item)[0]);
                    this.option_9.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{@score}%'
                        },
                        data: data.vip_point_sensitive_count.map(item => Math.round((Object.values(item)[0] / data.total_vip_count) * 100))
                    };
                } else {
                    this.$refs.chart_9.classList.add('shadow');
                    this.option_9 = {
                        title: {
                            text: '积分敏感分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }

                if (chart_10) {
                    this.option_10.series[index] = {
                        name: this.names[index],
                        barWidth,
                        barGap: '30%',
                        legendHoverLink: true,
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{@score}%'
                        },
                        data: [Math.round(data.purchase_3m_vip_rate * 100), Math.round(data.purchase_3_6m_vip_rate * 100), Math.round(data.purchase_6_12m_vip_rate * 100)]
                    };
                } else {
                    this.$refs.chart_10.classList.add('shadow');
                    this.option_10 = {
                        title: {
                            text: '消费情况分析',
                            textStyle: {
                                fontSize: 22
                            },
                            left: 'center',
                            top: 'center',
                            subtext: '暂无数据',
                            subtextStyle: {
                                fontSize: 25
                            }
                        }

                    };
                }
            });


            for (let i = 1; i <= this.chartSize; i++) {
                this[`chart_${i}`].setOption(this[`option_${i}`]);
            }

            this.spinLoading = false;

            // echarts响应式
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            resize() {
                this.$refs.chart_6.style.width = `${this.winWidth * 0.25}px`;
                this.$refs.chart_1.style.width = `${this.winWidth * 0.23}px`;

                this.$refs.chart_2.style.width = `${this.winWidth * 0.48}px`;
                this.$refs.chart_3.style.width = `${this.winWidth * 0.48}px`;
                this.$refs.chart_4.style.width = `${this.winWidth * 0.48}px`;
                this.$refs.chart_5.style.width = `${this.winWidth * 0.98}px`;

                this.$refs.chart_7.style.width = `${this.winWidth * 0.31}px`;
                this.$refs.chart_8.style.width = `${this.winWidth * 0.31}px`;
                this.$refs.chart_9.style.width = `${this.winWidth * 0.31}px`;
                this.$refs.chart_10.style.width = `${this.winWidth * 0.98}px`;
                for (let i = 1; i <= this.chartSize; i++) {
                    this[`chart_${i}`].resize();
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .portrayal{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        background-color: white;
        .box{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        };

    }
    .auto{
        margin: 20px 0;
    }
    .auto.shadow{
        box-shadow: 0px 0px 80px -65px;
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
