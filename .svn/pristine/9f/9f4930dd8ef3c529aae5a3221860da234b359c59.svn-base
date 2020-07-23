<template>
<div class="trend-chart">
    <Tabs class="trend-tab" :animated="false" @on-click="tabChange" :value="tabVal">
        <TabPane v-for="item in tabArr" :key="item.name" :label="item.label" :name="item.name">
        </TabPane>
    </Tabs>
    <RadioGroup class="trend-radio" v-model="radioVal" type="button" size="small" @on-change="debounceChange">
        <Radio v-for="item in radioArr" :key="item.val" :label="item.val">{{item.name}}</Radio>
    </RadioGroup>
    <board class="trend-board" ref="trend" :data="boardData" :hasLegend="true" :isShowText="true" :height="chartHeight">
    </board>
</div>
</template>

<script>
    import Board from '@/components/chart/board.vue';

    export default {
        name: 'TrendChart',
        components: {
            Board
        },
        props: {
            chartHeight: {
                type: String,
                default: '276px'
            },
            tabArr: {
                type: Array,
                default() {
                    return [{
                        label: '累计趋势',
                        name: 'total'
                    }];
                }
            },
            request: {
                type: Object,
                default() {
                    return {
                        url: '',
                        params: {}
                    };
                },
                validator(value) {
                    return !!value.url;
                }
            }
        },
        data() {
            const radioVal = 'one_week';
            return {
                canSend: true,
                cacheData: null,
                tabVal: this.tabArr[0].name,
                radioVal,
                radioArr: [{
                               name: '近7天',
                               val: 'one_week'
                           },
                           {
                               name: '近2周',
                               val: 'two_weeks'
                           },
                           {
                               name: '近1个月',
                               val: 'one_month'
                           },
                           {
                               name: '近3个月',
                               val: 'three_months'
                           },
                           {
                               name: '近6个月',
                               val: 'six_months'
                           },
                           {
                               name: '近1年',
                               val: 'one_year'
                           }
                ],
                boardData: {
                    request: {
                        url: this.request.url,
                        params: {
                            time_period: radioVal
                        },
                        isSend: () => this.canSend,
                        getData: (dt) => {
                            this.cacheData = dt;
                            return dt;
                        }
                    },
                    name: 'date_str',
                    field: 'total',
                    charts: [
                        'line'
                    ],
                    chartOpt: {
                        grid: {
                            left: 20,
                            right: 40
                        },
                        yAxis: {
                            min: 0
                        }
                    }
                }
            };
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceChange = this.$lodash.debounce(this.change, timer);
        },
        methods: {
            // 日期单选变化时触发
            change(val) {
                this.canSend = true;
                this.boardData.data = null;
                this.boardData.request.params.time_period = val;
                this.radioVal = val;
                this.$refs.trend.change();
            },
            tabChange(val) {
                this.canSend = false;
                this.boardData.data = this.cacheData;
                this.boardData.field = val;
                console.log(this.boardData.field, 998);
                this.$refs.trend.change();
            }
        }
    };
</script>

<style lang="less" scoped>
.trend-chart {
    position: relative;
    .trend-radio{
        position: absolute;
        right: 20px;
        top: 4px;
    }
    .trend-board{
        // margin: 10px 0px 16px;
    }
    .ivu-radio-group-button {
        .ivu-radio-wrapper-checked {
            background: #2d8cf0;
            color: #fff;
        }
    }
}
</style>
<style lang="less">
.trend-tab .ivu-tabs-bar{
        padding: 0 20px;
    }
</style>
