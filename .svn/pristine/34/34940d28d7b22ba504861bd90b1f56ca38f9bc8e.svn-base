<template>
    <div class="trait-analyse no-pm">
        <Row type="flex" justify="space-between" align="middle" style="height:32px;margin:24px 2px;">
            <Col class="title">特性实时分析</Col>
            <Col>
                <TraitInput
                    v-if="visible"
                    :disabled="Object.keys(traitList).length>=6"
                    :btnType="true"
                    btnColor="primary"
                    @on-change="createTrait"
                    :filterIds="filterIds"
                    :URI="URI">
                </TraitInput>
            </Col>
        </Row>
        <Row>
            <Spin fix v-if="spinShow"></Spin>
            <div>
                <Row v-if="Object.keys(traitList).length" class="chart-wrapper">
                    <Col span="12" v-for="(item, key) in traitList" :key="key" class="single-card">
                        <Card dis-hover>

                                <board
                                    hasCheckbox
                                    :hasDeleteBtn="visible"
                                    ref="board"
                                    :title="key"
                                    :data="item"
                                    offsetX="0px"
                                    offsetY="-31px"
                                    @remove="deleteTrait(item, key)">
                                </board>
                                <!-- <div span="0" class="del-icon" v-if="visible" style="position:absolute; top: 14px;right:16px;">
                                    <Icon type="ios-trash f16" @click="deleteTrait(item, key)"/>
                                </div> -->
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
    import TraitInput from '@/components/strategy/TraitInput.vue';

    export default {
        name: 'traitAnalyse',
        components: {
            TraitInput,
            Board
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            noDataMsg: {
                type: String,
                default: '渠道管理员未添加任何特性，若需要添加实时特性分析，请联系渠道管理员'
            }
        },
        created() {
            this.getChartData();
        },
        computed: {
            filterIds() {
                return this.filterTraitId(this.traitList);
            }
        },
        data() {
            const utilParams = {
                include_sub_catalog: false,
                authorized: false,
                lifecycle_status: 'active',
                data_type: this.$config.data_type_list
            };
            // 特性实时分析接口配置
            const traitAnalyseURI = {
                searchParams: {
                    ...utilParams
                }, // 搜索的参数
                catalogsParams: {
                    ...utilParams
                }, // 目录的参数
                traitsParams: {
                    ...utilParams
                }, // 特性的参数
                search: `${this.$config.apiDomain}/searcher/traits-and-crowds`,
                catalogs: `${this.$config.apiDomain}/catalogs`,
                traits: `${this.$config.apiDomain}/traits`
            };

            return {
                spinShow: true,
                URI: traitAnalyseURI,
                traitList: []
            };
        },
        methods: {
            // 提取特性id
            filterTraitId(data) {
                const codeArr = [];
                for (const item in data) {
                    if (Object.prototype.hasOwnProperty.call(data, item)) {
                        const tempData = data[item].data[0];
                        codeArr.push({
                            code: tempData.code,
                            scope: tempData.scope
                        });
                    }
                }
                return codeArr;
            },
            // 处理传入图表的数据
            dealData(obj) {
                const tempObj = obj || {};
                const chartData = {
                    data: {},
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
                };

                const keyArr = Object.keys(tempObj);
                keyArr.forEach((item) => {
                    // debugger;
                    tempObj[item] = Object.assign({}, chartData, {
                        data: obj[item]
                    });
                    // 地址类型用地图显示
                    if (tempObj[item] && tempObj[item].data[0].data_type === 'Address') {
                        tempObj[item] = Object.assign(tempObj[item], {
                            type: 'address',
                            data_type: 'address',
                            isShowNonExistent: true
                        });
                    } else {
                        tempObj[item] = Object.assign(tempObj[item], {
                            type: 'chart'
                        });
                    }
                });
                return tempObj;
            },
            // 获取特性分析chart图数据
            getChartData() {
                this.spinShow = true;
                const url = `${this.$config.apiDomain}/board/portraits`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        this.spinShow = false;
                        this.traitList = this.dealData(data);
                    })
                    .catch(() => {
                        this.spinShow = false;
                    });
            },
            // 新增特性
            createTrait(val) {
                this.spinShow = true;
                const url = `${this.$config.apiDomain}/board/portraits/traits/${val.value[0]}`;
                this.$axios
                    .post(url)
                    .then(({ data }) => {
                        this.spinShow = false;
                        if (data && data[0]) {
                            const key = data[0].name;
                            const item = {};
                            item[key] = data;
                            const tempData = this.dealData(item);
                            this.$set(this.traitList, key, tempData[key]);
                        }
                        this.$Message.success('已添加');
                    })
                    .catch(() => {
                        this.spinShow = false;
                    });
            },
            // 删除特性
            deleteTrait(item, key) {
                const code = item.data[0].code;
                this.$Modal.confirm({
                    title: '确认删除此图表吗？',
                    content: `名称：${key}<br><br>删除后，节点角色的概览页也将不再展示此图表。`,
                    onOk: () => {
                        const url = `${this.$config.apiDomain}/board/portraits/traits/${code}`;
                        this.spinShow = true;
                        this.$axios
                            .delete(url)
                            .then(() => {
                                this.spinShow = false;
                                // 对前端数据执行删除操作
                                this.$delete(this.traitList, key);
                                this.$Message.success('已删除');
                            })
                            .catch(() => {
                                this.spinShow = false;
                            });
                    }
                });
            }
        }
    };
</script>
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
        background: #fff;
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
