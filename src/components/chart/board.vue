<template>
    <div>
        <div :class="{'ui-board-box':true, 'ui-board-box-nt':!title}" :style="{width: width, height: height}">
            <h3 class="ui-board-box-title" v-if="hasTitle" :style="{'width':tWid}">{{title}}</h3>

            <div :style="{position:'relative', height:hasTitle ? 'calc(' + height + ' - 30px)' : height, width:'100%'}">

                <!-- 加载效果 -->
                <div v-if="loading" class="ui-board-box-content">
                    <Spin size="large" fix>
                    </Spin>
                </div>

                <!-- 配置错误兼容 -->
                <div v-else-if="!loading && data.type=='unknown'" class="ui-board-box-content ">
                    <p class="ui-board-box-unknown">
                        配置信息错误!
                    </p>
                </div>

                <!-- 无数据 -->
                <!-- <div v-else-if="!loading && !isShowChart" class="ui-board-box-msg" :style="{ lineHeight: hasTitle ? 'calc(' + height + ' - 30px)' : height}">
                    <div class="ui-board-box-toolbar" :style="{top:offsetY, right:offsetX}" >
                        <slot name="del" v-if="hasDelSlot"></slot>
                        <div v-else-if="hasDeleteBtn" class="icon iconfont ui-board-box-toolbar-item icon-action_delete_outline" @click="remove"></div>
                    </div>
                    {{notDataMsg}}
                </div> -->

                <!-- 文本内容 -->
                <!-- <div v-else-if="!loading && isShowChart && data.type=='text'" class="ui-board-box-content" style="overflow-y: auto;">
                    <div
                        class="ui-board-box-item"
                        v-for="(item, index) in dt"
                        :key="index">
                        <Tooltip class="ui-board-box-con" :transfer="true" max-width="100%" :content="item.name">
                            {{item.name}}
                        </Tooltip>
                        <Tooltip class="ui-board-box-num" :transfer="true" :content="item.value">
                            {{item.value}}
                        </Tooltip>
                    </div>
                </div> -->

                <!-- 图 || 无数据 -->
                <div v-else class="ui-board-box-content">
                <!-- <div v-if="!loading && isShowChart && (data.type=='chart' || data.type=='address')" class="ui-board-box-content"> -->
                    <!-- <Select v-if="hasSelect" class="change-select-style" :style="{top:0, right:offsetX}" v-model="barData.model" @on-change="(value) => changeType(value)">
                        <Option v-for="el in barData.type" :value="el.value" :key="el.value">{{ el.label}}</Option>
                    </Select> -->

                    <div class="ui-board-box-toolbar" :style="{top:offsetY, right:offsetX}" >
                        <!-- 详情 -->
                        <div v-if="data.type=='address' && !isShowAddressDetail" class="icon iconfont ui-board-box-toolbar-item icon-editor_format_list_bulleted" @click="changeAddressDetail()"></div>
                        <!-- 地图 , 地图和其它有互斥 -->
                        <div v-if="data.type=='address' && isShowAddressDetail" class="icon iconfont ui-board-box-toolbar-item icon-address_outlined" @click="changeAddressDetail()"></div>
                        <!-- 图形列表 -->
                        <div v-for="(item) in barData.type" v-if="item.value != barData.model" class="icon iconfont ui-board-box-toolbar-item" :class="{'icon-editor_pie_chart_outline':(item.value == 'pie'),'icon-social_poll':(item.value == 'v_bar')}" @click="changeType(item.value)"></div>
                        <!-- 删除 -->
                        <slot name="del" v-if="hasDelSlot"></slot>
                        <div v-else-if="hasDeleteBtn" class="icon iconfont ui-board-box-toolbar-item icon-action_delete_outline" @click="remove"></div>
                        <!-- <div v-role-button="`${roleDeleteButton}`" v-if="hasDeleteBtn" class="icon iconfont ui-board-box-toolbar-item icon-action_delete_outline" @click="remove"></div> -->


                        <!-- 更多 -->
                        <Dropdown transfer trigger="click" style="height:24px;" @on-click="clickMore">
                            <Icon class="ui-board-box-toolbar-item" type="md-more" style="color: #2d8cf0;" v-if="isShowMore || (hasCheckbox && data.type!='address')"></Icon>
                            <DropdownMenu slot="list" class="ui-board-dropdown">
                                <DropdownItem name="-1" v-if="hasCheckbox && data.type!='address'">
                                    <Checkbox @on-change="(value) => changeValue(value)" class="is-no-value" v-model="isNoValue">隐藏空值</Checkbox>
                                </DropdownItem>

                                <slot name="item"></slot>
                                <!-- :name == -2时，事件不派发；因为dropdown中，disabled也能触发事件的问题，为解决这个问题加的
                                <DropdownItem slot="item" :name="!item.canTracking ? -2 : key" :disabled="!item.canTracking">
                                    <Tooltip class="tooltip" content="仅数字、标记、分类的类型特性可以添加长期跟踪" max-width="450px" :transfer="true"  placement="bottom">
                                        长期跟踪分析
                                    </Tooltip>
                                </DropdownItem>
                                 -->
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div v-if="!isShowChart" class="ui-board-box-msg" :style="{ lineHeight: hasTitle ? 'calc(' + height + ' - 30px)' : height}">
                        {{notDataMsg}}
                    </div>
                    <!--
                    <charts ref="chart" class="ui-board-box-charts" :data="barData" v-if="!loading && isShowChart && (data.type=='chart' || data.type=='address')" -->

                    <charts v-else ref="chart" class="ui-board-box-charts" :data="barData"
                        :isShowAddressDetail="isShowAddressDetail"
                        :legendPaddingTop="hasTitle ? 12 : 0"
                        :hasLegend="hasLegend"
                        :width="width" :height="hasTitle ? 'calc(' + height + ' - 30px)' : height"></charts>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import charts from '@/components/chart/charts.vue';
    import api from '@/api/boardApi';
    import Vue from 'vue';

    export default {
        props: {
            /** data的可能数据结构
                {
                    request:{
                        url:null,                           // 请求的URL
                        params:{

                        },                                  // 请求的参数
                        isSend:()=>{return true}            // 是否能发送ajax;当不是函数或函数的返回非false时，都会发送这个ajax; 参数：第一个是 request.params, 第二个参数request
                    },
                    data:null,                              // 和request互斥，优先高于request；
                    isShowNonExistent:true,                 // 当type=address时生效，是否显示“不存在”，和业务相关的字段；默认:false，不显示
                    unit:'人',                               // 单位，默认是“人”
                    label:"label",
                    values:"values",
                    name:"name",
                    field:"value",                          // 图形使用哪个字段做为显示，默认是value,可配置；该字段被配置时，formatter原则上也应该要重置配置
                    formatter:()=>{},                       // type=="chart"时生效；图形hover时的显示格式;一旦配置了 field字段，原则上这里就应该使用自定义了，自己配置了
                    type:"chart",                           // text、address、chart
                    model:"line",                           // 默认选中的的图表类型，优先于charts中的第一个类型
                    charts:[                                // 当type是A时才需要配置charts
                        "pie","line","v_bar","h_bar"
                    ],
                    chartOpt:{
                        grid:{
                            left:30,
                            right:40
                        }
                    }
                }
            */
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            /* 由actionMore事件回调触发
                [
                    {
                        title:"",
                        "tip",
                        isShow:true // 非false都显示
                    }
                ]
            */
            // 配置下啦
            downList: {
                type: Array,
                default() {
                    return [];
                }
            },
            offsetX: {
                type: String,
                default: '0'
            }, // 图形选择框的X轴偏移值(相对于right)
            offsetY: {
                type: String,
                default: '-34px'
            }, // 图形选择框的Y轴偏移值
            tWid: {
                type: String,
                default: '100%'
            }, // 标题的容器宽度
            title: {
                type: String,
                default: ''
            },
            isReserveTitle: { // 当title是空且有图形选择下拉框是，是否保留title的容器(为了Select图形下拉控件的对齐) ;当值是true， 是预留；否则反之
                type: Boolean,
                default: true
            },
            width: { // 内容宽
                type: String,
                default: '100%'
            },
            height: { // 内容高
                type: String,
                default: '300px'
            },
            isShowText: { // 当没有数据时，是显示文本“暂无内容”，还是一个空数据的Echarts图,默认显示文本
                type: Boolean,
                default: true
            },
            notDataMsg: { // 当isShowText==true且没有数据时生效
                type: String,
                default: '暂无数据'
            },
            hasLegend: {
                type: Boolean,
                default: true
            },
            hasCheckbox: {
                type: Boolean,
                default: false
            },
            hasDeleteBtn: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isShowAddressDetail: false, // 是否显示地址数据列表
                mol: null,
                isNoValue: true,
                chartType: '',
                barData: {
                    model: '',
                    type: [],
                    mapOpt: null
                }, // 图表数据
                dt: [], // 文本列表数据
                loading: true, // 数据加载状态
                hasData: false // 是否有数据
            };
        },
        components: {
            charts
        },
        mounted() {
            this.init();
        },
        computed: {
            hasTitle() {
                const data = this.data || {};
                const hasTitle = this.title != null && this.title.trim() != '';
                // 当需要预留头容器时，无论是title不为空或是图形个数大于1都需要保留容器；当不需要预留时，只有title不为空才保留容器
                return (this.isReserveTitle && (hasTitle || (data.charts && data.charts.length > 1)))
                    || (!this.isReserveTitle && hasTitle);
            },
            isShowChart() {
                const isShowText = !this.hasData ? this.isShowText : false;
                return !isShowText;
            },
            hasSelect() {
                return this.barData.type.length > 1 && this.data.type != 'address';
            },
            isShowMore() {
                return this.$slots.item;
            },
            hasDelSlot() {
                return !!this.$slots.del;
            }
        },
        methods: {
            init() {
                // --- debug --- check参数是否全理，需要完善;比如request和其它模式下的必参
                if (!this.data) {
                    return;
                }
                this.loading = true;
                const data = this.data || {};

                // 此处在【内层】name后拼接空格，为了防止图表名称重复（区分新建特性-类型是分类，自定义名称和过滤系统没有值名称重复）
                data && data.data && this.addSpace(data.data[0].values);

                let type = data.type;
                type = type == null ? '' : (`${type}`).trim().toLocaleLowerCase();

                // 设置type默认值
                if (type == '') {
                    type = 'chart';
                    data.type = 'chart';
                }

                // 设置data.charts的默认值
                if (!data.charts || data.charts.length == 0) {
                    this.data.charts = ['v_bar'];
                }
                if (type == 'chart' || type == 'address' || type == 'text') {
                    data.data ? this.branchType(data.data) : this.getCommonData();
                } else { // 无法识别的信息
                    data.type = 'unknown';
                    this.loading = false;
                }
            },
            changeAddressDetail() {
                this.isShowAddressDetail = !this.isShowAddressDetail;
            },
            addSpace(data) {
                data.forEach((item) => {
                    if (item.label === '$missing') {
                        item.name = `${item.name.trim()} `;
                        if (item.tmp_board_name) {
                            item.tmp_board_name = `${item.tmp_board_name.trim()} `;
                        }
                    }
                });
            },

            clickMore(type) {
                // 默认-1是隐藏空值
                if (type < 0) {
                    return;
                }
                this.$emit('clickMore', type);
            },

            remove() {
                // 必须$prop.hasDeleteBtn是真
                this.$emit('remove');
            },

            // 切换展示类型
            changeType(val) {
                this.barData.model = val;
                this.$emit('changeType', val);
                // 记录当前下拉选择的图标类型
                this.chartType = val;
                this.$refs.chart && this.$refs.chart.change && this.$refs.chart.change();
            },

            // 切换是否过滤值
            changeValue(val) {
                this.isNoValue = val;
                if (this.data.data) {
                    this.setBarData(this.data.data);
                } else {
                    this.getCommonData();
                }
                // 给下拉赋新值，防止切换重置到第一个图标类型
                if (this.chartType) {
                    this.barData.model = this.chartType;
                }
            },

            // 对数据的分类
            branchType(dt) {
                dt = dt || {};
                const data = this.data || {};
                let type = data.type;
                type = type == null ? '' : (`${type}`).trim().toLocaleLowerCase();
                if (type == 'chart') {
                    this.setBarData(dt);
                } else if (type == 'address') {
                    this.setMap(dt);
                } else if (type == 'text') {
                    this.dt = dt || {};
                }
                this.loading = false;
            },

            getItems(data) {
                const list = data || [];
                return list;
            },

            getValues(dt) {
                dt = dt || {};
                const values = dt[this.data.values || 'values'] || [];
                return values;
            },

            // 地图分布
            setMap(data) {
                const formatAmount = Vue.filter('formatAmount');
                const dt = this.data || {};
                const that = this;
                const maplist = [];
                const map_data = [];
                const list = that.getItems(data);
                let unExitsData = null;
                that.barData.model = 'map';
                that.hasData = false;
                list.forEach((dt) => {
                    const items = that.getValues(dt);
                    items.map((item) => {
                        const value = item.value;
                        const name = item.name;
                        item.name = item[this.data.name || 'name'];
                        item.value = item[this.data.field || 'value'];
                        item.tmp_board_name = name; // 另存
                        item.tmp_board_value = value; // 另存

                        that.hasData = true;
                        // item.name = "北京"
                        maplist.push(item);
                        map_data.push(item.value);
                        if (item.name == '没有值') {
                            unExitsData = item;
                        }
                    });
                });
                this.barData.mapOpt = {
                    title: {
                        text: '',
                        subtext: dt.isShowNonExistent !== true ? '' : (unExitsData ? (`${unExitsData.name}：${unExitsData.value}${dt.unit == null ? '人' : dt.unit}`) : ''),
                        bottom: '0px',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter(data) {
                            return `${data.name ? data.name : '-'}：${isNaN(data.value) ? '-' : data.value + (dt.unit == null ? '人' : dt.unit)}`;
                        }
                    },
                    visualMap: {
                        min: Math.min(...map_data),
                        max: Math.max(...map_data),
                        left: 'left',
                        top: 'bottom',
                        text: ['高', '低'], // 文本，默认为数值文本
                        calculable: true,
                        inRange: {
                            color: ['#b3d9ff', '#3399ff']
                        },
                        controller: {
                            outOfRange: {
                                color: '#EEEEEE'
                            }
                        },
                        formatter(value) {
                            return `${formatAmount(value)}`;
                        }
                    },
                    series: [{
                        name: dt.mapTitle == null ? '' : dt.mapTitle,
                        type: 'map',
                        mapType: 'china',
                        data: maplist,
                        itemStyle: {
                            // 默认样式
                            normal: {
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.1)',
                                color: '#fff',
                                label: {
                                    show: false
                                }
                            },
                            // 选中样式
                            emphasis: {
                                borderWidth: 0,
                                borderColor: 'rgba(0,0,0,0.1)',
                                areaColor: '#2b85e4',
                                // color: 'red',
                                label: {
                                    show: false
                                }
                            }
                        }
                    }]
                };
                that.$nextTick(() => {
                    that.$refs.chart && that.$refs.chart.change && that.$refs.chart.change();
                });
            },

            // 饼图、曲线图、柱状图
            setBarData(data) {
                const that = this;
                that.hasData = false;

                // 过滤数据，区分【内层】是否含有系统没有值
                const filterData = this.$lodash.cloneDeep(data);
                let items = null;
                if (this.isNoValue) {
                    filterData.map((item) => {
                        item.values = item.values.filter(item => item.label !== '$missing');
                    });
                    // filterData[0].values = filterData[0].values.filter(item => item.label !== '$missing');
                    items = that.getItems(filterData);
                } else {
                    items = that.getItems(data);
                }

                /**
                 * 在这里拿到type 根据type判断展示柱状图还是地图，如果不是Address类型，显示柱状图
                 * type!==Address
                 * 显示：柱状图
                 */
                let xData = [];
                let yData = [];
                let pielist = [];
                const legend = [];

                // 过滤数据，区分【上层】是否含有系统没有值
                const filterData2 = this.$lodash.cloneDeep(items);
                if (this.isNoValue) {
                    items = filterData2.filter(item => item.label !== '$missing');
                }
                // 此处在【上层】name后拼接空格，为了防止图表名称重复（区分新建特性-类型是分类，自定义名称和过滤系统没有值名称重复）
                this.addSpace(items);

                items.map((item2, index2) => {
                    this.addSpace(item2.values);

                    const list = that.getValues(item2);
                    const yItem = {};
                    legend.push(item2.name);
                    yItem.name = item2.name;
                    yItem.data = [];
                    yData.push(yItem);

                    list.map((item) => {
                        item = item || {};
                        that.hasData = true;

                        const value = item.value;
                        const name = item.name;

                        item.name = item[this.data.name || 'name'];
                        item.value = item[this.data.field || 'value'];
                        item.tmp_board_name = name; // 另存
                        item.tmp_board_value = value; // 另存

                        // let dt = {
                        //     value:item[this.data.field || "value"],      // 用来展示图形的数据
                        //     name: item[this.data.name || "name"],
                        //     val:item.value,                              // 保留原始的value数据
                        //     percent:item.percent
                        // };

                        yItem.data.push(item);

                        // 相关X而言，名字是不能相同的，所以只存名字不一样的，但因为常理上认为每一维的数据结构应该是一样的所以就不做这种处理了，所以只取第一维
                        index2 == 0 && xData.push(item.name);

                        // 饼图只能显示一个维度; 所以当碰到多维时，饼图只显示第一维数据 --- debug ---
                        index2 == 0 && pielist.push(item);
                    });
                });

                // 容错处理
                if (!that.hasData) {
                    const emptyData = {
                        value: 0,
                        name: '无'
                    };
                    xData = ['无'];
                    yData = [emptyData];
                    pielist = [emptyData];
                }

                that.barData.id = 0;
                that.barData.data = {
                    xAxisData: xData,
                    yAxisData: {
                        type: 'value'
                    },
                    seriesData: yData,
                    pieSeriesData: pielist,
                    formatter: this.data.formatter,
                    legend,
                    chartOpt: this.data.chartOpt
                };

                // 根据配置数据生成可选择的图形下拉
                (that.data.charts).map((item, index) => {
                    if (index == 0) {
                        // 当有配置时，使用配置的，当无配置时使用默认的
                        that.barData.type = [];
                        that.barData.model = that.data.charts.indexOf(that.data.model) > -1 ? that.data.model : item;
                    }
                    item == 'v_bar' && that.barData.type.push({
                        value: 'v_bar',
                        label: '纵向柱状图'
                    });
                    item == 'h_bar' && that.barData.type.push({
                        value: 'h_bar',
                        label: '横向柱状图'
                    });
                    item == 'line' && that.barData.type.push({
                        value: 'line',
                        label: '线形图'
                    });
                    item == 'pie' && that.barData.type.push({
                        value: 'pie',
                        label: '饼状图'
                    });
                });

                that.$nextTick(() => {
                    that.$refs.chart && that.$refs.chart.change && that.$refs.chart.change();
                });
            },

            // 获取图表信息
            getCommonData() {
                const that = this;
                void (async function () {
                    try {
                        that.loading = true;
                        const req = that.data.request || {};
                        const isSend = req.isSend || (() => true);
                        if ((req.url == null || req.url.trim() == '') || isSend(req.params || {}, req) === false) {
                            that.loading = false;
                            return;
                        }
                        // 获取子目录
                        const result = await api.getCommonData(req.url, req.params);
                        const data = typeof (req.getData) === 'function' ? req.getData(result) || [] : result;
                        that.branchType(data);
                        that.loading = false;
                    } catch (e) {
                        console.error(e);
                        that.loading = false;
                    }
                }());
            },
            change() {
                this.init();
            }
        },
        watch: {
            data() {
                this.$nextTick(() => {
                    this.init();
                });
            }
        }
    };
