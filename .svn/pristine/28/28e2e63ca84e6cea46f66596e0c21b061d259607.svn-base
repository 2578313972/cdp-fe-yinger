<template>
    <div class="mask-bg">
        <edit-title :isShowBtn="false" title="审核详情"></edit-title>
        <div class="custom-dialog-content">
            <div class="dialog-padding20">
                <Card dis-hover>
                    <p slot="title">基本信息</p>
                    <Row>
                        <Col span="8">审核内容：{{statusConfig[auditInfo.title]}}</Col>
                        <Col span="8">名称：{{auditInfo.res_name}}</Col>
                        <Col span="8">申请人：{{auditInfo.submiter_name}}</Col>
                    </Row>
                    <Row class="mt10" v-if="auditInfo.review_type!=='export_crowd'">
                        <Col span="8">是否重算：{{auditInfo.need_recalc ? '是' : '否'}}</Col>
                        <Col v-if="auditInfo.res_type==='trait'" span="8">类型：{{auditInfo.data_type_name}}</Col>
                        <Col v-if="auditInfo.res_type==='trait'" span="8">
                            <div class="fl">配置：</div>
                            <div class="fl text-hide" style="padding-left:12px;width:85%;">
                                <StrategyExpression :configData="auditInfo.expression"></StrategyExpression>
                            </div>
                        </Col>
                    </Row>
                    <template v-if="auditInfo.res_type === 'crowd' && auditInfo.review_type==='export_crowd'">
                        <Row class="mt10">
                            <Col span="24">导出特性：{{auditInfo.res_data.export_config || '--'}}</Col>
                        </Row>
                        <Row class="mt10">
                            <Col span="6">导出模式：{{auditInfo.exportType}}</Col>
                            <Col span="18" v-if="auditInfo.res_data.export_cycle!=='once'">截止日期：{{auditInfo.res_data.calc_deadline | timeLize}}</Col>
                        </Row>
                        <Row class="mt10">
                            <Col span="24">导出文件下载方式：
                                <span>{{auditInfo.downloadType}}</span>
                            </Col>
                        </Row>
                    </template>
                </Card>
                <!-- 人群 -->
                <div v-if="auditInfo.res_type==='crowd' && auditInfo.review_type!=='export_crowd'" class="strategy-crowd">
                    <Card dis-hover v-if="auditInfo.res_data.trigger">
                        <p slot="title">更新方式</p>
                        <crowd-update
                            :value="auditInfo.res_data.trigger">
                        </crowd-update>
                    </Card>
                    <Card
                        v-if="auditInfo.res_data.conditions && auditInfo.res_data.conditions.length"
                        dis-hover
                        style="margin-top:16px">
                        <p slot="title">筛选条件</p>
                        <Condition
                            :isReadOnly='true'
                            :value="auditInfo.res_data.conditions"
                            :logic-type="auditInfo.res_data.condition_logic_type">
                        </Condition>
                    </Card>
                    <div v-show="!isEdit" class="overlay"></div>
                </div>
                <!-- 特性 -->
                <div v-if="auditInfo.res_type==='trait'&& strategies && strategies.length" class="strategy-trait">
                    <div v-if="auditInfo.res_data && auditInfo.res_data.strategies&& auditInfo.res_data.strategies.length">
                        <div class="trigger_title">
                            <span class="weight">触发方式：</span>
                            <span>
                                当 {{triggerParent.trigger_type=='event'?'事件到达时':'引用的特性变化'}} 触发更新，保留
                            </span>
                            <span v-if="triggerParent.trait_update_type=='latest'">末次值</span>
                            <span v-if="triggerParent.trait_update_type=='first'">首次值</span>
                            <span v-if="triggerParent.trait_update_type=='accumulate'">累积值</span>
                        </div>
                        <div style="padding:16px;">
                            <Timeline>
                                <TimelineItem v-for="(strategy, straIndex) in strategies" :key="straIndex">
                                    <span class="time" v-if="straIndex==0">触发后，将按顺序执行以下更新规则，直到有效赋值</span>
                                    <span class="time" v-if="straIndex>0">如果以上规则无效，则继续执行</span>
                                    <Card class="strategy-card mt10" :class="{'no-paddinng-border':strategyHideStatus[straIndex]}" dis-hover :key="straIndex">
                                        <p slot="title">
                                            <span>规则{{straIndex + 1}}</span>
                                            <span class="title-des">{{strategy.description}}</span>
                                        </p>
                                        <p slot="extra">
                                            <Icon type="ios-arrow-down" @click="isShow(straIndex)" :class="{'title-show': true, 'up': strategyHideStatus[straIndex]}"/>
                                        </p>
                                        <collapse-transition>
                                            <div v-show="!strategyHideStatus[straIndex]">
                                                    <p class="name">满足以下条件：</p>
                                                    <Row class="mb20 pl20">
                                                        <Col>
                                                            <Condition
                                                                :isReadOnly='true'
                                                                :triggerParent="triggerParent"
                                                                :value="strategy.conditions"
                                                                :event="strategy.trigger&&strategy.trigger.trigger_type == 'event' && !!strategy.trigger.trigger_code ? {code: strategy.trigger.trigger_code, name: strategy.trigger.trigger_name} : null"
                                                                :logic-type="strategy.condition_logic_type">
                                                            </Condition>
                                                        </Col>
                                                    </Row>
                                                    <Row type="flex" align="middle" class="action-part">
                                                        <Col class="name">执行更新：</Col>
                                                        <Col style="flex:1">
                                                            <ExpressControl
                                                                :triggerParent="triggerParent"
                                                                :value="strategy.action"
                                                                result-type-code="Void">
                                                            </ExpressControl>
                                                        </Col>
                                                    </Row>
                                                <div v-show="!isEdit" class="overlay"></div>
                                            </div>
                                        </collapse-transition>
                                    </Card>
                                </TimelineItem>
                            </Timeline>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import editTitle from '@/components/EditTitle';
    import CrowdUpdate from '@/views/user/crowd/strategy/Update'; // 策略更新方式-人群
    import StrategyExpression from '@/components/StrategyExpression';
    // 触发方式-特性
    export default {
        data() {
            return {
                statusConfig: this.$config.status_config,
                strategyHideStatus: {
                    default() {
                        return {};
                    }
                },
                auditInfo: {},
                dataList: [{
                    action: {},
                    trigger: {},
                    conditions: [],
                    condition_logic_type: 'and'
                }],
                isEdit: false
            };
        },
        props: {
            auditId: { // 审核id
                type: [String, Number]
            },
            auditType: { // 类型，crowd,trait,audit。
                type: [String],
                default: ''
            }
        },
        components: {
            editTitle,
            StrategyExpression,
            CrowdUpdate
        },
        computed: {
            strategies() {
                return this.$lodash.map(this.auditInfo.res_data.strategies, (strategy) => {
                    if (!strategy.description) {
                        if (strategy.trigger && strategy.trigger.trigger_type == 'event') strategy.description = `当事件（${strategy.trigger.trigger_name}）到达时触发更新`;
                        else strategy.description = '';
                    }
                    return strategy;
                });
            },
            eventTriggerList() {
                return this.strategies.map(item => [{
                    code: item.trigger.trigger_code,
                    name: item.trigger.trigger_name
                }]);
            },
            triggerParent() {
                return {
                    trigger_type: this.auditInfo.res_data.trigger_type || '',
                    trait_update_type: this.auditInfo.res_data.trait_update_type || ''
                };
            }
        },
        methods: {
            isShow(index) {
                this.strategyHideStatus = this.$lodash.cloneDeep(this.strategyHideStatus);
                this.strategyHideStatus[index] = this.$lodash.cloneDeep(!this.strategyHideStatus[index]);
            },
            // 获取审核详情
            getDetailData() {
                let apiUrl = '';
                let params = {};
                if (this.auditType === 'audit') { // 审核的审核详情
                    apiUrl = `/api/audit/${this.auditId}`;
                    params = {};
                } else { // 人群或特性策略的审核详情
                    apiUrl = `/api/audit/${this.auditId}/audit/detail`;
                    params = { resource_type: this.auditType };
                }
                this.$axios.get(`${this.$config.apiDomain}${apiUrl}`, { params })
                    .then(({ data }) => {
                        this.auditInfo = data;
                        this.auditInfo.res_property = JSON.parse(this.auditInfo.res_property || '{}');
                        this.auditInfo.res_data = JSON.parse(this.auditInfo.res_data || '{}');
                        this.dataList = _.cloneDeep(this.auditInfo.res_data);
                        // 特性-配置显示
                        if (this.auditInfo.res_type === 'trait') {
                            const strExp = this.auditInfo.res_property;
                            this.auditInfo.data_type_name = this.$config.status_config[strExp.data_type];
                            this.auditInfo.expression = strExp;
                        }
                        // 人群导出配置显示
                        if (this.auditInfo.res_type === 'crowd' && this.auditInfo.review_type === 'export_crowd') {
                            const detail = this.auditInfo.res_data;
                            // 导出模式
                            const exportCycle = this.statusConfig[detail.export_cycle];
                            let date = '';
                            switch (detail.frequency) {
                            case 'daily':
                                date = '';
                                break;
                            case 'weekly':
                                date = detail.range;
                                break;
                            case 'monthly':
                                date = detail.range === 'L' ? '最后一天' : `${detail.range}号`;
                                break;
                            default:
                                break;
                            }
                            const frequent = detail.export_cycle === 'once' ? '' : `（${this.statusConfig[detail.frequency]}${date}）`;
                            this.auditInfo.exportType = `${exportCycle}${frequent}`;
                            // 下载方式
                            const transArr = detail.download_type.map((item) => {
                                let tempMsg;
                                if (item === 'auto') {
                                    tempMsg = `${this.statusConfig[item]}（可下载的外部系统账号：${detail.notice_accounts}）`;
                                } else {
                                    tempMsg = this.statusConfig[item];
                                }
                                return tempMsg;
                            });
                            this.auditInfo.downloadType = transArr.join('，');
                        }
                    })
                    .catch(() => {
                    });
            }
        },
        mounted() {
            this.getDetailData(); // 审核详情
        }
    };
