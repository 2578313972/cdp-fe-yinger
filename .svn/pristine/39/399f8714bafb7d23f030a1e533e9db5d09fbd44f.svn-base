<template>

    <div class="mask-bg">
        <edit-title :isShowBtn="false" :title="title"></edit-title>
        <div class="custom-dialog-content">

            <!-- 详情-人群分析 -->
            <div class="crowd-comparison-box">

                <Card dis-hover  class="crowd-portrait-box-item">
                    <Row style="min-height:380px" class="box">
                        <div class="crowd-comparison-box-filteritem">
                            <span class="crowd-comparison-box-label">已选人群</span>
                            <span class="crowd-comparison-box-value">{{crowdName}}</span>
                        </div>
                        <br>
                        <div class="crowd-comparison-box-filteritem">
                            <span class="crowd-comparison-box-label">对比人群</span>
                            <TraitInput
                                :value="crowdData"
                                :closable="false"
                                :publicTrait="false"
                                :groupTrait="false"
                                :allCrowd="true"
                                :selfCrowd="tabView==='self'"
                                :groupCrowd="tabView==='group'"
                                :group="tabView==='group'? groupInfo : {}"
                                @on-change="setObjectCrowd"></TraitInput>
                        </div>
                        <div class="crowd-comparison-box-filteritem mt20">
                            <span class="crowd-comparison-box-label">对比分析的特性</span>
                            <TraitInput
                                :URI="URI"
                                :value="traitData"
                                :selfTrait="tabView==='self'"
                                :closable="false"
                                :groupTrait="tabView==='group'"
                                :group="tabView==='group'? groupInfo : {}"
                                @on-change="setObject"></TraitInput>
                        </div>

                        <board v-if="isShowEChart" :length="1" class="mt20"
                            title="对比图"
                            ref="board"
                            hasCheckbox
                            :data="boardData"
                            :crowdCode="crowdCode"
                            :traitCode="traitCode"
                            :isReserveTitle="false"
                            :hasLegend="true"
                            @changeType="changeType"
                            offsetY="-32px"
                            width="100%"
                            height="320px">
                        </board>
                        <div v-if="!isShowEChart" class="crowd-comparison-box-msg">
                            请选择对比人群和特性
                        </div>

                    </Row>
                </Card>
            </div>
        </div>
    </div>

</template>

<script>

    import editTitle from '@/components/EditTitle';
    import Board from '@/components/chart/board.vue';

    export default {
        props: {
            crowdCode: {
                type: String,
                default: ''
            },
            crowdName: {
                type: [String],
                default: ''
            },
            configData: {
                type: Object,
                default() {
                    return {};
                }
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
            URI: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                title: '人群对比分析',
                requestFlag: false,
                boardData: {
                    request: { // 这里只有request是变的
                        url: `${this.$config.apiDomain}/crowds-analytics/${this.crowdCode}/contrast`,
                        isSend: (params) => {
                            if (params.selected_crowd_code == null || params.selected_crowd_code.trim() == '' || params.trait_code == null || params.trait_code.trim() == '') {
                                return false;
                            }
                            return true;
                        },
                        params: null
                    },
                    formatter: (data) => {
                        const result = [];
                        data.map((item, index) => {
                            index == 0 && result.push(item.name);
                            result.push(`${item.marker + item.seriesName}: ${item.data.percent || 0}%(${item.data.tmp_board_value}人)`);
                        });
                        return result.join('<br>');
                    },
                    field: 'percent',
                    model: '',
                    type: 'chart',
                    charts: [
                        'v_bar'
                    ]
                },
                crowdTmpValue: null,
                traitTmpValue: null
            };
        },
        components: {
            Board,
            editTitle
        },
        created() {},
        mounted() {
        },
        computed: {
            crowdData() {
                return this.getCrowdData();
            },
            crowdCode2() {
                return this.getCrowdCode();
            },
            traitData() {
                return this.getTraitData();
            },
            traitCode() {
                return this.getTraitCode();
            },
            isShowEChart() {
                const boardData = this.boardData || {};
                const req = boardData.request || {};
                const params = req.params || {};
                if (params.selected_crowd_code == null || params.selected_crowd_code.trim() == '' || params.trait_code == null || params.trait_code.trim() == '') {
                    return false;
                }
                return true;
            }
        },
        methods: {

            getCrowdData() {
                const result = {
                    // data_type:"String",
                    // data_types:["String"],
                    names: [],
                    value: [],
                    source: 'crowd'
                };
                if (this.crowdTmpValue != null) {
                    return this.crowdTmpValue;
                }

                return result;
            },
            getCrowdCode() {
                const crowdData = this.getCrowdData() || {};
                const values = crowdData.value || [];
                return values[0];
            },
            getTraitData() {
                const configData = this.configData || {};
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

            changeType(type) {
                this.boardData.model = type;
            },

            setURIPath() {
                // 参数不完事
                if (this.crowdCode2 == null || this.crowdCode2.trim() == '' || this.traitCode == null || this.traitCode.trim() == '') {
                    return;
                }

                this.boardData.request.params = {
                    selected_crowd_code: this.crowdCode2, // 要对比的人群code
                    trait_code: this.traitCode // 使用的特性code
                };

                this.$nextTick(() => {
                    this.requestFlag && this.$refs.board && this.$refs.board.change && this.$refs.board.change();
                    // this.$tools.bus.$emit(`setBoardData${this.boardData.onlykey}`);
                    this.requestFlag = true;
                });
            },

            // 切换特性类型
            setObject(data) {
                this.traitTmpValue = (data.value && data.value.length > 0) ? data : this.traitTmpValue;
                this.traitData.type = data.data_type == 'Address' ? 'address' : 'chart';
                this.setURIPath();
            },

            // 切换人群
            setObjectCrowd(data) {
                this.crowdTmpValue = (data.value && data.value.length > 0) ? data : this.crowdTmpValue;
                this.setURIPath();
            },
            ok() {

            },
            cancel() {
                this.$emit('cancel', false);
            }
        },
        watch: {},
        destroyed() {
        }
    };
</script>

<style scoped lang="less">
    .crowd-comparison-box {
        width: 100%;
        padding: 20px;
        .crowd-comparison-box-msg{
            line-height: 332px;
            text-align: center;
            font-size: 20px;
            color: #bbb;
        }
        .crowd-comparison-box-filteritem{
            line-height: 32px;
            display: flex;
            .crowd-comparison-box-label{
                width: 120px;
            }
        }
        .crowd-portrait-box-item{
            &+.crowd-portrait-box-item{
                margin-top: 16px;
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
            color: red;
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
</style>
