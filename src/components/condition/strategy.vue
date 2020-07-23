
<template>
    <div class="main-strategy">
<!--
        <div>
            <Button type="primary" @click="commit">修改</Button>
        </div> -->
        <div class="strategy-list">
            <Card class="strategy-card card-nopadding" :class="{'no-paddinng-border':strategyHideStatus[straIndex]}" dis-hover v-for="(strategy, straIndex) in dataList" :key="straIndex">
                <!--
                <p slot="title">
                    <span>策略1{{straIndex + 1}}</span>
                    <span class="title-des">{{!strategy.description ? "没有策略" : strategy.description }}</span>
                </p>
                <p slot="extra">
                    <Icon v-role-button="`strategy_trait_button_${tabView}`" type="ios-trash" @click="() => !isEdit ? null: removeStrategy(straIndex, strategy)" :class="{'title-trash': true, 'disabled': !isEdit}"/>
                    <Icon type="ios-arrow-down" @click="isShow(straIndex)" :class="{'title-show': true, 'up': strategyHideStatus[straIndex]}"/>
                </p>
                -->
                <collapse-transition>
                    <div v-show="!strategyHideStatus[straIndex]" class="strategy-body">
                        <!-- <Card dis-hover >
                            <p slot="title">选择触发方式</p>
                            <Trigger
                                :disabled="!isEdit"
                                :group="group"
                                :groupTrait="canSelectGroupTrait"
                                :selfTrait="canSelectSelfTrait"
                                :trait="curTrait"
                                :value="strategy.trigger"
                                :eventList="eventList"
                                @on-change="updateTrigger($event, straIndex)">
                            </Trigger>
                        </Card> -->
                        <!-- <Card class="mt10 mb10" dis-hover>
                            <p slot="title">设置判断条件（可选）</p> -->
                            <MyCondition
                                :name="'策略' + (straIndex + 1)"
                                :strategy="strategy"
                                :value="strategy.conditions"
                                :group="group"
                                :isReadOnly="false"
                                :publicTrait="canSelectPublicTrait"
                                :groupTrait="canSelectGroupTrait"
                                :selfTrait="canSelectSelfTrait"
                                :logic-type="strategy.condition_logic_type"
                                @on-change="updateConditions($event, straIndex)"
                                @on-change-logic-type="updateLogicType($event, straIndex)">
                            </MyCondition>
                        <!-- </Card> -->

                        <!-- <Card dis-hover>
                            <p slot="title">设置更新操作</p>
                            <ExpressControl
                                :key="strategy.action.id"
                                :event="strategy.trigger.trigger_type == 'event' && !!strategy.trigger.trigger_code ? {code: strategy.trigger.trigger_code, name: strategy.trigger.trigger_name} : null"
                                :group="group"
                                :value="strategy.action"
                                result-type-code="Void"
                                :groupTrait="canSelectGroupTrait"
                                :selfTrait="canSelectSelfTrait"
                                :publicTrait="canSelectPublicTrait"
                                @on-change="updateAction($event, straIndex)"
                            ></ExpressControl>
                        </Card> -->

                        <div v-show="!isEdit" class="overlay"></div>
                    </div>
                </collapse-transition>
                <!-- {{strategy}} -->
            </Card>
            <Button v-role-button="`strategy_trait_button_${tabView}`" :disabled="!isEdit" type="primary" icon="md-add" @click="addStrategy" style="margin:20px 0;">添加策略</Button>
        </div>
        <Drawer v-model="showAuditDetail" width="1000" :mask-closable="false">
            <audit-detail v-if="showAuditDetail" :auditId="trait.id" :auditType="`trait`"></audit-detail>
        </Drawer>
    </div>
</template>

