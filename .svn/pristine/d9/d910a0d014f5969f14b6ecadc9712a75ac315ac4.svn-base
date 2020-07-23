<!-- 目前人群分析的实时分析用到 -->
<template>

    <div class="trait-analyse no-pm">
        <Row type="flex" justify="space-between" align="middle" style="height:32px;margin:24px 2px;">
            <Col class="title">特性实时分析</Col>
            <Col>
                <TraitInput v-if="visible"
                :disabled="Object.keys(traitList).length>=6"
                :selfTrait="tabView==='self'"
                :groupTrait="tabView==='group'"
                :group="tabView==='group'? groupInfo : {}"
                :btnType="true"
                btnColor="primary"
                @on-change="createTrait"
                :filterIds="filterIds"
                :URI="URI"></TraitInput>
            </Col>
        </Row>
        <Row>
            <div>
                <Row v-if="Object.keys(traitList).length" class="chart-wrapper">
                    <Col span="12" v-for="(item, key, index) in traitList" :key="index" class="single-card">
                        <Card dis-hover>
                                <board
                                    hasCheckbox
                                    hasDeleteBtn
                                    tWid="calc(100% - 170px)"
                                    :downList="downList"
                                    :key="item.traitData.value[0]"
                                    ref="board"
                                    :title="item.traitData.names[0]"
                                    :data="item.boardData"
                                    @clickMore="clickMore"
                                    @remove="deleteTrait(item.traitData)"
                                    offsetX="0px"
                                    offsetY="-31px">

                                    <!-- :name == -2时，事件不派发；因为dropdown中，disabled也能触发事件的问题，为解决这个问题加的 -->
                                    <DropdownItem slot="item" :name="!item.canTracking ? -2 : key" :disabled="!item.canTracking">
                                        <Tooltip class="tooltip" content="仅数字、标记、分类的类型特性可以添加长期跟踪" max-width="450px" :transfer="true"  placement="bottom">
                                            长期跟踪分析
                                        </Tooltip>
                                    </DropdownItem>
                                </board>
                        </Card>
                    </Col>
                </Row>
                <Row v-else>
                    <Card dis-hover>
                        <Col class="no-msg">{{noDataMsg}}</Col>
                    </Card>
                </Row>
            </div>
        </Row>
    </div>

