<template>
    <div>
        <Row type="flex" justify="space-between" align="middle" style="padding:16px 24px;background-color:white;">
            <i-col style="background-color:white;">
                <span @click="back">
                    <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" style="margin-top:-5px;margin-right:5px;"/>
                </span>
                <span style="font-size:20px;">
                   【 {{names.toString()}} 】
                </span>
            </i-col>
        </Row>
        <div ref="winBox" class="slide-scroll-box">
            <div class="page-title page-title-tab">
                <Menu class="pl24" mode="horizontal" theme="light" @on-select="menuSelect" :active-name='active_name'>
                <MenuItem v-for="(item,index) in menu" :key="index" :name="index">{{item}}</MenuItem>
                </Menu>
            </div>
            <Row style="background:white;padding:5px 18px;">
                <i-col span="5" offset="19" style="text-align:right;padding-right:20px;color:#3398DB">
                    <i style="font-weight:700;font-size:25px;margin-right:20px;cursor: pointer;" class="el-icon-download"></i>
                    <i style="font-weight:700;font-size:25px;cursor: pointer;" class="el-icon-question"></i>
                </i-col>
            </Row>

            <keep-alive style="position: relative;">
                <Spin size="large" fix v-if="spinLoading"></Spin>
                <component v-else :is="componentName" :allData="allData" :names="names" :winWidth="winWidth" />
            </keep-alive>

        </div>
    </div>
</template>

<script>
    import Portrayal from './portrayal';
    import ConsumptionAnalysis from './consumptionAnalysis';
    import CommodityAnalysis from './commodityAnalysis';
    import IntegralUse from './IntegralUse';

    export default {
        data() {
            return {
                names: '', // title名
                allData: [], // 所有数据
                menu: [], // 菜单栏
                active_name: 0, // 已选中的菜单栏
                loading: false, // 加载
                dimension: ['Portrayal', 'ConsumptionAnalysis', 'IntegralUse', 'CommodityAnalysis'], // 加载数据的类型
                show: false,
                componentName: 'Portrayal',
                winWidth: 0,
                spinLoading: true
            };
        },
        components: {
            Portrayal,
            ConsumptionAnalysis,
            IntegralUse,
            CommodityAnalysis
        },
        created() {
            this.menu = ['人群画像', '消费分析', '积分使用', '商品分析'];
            // /**
            this.$https.crowdKanban.crowdDetailView({
                taskIds: this.$route.query.code
            }).then((res) => {
                console.log(res.data.data);
                this.allData = res.data.data;
                this.names = this.allData.map(item => item.crowd_name);
                this.spinLoading = false;
            });
            // *
        },
        mounted() {
            this.resize();
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            /** 菜单切换 */
            menuSelect(name) {
                if (this.active_name === name) return;
                this.componentName = this.dimension[name];
                this.active_name = name;
            },
            back() {
                this.$router.go(-1);
            },
            /** 响应式 */
            resize() {
                this.winWidth = this.$refs.winBox.clientWidth - 2;
            }
        }
    };
</script>