</script>
<style lang="less">
    .ui-board-box-toolbar .ivu-dropdown-rel{
        height: 24px;
    }

    .ui-board-dropdown .ivu-dropdown-item-disabled{
        background-color: #fff;
        color: rgba(23,35,61,.35);
        // pointer-events:none;
    }
</style>
<style scoped lang="less">
    @num-w:84px;
    .ui-board-box{

        .ui-board-box-msg{
            line-height: 332px;
            text-align: center;
            font-size: 20px;
            color: #bbb;
        }
        .ui-board-box-unknown{
            color: #ed4014;
        }
        .change-select-style {
            width: 150px;
            // float: right;
            position: absolute;
            right: 0px;
        }
        .ui-board-box-toolbar{
            height: 24px;
            position: absolute;
            .ui-board-box-toolbar-item{
                vertical-align: middle;
                text-align: center;
                cursor: pointer;
                width: 24px;
                height: 24px;
                line-height: 24px;
                display: block;
                float: left;
                font-size: 18px;
            }
        }
        .ui-board-box-charts {
            position: relative;
        }
        .ui-board-box-detail{
            position: absolute;
            top: 0px;
            left: 0px;
        }
        .ui-board-box-con,
        .ui-board-box-num{
            white-space: nowrap;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .ui-board-box-con{
            width: calc(100% - @num-w - 4px);
        }
        .ui-board-box-num{
            width: @num-w;
            padding-left: 4px;
        }
        .ui-board-box-title{
            font-size: 14px;
            // text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            line-height: 20px;
            height: 20px;
            margin-bottom: 10px;
            padding: 0px;
        }
        .ui-board-box-content{
            // height: calc(100% - 30px);
            height: 100%;
            .ui-board-box-item{
                &+.ui-board-box-item{
                    margin-top: 10px;
                }
            }
        }
        &.ui-board-box-nt{
            .ui-board-box-content{
                height:100%;
            }
        }
        .is-no-value{
            position: absolute;
            top:-28px;
            z-index: 8;
        }
    }
</style>
