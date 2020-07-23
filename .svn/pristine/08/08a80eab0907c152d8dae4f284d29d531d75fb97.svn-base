<template>
    <div class="user-amount">
        <Row class="content-wrapper">
            <Col span="19" class="chart-wrapper">
                <Card dis-hover>
                    <trend-chart :tab-arr="tabArr" :request="request"></trend-chart>
                </Card>
            </Col>
            <Col span="5" class="real-time-wrapper" v-if="$config.login_info.auth_info.role_id=='ROLE_C_ADMIN'">
                <Card dis-hover class="num">
                    <p class="total">{{data.total | formatAmount}}</p>
                    <p>实时累计用户数</p>
                </Card>
                <Card dis-hover class="num">
                    <p class="total">{{data.increase | formatAmount}}</p>
                    <p>实时今日新增数</p>
                </Card>
            </Col>
            <Col
                span="5"
                class="real-time-wrapper"
                v-if="$config.login_info.auth_info.role_id=='ROLE_D_ADMIN'||$config.login_info.auth_info.role_id=='ROLE_D_OPERATOR'">
                <Card dis-hover class="num">
                    <p class="total-admin">{{data.total | formatAmount}}</p>
                    <p>实时累计用户数</p>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import TrendChart from './TrendChart.vue';

    export default {
        name: 'UserAmount',
        components: {
            TrendChart
        },
        props: {
            tabTitle: {
                type: String,
                default: ''
            },
            tabArr: {
                type: Array
            },
            isShowToday: {
                type: Boolean,
                default: false
            }
        },
        created() {
            this.getRealTimeData();
        },
        data() {
            return {
                data: {
                    total: 0,
                    increase: 0
                },
                request: {
                    url: `${this.$config.apiDomain}/board/history/user-count/channel`
                }
            };
        },
        methods: {
            // 获取实时数据
            getRealTimeData() {
                const url = `${this.$config.apiDomain}/board/realtime/user-count/channel`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        if (data[0] && data[0].values) {
                            const values = data[0].values[0];
                            this.data = {
                                total: values.total,
                                increase: values.increase
                            };
                        }
                    });
            }
        }
    };
</script>
<style lang="less" scoped>
.user-amount {
    .content-wrapper {
        height: 368px;
        overflow: hidden;
        .real-time-wrapper {
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            .num {
                flex: 1;
                margin-left:24px;
                .total{
                    font-size: 32px;
                    line-height: 74px;
                    margin-top: 10px;
                }
                .total-admin{
                    font-size: 32px;
                    line-height: 74px;
                    margin-top: 100px;
                }
            }
            .num:nth-of-type(2){
                margin-top:24px;
            }
        }
    }
}
</style>
