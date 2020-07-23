<template>
    <div>
        <Row type="flex" justify="space-between" align="middle" style="padding:16px 24px;background-color:white;">
            <i-col style="background-color:white;">
                <span @click="back">
                    <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" style="margin-top:-5px;margin-right:5px;"/>
                </span>
                <span style="font-size:20px;">
                   【 {{title}} 】
                </span>
            </i-col>
        </Row>
        <div class="slide-scroll-box">
            <div class="page-title bottom-shadow page-title-tab">
                <Menu class="pl24" mode="horizontal" theme="light" @on-select="menuSelect" :active-name='active_name'>
                <MenuItem v-for="(item,index) in menu" :key="index" :name="index">{{item}}</MenuItem>
                </Menu>
            </div>

            <component :is="componentName" >
                    <p slot="title">{{menu[active_name]}}</p>
            </component>

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
                title: '', // title名
                allData: [], // 所有数据
                menu: [], // 菜单栏
                active_name: 0, // 已选中的菜单栏
                loading: false, // 加载
                dimension: ['Portrayal', 'ConsumptionAnalysis', 'CommodityAnalysis', 'IntegralUse'], // 加载数据的类型
                show: false,
                componentName: 'Portrayal'
            };
        },
        components: {
            Portrayal,
            ConsumptionAnalysis,
            CommodityAnalysis,
            IntegralUse
        },
        created() {
            this.menu = ['人群画像', '消费分析', '积分使用', '商品分析'];


            this.getData();
        },
        mounted() {},
        methods: {
            /** 查询接口数据 */
            getData() {
                this.show = false;
                // this.loading = true;
                // this.$https.analysisKanban.detailView({
                //     dimension: this.dimension[this.active_name],
                //     taskIds: this.$route.query.code
                // }).then((res) => {
                //     this.allData = res.data.data;
                //     this.title = this.allData.map(item => item.display_name).toString();
                //     this.show = true;
                // });
            },
            /** 菜单切换 */
            menuSelect(name) {
                console.log(name);
                if (this.active_name === name) return;
                this.componentName = this.dimension[name];
                this.active_name = name;
                this.getData();
            },
            back() {
                this.$router.go(-1);
            }
        }
    };
</script>
