<template>
    <!-- 营销分析看板 （详情页面） -->
    <div>
        <Spin size="large" fix v-if="loading"></Spin>

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
            <div class="page-title page-title-tab">
                <Menu class="pl24" mode="horizontal" theme="light" @on-select="menuSelect" :active-name='active_name'>
                <MenuItem v-for="(item,index) in menu" :key="index" :name="index">{{item}}</MenuItem>
                </Menu>
            </div>


            <whole-order
                v-if="show"
                :title="menu[active_name]"
                :allData="allData"
                :vip="this.dimension[this.active_name]"
            />

        </div>
    </div>
</template>

<script>
    import WholeOrder from './WholeOrder';

    export default {
        data() {
            return {
                title: '', // title名
                allData: [], // 所有数据
                menu: [], // 菜单栏
                active_name: 0, // 已选中的菜单栏
                loading: true, // 加载
                dimension: ['total', 'nonVip', 'oldVip', 'newVip'], // 加载数据的类型
                show: false
            };
        },
        components: {
            WholeOrder
        },
        created() {
            this.menu = ['整体订单', '非会员消费订单', '老会员消费订单', '新会员消费订单'];
            this.getData();
        },
        mounted() {},
        methods: {
            /** 查询接口数据 */
            getData() {
                this.show = false;
                this.loading = true;
                this.$https.analysisKanban.detailView({
                    dimension: this.dimension[this.active_name],
                    taskIds: this.$route.query.code
                }).then((res) => {
                    this.allData = res.data.data;
                    this.title = this.allData.map(item => item.display_name).toString();
                    this.show = true;
                    this.loading = false;
                });
            },
            /** 菜单切换 */
            menuSelect(name) {
                if (this.active_name === name) return;
                this.active_name = name;
                this.getData();
            },
            back() {
                this.$router.go(-1);
            }
        }
    };
</script>
