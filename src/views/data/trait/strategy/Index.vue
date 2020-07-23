<template>
    <div>
        <div v-if="trait.cross_channel_auth_info">
            <cross-channel :cross_channel="trait.cross_channel_auth_info"></cross-channel>
        </div>
        <div v-else class="main-strategy">
            <Row class="strategy-title-box" type="flex" justify="space-between" align="middle">
                <Col style="position:relative">
                    <Row type="flex" justify="start">
                        <div>
                            <span class="strategy-trigger-type">触发方式：</span>
                        </div>
                        <div v-if="!isEdit&&!dataList.length">
                            <span class="strategy-trigger-type">无</span>
                        </div>
                        <div v-else>
                            <span>当</span>
                            <Select
                                v-model="triggerParent.trigger_type"
                                @on-change="updateTriggerType($event,true)"
                                :readonly="!isEdit"
                                style="width:150px;margin:0 5px;">
                                <Option value="event">事件到达时</Option>
                                <Option value="trait"
                                    v-if="canSelectTrait">引用的特性变化时
                                </Option>
                            </Select>
                            <span>触发更新</span>
                            <span v-show="triggerParent.trigger_type=='event'"> ，保留</span>
                            <Select
                                v-model="triggerParent.trait_update_type"
                                v-show="triggerParent.trigger_type=='event'"
                                @on-change="updateTriggerSaveType"
                                :readonly="!isEdit"
                                style="width:150px;margin:0 5px;">
                                <Option v-for="(val,key,idx) in triggerSave" :value="key" :key="idx">{{val}}</Option>
                            </Select>
                        </div>
                    </Row>
                    <div v-show="!isEdit" class="overlay"></div>
                </Col>
                <Col v-if="trait.audit_status">
                    <span v-if="trait.calc_status=='res_calculating'" >
                        <i class="fa fa-circle bg-calculating"></i> 重新计算中
                    </span>
                    <Button
                        v-role-button="`strategy_trait_button_${tabView}`"
                        v-if="!isEdit && !(trait.audit_status=='pending'||trait.calc_status=='res_calculating')"
                        type="primary"
                        class="ml10"
                        @click="edit">修改
                    </Button>
                    <div v-if="isEdit">
                        <Checkbox
                            v-if="trait.lifecycle_status=='active' && trait.calc_status!=='res_calculating'"
                            v-model="isRecalc">修改后重新计算
                        </Checkbox>
                        <Button type="primary" @click="cancel" style="margin-right:5px;">取消</Button>
                        <Button type="primary" :loading="loading" :disabled="!hasChanged" @click="commit">{{`${sumitLabel}`}}</Button>
                    </div>
                    <Button type="primary" ghost v-show="trait.audit_status == 'pending'" style="margin-left:5px" @click="auditDetail">审核详情</Button>
                </Col>
            </Row>
            <div class="strategy-list">
                <!-- 分割线 -->
                <Timeline>
                    <draggable
                        :disabled="!isSort"
                        :list="dataList"
                        class="list-group"
                        @update="datadragEnd"
                        draggable=".draggable-item"
                        ghost-class="ghost">
                            <TimelineItem class="draggable-item" v-for="(strategy, straIndex) in dataList" :key="straIndex">
                                <span class="time" v-if="straIndex==0">
                                    触发后，将按顺序执行以下更新规则，直到有效赋值
                                    <Checkbox
                                        v-model="isSort"
                                        @on-change="sort"
                                        class="ml10 "
                                        v-if="isEdit"
                                        :disabled="trait.audit_status==='pending'||trait.calc_status=='res_calculating'">启用拖拽调整顺序
                                    </Checkbox>
                                </span>
                                <span class="time" v-if="straIndex>0">如果以上规则无效，则继续执行</span>
                                <Card class="strategy-card mt10" :class="{'no-paddinng-border':strategyHideStatus[straIndex]}" dis-hover :key="straIndex">
                                    <p slot="title">
                                        <span>规则{{straIndex + 1}}</span>
                                        <span class="title-des" v-if="strategyHideStatus[straIndex]&& triggerParent.trigger_type=='event'">
                                            当事件（{{strategy.trigger.trigger_name||'无'}}）到达时触发更新
                                        </span>
                                        <span class="title-des" v-if="strategyHideStatus[straIndex] && triggerParent.trigger_type=='trait'">
                                            当引用的特性变化时触发更新
                                        </span>
                                    </p>
                                    <p slot="extra">
                                        <Icon v-role-button="`strategy_trait_button_${tabView}`" type="ios-trash" @click="() => !isEdit ? null: removeStrategy(straIndex, strategy)" :class="{'title-trash': true, 'disabled': !isEdit}"/>
                                        <Icon type="ios-arrow-down" @click="isShow(straIndex)" :class="{'pointer-event':isSort, 'title-show': true, 'up': strategyHideStatus[straIndex]}"/>
                                    </p>
                                    <collapse-transition>
                                        <div v-show="!strategyHideStatus[straIndex]" class="strategy-body">
                                            <Trigger
                                                v-if="triggerParent.trigger_type=='event'"
                                                class="mt10 mb10"
                                                :disabled="!isEdit"
                                                :group="group"
                                                :groupTrait="canSelectGroupTrait"
                                                :selfTrait="canSelectSelfTrait"
                                                :trait="curTrait"
                                                :value="strategy.trigger"
                                                :eventList="eventList"
                                                @on-change="updateTrigger($event, straIndex)">
                                            </Trigger>
                                            <p class="name">{{triggerParent.trigger_type==='event'?'并且':'当'}}满足以下条件（可选项）：</p>
                                            <Row class="mb20 pl20">
                                                <Col>
                                                    <Condition
                                                        :name="'策略' + (straIndex + 1)"
                                                        :URI="URI"
                                                        :strategy="strategy"
                                                        :value="strategy.conditions"
                                                        traitOrCrowd="trait"
                                                        :group="group"
                                                        :filterIds="filterIds"
                                                        :triggerParent="triggerParent"
                                                        :publicTrait="canSelectPublicTrait"
                                                        :groupTrait="canSelectGroupTrait"
                                                        :selfTrait="canSelectSelfTrait"
                                                        :logic-type="strategy.condition_logic_type"
                                                        @on-change="updateConditions($event, straIndex)"
                                                        @on-change-logic-type="updateLogicType($event, straIndex)">
                                                    </Condition>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" class="action-part">
                                                <Col class="name">执行更新：</Col>
                                                <Col style="flex:1">
                                                    <ExpressControl
                                                        :URI="URI"
                                                        :key="strategy.action.id"
                                                        :event="strategy.trigger&&strategy.trigger.trigger_type == 'event' && !!strategy.trigger.trigger_code ? {code: strategy.trigger.trigger_code, name: strategy.trigger.trigger_name} : null"
                                                        traitOrCrowd="trait"
                                                        :group="group"
                                                        :value="strategy.action"
                                                        :trait="trait"
                                                        result-type-code="Void"
                                                        bool-or-void="Void"
                                                        :groupTrait="canSelectGroupTrait"
                                                        :selfTrait="canSelectSelfTrait"
                                                        :publicTrait="canSelectPublicTrait"
                                                        :filterIds="filterIds"
                                                        :triggerParent="triggerParent"
                                                        @on-change="updateAction($event, straIndex)">
                                                    </ExpressControl>
                                                </Col>
                                            </Row>
                                            <div v-show="!isEdit" class="overlay"></div>
                                        </div>
                                    </collapse-transition>
                                </Card>
                            </TimelineItem>
                            <TimelineItem slot="footer"
                                color="#dcdee2"
                                v-if="isEdit&&!!triggerParent.trait_update_type&&!!triggerParent.trigger_type">
                                <Button
                                    v-role-button="`strategy_trait_button_${tabView}`"
                                    :disabled="!isEdit"
                                    type="primary"
                                    icon="md-add"
                                    @click="addStrategy"
                                    style="margin-top:-6px">添加规则
                                </Button>
                            </TimelineItem>
                    </draggable>
                </Timeline>
                <!-- 分割线 -->
            </div>
            <Drawer v-model="showAuditDetail" width="1000" :mask-closable="false">
                <audit-detail v-if="showAuditDetail" :auditId="trait.id" :auditType="`trait`"></audit-detail>
            </Drawer>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import _ from 'lodash';
    import Trigger from './Trigger'; // 触发方式
    import auditDetail from '@/components/AuditDetail'; // 查看审核详情
    import strategyModel from '@/components/strategy';
    import CrossChannel from './CrossChannel';
    // 跨渠道授权
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
        // if(!strategy.description){
        //     if(strategy.trigger.trigger_type == 'event')
        //         strategy.description = `当事件到达时触发更新`;
        //     else if(strategy.trigger.trigger_type == 'trait')
        //         strategy.description = `当特性变化时触发更新`;
        //     else if(strategy.trigger.trigger_type == 'time')
        //         strategy.description = "当时间到期时触发"
        //     else
        //         strategy.description = 'test'
        // }
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
            // 当前目录名称
            traitAscription: {
                type: String,
                default: ''
            }
        },
        data() {
            const param = {
                authorized: false
            };
            return {
                loading: false,
                isSort: false, // 是否开启排序
                isRecalc: true, // 是否凌晨重计算
                isEdit: false, // 点击了修改按钮，显示提交和取消
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
                dataList: [],
                showStrategy: false,
                strategyHideStatus: {
                    default() {
                        return {};
                    }
                },
                dataListBack: [],
                showAuditDetail: false, // 查看审核详情
                eventList: [],
                eventListError: false,
                triggerSave: {
                // "latest": "末次值",
                // "first": "首次值",
                // "accumulate": "累积值"
                },
                triggerParent: {
                    trigger_type: '', // 触发类型 event,trati
                    trait_update_type: '' // 触发类型更新方式 latest,first,accumulate
                },
                URI: {

                    searchParams: { ...param }, // 搜索的参数
                    catalogsParams: { ...param }, // 目录的参数
                    traitsParams: { ...param }, // 特性的参数
                    crowdsParams: { ...param }, // 人群的参数
                    eventsParams: { ...param } // 事件特性的参数
                }
            };
        },
        computed: {
            hasChanged() {
                // 切换 在修改后清空数据并重新计算时
                if (!this.isRecalc) return true;
                if (this.dataList.length) {
                    if (this.trait && this.trait.strategies && this.trait.strategies.trigger_type !== this.triggerParent.trigger_type) {
                        return true;
                    }
                    if (this.trait && this.trait.strategies && this.trait.strategies.trait_update_type !== this.triggerParent.trait_update_type) {
                        return true;
                    }
                }
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
            filterIds() { // 去掉自己本身，公共特性接口全部返回，前端限制不显示当前本身特性。
                return [this.trait];
            },
            sumitLabel() {
                return this.trait.lifecycle_status == 'freeze' ? '保存' : '提交审核';
            },
            canSelectGroupTrait() {
                if (!!this.curTrait && this.curTrait.visibility == 'group' && this.triggerParent.trigger_type == 'trait') {
                    return true;
                }
                return false;
            },
            canSelectSelfTrait() {
                if (!!this.curTrait && this.curTrait.visibility == 'self' && this.triggerParent.trigger_type == 'trait') {
                    return true;
                }
                return false;
            },
            canSelectPublicTrait() {
                if (this.triggerParent.trigger_type == 'event') {
                    return false;
                }
                return true;
            },
            canSelectTrait() { // 是否有“特性依赖变化”一项
                const arr = ['CounterTimeLine', 'NumberTimeLine', 'Counter'];
                if (!arr.includes(this.trait.data_type)) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            init() {
                this.getEventList().then(({ data }) => {
                    this.eventList = data.items;
                }).catch(() => {});
            },

            // 当点击启用排序时，关闭所有打开状态;禁用排序时无动作
            sort() {
                // 当选中时关闭所有状态
                this.isSort && this.dataList.map((item, index) => {
                    // this.strategyHideStatus[index] = true;
                    // if(this.strategyHideStatus[index] == null){
                    //     this.strategyHideStatus[index] = this.$lodash.cloneDeep(!this.strategyHideStatus[index]);
                    // }else if(this.strategyHideStatus[index] === false){
                    //     this.strategyHideStatus[index] = this.$lodash.cloneDeep(!this.strategyHideStatus[index]);
                    // }else{
                    //     this.strategyHideStatus[index] = this.$lodash.cloneDeep(this.strategyHideStatus[index]);
                    // }

                    const item2 = {};
                    item2[index] = true;
                    this.strategyHideStatus = Object.assign({}, this.strategyHideStatus, item2);
                });
            },
            // 拖拽更新，更新打开状态
            datadragEnd(evt) {
                let tmpState = null;
                let tmpState2 = null;
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;
                tmpState = this.$lodash.cloneDeep(this.strategyHideStatus[newIndex]);
                this.$set(this.strategyHideStatus, newIndex, this.$lodash.cloneDeep(this.strategyHideStatus[oldIndex]));
                // this.strategyHideStatus[newIndex] = this.$lodash.cloneDeep(this.strategyHideStatus[oldIndex]);
                if (oldIndex > newIndex) {
                    for (let sq = newIndex + 1; sq <= oldIndex; sq++) {
                        tmpState2 = this.$lodash.cloneDeep(this.strategyHideStatus[sq]);
                        this.$set(this.strategyHideStatus, sq, tmpState);
                        tmpState = tmpState2;
                    }
                } else {
                    for (let sq = (newIndex - 1); sq >= oldIndex; sq--) {
                        tmpState2 = this.$lodash.cloneDeep(this.strategyHideStatus[sq]);
                        this.$set(this.strategyHideStatus, sq, tmpState);
                        tmpState = tmpState2;
                    }
                }
            },

            updateTriggerType(e, isUpdate) { // 事件，特性触发。取最新值，去首次值，累计计算。
                // this.dataList = [strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                // this.dataList[0].trigger.trigger_type = e;
                this.dataList = [];
                this.triggerSaveList(e);
                if (isUpdate) {
                    this.triggerParent.trait_update_type = Object.keys(this.triggerSave)[0] || '';
                }
            },

            triggerSaveList(e) {
                this.triggerSave = {};
                const arr = ['CounterTimeLine', 'NumberTimeLine', 'Counter'];
                const arr1 = ['StringSet', 'Number'];
                const arr2 = ['String', 'Bool', 'Enum', 'Badge', 'Date', 'Address'];
                if (e === 'event' && arr.includes(this.trait.data_type)) {
                    this.triggerSave.accumulate = '累积值';
                }
                if (e === 'event' && arr1.includes(this.trait.data_type)) {
                    this.triggerSave.latest = '末次值';
                    this.triggerSave.first = '首次值';
                    this.triggerSave.accumulate = '累积值';
                }
                if (e === 'trait' && arr1.includes(this.trait.data_type)) {
                    this.triggerSave.latest = '末次值';
                }
                if (e === 'event' && arr2.includes(this.trait.data_type)) {
                    this.triggerSave.latest = '末次值';
                    this.triggerSave.first = '首次值';
                }
                if (e === 'trait' && arr2.includes(this.trait.data_type)) {
                    this.triggerSave.latest = '末次值';
                }
            },

            updateTriggerSaveType() {
                this.dataList = [];
            },

            // 获取事件触发list
            getEventList() {
                return this.$axios.get(`${this.$config.apiDomain}/events`, {
                    params: {
                        size: -1,
                        authorized: false
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
                const {
                    trigger_type,
                    trait_update_type
                } = this.trait.strategies || {};
                this.triggerParent = Object.assign({}, {
                    trigger_type,
                    trait_update_type
                });
                this.updateTriggerType(trigger_type, false);
                this.isSort = false;
                this.isEdit = false;
                this.isRecalc = true;
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
                if (!this.curTrait || !this.curTrait.code) {
                    this.$Message.destroy();
                    this.$Message.error('curTrait code is null');
                    return;
                }
                const checkPass = _.filter(this.dataList, this.strategyVerify);
                if (checkPass.length != this.dataList.length) {
                    return;
                }
                // 提交修改
                if (this.triggerParent.trigger_type === 'trait') {
                    this.dataList.forEach((i) => {
                        delete i.trigger;
                    });
                }
                const params = !this.dataList.length ? {} : {
                    trigger_type: this.triggerParent.trigger_type,
                    trait_update_type: this.triggerParent.trait_update_type,
                    strategies: this.dataList
                };
                this.loading = true;
                this.$api.trait.modifyTraitStrategies(this.curTrait.code, this.isRecalc, params)
                    .then((traitInfo) => {
                        this.loading = false;
                        // 这里直接调用的cancle是不对的。需要把提交后的数据展示出来。
                        this.$emit('on-change-trait', traitInfo);
                        // this.cancel();
                        this.$Message.destroy();
                        this.$Message.success(`${this.sumitLabel}成功`);
                    }).catch(() => {
                        this.loading = false;
                    });
            },
            strategyVerify(strategy) {
                const _ = this.$lodash;
                if (!strategy || !strategy.conditions || !strategy.action) {
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
                    this.$Message.error('策略不完整');
                    return false;
                }

                // trigger
                const trigger = strategy.trigger;
                if (this.trigger_type == 'event' && !trigger.trigger_code) {
                    this.$Message.destroy();
                    this.$Message.error('触发规则不完整');
                    return false;
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
                this.dataList = [];
                this.dataListBack = [];
                this.cancel();
                if (this.trait.strategies && this.trait.strategies.strategies.length) {
                    const {
                        trigger_type,
                        trait_update_type
                    } = this.trait.strategies;
                    this.updateTriggerType(trigger_type, false);
                    this.$nextTick(() => {
                        this.triggerParent = Object.assign({}, {
                            trigger_type,
                            trait_update_type
                        });
                        this.dataList = _.map(this.trait.strategies.strategies, strategyObjectToModel(this.curTrait));
                        this.dataListBack = _.cloneDeep(this.dataList);
                    });
                } else {
                    // this.dataList = [strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                    this.dataListBack = _.cloneDeep(this.dataList);
                }
            }
        },
        components: {
            draggable,
            Trigger,
            auditDetail,
            CrossChannel
        },
        mounted() {
            this.init();
            if (this.trait.strategies && this.trait.strategies.strategies.length) {
                const {
                    trigger_type,
                    trait_update_type
                } = this.trait.strategies;
                this.triggerParent = Object.assign({}, {
                    trigger_type,
                    trait_update_type
                });
                this.triggerSaveList(this.triggerParent.trigger_type); // tab切换更新保留值list。
                this.dataList = _.map(this.trait.strategies.strategies, strategyObjectToModel(this.curTrait));
                this.dataListBack = _.cloneDeep(this.dataList);
            } else {
                // this.dataList = [strategyObjectToModel(this.curTrait)(defaultEmptyStrategy)];
                this.dataListBack = _.cloneDeep(this.dataList);
            }
        }
    };
</script>

<style scoped lang="less">
    .main-strategy{
        border: 1px solid #e8eaec;
        border-radius: 4px;
        .time{
            font-weight: bold;
        }
        .strategy-title-box{
            border-bottom: 1px solid #e8eaec;
            padding: 10px 16px;
            .strategy-trigger-type{
                font-size: 14px;
                font-weight: 700;
                color: #17233d;
                line-height: 32px;
            }
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
        }
        .action-part{
            padding-top: 16px;
            border-top: 1px #e8eaec dashed;
        }
        .name{
            font-weight: 700;
            line-height: 40px;
        }
        .strategy-list{
            position: relative;
            padding: 20px 16px 0 16px;
            .strategy-card {
                .collapse-enter-active, .collapse-leave-active{
                    transition: all .5s;
                }
                .collapse-enter, .collapse-leave-to {
                    height: 0;
                }
                .strategy-body{
                    position: relative;
                }

            }

        }
        .bg-calculating{
            color: #ff9900;
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
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }
</style>