</template>
<script>
    import Board from '@/components/chart/board.vue';
    import api from '@/api/boardApi';
    import TraitInput from '@/components/strategy/TraitInput.vue';

    export default {
        name: 'traitAnalyse',
        components: {
            TraitInput,
            Board
        },
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
            visible: {
                type: Boolean,
                default: false
            },
            groupInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            noDataMsg: {
                type: String,
                default: '渠道管理员未添加任何特性，若需要添加实时特性分析，请联系渠道管理员'
            }
        },
        data() {
            const uitlParams = {
                include_sub_catalog: false,
                authorized: false,
                data_type: this.$config.data_type_list
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
            return {
                downList: [{
                    title: '长期跟踪分析',
                    tip: '',
                    isShow: true // 非false都显示
                }, {
                    title: '长期跟踪分析2',
                    tip: '',
                    isShow: true // 非false都显示
                }],
                // 特性饱和度分析
                boardData: {
                    request: { // 这里只有request是变的
                        url: null,
                        // isSend: () => this.traitCode != null && this.traitCode.trim() != '',
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
                URI: {
                    ...params,
                    search: `${this.$config.apiDomain}/searcher/traits-and-crowds`,
                    catalogs: `${this.$config.apiDomain}/catalogs`,
                    traits: `${this.$config.apiDomain}/traits`,
                    crowds: `${this.$config.apiDomain}/crowds/drop/list`
                },
                traitList: {}
            };
        },
        computed: {
            filterIds() {
                const data = [];
                Object.keys(this.traitList).map((traitCode) => {
                    const trait = (this.traitList[traitCode] || {}).traitData || {};
                    const scopes = trait.scopes || [];
                    const codes = trait.value || [];
                    data.push({
                        scope: scopes[0],
                        code: codes[0]
                    });
                });
                return data;
            }
        },
        methods: {
            clickMore(key) {
                if (key == -1) {
                    return;
                }
                const item = this.traitList[key] || {};
                this.tracking(item.traitData, item.canTracking);
            },
            // 处理传入图表的数据
            getData(traitData) {
                // 只有‘数字/标记、分类、是否’可长期跟踪
                const canTracking = [
                    'Number',
                    'Badge',
                    'Enum',
                    'Bool'
                ].indexOf(traitData.data_type) != -1;

                const traitCode = traitData.value[0];
                const boardData = JSON.parse(JSON.stringify(this.boardData));
                // boardData.type = traitData.data_type == 'Address' ? 'address' : 'chart';
                if (traitData.data_type == 'Address') {
                    boardData.type = 'address';
                    boardData.isShowNonExistent = true;
                } else {
                    boardData.type = 'chart';
                    boardData.isShowNonExistent = false;
                }
                boardData.request.url = `${this.$config.apiDomain}/crowds-analytics/${this.crowdCode}/traits/${traitCode}`;

                const item = {
                    traitData,
                    canTracking,
                    boardData
                };

                return item;
            },
            // 新增特性
            createTrait(traitData) {
                traitData = traitData || {};
                const data = this.getData(traitData);
                this.$set(this.traitList, traitData.value[0], data);
                this.$Message.success('添加到特性实时分析成功');
            },
            // 删除特性
            deleteTrait(traitData) {
                // const traitName = traitData.names[0];
                const traitCode = traitData.value[0];
                // this.$Modal.confirm({
                //     title: '确认删除此图表吗？',
                //     content: `名称：${traitName}<br><br>删除后，节点角色的概览页也将不再展示此图表。`,
                //     onOk: () => {
                // 对前端数据执行删除操作
                this.$delete(this.traitList, traitCode);
                this.$Message.success('从特性实时分析删除成功');
                //     }
                // });
            },
            // 添加长期跟踪
            tracking(traitData, canSend) {
                if (!canSend) {
                    return;
                }
                const traitCode = traitData.value[0];
                const that = this;
                void (async function () {
                    try {
                        that.$emit('on-changeStatus', true);
                        // 获取子目录
                        const result = await api.addTrackingData({
                            crowdCode: that.crowdCode,
                            traitCode
                        });
                        that.$emit('on-add', result.tracking);
                        that.$emit('on-changeStatus', false);
                    } catch (e) {
                        that.$emit('on-changeStatus', false);
                    }
                }());
            }
        }
    };
</script>
<style lang="less" scoped>
// .trait-analyse {
//     .chart-wrapper {
//         .single-card {
//             padding-bottom: 16px;
//             &:nth-child(odd) {
//                 padding-right: 16px;
//             }
//             .title {
//                 font-size: 16px;
//             }
//             .operation-icon {
//                 font-size: 18px;
//                 position: absolute;
//                 top: -4px;
//                 right: 0px;
//                 .operation-icon-item:hover{
//                     color: #2d8cf0;
//                 }
//                 .operation-icon-item.disabled:hover,
//                 .disabled{
//                     color: #bbb;
//                     cursor: not-allowed;
//                 }
//             }
//         }
//     }
//     .no-msg {
//         padding-bottom: 16px;
//         line-height: 336px;
//         font-size: 20px;
//         color: #bbb;
//         text-align: center;
//     }
// }
</style>
<style lang="less">
// .trait-analyse {
//     &.no-pm>.ivu-card-body{
//         padding-bottom: 0px;
//     }
//     .ivu-card-extra {
//         top: 9px;
//     }
// }
</style>

<style lang="less" scoped>
.trait-analyse {
    .chart-wrapper {
        .single-card {
            padding-bottom: 24px;
            &:nth-child(odd) {
                padding-right: 24px;
            }
            .title {
                font-size: 18px;
            }
            .del-icon {
                text-align: right;
                &:hover {
                    color: #2d8cf0;
                }
            }
        }
    }

    .no-msg {
        // padding-bottom: 16px;
        line-height: 200px;
        font-size: 14px;
        color: #bbb;
        text-align: center;
    }
}
</style>
<style lang="less">
.trait-analyse {
    &.no-pm>.ivu-card-body{
        padding-bottom: 0px;
    }
    .ivu-card-extra {
        top: 9px;
    }
}
</style>
