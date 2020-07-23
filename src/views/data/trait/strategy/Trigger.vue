<template>
    <div>
        <div v-show="value.trigger_type=='event'">
            <span class="name">当</span>
            <Select
                v-if="eventList[0]&&eventList[0].code"
                :value="trigger_event_code"
                filterable
                @on-change="updateEventTriggerCode"
                placeholder="请选择事件"
                class="line-middle"
                style="width:220px;margin:0 5px;">
                <Option v-for="(item,index) in eventList" :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
            <span class="name">事件到达时，</span>
        </div>
        <div v-show="value.trigger_type=='trait'">
            <span>触发更新特性：</span>
            <TraitInput
                v-bind="$props"
                :closable="true"
                :value="trigger_trait_code"
                @on-change="updateTraitTriggerCode"
                class="line-middle"
            ></TraitInput>
        </div>
        <div v-show="value.trigger_type=='time'">
            <span>时间选择：</span>
            <ExpressControl
                result-type-code="Date"
                v-bind="$props"
                :value="trigger_date_code"
                :obj-data-type-limit="['Date']"
                @on-change="updateTimeTriggerExpression"
                class="line-middle" style="display: inline-flex;"
            ></ExpressControl>
        </div>
    </div>
</template>

<script>
/*
        特性触发方式相关：
        1，事件： 全部无区分，一个下拉框。
        2，特性：公共的=>公共特性，子目录直接打开。
            我的=> 全部，包含公共特性，我的特性。
            运营组=>全部，包含 运营组特性，公共特性。
        3，时间到达触发：
            date类型的timeline。
    */
    import _ from 'lodash';
    import strategy from '@/components/strategy';

    const Expression = strategy.Expression;
    export default {
        props: {
            group: {
                type: Object,
                default() {
                    return {};
                }
            },
            event: Object, // 需要显示的Event的特性
            selfTrait: {
                type: Boolean,
                default: false
            },
            publicTrait: {
                type: Boolean,
                default: true
            },
            groupTrait: Boolean,
            selfCrowd: {
                type: Boolean,
                default: false
            },
            groupCrowd: Boolean,
            disabled: {
                type: Boolean,
                default: false
            },
            trait: {
                type: Object,
                default() {
                    return {};
                }
            },
            value: {
                type: Object,
                default() {
                    return null;
                }
            },
            dataList: {
                type: Object,
                default: () => ({})
            },
            eventList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                trigger: this.$lodash.cloneDeep(this.value)
            };
        },
        methods: {

            // updateTriggerType(e){
            //     const trigger = this.trigger;
            //     if(e != trigger.trigger_type){
            //         trigger.trigger_type = e;
            //         trigger.trigger_code = null;
            //         trigger.expression = null;
            //         this.updateTrigger(trigger);
            //     }
            //     //更新 更新方式
            // },

            updateTraitTriggerCode(trait) {
                const trigger = this.trigger;
                if (trigger.trigger_code != trait.value[0]) {
                    trigger.trigger_code = trait.value[0] ? trait.value[0] : null;
                    trigger.trigger_name = trait.names[0] ? trait.names[0] : null;
                    this.updateTrigger(trigger);
                }
            },

            updateTimeTriggerExpression(expression) {
                const trigger = this.trigger;
                if (!this.$lodash.isEqual(trigger.expression, expression)) {
                    trigger.expression = expression;
                    this.updateTrigger(trigger);
                }
            },

            updateEventTriggerCode(eventCode) {
                // 更新事件触发的code

                const trigger = this.trigger;
                if (eventCode != trigger.trigger_code) {
                    const event = _.find(this.eventList, e => e.code == eventCode);
                    if (event) {
                        trigger.trigger_name = event.name;
                        trigger.trigger_code = eventCode || null;
                        this.updateTrigger(trigger);
                    }
                }
            },

            updateTrigger(trigger) {
                this.$emit('on-change', this.$lodash.cloneDeep(trigger));
            }
        },
        watch: {
            value(nValue) {
                this.trigger = this.$lodash.cloneDeep(nValue);
            }
        },
        computed: {

            trigger_type() {
                return this.trigger.trigger_type;
            },
            trigger_trait_code() {
                return this.trigger_type == 'trait' ? {
                    value: [this.trigger.trigger_code],
                    names: [this.trigger.trigger_name],
                    source: 'trait'
                } : {};
            },
            trigger_event_code() {
                return this.trigger_type == 'event' ? this.trigger.trigger_code : null;
            },
            trigger_date_code() {
                return this.trigger.expression ? new Expression(this.trigger.expression) : new Expression();
            },
            canSelectEventTrigger() {
                return true;
            },
            canSelectTraitTrigger() {
                if (!!this.trait.data_type && !!~this.trait.data_type.indexOf('TimeLine')) {
                    return false;
                }
                return true;
            },
            canSelectTimeTrigger() {
                if (!!this.trait.data_type && !!~this.trait.data_type.indexOf('TimeLine')) {
                    return false;
                }
                return true;
            }
        },
        mounted() {}
    };
</script>

<style scoped lang="less">
        span.name {
            font-weight: 700;
        }
        .line-middle{
            vertical-align: middle;
        }
</style>
