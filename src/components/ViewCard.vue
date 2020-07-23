<template>
    <Card :padding="0" :dis-hover="shadow" class="view-card-wrapper" @click.native="handleClick">
        <p class="title" :style="{'text-align': align, 'font-size': titleFontSize}">{{title}}
            <Tooltip v-if="showTitleTooltip"
                :content="toolTipContent"
                placement="right"
                max-width="200"
                :disabled="!toolTipContent">
                <span class="iconfont icon-action_help_outline"></span>
            </Tooltip>
            <p v-if="subtitle" class="subtitle">{{subtitle}}</p>
        </p>
        <p class="num total"
            :style="{'text-align': align, 'font-size': numFontSize, 'font-weight': fontWeight}">
            {{amount | formatAmount}}
        </p>
        <div v-if="showActive" class="active-wrapper">
            <span class="active">
                <template v-if="activelimit">
                    <span>{{activeName}}</span>
                    <span class="limit-num">{{`${activeNum}`}}</span>
                    <span style="font-size: 12px;color: #666;margin-left:4px;" >{{`( 余量：${activeRemain}`}}</span>
                    <Tooltip v-if="showLimitTooltip"
                        :content="limitTipContent"
                        placement="right"
                        max-width="240"
                        :disabled="!limitTipContent">
                        <span class="iconfont icon-action_help_outline" style="vertical-align: middle;line-height: 16px;color: #666;"></span>
                        <div style="font-size: 12px;color: #666; display: inline-block;">)</div>
                    </Tooltip>

                </template>
                <template v-else>
                    <span>{{activeName}}</span>
                    <span class="num">{{activeNum | formatAmount}}</span>
                </template>
            </span>
            <span class="frozen">
                <template v-if="activelimit">
                    <span>{{frozenName}}</span>
                    <span class="limit-num">{{frozenNum}}</span>
                </template>
                <template v-else>
                    <span>{{frozenName}}</span>
                    <span class="num">{{frozenNum | formatAmount}}</span>
                </template>
            </span>
        </div>
        <Row v-if="showChange" class="change-status-wrapper">
            <Col span="8">{{changeTitle}}</Col>
            <Col span="8" v-if="isShowPercent">
                <Icon type="md-arrow-round-up" class="arrow-icon" />
                <span>{{percent}}%</span>
            </Col>
            <Col class="num">{{changeNum | formatAmount}}</Col>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: 'ViewCard',
        props: {
            shadow: {
                type: Boolean,
                default: true
            },
            showActive: {
                type: Boolean,
                default: false
            },
            showChange: {
                type: Boolean,
                default: false
            },
            showTitleTooltip: {
                type: Boolean,
                default: false
            },
            toolTipContent: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            subtitle: {
                type: String,
                default: ''
            },
            amount: {
                type: Number,
                default: 0
            },
            activeNum: {
                type: Number,
                default: 0
            },
            activeRemain: {
                default: Number
            },
            activeLimitNum: {
                default: Number
            },
            frozenNum: {
                type: Number,
                default: 0
            },
            activeName: {
                type: String,
                default: '激活'
            },
            frozenName: {
                type: String,
                default: '冻结'
            },
            activeStatus: {
                type: String,
                default: 'success'
            },
            frozenStatus: {
                type: String,
                default: 'default'
            },
            changeTitle: {
                type: String,
                default: ''
            },
            percent: {
                type: [Number, String],
                default: ''
            },
            changeNum: {
                type: Number,
                default: 0
            },
            align: {
                type: String,
                default: ''
            },
            titleFontSize: {
                type: String,
                default: '14px'
            },
            numFontSize: {
                type: String,
                default: '24px'
            },
            fontWeight: {
                type: String,
                default: 'bold'
            },
            activelimit: {
                type: Boolean,
                default: false
            },
            limitColor: {
                type: String,
                default: '#19be6b'
            },
            showLimitTooltip: {
                type: Boolean,
                default: false
            },
            limitTipContent: {
                type: String
            }
        },
        computed: {
            isShowPercent() {
                return this.percent || `${this.percent}`;
            }
        },
        methods: {
            // 点击卡片
            handleClick() {
                this.$emit('handle-click');
            }
        }
    };
</script>

<style lang="less" scoped>
.view-card-wrapper {
    border: 1px solid rgb(233, 233, 233);
    padding: 24px 24px 0;
    font-family: 'PingFangSC-Regular';
    // box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20);
    box-shadow: 0 0 5px rgba(0,0,0,.05);
    &:hover{
        box-shadow: 0 0 5px rgba(0,0,0,.2);
    }
    .title {
        font-size: 14px;
    }
    .num {
        color: #17233D;
    }
    .total {
        padding: 8px 0 18px;
        font-size: 24px;
        font-weight: bold;
    }
    .subtitle {
        text-align: left;
        line-height: 20px;
    }
    .active-wrapper,
    .change-status-wrapper {
        border-top: 1px solid #E7E9EB;
        padding: 16px 0;
        text-align: left;
        .num {
            font-weight: bold;
            padding-left: 8px;
        }
        .active {
            padding-right: 32px;
        }
        .limit-num {
            padding-left: 8px;
            font-weight: bold;
        }
    }
    .change-status-wrapper {
        .ivu-col:first-child {
            text-align: left;
        }
        .arrow-icon {
            color: #5cb85c;
        }
    }
}
</style>
