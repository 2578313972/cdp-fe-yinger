<template>
    <div>
        <Tabs value="name1" style="margin:20px">
            <TabPane label="概览" name="name1">
                <Row style="padding-bottom:6px">
                    <Col span="3" offset="19">
                    <DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
                <div class="lineMenu">
                    <Card>
                        <Menu class="pl24" mode="horizontal" theme="primary" active-name="1" @on-select="register">
                            <MenuItem name="1">
                            <Icon type="ios-paper"></Icon>
                            注册期
                            </MenuItem>
                            <MenuItem name="2">
                            <Icon type="ios-people"></Icon>
                            开户期
                            </MenuItem>
                            <MenuItem name="3">
                            <Icon type="stats-bars"></Icon>
                            入金期
                            </MenuItem>
                            <MenuItem name="4">
                            <Icon type="settings"></Icon>
                            首次交易
                            </MenuItem>
                            <MenuItem name="5">
                            <Icon type="settings"></Icon>
                            重复交易
                            </MenuItem>
                            <MenuItem name="6">
                            <Icon type="settings"></Icon>
                            理财购买
                            </MenuItem>
                            <MenuItem name="7">
                            <Icon type="settings"></Icon>
                            流失期
                            </MenuItem>
                        </Menu>
                        <br>
                        <div id="lineChart" :style="{width: '100%', height: '350px'}"></div>
                    </Card>
                </div>
            </TabPane>
            <TabPane label="周期对比" name="name2">
                <Row style="padding-bottom:6px">
                    <Col span="3" offset="19">
                    <DatePicker type="month" placeholder="Select month" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
                <Card>
                    <div id="barChart" :style="{width: '100%', height: '420px'}"></div>
                </Card>
                <br>
                <Card>
                    <h4>明细数据</h4>
                    <br>
                     <Table class="smce-table-noscroll" :columns="columns1" :data="data1"></Table>
                </Card>
            </TabPane>
            <!-- <TabPane label="人流转换" name="name3">
                <Row style="padding-bottom:6px">
                    <Col span="3" offset="19" >
                     <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
                标签三的内容
            </TabPane> -->
        </Tabs>
    </div>
</template>

<script>
    import 'echarts';
    import echartsConfig from '@/components/chart/echartsCommon';

    export default {
        data() {
            return {
                lineChart: null,
                lineConfig: null,
                columns1: [{
                               title: '客户分类',
                               key: 'customerStatus'
                           },
                           {
                               title: '数量',
                               key: 'count'
                           },
                           {
                               title: '占比',
                               key: 'proportion'
                           }
                ],
                data1: [{// 注册期、开户期、入金期、首次交易、重复交易、理财购买、流失期
                            customerStatus: '注册期',
                            count: 2520,
                            proportion: '70%'
                        },
                        {
                            customerStatus: '开户期',
                            count: 1134,
                            proportion: '32%'
                        },
                        {
                            customerStatus: '入金期',
                            count: 461,
                            proportion: '13%'
                        },
                        {
                            customerStatus: '首次交易',
                            count: 397,
                            proportion: '11%'
                        },
                        {
                            customerStatus: '重复交易',
                            count: 360,
                            proportion: '10%'
                        },
                        {
                            customerStatus: '理财购买',
                            count: 680,
                            proportion: '19%'
                        },
                        {
                            customerStatus: '流失期',
                            count: 1008,
                            proportion: '28%'
                        }
                ]
            };
        },
        methods: {
            initLinechart() {
                this.lineChart = this.echarts.init(document.getElementById('lineChart'));
                this.barChart = this.echarts.init(document.getElementById('barChart'));
                this.lineConfig = echartsConfig.lineOption;
                this.barConfig = echartsConfig.barOption;
            },
            register(name) {
                this.barConfig.xAxis.data = ['生命周期'];
                this.barConfig.title.text = '周期对比趋势';
                this.barConfig.series = [{ // 注册期、开户期、入金期、首次交易、重复交易、理财购买、流失期
                                             name: '注册期',
                                             type: 'bar',
                                             barGap: 0,
                                             data: [2520, 332, 301, 334, 390]
                                         },
                                         {
                                             name: '开户期',
                                             type: 'bar',
                                             data: [1134, 182, 191, 234, 290]
                                         },
                                         {
                                             name: '入金期',
                                             type: 'bar',
                                             data: [461, 232, 201, 154, 190]
                                         },
                                         {
                                             name: '首次交易',
                                             type: 'bar',
                                             data: [397, 77, 101, 99, 40]
                                         },
                                         {
                                             name: '重复交易',
                                             type: 'bar',
                                             data: [360, 88, 101, 99, 40]
                                         }, {
                                             name: '理财购买',
                                             type: 'bar',
                                             data: [680, 77, 101, 10, 40]
                                         }, {
                                             name: '流失期',
                                             type: 'bar',
                                             data: [1008, 77, 10, 99, 40]
                                         }
                ];
                this.barChart.setOption(this.barConfig);
                if (name === '1' || name === void 0) {
                    this.lineConfig.series.data = [10.0, 40.9, 70.0, 40.2, 90.6, 76.7, 20, 162.2, 32.6, 20.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '2') {
                    this.lineConfig.series.data = [12.9, 100.0, 120.0, 80.2, 10.6, 20.7, 20, 162.2, 32.6, 120.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '3') {
                    this.lineConfig.series.data = [10.0, 120.9, 12.0, 180.2, 100.6, 200.7, 50, 12.2, 50.6, 120.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '4') {
                    this.lineConfig.series.data = [100.0, 120.9, 135.0, 110.2, 100.6, 80.7, 50, 90.2, 70.6, 60.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '5') {
                    this.lineConfig.series.data = [200.0, 300.9, 180.0, 280.2, 400.6, 350.7, 300, 90.2, 70.6, 60.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '6') {
                    this.lineConfig.series.data = [2000000.0, 1800000.9, 1000000.0, 500000.2, 2005000.6, 1500000.7, 800000, 90.2, 70.6, 60.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                } else if (name === '7') {
                    this.lineConfig.series.data = [5000.0, 4500.9, 4200.0, 4000.2, 3000.6, 1000.7, 500, 90.2, 70.6, 60.0, 6.4, 3.3];
                    this.lineConfig.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                }
                this.lineChart.setOption(this.lineConfig);
            }
        },
        computed: {},
        watch: {},
        components: {},
        mounted() {
            this.initLinechart();
            this.register();
        },
        created() {}
    };
</script>

<style scoped lang="less">
    .lineMenu {
        width: calc (100% - 60px);
        height: 450px; // margin: 20px;
        .ivu-menu-primary {
            width: 100%;
            background:  rgb(226, 226, 226)
        }
    }
    .ivu-menu-item-active,
    .ivu-menu-item-selected,
    .ivu-menu-item:hover {
        // background: rgb(226, 226, 226) !important;
         border-top: 2px solid #59a4f4 !important;
        background: white !important;
        ;
    }
    .ivu-menu-primary.ivu-menu-horizontal .ivu-menu-item,
    .ivu-menu-primary.ivu-menu-horizontal .ivu-menu-submenu {
        width: calc(100% / 7); // border-right: 1px solid #ccc;
        // border-bottom: 1px solid rgb(154, 154, 154);
        color: #2b2b2d !important;
        background:  rgb(226, 226, 226)
    }
    .ivu-menu {
        z-index: 0
    }
</style>
