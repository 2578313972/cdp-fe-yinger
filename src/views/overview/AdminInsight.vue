<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow">
        概览
    </div>
    <div class="admin-insight-home page-content container-padding24">
        <div class="view-box card-nopb clearfix">
            <view-card v-for="(item,index) in data" :key="index" :class="(1+index)%4===0?'':'mr16'" class="card-list fl mb16" :title="item.name" :amount="item.values[0].total" subtitle="实时累计用户数" changeTitle="实时今日新增数" :changeNum="item.values[0].increase"></view-card>
            <!-- loading -->
            <div v-if="loading" class="loading-box">
                数据加载中...
                <Spin size="large" fix></Spin>
            </div>
            <!-- 无数据 -->
            <div v-if="!loading && !data.length" class="loading-box">
                暂无数据
            </div>
        </div>
        <Card dis-hover class="mt10 trend-chart-box card-nopadding">
            <trend-chart chartHeight="300px" :request="request" :tab-arr="tabArr"></trend-chart>
        </Card>
    </div>
</div>
</template>

<script>
    import ViewCard from './AdminViewCard.vue';
    import TrendChart from '@/components/overview/TrendChart.vue';

    export default {
        name: 'AdminInsight',
        components: {
            ViewCard,
            TrendChart
        },
        data() {
            return {
                loading: false,
                data: [],
                tabArr: [{
                             label: '累计趋势',
                             name: 'total'
                         },
                         {
                             label: '新增趋势',
                             name: 'increase'
                         }
                ],
                request: {
                    url: `${this.$config.apiDomain}/board/history/user-count/tenant`
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.loading = true;
                this.$axios
                    .get(`${this.$config.apiDomain}/board/realtime/user-count/tenant`)
                    .then(({
                        data
                    }) => {
                        this.loading = false;
                        this.data = data;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
@height: 200px;
.admin-insight-home {
    .view-box {
        min-height: @height;
    }
    .loading-box {
        line-height: @height;
        text-align: center;
        font-size: 20px;
        color: #bbb;
    }
    .card-list {
        width: calc((100%/4 - 12px));
    }
    .card-nopb {
        &>.ivu-card-body {
            padding-bottom: 0!important;
        }
    }
    .trend-chart-box{
        padding-top: 10px;
    }
}
</style>
