<template>
    <!-- 详情-人群分析 -->
    <div class="crowd-portrait-box">

        <div class="crowd-portrait-box-item" style="text-align: right;">
            <Button type="primary" @click="contrast" v-role-button="`crowd_contrast_button_in_${tabView}`">人群对比分析</Button>
            <Drawer v-model="isShowDialog" width="1000" :mask-closable="false">
                <div slot="title"></div>
                <crowd-comparison v-if="isShowDialog"
                    :URI="URI2"
                    :crowdName="crowdListContent.name"
                    :crowdCode="crowdCode"
                    :tabView="tabView"
                    :groupInfo="group_info"
                    :cancel="hideDialog">
                </crowd-comparison>
                <!-- <crowd-comparison v-if="isShowDialog"
                    :crowdName="crowdListContent.name"
                    :configData="configData"
                    :crowdCode="crowdCode"
                    :tabView="tabView"
                    :groupInfo="group_info"
                    :cancel="hideDialog">
                </crowd-comparison> -->
            </Drawer>
        </div>

        <!-- <board-config :crowdCode="crowdCode" class="crowd-portrait-box-item"></board-config> -->


        <Card dis-hover  class="crowd-portrait-box-item">
            <Row style="min-height:280px">
                <h3>长期跟踪分析</h3>
                <Tabs class="tab-mt" size="small" @on-click="tabChange" :value="trendValue">
                    <TabPane v-for="(item,index) in tabList" :key="index" :label="item.name" :name="item.value"></TabPane>
                </Tabs>
                <div class="btn_list flex1">
                    <ButtonGroup>
                        <Button class="btn_width" size="small" v-for="(item,index) in buttonList" :key="index" :type="item.key==buttonActive?'primary':'default'" @click="buttonStatus(item.key)">
                            {{item.value}}
                        </Button>
                    </ButtonGroup>
                </div>
                <board
                    ref="trend"
                    class="cp-mt12"
                    :hasCheckbox="isCrowdCode"
                    :data="trendData"
                    :isReserveTitle="false"
                    :hasDeleteBtn="isCrowdCode"
                    @remove="removeTraitTrack()"
                    @changeType="changeType2"
                    :hasLegend="true"
                    :isShowText="true"
                    offsetY="-36px"
                    width="100%"
                    height="320px">

                    <div slot="del" v-role-button="`crowd_tracking_in_${tabView}`" v-if="isCrowdCode" class="icon iconfont ui-board-box-toolbar-item icon-action_delete_outline" @click="removeTraitTrack"></div>

                </board>
            </Row>
        </Card>

        <!-- 特性实时分析 -->
        <trait-analyse
            :crowdCode="crowdCode"
            :tabView="tabView"
            :groupInfo="group_info"
            visible
            noDataMsg="暂未添加数据，可点击右上方添加按钮添加"
            class="m100"
            @on-add="addTracking"
            @on-changeStatus="changeStatus"
            v-role-button="`crowd_tracking_in_${tabView}`"></trait-analyse>


        <!--
        <Card dis-hover  class="crowd-portrait-box-item crowd-portrait-box-fixitem" v-role-button="`crowd_tracking_in_${tabView}`">
            <Row style="min-height:380px" class="box">
                <h3>特性饱和度分析
                </h3>
                <TraitInput :URI="URI" class="width300" :value="traitData" :selfTrait="tabView==='self'" :closable="false" :groupTrait="tabView==='group'" :group="tabView==='group'?group_info:{}" @on-change="setObject"></TraitInput>
                <Button :disabled="!canTracking" type="primary" @click="tracking" style="margin-left:10px;">+长期跟踪</Button>
                <Tooltip class="tooltip" content="仅数字、标记、分类、是否的类型特性可以添加长期跟踪" max-width="450"  placement="right">
                    <i class="fa fa-question-circle-o" style="margin-left:5px;font-size:16px;position: relative;top: 2px;"></i>
                </Tooltip>

                <div v-if="!traitCode" class="crowd-portrait-box-msg">
                    请选择特性
                </div>
                <board v-if="traitCode"
                    ref="board"
                    class="cp-mt12"
                    :data="boardData"
                    :isReserveTitle="false"
                    :hasLegend="true"
                    @changeType="changeType"
                    offsetY="-43px"
                    width="100%"
                    height="320px">
                </board>
            </Row>
        </Card>

        <Card dis-hover  class="crowd-portrait-box-item crowd-portrait-box-fixitem" v-role-button="`crowd_tracking_in_${tabView}`">
            <Row style="min-height:380px" class="box">
                <h3>特性饱和度分析
                </h3>

            </Row>
        </Card>
        -->
    </div>
