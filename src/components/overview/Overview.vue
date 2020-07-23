<template>
    <Card dis-hover :bordered="false" :padding="0" class="overview-tab">
        <Row class="channel-overview">
            <Col :span="24/Object.keys(channelInfo).length" v-for="(item,key) in channelInfo" :key="key">
                <view-card  class="channel-card"
                    :shadow="false"
                    :title="item.title"
                    :amount="item.total"
                    showActive
                    :activeNum="item.active"
                    :frozenNum="item.freeze"
                    :activeName="item.activeName"
                    :frozenName="item.frozenName"
                    :activeStatus="item.activeStatus"
                    :frozenStatus="item.frozenStatus"
                    :activeRemain="item.active_remain"
                    :activelimit="!!item.active_limitation"
                    :activeLimitNum="item.active_limitation"
                    :showLimitTooltip="item.showLimitTooltip"
                    :limitTipContent="item.limitTipContent"
                    :limitColor="item.color"
                    showTitleTooltip
                    :toolTipContent="item.toolTipContent"
                    @handle-click="handleClick(item.to)"
                    ></view-card>
            </Col>
        </Row>
    </Card>
</template>
<script>
    import ViewCard from '@/components/ViewCard.vue';

    export default {
        name: 'OverviewTab',
        components: {
            ViewCard
        },
        props: {
            tabTitle: {
                type: String,
                default: '标题'
            },
            traitTooltip: {
                type: String,
                default: ''
            },
            crowdTooltip: {
                type: String,
                default: ''
            },
            auditTooltip: {
                type: String,
                default: ''
            }
        },
        created() {
            this.getData();
            this.getAuditNum();
        },
        data() {
            return {
                auditNum: 0,
                colorArr: ['#19be6b', '#f90', '#ed4014'],
                channelInfo: {
                    trait: {
                        title: '特性',
                        total: 0,
                        active: 0,
                        freeze: 0,
                        to: 'trait',
                        toolTipContent: this.traitTooltip,
                        active_limitation: 0,
                        active_remain: 0,
                        showLimitTooltip: true,
                        limitTipContent: '指渠道内可激活特性的剩余数量',
                        color: '#19be6b'
                    },
                    crowd: {
                        title: '人群',
                        total: 0,
                        active: 0,
                        freeze: 0,
                        to: 'crowd',
                        toolTipContent: this.crowdTooltip,
                        active_limitation: 0,
                        active_remain: 0,
                        showLimitTooltip: true,
                        limitTipContent: '指渠道内可激活人群的剩余数量',
                        color: '#19be6b'
                    },
                    audit: {
                        title: '待审核',
                        total: 0,
                        active: 0,
                        freeze: 0,
                        activeName: '人群',
                        frozenName: '特性',
                        activeStatus: 'processing',
                        frozenStatus: 'success',
                        to: 'channelaudit',
                        toolTipContent: this.auditTooltip
                    }
                }
            };
        },
        methods: {
            // 点击卡片跳转到相应页面
            handleClick(to) {
                let params = {
                    name: to
                };
                if (to === 'channelaudit') {
                    params = Object.assign({}, params, {
                        params: {
                            status: 'pending'
                        }
                    });
                }
                this.$router.push(params);
            },
            // 获取特性/人群概览数据
            getData() {
                const url = `${this.$config.apiDomain}/board/resources/preview`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        const keyArr = Object.keys(this.channelInfo);
                        keyArr.forEach((item) => {
                            const itemData = data[item];
                            if (itemData && itemData.active_percentage) {
                                const percent = itemData.active_percentage;
                                if (percent >= 0 && percent <= 80) {
                                    itemData.color = this.colorArr[0];
                                    // itemData.limitTipContent = this.setTipContent(item, 0);
                                } else if (percent > 80 && percent < 100) {
                                    itemData.color = this.colorArr[1];
                                    // itemData.limitTipContent = this.setTipContent(item, 1);
                                } else if (percent >= 100) {
                                    itemData.color = this.colorArr[2];
                                    // itemData.limitTipContent = this.setTipContent(item, 2);
                                } else {
                                    itemData.color = this.colorArr[0];
                                    // itemData.limitTipContent = this.setTipContent(item, 0);
                                }
                            }
                            this.channelInfo[item] = Object.assign(this.channelInfo[item], data[item]);
                        });
                    });
            },
            setTipContent(type, stage) {
                const arr = {
                    trait: '特性',
                    crowd: '人群'
                };
                let tip = '';
                switch (stage) {
                case 0:
                    tip = `渠道内激活的${arr[type]}总数占渠道${arr[type]}总数的80%以下，此时渠道内激活${arr[type]}数量处于正常状态`;
                    break;
                case 1:
                    tip = `渠道内激活的${arr[type]}总数占渠道${arr[type]}总数的80%~100%，此时渠道内激活${arr[type]}数量已经接近饱和。系统离线更新特性人群的时间可能较长`;
                    break;
                case 2:
                    tip = `渠道内激活的${arr[type]}总数达到或超过渠道限定可激活${arr[type]}数，此时渠道内激活${arr[type]}数量已经非常饱和。系统离线更新特性人群的时间可能会很长`;
                    break;
                default:
                    break;
                }
                return tip;
            },
            // 获取待审核数
            getAuditNum() {
                const url = `${this.$config.apiDomain}/board/audit/number`;
                const params = {
                    audit_status: 'pending'
                };
                this.$axios
                    .get(url, {
                        params
                    })
                    .then(({ data }) => {
                        data = data || {};
                        data.details = data.details || {};
                        this.channelInfo.audit = Object.assign({}, this.channelInfo.audit, {
                            total: data.total || 0,
                            active: data.details.crowd || 0,
                            freeze: data.details.trait || 0
                        });
                    });
            }
        }
    };
</script>
<style lang="less" scoped>
.overview-tab {
    background: #F1F2F4;
    .channel-overview {
        .ivu-col {
            padding-right: 24px;
            &:last-child {
                padding-right: 0;
            }
        }
        .channel-card {
            cursor: pointer;
        }
    }
}
</style>
