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
        <div ref="winBox" class="slide-scroll-box">
            <div class="page-title page-title-tab">
                <Menu class="pl24" mode="horizontal" theme="light" @on-select="menuSelect" :active-name='active_name'>
                <MenuItem v-for="(item,index) in menu" :key="index" :name="index">{{item}}</MenuItem>
                </Menu>
            </div>
            <Row style="background:white;padding:5px 18px;">
                <i-col span="6" style="font-size:18px;font-weight:600;">
                    {{title}}
                </i-col>
                <i-col span="5" offset="19" style="text-align:right;padding-right:20px;color:#3398DB">
                    <i style="font-weight:700;font-size:25px;margin-right:20px;cursor: pointer;" class="el-icon-download"></i>
                    <i style="font-weight:700;font-size:25px;cursor: pointer;" class="el-icon-question"></i>
                </i-col>
            </Row>
            <keep-alive style="position: relative;">
                <Spin size="large" fix v-if="spinLoading"></Spin>
                <component v-else :is="componentName" :allData="allData" :winWidth="winWidth" />
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
                title: '', // title名
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
        },
        mounted() {
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
            setTimeout(() => {
                this.allData = [{
                    use_point_vip_cont: 3224, purchase_2y_ago_vip_rate: 465.65, old_vip_rate: 3.33, color_distribution: [{ 蓝色系: '42' }, { 黑白灰色系: '38' }, { 红色系: '7' }, { 其它: '6' }, { '橙、紫色系': '3' }, { 金银色系: '3' }, { 杏米咖驼色系: '2' }, { 黄色系: '1' }, { 绿色系: '0' }, { 备用: '0' }], avg_transaction_value: 0.0158, purchase_6_12m_vip_rate: 53.24, fabric_distribution: [{ 化纤材质: '60' }, { 混纺材质: '25' }, { 饰品类材质: '9' }, { 植物材质: '7' }, { 动物材质: '0' }, { 皮革材质: '0' }, { 丝绸材质: '0' }], joint2_purchase_scale: 0.0098, total_sales_return_rate: 0.0016, top10_by_unit: [{ '7C60270240(款)+60(色)': '4' }, { '7C60270490(款)+02(色)': '3' }, { '7C60270490(款)+01(色)': '3' }, { '7C60220490(款)+02(色)': '3' }, { '5C50299030(款)+25(色)': '3' }, { '7C60220240(款)+60(色)': '3' }, { '7C39206030(款)+51(色)': '2' }, { '7C60260060(款)+01(色)': '2' }, { '7C60270040(款)+60(色)': '2' }, { '7C60220040(款)+60(色)': '2' }], order_amount: 342354255, new_vip_count: 111, purchase_1_2y_vip_rate: 465.65, purchase_3_6m_vip_rate: 23.24, vip_age_count: [{ '10岁-15岁': '4345' }, { '16岁-20岁': '3343' }, { '21岁-25岁': '353' }, { '26岁-30岁': '354' }, { '31岁-35岁': '544' }, { '36岁-40岁': '334' }, { '41岁-45岁': '543' }, { '46岁-50岁': '543' }, { '51岁-56岁': '435' }, { '56岁-60岁': '425' }, { '61岁-65岁': '353' }, { '66岁-70岁': '542' }, { '70岁+': '352' }], point_discount_rate: 7.0E-4, joint_purchase_rate: 0.0158, joint1_purchase_scale: 0.0158, purchase_vip_count: 435, starttime_day: '2020-07-01', new_vip_rate: 1.11, joint5_purchase_scale: 0.0071, category_distribution: [{ 单上衣: '28' }, { 裤子: '27' }, { 连衣裙: '23' }, { 毛织衫: '9' }, { 针织衫: '5' }, { 其他: '3' }, { 短裙: '2' }, { '包包/行李箱': '1' }, { 外套: '1' }, { 女鞋: '1' }, { 旗袍: '1' }, { '围巾/丝巾/披肩': '1' }, { '皮衣/皮草': '0' }, { '羽绒服/棉服': '0' }, { 大衣: '0' }, { 皮带: '0' }, { '背心/马甲': '0' }, { 项链: '0' }, { 风衣: '0' }, { 衬衫: '0' }, { '帽子/手套/袜子/领子': '0' }], vip_new_sensitve_count: [{ 新款不敏感: '2343' }, { 新款敏感: '342' }], purchase_vip_rate: 4.35, vip_level_count: [{ 影粉: '223' }, { 时尚卡: '4353' }, { 金卡: '4343' }, { 白金: '4343' }, { 钻石: '4353' }, { 黑卡: '3232' }], vip_point_sensitive_count: [{ 积分不敏感: '224' }, { 积分敏感: '234' }], new_vip_case_rate: 2.0, vip_discount_sensitve_count: [{ 折扣不敏感: '2334' }, { 折扣中敏感: '1234' }, { 折扣高敏感: '433' }], old_vip_count: 333, avg_vip_amount_rate: 787021.2759, endtime_day: '2020-07-23', vip_clv_count: [{ 高价值挽留: '43232' }, { 低价值发展: '232' }, { 中价值发展: '32423' }, { 高价值发展: '32' }, { 低价值挽留: '324' }, { 中价值保持: '322' }, { 高价值保持: '3242' }, { 低价值保持: '324' }, { 中价值发展: '324' }], top10_by_value: [{ '5C37205355(款)+01(色)': '9531' }, { '5C30205840(款)+03(色)': '7371' }, { '5C30205170(款)+82(色)': '7101' }, { '5C60305690(款)+02(色)': '6921' }, { '5C30205181(款)+03(色)': '6831' }, { '5C30205090(款)+82(色)': '6831' }, { '5C30205180(款)+03(色)': '6831' }, { '5C30205030(款)+56(色)': '6831' }, { '5C60205210(款)+02(色)': '5391' }, { '5C50105160(款)+82(色)': '4491' }], purchase_3m_vip_rate: 4.44, avg_discount_rate: 352.0, season_distribution: [{ 夏: '91' }, { 秋: '6' }, { 春: '5' }, { 冬: '0' }], avg_unit_value: 631649.917, avg_point: 1.0031, price_range_distribution: [{ 低价格带: '92' }, { 中低价格带: '9' }, { 中价格带: '1' }, { 高价格带: '0' }, { 中高价格带: '0' }], total_count_return_rate: 0.0126, vip_credit_count: [{ 注册器: '434' }, { 新客期: '532' }, { 成长期: '556' }, { 稳定期: '345' }, { 休眠期: '3243' }, { 留失期: '323' }, { 召回期: '3242' }], avg_transaction_unit: 9966.0647, joint3_purchase_scale: 0.0094, total_point: 3234, point_user_rate: 7.4115, point_related_order_amount: 4323235
                }, {
                    use_point_vip_cont: 5424, purchase_2y_ago_vip_rate: 263.7561, old_vip_rate: 2.7805, color_distribution: [{ 蓝色系: '449' }, { 黑白灰色系: '482' }, { 红色系: '39' }, { 其它: '97' }, { '橙、紫色系': '75' }, { 金银色系: '8' }, { 杏米咖驼色系: '104' }, { 黄色系: '20' }, { 绿色系: '126' }, { 备用: '1' }], avg_transaction_value: 0.01, purchase_6_12m_vip_rate: 19.0325, fabric_distribution: [{ 化纤材质: '1089' }, { 混纺材质: '233' }, { 饰品类材质: '16' }, { 植物材质: '0' }, { 动物材质: '38' }, { 皮革材质: '11' }, { 丝绸材质: '2' }], joint2_purchase_scale: 0.0101, total_sales_return_rate: 0.083, top10_by_unit: [{ '8C39206270(款)+61(色)': '20' }, { '8C68509791(款)+71(色)': '15' }, { '8C60206240(款)+60(色)': '14' }, { '8C60270460(款)+82(色)': '14' }, { '8C60220126(款)+02(色)': '13' }, { '8C60206540(款)+43(色)': '13' }, { '8C30205110(款)+02(色)': '12' }, { '8C60205010(款)+60(色)': '12' }, { '8C39210820(款)+60(色)': '11' }, { '8C69509980(款)+02(色)': '10' }], order_amount: 6535735, new_vip_count: 323, purchase_1_2y_vip_rate: 263.7561, purchase_3_6m_vip_rate: 26.374, vip_age_count: [{ '10岁-15岁': '4345' }, { '16岁-20岁': '3343' }, { '21岁-25岁': '353' }, { '26岁-30岁': '354' }, { '31岁-35岁': '544' }, { '36岁-40岁': '334' }, { '41岁-45岁': '543' }, { '46岁-50岁': '543' }, { '51岁-56岁': '435' }, { '56岁-60岁': '425' }, { '61岁-65岁': '353' }, { '66岁-70岁': '542' }, { '70岁+': '352' }], point_discount_rate: 0.001, joint_purchase_rate: 0.0098, joint1_purchase_scale: 0.0098, purchase_vip_count: 426, starttime_day: '2020-07-01', new_vip_rate: 2.626, joint5_purchase_scale: 0.0049, category_distribution: [{ 单上衣: '149' }, { 裤子: '241' }, { 连衣裙: '329' }, { 毛织衫: '435' }, { 针织衫: '15' }, { 其他: '0' }, { 短裙: '36' }, { '包包/行李箱': '0' }, { 外套: '53' }, { 女鞋: '0' }, { 旗袍: '0' }, { '围巾/丝巾/披肩': '5' }, { '皮衣/皮草': '63' }, { '羽绒服/棉服': '16' }, { 大衣: '13' }, { 皮带: '12' }, { '背心/马甲': '11' }, { 项链: '10' }, { 风衣: '8' }, { 衬衫: '4' }, { '帽子/手套/袜子/领子': '1' }], vip_new_sensitve_count: [{ 新款不敏感: '2345' }, { 新款敏感: '302' }], purchase_vip_rate: 3.4634, vip_level_count: [{ 影粉: '223' }, { 时尚卡: '4353' }, { 金卡: '4343' }, { 白金: '4343' }, { 钻石: '4353' }, { 黑卡: '3232' }], vip_point_sensitive_count: [{ 积分不敏感: '321' }, { 积分敏感: '324' }], new_vip_case_rate: 1.0, vip_discount_sensitve_count: [{ 折扣不敏感: '2334' }, { 折扣中敏感: '1234' }, { 折扣高敏感: '433' }], old_vip_count: 342, avg_vip_amount_rate: 15342.1009, endtime_day: '2020-07-24', vip_clv_count: [{ 高价值挽留: '43232' }, { 低价值发展: '232' }, { 中价值发展: '32423' }, { 高价值发展: '32' }, { 低价值挽留: '324' }, { 中价值保持: '322' }, { 高价值保持: '3242' }, { 低价值保持: '324' }, { 中价值发展: '324' }], top10_by_value: [{ '8C69509980(款)+02(色)': '74728' }, { '8C39206270(款)+61(色)': '47706' }, { '8C68509791(款)+71(色)': '37500' }, { '8C30205110(款)+02(色)': '34663' }, { '8C69509380(款)+54(色)': '27594' }, { '8C69509520(款)+04(色)': '22000' }, { '8C69509240(款)+02(色)': '21600' }, { '8C30206900(款)+54(色)': '19951' }, { '8C30205410(款)+60(色)': '19667' }, { '8C68509450(款)+02(色)': '19380' }], purchase_3m_vip_rate: 2.6341, avg_discount_rate: 543.0, season_distribution: [{ 夏: '935' }, { 秋: '261' }, { 春: '127' }, { 冬: '78' }], avg_unit_value: 12239.2041, avg_point: 0.6567, price_range_distribution: [{ 低价格带: '1088' }, { 中低价格带: '255' }, { 中价格带: '36' }, { 高价格带: '13' }, { 中高价格带: '9' }], total_count_return_rate: 0.0101, vip_credit_count: [{ 注册器: '434' }, { 新客期: '532' }, { 成长期: '556' }, { 稳定期: '345' }, { 休眠期: '3243' }, { 留失期: '323' }, { 召回期: '3242' }], avg_transaction_unit: 122.0583, joint3_purchase_scale: 0.01, total_point: 3562, point_user_rate: 12.7324, point_related_order_amount: 4354244
                }];
                this.resize();
                this.spinLoading = false;
            }, 500);
        },
        methods: {
            /** 菜单切换 */
            menuSelect(name) {
                console.log(name);
                if (this.active_name === name) return;
                this.componentName = this.dimension[name];
                this.active_name = name;
            },
            back() {
                this.$router.go(-1);
            },
            /** 响应式 */
            resize() {
                this.winWidth = this.$refs.winBox.clientWidth - 1;
            }
        }
    };
</script>