<script>
    import _ from 'lodash';
    import auditDetail from '@/components/AuditDetail'; // 查看审核详情
    import strategyModel from '@/components/strategy';
    import MyCondition from './MyCondition.vue';

    const { Expression } = strategyModel;
    const traitTriggerCmp = function (trigger, other) {
        if (_.isEqual(trigger, other)) {
            return true;
        }

        if (!!trigger != !!other) {
            return false;
        }

        if (!!trigger && trigger.trigger_type == other.trigger_type
            && trigger.trigger_code == other.trigger_code
            && trigger.expression == other.expression) {
            if (!(trigger.expression instanceof Expression)) {
                trigger.expression = new Expression(trigger.expression);
            }
            if (!_.isNil(trigger.expression) && trigger.expression.isEqual(new Expression(other.expression))) {
                return true;
            }
        }
        return false;
    };
    const traitConditionCmp = function (condition, other) {
        if (_.isEqual(condition, other)) {
            return true;
        }
        if (!!condition != !!other) {
            return false;
        }
        // 俩都存在或者都不存在才会走到这里。所以当action存在的时候比对，其他就是都不存在，直接返回true
        if (condition) {
            if (!(condition instanceof Expression)) {
                condition = new Expression(condition);
            }
            return condition.isEqual(new Expression(other));
        }
        return false;
    };
    const traitActionCmp = function (action, other) {
        if (_.isEqual(action, other)) {
            return true;
        }
        if (!!action != !!other) {
            return false;
        }
        // 俩都存在或者都不存在才会走到这里。所以当action存在的时候比对，其他就是都不存在，直接返回true
        if (action) {
            if (!(action instanceof Expression)) {
                action = new Expression(action);
            }

            return action.isEqual(new Expression(other));
        }
        return false;
    };
    const traitStrategyCmp = function (strategy, other) {
        if (_.isEqual(strategy, other)) {
            return true;
        }
        if (!!strategy != !!other) {
            return false;
        }
        let result = traitTriggerCmp(strategy.trigger, other.trigger);
        if (!result) {
            console.log('trigger cmp false');
            return false;
        }

        if (strategy.conditions) {
            if (!other.conditions) {
                return false;
            }
            if (strategy.conditions.length != other.conditions.length) {
                console.log('conditions size cmp false');
                return false;
            }
        }

        // 切换 且/或 时
        if (strategy.condition_logic_type != other.condition_logic_type) {
            return false;
        }

        for (let i = 0; i < strategy.conditions.length; i++) {
            const condition = strategy.conditions[i];
            const otherCondition = other.conditions[i];
            result = traitConditionCmp(condition, otherCondition);
            if (!result) {
                console.log('conditions cmp false');
                return false;
            }
        }

        result = traitActionCmp(strategy.action, other.action);
        console.log('trait action cmp = ', result);
        return result;
    };
    const defaultEmptyStrategy = {
        description: '空策略',
        action: {},
        trigger: {
            trigger_type: 'event'
        },
        conditions: [],
        condition_logic_type: 'and'
    };
    const strategyObjectToModel = curTrait => (strategy) => {
        const curActionObjValue = [curTrait.code];
        if (!strategy.description) {
            if (strategy.trigger.trigger_type == 'event') strategy.description = '当事件到达时触发';
            else if (strategy.trigger.trigger_type == 'trait') strategy.description = '当特性变化时触发';
            else if (strategy.trigger.trigger_type == 'time') strategy.description = '当时间到期时触发';
            else strategy.description = 'test';
        }
        const conditions = strategy.conditions.map(condition => new Expression(condition));
        return {
            ...strategy,
            conditions,
            action: !!strategy.action
                && !!strategy.action.object
                && _.isEqual(strategy.action.object.value, curActionObjValue)
                ? new Expression(strategy.action) : new Expression(curTrait, {}, [], 'Void') // 默认action的object为本特性或者人群
        };
    };
    export default {
        props: {
            tabView: {
                type: String,
                default: ''
            },
            group: {
                type: Object,
                default() {
                    return {};
                }
            },
            trait: {
                type: Object,
                default() {
                    return {};
                }
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            // 当前目录名称
            traitAscription: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                isRecalc: false, // 是否凌晨重计算
                titleData: [{
                    title: '选择触发方式',
                    name: 'Trigger',
                    interviewName: 'trigger'
                }, {
                    title: '设置判断条件（可选）',
                    name: 'Condition',
                    interviewName: 'conditions',
                    conditionRelation: this.condition_logic_type
                }, {
                    title: '设置更新操作',
                    name: 'Update',
                    interviewName: 'action'
                }],
                dataList: null,
                showStrategy: false,
                strategyHideStatus: {
                    default() {
                        return {};
                    }
                },
                dataListBack: null,
                showAuditDetail: false, // 查看审核详情
                eventList: [],
                eventListError: false
            };
        },
        computed: {
            hasChanged() {
                // 切换 在修改后清空数据并重新计算时
                if (this.isRecalc) return true;

                for (let i = 0; i < this.dataList.length; i++) {
                    const other = this.dataListBack[i];
                    const result = traitStrategyCmp(this.dataList[i], other);
                    if (!result) {
                        return true;
                    }
                }
                if (this.dataList.length !== this.dataListBack.length) {
                    return true;
                }
                return false;
            },
            curTrait() {
                return {
                    ...this.trait
                };
            },
            sumitLabel() {
                return this.trait.lifecycle_status == 'freeze' ? '保存' : '提交审核';
            },
            canSelectGroupTrait() {
                if (!!this.curTrait && this.curTrait.visibility == 'group' && this.curTrait.data_type && !~this.curTrait.data_type.indexOf('TimeLine')) {
                    return true;
                }
                return false;
            },
            canSelectSelfTrait() {
                if (!!this.curTrait && this.curTrait.visibility == 'self'
                    && this.curTrait.data_type
                    && !~this.curTrait.data_type.indexOf('TimeLine')) {
                    return true;
                }
                return false;
            },
            canSelectPublicTrait() {
                if (!!this.curTrait && !!this.curTrait.data_type && !!~this.curTrait.data_type.indexOf('TimeLine')) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            init() {
                this.getEventList().then(({ data }) => {
                    this.eventList = data.items;
                }).catch(() => {});
            },
            // 获取事件触发list
            getEventList() {
                return this.$axios.get(`${this.$config.apiDomain}/events`, {
                    params: {
                        size: -1
                    }
                });
            },

            // 添加策略
            addStrategy() {
                if (this.dataList.length >= 20) {
                    this.$Message.destroy();
                    this.$Message.error('最多支持20条策略');
                    return;
                }

                this.getEventList().then(({ data }) => {
                    this.eventList = data.items;
                    this.dataList = [...this.dataList, strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                }).catch(() => {});
            },
            removeStrategy(index) {
                this.dataList.splice(index, 1);
            },

            // 修改
            edit() {
                this.isEdit = true;
            },

            // 取消
            cancel() {
                this.isEdit = false;
                this.isRecalc = false;
                this.dataList = _.cloneDeep(this.dataListBack);
            },

            isShow(index) {
                this.dataList = _.cloneDeep(this.dataList);
                this.strategyHideStatus[index] = this.$lodash.cloneDeep(!this.strategyHideStatus[index]);
            },

            // 提交
            commit() {
                const _ = this.$lodash;
                if (!this.hasChanged) {
                    // 没有修改，不做任何操作。
                    return;
                }
                console.log('this.curTrait', this.curTrait);
                // if(!this.curTrait || !this.curTrait.code){
                //     this.$Message.destroy();
                //     this.$Message.error('curTrait code is null');
                //     return;
                // }
                const checkPass = _.filter(this.dataList, this.strategyVerify);
                if (checkPass.length != this.dataList.length) {
                    return;
                }
                // 提交修改
                // console.log(JSON.stringify(this.dataList));
                // this.$axios.put(`${this.$config.apiDomain}/traits/${this.curTrait.code}/strategies?is_recalc=${this.isRecalc}`,this.dataList)
                this.$api.trait.modifyTraitStrategies(this.curTrait.code, this.isRecalc, this.dataList)
                    .then((traitInfo) => {
                        // 这里直接调用的cancle是不对的。需要把提交后的数据展示出来。
                        this.$emit('on-change-trait', traitInfo);
                        this.cancel();
                        this.$Message.destroy();
                        this.$Message.success(`${this.sumitLabel}成功`);
                    }).catch(() => {});
            },
            strategyVerify(strategy) {
                const _ = this.$lodash;
                if (!strategy || !strategy.trigger || !strategy.conditions || !strategy.action) {
                    this.$Message.destroy();
                    this.$Message.error('策略不完整');
                    return false;
                }
                if (strategy.conditions.length > 1 && (!strategy.condition_logic_type || !~['and', 'or'].indexOf(strategy.condition_logic_type))) {
                    this.$Message.error('没有策略的逻辑关系或者不正确的逻辑关系');
                    return false;
                }
                // 条件完整性判断
                const unPassConditions = _.filter(strategy.conditions, (condition) => {
                    if (condition instanceof Expression) {
                        return !condition.check();
                    }
                    const conditionExpression = new Expression(condition);
                    return !conditionExpression.check();
                });
                if (unPassConditions.length > 0) {
                    this.$Message.destroy();
                    this.$Message.error('条件表达式有问题');
                    return false;
                }

                // 更新策略完整性判断
                let actionCheck = false;
                if (strategy.action instanceof Expression) {
                    actionCheck = strategy.action.check();
                } else {
                    const actionExpression = new Expression(strategy.action);
                    actionCheck = actionExpression.check();
                }
                if (!actionCheck) {
                    this.$Message.destroy();
                    // this.$Message.error('action策略不完整')
                    this.$Message.error('策略不完整');
                    return false;
                }

                // trigger
                const trigger = strategy.trigger;
                if (!trigger.trigger_type || ['trait', 'event', 'time'].indexOf(trigger.trigger_type) == -1) {
                    this.$Message.destroy();
                    this.$Message.error('触发类型不存在或不允许的类型');
                    return false;
                }
                if (((trigger.trigger_type == 'trait' || trigger.trigger_type == 'event') && !trigger.trigger_code)
                    || (trigger.trigger_type == 'time' && !trigger.expression)
                ) {
                    this.$Message.destroy();
                    this.$Message.error('触发规则不完整');
                    return false;
                }
                if (trigger.trigger_type == 'time') {
                    const triggerExpression = trigger.expression instanceof Expression ? trigger.expression : new Expression(trigger.expression);
                    if (!triggerExpression.check()) {
                        this.$Message.destroy();
                        this.$Message.error('时间触发规则配置不完整');
                        return false;
                    }
                }

                return true;
            },
            updateTrigger(trigger, index) {
                const strategy = this.$lodash.cloneDeep(this.dataList[index]);
                if (strategy) {
                    const lastTrigger = strategy.trigger;
                    // const lastAction = strategy.action;
                    strategy.trigger = trigger;
                    if (trigger.trigger_type == 'event' || lastTrigger.trigger_type == 'event') {
                        strategy.conditions = [];
                        strategy.action = null;
                    }
                }
                this.setStrategy(strategy, index);
            },
            updateConditions(conditions, index) {
                const strategy = this.$lodash.cloneDeep(this.dataList[index]);
                if (strategy) {
                    strategy.conditions = conditions;
                }
                this.setStrategy(strategy, index);
            },
            updateLogicType(logicType, index) {
                const strategy = this.$lodash.cloneDeep(this.dataList[index]);
                if (strategy) {
                    strategy.condition_logic_type = logicType;
                }
                this.setStrategy(strategy, index);
            },
            updateAction(expression, index) {
                const strategy = this.$lodash.cloneDeep(this.dataList[index]);
                if (strategy) {
                    strategy.action = expression;
                }
                this.setStrategy(strategy, index);
            },
            setStrategy(strategy, index) {
                this.$set(this.dataList, index, strategyObjectToModel(this.curTrait)(strategy));
            // this.dataList = _.cloneDeep(this.dataList)
            },

            // 特性审核详情
            auditDetail() {
                this.showAuditDetail = true;
            }
        },
        watch: {
            trait() {
                this.cancel();
                if (this.trait.strategies && this.trait.strategies.length) {
                    this.dataList = _.map(this.trait.strategies, strategyObjectToModel(this.curTrait));
                    this.dataListBack = _.cloneDeep(this.dataList);
                } else {
                    this.dataList = [strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                    this.dataListBack = _.cloneDeep(this.dataList);
                }
            }
        },
        components: {
            MyCondition,
            auditDetail
        },
        mounted() {
            this.init();

            if (this.trait.strategies && this.trait.strategies.length) {
                this.dataList = _.map(this.trait.strategies, strategyObjectToModel(this.curTrait));
                this.dataListBack = _.cloneDeep(this.dataList);
            } else {
                this.dataList = [strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                this.dataListBack = _.cloneDeep(this.dataList);
            }
        }
    };
</script>

<style scoped lang="less">
    .main-strategy{
        .strategy-edit-box{
            display:flex;
            justify-content:flex-end;
            line-height: 30px;
        }
        .title-des{
            font-size:12px;
            font-weight:500;
            color:#808695;
            padding-left: 10px;
        }
        .title-trash{
            font-size:18px;
            margin-right:10px;
            cursor: pointer;
            color: red;
            &.disabled{
                cursor:not-allowed;
                color: gray;
            }
        }
        .title-show{
            font-size:18px;
            cursor: pointer;
            &.up{
                transform: rotate(-90deg);
            }
            -webkit-transition: transform .20s ease .1s;
            // transition-duration: 5ms;
            // transition-property: transform torate;
            // transition-timing-function:ease;

        }
        .strategy-list{
            position: relative;
            .strategy-card {
                border: 0 none;
                .collapse-enter-active, .collapse-leave-active{
                    transition: all .5s;
                }
                .collapse-enter, .collapse-leave-to /* .fade-leave-active below version 2.1.8 */ {
                    height: 0;
                }
                .strategy-body{
                    position: relative;
                }

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
        }
    }
</style>