</template>

<script>
    import CrowdComparison from './CrowdComparison.vue';
    import Board from '@/components/chart/board.vue';
    import api from '@/api/boardApi';
    import 'echarts/map/js/china';
    import TraitAnalyse from '@/components/overview/TraitAnalyse2.vue';

    export default {
        props: {
            crowdCode: {
                type: [String],
                default: ''
            },
            tabView: {
                type: String,
                default() {
                    return '';
                }
            },
            groupInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            crowdListContent: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                canTracking: false,
                URI: null,
                URI2: null,
                // 特性饱和度分析
                boardData: {
                    request: { // 这里只有request是变的
                        url: null,
                        isSend: () => this.traitCode != null && this.traitCode.trim() != '',
                        isAddress: false,
                        params: {}
                    },
                    type: 'chart',
                    model: '',
                    charts: [
                        'pie',
                        'v_bar'
                    ],
                    chartOpt: {
                        grid: {
                            left: 30,
                            right: 40
                        }
                    }
                },
                // 长期跟踪分析
                trendValue: this.crowdCode,
                trendData: {
                    request: { // 这里只有request是变的
                        url: null,
                        params: {}
                    },
                    formatter: (data) => {
                        let dt = data.data || {};
                        const result = [];

                        if (data instanceof Array) {
                            data.map((item, index) => {
                                dt = item.data || {};
                                index == 0 && result.push(item.name);
                                result.push(`${item.marker + item.seriesName}: ${item.value}`);
                            });
                        } else {
                            result.push(data.seriesName);
                            result.push(`${data.marker + dt.name}: ${dt.value}`);
                        }
                        return result.join('<br>');
                    },
                    model: '',
                    type: 'chart',
                    charts: [
                        'line'
                    ],
                    chartOpt: {
                        grid: {
                            left: 30,
                            right: 40
                        }
                    }
                },
                buttonActive: 'one_week',
                buttonList: [
                    {
                        value: '近7天',
                        key: 'one_week'
                    }, {
                        value: '近2周',
                        key: 'two_weeks'
                    }, {
                        value: '近1个月',
                        key: 'one_month'
                    }, {
                        value: '近3个月',
                        key: 'three_months'
                    }, {
                        value: '近6个月',
                        key: 'six_months'
                    }, {
                        value: '近1年',
                        key: 'one_year'
                    }
                ],
                group_info: null,
                isShowDialog: false, // 是否显示”人群对比“对话框
                configData: null,
                traitTmpValue: null
            };
        },
        computed: {
            // 判断是否是人群（用来去掉过滤没有值、删除）
            isCrowdCode() {
                return this.trendValue != this.crowdCode;
            },
            traitData() {
                return this.getTraitData();
            },
            traitCode() {
                return this.getTraitCode();
            },
            tabList() {
                return this.getTabList();
            }
        },
        components: {
            CrowdComparison,
            TraitAnalyse,
            Board
        },
        created() {},
        mounted() {
            const self = this;
            // Number, String, Bool, Enum, Badge, Date,   StringSet, Address,
            // NumberTimeLine, CounterTimeLine    ,Counter,TimeLine, StringList, NumberList, BoolList,Time, Void, Script,
            const typeCodes2 = function () {
                const data_type = [].concat(self.$config.data_type_list);
                data_type.pop();
                return data_type;
            };
            const uitlParams = {
                include_sub_catalog: false,
                authorized: false,
                data_type: this.$config.data_type_list
            };
            const uitlParams2 = {
                ...uitlParams,
                data_type: typeCodes2()
            };
            const params = {
                searchParams: {
                    ...uitlParams
                }, // 搜索的参数
                catalogsParams: {
                    ...uitlParams
                }, // 目录的参数
                traitsParams: {
                    ...uitlParams
                }, // 特性的参数
                crowdsParams: {
                    ...uitlParams
                }, // 人群的参数
                eventsParams: {
                    ...uitlParams
                } // 事件特性的参数
            };
            const params2 = {
                searchParams: {
                    ...uitlParams2
                }, // 搜索的参数
                catalogsParams: {
                    ...uitlParams2
                }, // 目录的参数
                traitsParams: {
                    ...uitlParams2
                }, // 特性的参数
                crowdsParams: {
                    ...uitlParams2
                }, // 人群的参数
                eventsParams: {
                    ...uitlParams2
                } // 事件特性的参数
            };
            this.URI = {
                ...params,
                search: `${this.$config.apiDomain}/searcher/traits-and-crowds`,
                catalogs: `${this.$config.apiDomain}/catalogs`,
                traits: `${this.$config.apiDomain}/traits`,
                crowds: `${this.$config.apiDomain}/crowds/drop/list`
            };
            this.URI2 = {
                ...params2,
                search: `${this.$config.apiDomain}/searcher/traits-and-crowds`,
                catalogs: `${this.$config.apiDomain}/catalogs`,
                traits: `${this.$config.apiDomain}/traits`,
                crowds: `${this.$config.apiDomain}/crowds/drop/list`
            };
            this.getConfigData();
            this.group_info = {
                id: this.groupInfo.group_id,
                name: this.groupInfo.name
            };
            this.setURIPath(this.crowdCode);
        },
        methods: {
            addTracking(tracking) {
                this.$Message.success('添加长期跟踪分析成功');
                this.configData.tracking = tracking;
            },
            changeStatus(status) {
                this.loading = status;
            },
            // "长期跟踪分析"的”人群数量“及相关特性列表
            getTabList() {
                const configData = this.configData || {};
                const result = [{
                    name: '人群数量',
                    value: this.crowdCode
                }];
                if (configData && configData.tracking) {
                    configData.tracking.map((item) => {
                        result.push({
                            name: item.trait_name,
                            value: item.trait_code
                        });
                    });
                }
                return result;
            },

            getTabName(id) {
                let result = '';
                const list = this.getTabList();
                list.map((item) => {
                    if (item.value == id) {
                        result = item.name;
                    }
                });
                return result;
            },

            // 删除配置中特性标签
            delTabList(tabId) {
                const configData = this.configData;
                if (configData && configData.tracking) {
                    configData.tracking.map((item, index) => {
                        if (tabId == item.trait_code) {
                            configData.tracking.splice(index, 1);
                        }
                    });
                }
            },

            // 获取默认特性或选中特性、优先选中的
            getTraitData() {
                const configData = this.configData;
                let result = {
                    // data_type:"String",
                    // data_types:["String"],
                    names: [],
                    value: [],
                    source: 'trait'
                };
                let tmp = null;
                if (this.traitTmpValue != null) {
                    return this.traitTmpValue;
                }
                if (configData == null) {
                    result = null;
                } else {
                    tmp = configData.saturation || null;
                    tmp && tmp.map((item) => {
                        result.names.push(item.trait_name);
                        result.value.push(item.trait_code);
                    });
                }
                return result;
            },
            getTraitCode() {
                const traitData = this.getTraitData() || {};
                const values = traitData.value || [];
                return values[0];
            },

            /** 获取配置数据
             */
            getConfigData() {
                const that = this;
                void (async function () {
                    try {
                        // 获取子目录
                        that.loading = true;
                        const result = await api.getConfigData({
                            crowdCode: that.crowdCode
                        });
                        that.configData = result;
                        that.loading = false;
                    } catch (e) {
                        that.loading = false;
                    }
                }());
            },

            // 长期跟踪分析里的人群数据与勘察特性的切换
            setURIPath(val) {
                // 人群数量
                if (val == this.crowdCode) {
                    this.trendData.request.url = `${this.$config.apiDomain}/crowds-analytics/${this.crowdCode}`;


                // 其它特性
                } else {
                    this.trendData.request.url = `${this.$config.apiDomain}/crowds-analytics/${this.crowdCode}/tracking/${val}`;
                }

                this.trendData.request.params.time_period = this.buttonActive;

                this.$refs.trend.change();
            },

            // "长期跟踪分析"的”人群数量“及相关特性切换
            tabChange(val) {
                if (this.trendValue == val) {
                    return;
                }
                this.trendValue = val;
                this.setURIPath(val);
            },

            // “长期跟踪分析”里的时间筛选
            buttonStatus(key) {
                this.buttonActive = key;
                this.setURIPath(this.trendValue);
            },

            // 添加长期跟踪
            tracking() {
                const that = this;
                void (async function () {
                    try {
                        // 获取子目录
                        that.loading = true;
                        const result = await api.addTrackingData({
                            crowdCode: that.crowdCode,
                            traitCode: that.traitCode
                        });
                        that.configData.tracking = result.tracking;
                        that.loading = false;
                    } catch (e) {
                        that.loading = false;
                    }
                }());
            },

            changeType(type) {
                this.boardData.model = type;
            },

            changeType2(type) {
                this.trendData.model = type;
            },

            // 人群对比
            contrast() {
                this.isShowDialog = !this.isShowDialog;
            },

            // 删除长期跟踪
            removeTraitTrack() {
                const that = this;
                const name = this.getTabName(this.trendValue);
                this.$Modal.confirm({
                    title: '你确认要从长期跟踪特征中删除此特性吗？',
                    content: `名称：${name}<br><br>删除后将不能看到特性的跟踪信息。`,
                    onOk: () => {
                        void (async function () {
                            try {
                                // 获取子目录
                                that.loading = true;
                                await api.delTrackingData({
                                    crowdCode: that.crowdCode,
                                    traitCode: that.trendValue
                                });
                                that.delTabList(that.trendValue);
                                that.loading = false;
                                that.$nextTick(() => {
                                    // 删除后默认设置在”人群数量“上
                                    that.tabChange(that.crowdCode);
                                });
                            } catch (e) {
                                that.loading = false;
                            }
                        }());
                    },
                    onCancel: () => {}
                });
            },

            // 隐藏抽屉对话框
            hideDialog() {
                this.isShowDialog = true;
            },

            // 切换特性类型
            setObject(data) {
                // 只有‘数字/标记、分类、是否’可长期跟踪
                this.canTracking = [
                    'Number',
                    'Badge',
                    'Enum',
                    'Bool'
                ].indexOf(data.data_type) != -1;
                this.traitTmpValue = (data.value && data.value.length > 0) ? data : this.traitTmpValue;
                this.boardData.type = data.data_type == 'Address' ? 'address' : 'chart';

                this.$nextTick(() => {
                    // 为防止
                    this.boardData.request.url = `${this.$config.apiDomain}/crowds-analytics/${this.crowdCode}/traits/${this.traitCode}`;
                    this.$refs.board && this.$refs.board.change();
                });
            }
        },
        watch: {},
        destroyed() {
        }
    };
