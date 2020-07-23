<template>
    <div>
        <Row type="flex" justify="space-between" align="middle" style="padding:16px 24px;background-color:white;margin-top:15px">
            <i-col style="background-color:white;">
                <span @click="back">
                    <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" style="margin-top:-5px;margin-right:5px;"/>
                </span>
                <span style="font-size:20px;">
                   回访看板
                </span>
            </i-col>
        </Row>
        <div class="slide-scroll-box">
            <div class="page-title bottom-shadow page-title-tab">
                <Menu class="pl24" mode="horizontal" theme="light" :active-name='active_name'>
                <MenuItem v-for="(item,index) in menu" :key="index" :name="index">{{item}}</MenuItem>
                </Menu>
            </div>

            <Row class="padding16-18" style="background:white;font-size:18px;font-weight:600;color:#000;display:flex">
                <i-col style="display:flex;">
                    <i-col class="borbox" style="padding-right:25px;">
                        <span>品牌渠道</span>
                        <i-select
                            @on-change="ditchChange"
                            placeholder="请选择渠道"
                            v-model="queryChannelOptions.brand"
                            style="width:100px"
                        >
                            <i-option
                            v-for="item in ditchList"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col>

                    <i-col class="borbox" style="padding-right:25px;">
                        <span>区域</span>
                        <i-select
                            @on-change="areaChange"
                            placeholder="请选择区域"
                            v-model="queryChannelOptions.area"
                            style="width:150px"
                        >
                            <i-option
                            v-for="item in areaList"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col>

                    <i-col style="padding-right:25px;">
                        <span>门店</span>
                        <i-select
                            multiple
                            @on-change="shopChange"
                            placeholder="请选择门店"
                            v-model="queryChannelOptions.shop"
                            style="width:400px;"
                        >
                            <i-option
                            v-for="item in shopList"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col>

                    <i-col>
                        <Button type="primary" @click="inquire">查询</Button>
                    </i-col>

                </i-col>
                <i-col style="text-align:right;flex:1;">
                    <i style="font-weight:900;font-size:17px;margin-right:5px;cursor: pointer;" class="el-icon-download"></i>
                    <i style="font-weight:700;font-size:17px;cursor: pointer;" class="el-icon-question"></i>
                </i-col>
            </Row>


            <chart-page
                v-if="show"
                :title="'回访看板'"
                :loading="loading"
                :allData="allData"
                :vip="this.dimension[this.active_name]"
            />

        </div>
    </div>
</template>

<script>
    import ChartPage from './ChartPage';

    export default {
        data() {
            return {
                title: '', // title名
                allData: [], // 所有数据
                menu: [], // 菜单栏
                active_name: 0, // 已选中的菜单栏
                loading: false, // 加载
                dimension: ['total', 'nonVip', 'oldVip', 'newVip'], // 加载数据的类型
                show: false,
                ditchList: [],
                areaList: [],
                shopList: [],
                queryChannelOptions: {
                    brand: '',
                    area: '',
                    shop: ''
                },
                queryOptions: {
                    brand: '',
                    area: '',
                    shop: ''
                }

            };
        },
        components: {
            ChartPage
        },
        created() {
            this.$https.analysisManagement.allQueryType().then((res) => {
                this.ditchList = res[0].data.data.map(item => ({ label: item.name, value: item.orgId }));
                this.ditchList.unshift({ label: '选择渠道', value: '0' });
                this.areaList = res[1].data.data.map(item => ({ label: item.name, value: item.orgId }));
                this.areaList.unshift({ label: '选择门店', value: '0' });
            });

            this.menu = ['回访数据'];
            this.getData();
        },
        mounted() {},
        methods: {
            /** 门店数据接口 */
            changeStroe() {
                this.$https.analysisManagement.queryChannelOptions({
                    queryType: 'stroe',
                    brand: this.queryOptions.brand,
                    area: this.queryOptions.area
                }).then((res) => {
                    this.queryChannelOptions.shop = '';
                    this.queryOptions.shop = '';
                    this.shopList = res.data.data.map(item => ({ label: item.storeName, value: item.storeNo }));
                });
            },

            /** 查询接口数据 */
            getData() {
                this.show = false;
                this.$https.visitKanban.detail({
                    code: this.$route.query.f_id,
                    data: {
                        area: this.queryOptions.area && this.queryOptions.area.split(),
                        brand: this.queryOptions.brand && this.queryOptions.brand.split(),
                        shop: this.queryOptions.shop
                    }
                }).then((res) => {
                    this.allData = res.data.data;
                    this.show = true;
                });
            },
            /** 渠道 */
            ditchChange(e) {
                this.queryOptions.brand = this.find(this.ditchList, 'value', e) && (this.find(this.ditchList, 'value', e).label || '');
                this.changeStroe();
                // this.getData();
            },
            /** 区域 */
            areaChange(e) {
                this.queryOptions.area = this.find(this.areaList, 'value', e) && (this.find(this.areaList, 'value', e).label || '');
                this.changeStroe();
                // this.getData();
            },
            /** 门店 */
            shopChange(e) {
                const arr = [];
                for (const i in e) {
                    arr.push(this.find(this.shopList, 'value', e[i]) && (this.find(this.shopList, 'value', e[i]).label || ''));
                }
                this.queryOptions.shop = arr;
                // this.getData();
            },
            /** 返回 */
            back() {
                this.$router.go(-1);
            },
            /** 数组查找 */
            find(allArray, data, val) {
                return allArray.find(item => item[data] === val);
            },
            /** 查询 */
            inquire() {
                this.getData();
            }
        }
    };
</script>
