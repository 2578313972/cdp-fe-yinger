<template>
    <!-- 画像chart图 -->
    <div class="emptyBox" v-if="hasData">
        <Row type="flex" v-for="(value, key) in config" :key="key">
            <Col :style="{width:'calc((100% - 16px * ' + (value.length - 1) + ') / ' + value.length + ' )', marginLeft:(key2 == 0 ? 0 : '16px')}" v-for="(value2, key2) in value" :key="key2">
                <Card dis-hover>
                    <board :length="value ? value.length : 1" :data="value2" :hasLegend="false" :crowdCode="crowdCode" :traitCode="value2.traitCode" :width="width" :height="height"></board>
                </Card>
            </Col>
        </Row>
        <!-- <Row type="flex" justify="space-between" class="code-row-bg" v-for="(value, key) in a" :key="key" :gutter="24">
            <Col :span="parseInt(24 / value.length)" v-for="(value2, key2) in value" :key="key2">
                <Card dis-hover>
                    <board :length="value ? value.length : 1"></board>
                </Card>
            </Col>
        </Row> -->
        <!-- <div v-for="i in a">
            <portrait-charts class="charts" :getBarData="getBarData" :width="width" :height="height"></portrait-charts>
            123
        </div> -->
    </div>
</template>

<script>
// --- debug --- test
    import ChartConfig from '@/views/user/crowd/details/chartConfig';
    import Board from '@/components/chart/board.vue';

    export default {
        props: {
            crowdCode: null,
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            }
        },
        data() {
            return {
                config: ChartConfig
            };
        },
        components: {
            Board
        },
        mounted() {
        },
        computed: {
            hasData() {
                const config = this.config || [];
                const hasData = config.length != 0 && config[0].length != 0;
                return hasData;
            }
        },
        methods: {
        },
        watch: {}
    };
</script>

<style scoped>
    .emptyBox{
        padding: 0px;
        margin-bottom: 16px;
        width: 100%;
    }
    .ivu-row-flex + .ivu-row-flex{
        margin-top: 15px;
    }
</style>