</script>

<style scoped lang="less">
    .crowd-portrait-box {
        width: 100%;

        .crowd-portrait-box-msg{
            line-height: 332px;
            text-align: center;
            font-size: 20px;
            color: #bbb;
        }
        .crowd-portrait-box-item{
            h3{
                color: #17233d;
            }
            &+.crowd-portrait-box-item{
                margin-top: 24px;
            }
        }
        @trait-item-width:2;
        .crowd-portrait-box-fixitem{
            display: inline-block;
            width: calc((100% / @trait-item-width) - (16px * (@trait-item-width)));
            &+.crowd-portrait-box-item{
                margin-left: 16px;
            }
            &:nth-child(2n){
                margin-left: 0px;
            }
        }
        .cp-mt12{
            margin-top: 12px;
        }
        .tab-mt{
            margin-top: 8px;
        }
        .btn_list{
            position: relative;
        }
        .del{
            position: absolute;
            right: 0px;
            top: 3px;
            font-size:18px;
            cursor: pointer;
            &:hover{
                color: #2d8cf0;
            }
            &.disabled{
                cursor:not-allowed;
                color: gray;
            }
        }
        .box {
            background: white;
            h3{
                margin-bottom: 6px;
            }
            .charts {
                margin-top: 30px;
                padding: 10px
            }
            .change-select-style {
                width: 150px;
                width: 200px;
                position: absolute;
                right: 10px;
                top: 41px;
            }
        }
        .subText {
            font-size: 12px;
            font-weight: 500;
            color: #808695
        }
        .middle-style {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -24px;
            margin-top: -9px;
        }
        .hidden-content {
            width: 100%;
            height: 360px;
            background: white;
            position: absolute;
            left: 0;
            top: 20px;
        }
        .trait-option {
            position: absolute;
            left: 10px;
            top: 28px;
            background: white;
            height: 24px;
            min-width: 48px
        }
    }
    .m100{
        // margin: 16px 0 0 0px !important;
    }

</style>