</script>

<style lang="less">
    .item-box .pl5 {
        padding-left: 5px;
    }
    .title-des{
        font-size: 12px;
        font-weight:500;
        color:#808695;
        padding-left: 10px;
    }
    .overlay{
        position:absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        cursor:not-allowed;
        background-color: rgba(255, 255, 255, 0);
        z-index: 3;
        border-radius: 4px;
    }
    .strategy-crowd{
        margin: 16px 0 0;
        position: relative;
    }
    .strategy-trait{
        margin: 16px 0 0;
        position: relative;
        background: #fff;
        border: 1px solid #e8eaec;
        border-radius: 4px;
        overflow: hidden;
        .name{
            font-weight: 700;
            line-height: 30px;
        }
    }
    .action-part{
        padding-top: 16px;
        border-top: 1px #e8eaec dashed;
    }
    .title-show{
        font-size:18px;
        cursor: pointer;
        z-index: 4;
        position: relative;
        &.up{
            transform: rotate(-90deg);
        }
        -webkit-transition: transform .20s ease .1s;
    }
    .trigger_title{
        background: #fff;
        border-bottom: 1px solid #e8eaec;
        line-height: 50px; text-indent: 16px;
        .weight{
            color: #17233d;
            font-size: 14px;
            font-weight: 700;
        }
    }
</style>
