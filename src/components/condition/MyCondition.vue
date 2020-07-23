<template>
    <div>
        <div class="and-box" v-if="conditions.length">
            <!-- 且或 -->
            <div v-show="conditions.length>1" class="and">
                <div class="border"></div>
                <div class="and-or">
                    <Button type="primary" @click="toggleLogicType">{{is_and?'且':'或'}}</Button>
                </div>
            </div>
            <!-- 条件 -->
            <div class="and-condition">
                <Row :class="{'condition-row-no-padding':conditions.length==1}" type="flex" align="middle" justify="start" v-for="(item,index) in conditions" :key="item.id" class="add-condition-row">
                    <Col>
                        <ExpressControl
                            v-bind="$props"
                            :value="item"
                            :key="item.id"
                            :group="group"
                            :event="event || strategyEvent"
                            @on-change="setExpression($event,index)">
                        </ExpressControl>
                    </Col>
                    <Col v-if="!isReadOnly" class="add-condition-del-cell">
                        <span class="ml10 close" @click="deleteFn(index)">
                            <Icon type="md-close" />
                        </span>
                    </Col>
                </Row>
            </div>
        </div>
        <Button :class="{'pr60':conditions.length>1, 'mtop':true}" v-if="!isReadOnly" icon="md-add" type="primary" ghost @click="addCondition">添加条件</Button>
    </div>
</template>

<script>
/*
    判断条件的特性文件夹目录：
    1，事件触发：
    事件触发&我的：公共特性，我的特性，事件特性。
    事件触发&公共的：公共特性，事件特性。
    事件触发&运营组的：公共特性，运营组特性，事件特性。
    2，特性触发：
    特性触发&我的：我的特性，公共特性。
    特性触发&公共的：公共的。
    特性触发&运营组：运营组特性，公共特性。
    3，更新操作：
*/
    import _ from 'lodash';
    import strategyModel from '@/components/strategy/strategyModel';

    const { Expression } = strategyModel;
    export default {
        props: {
            // 当前用户在为组织添加吗？
            group: {
                type: Object,
                default() {
                    return {};
                }
            },
            template: Object, // 当前渠道的id和name -- 目前在template项目中使用
            URI: Object, // 策略的接口地址修改，可不传，有默认值{catalogs:"目前请求地址",searchTraitAndCrowds:"搜索请求地址",traits:"特性请求地址",URI.eventDetail:"事件"}
            isReadOnly: { // 是查看时不显示关闭和添加条件按钮
                type: Boolean,
                default: false
            },
            event: { // 可以选择哪个事件的特性
                type: Object,
                default() {
                    return null;
                }
            },
            selfTrait: {
                type: Boolean,
                default: false
            },
            publicTrait: {
                type: Boolean,
                default: true
            },
            groupTrait: Boolean,
            templateTrait: { // 是否有渠道特性 -- 目前在template项目中使用
                type: Boolean,
                default: false
            },
            selfCrowd: {
                type: Boolean,
                default: false
            },
            groupCrowd: Boolean,
            disabled: {
                type: Boolean,
                default: false
            },
            includeCrowd: {
                type: Boolean,
                default: false
            },
            logicType: {
                type: String,
                validator(value) {
                    return ['and', 'or'].indexOf(value) !== -1;
                }
            },
            strategy: {
                type: Object,
                default() {
                    return {};
                }
            },
            value: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },
            conditionRelation: {
                type: String,
                default: ''
            },
            scope: { // 特性的级别（事件级别还是用户级别）
                type: String,
                default: 'user'
            },
            name: {
                type: String,
                default: 'test'
            }
        },
        data() {
            return {
                type: 'trait', // trait-特性。crowd-人群。
                trait_type: 'self', // 包含 self,public,group。
                operation: {
                    code: '',
                    name: '',
                    params_count: 0,
                    result_data_type: ''
                }

            };
        },
        methods: {

            toggleLogicType() { // 且 或
                const is_and = this.is_and;
                this.$emit('on-change-logic-type', !is_and ? 'and' : 'or');
            },
            // 添加条件
            addCondition() {
                if (this.conditions.length >= 10) {
                    this.$Message.destroy();
                    this.$Message.error('最多添加10个条件');
                    return;
                }
                const conditions = [...this.conditions, new Expression()];
                if (conditions.length <= 1) {
                    this.$emit('on-change-logic-type', 'and');
                } else if (!this.logicType) {
                    this.$emit('on-change-logic-type', 'and');
                }
                this.$emit('on-change', conditions);
            },

            deleteFn(index) {
                const conditions = this.$lodash.cloneDeep(this.conditions);
                conditions.splice(index, 1);
                this.$emit('on-change', [...conditions]);
            },

            setExpression(express, index) {
                const conditions = this.$lodash.cloneDeep(this.conditions);
                conditions[index] = express;
                this.$emit('on-change', [...conditions]);
            }

        },
        computed: {
            is_and() {
                return _.isEqual(this.logicType, 'and');
            },
            conditions() {
                return this.$lodash.map(this.value, (condition) => {
                    if (condition instanceof Expression) {
                        return condition;
                    }
                    return new Expression(condition);
                });
            },
            strategyEvent() {
                const strategy = this.strategy;
                if (strategy.trigger) {
                    return strategy.trigger.trigger_type == 'event' && !!strategy.trigger.trigger_code ? { code: strategy.trigger.trigger_code, name: strategy.trigger.trigger_name } : null;
                }
            }
        },

        mounted() {
        },
        watch: {
        }
    };
</script>

<style scoped lang="less">
    .and-box{
        display: flex;
        .and{
            width: 60px;
            // padding: 25px 0 25px 30px;
            padding: 14px 0 15px 30px;
            position: relative;
            overflow: hidden;
            .border{
                width: 24px;
                height: 100%;
                border-top: 1px #dcdee2 solid;
                border-bottom: 1px #dcdee2 solid;
                border-left: 1px #dcdee2 solid;
            }
            .and-or{
                position: absolute;
                left: 0px;
                top: 50%; margin-top: -20px;
                background: #fff;
                padding: 3px;
            }
        }
        .and-condition{
            flex: 1;
            .close{
                color:#808695;
                cursor: pointer;
                &:hover{
                    color: #ed4014;
                }
            }
            .condition-row-no-padding{
                padding:0!important;
            }
            .add-condition-row{
                position: relative;
                padding-right: 30px;
                padding: 6px 28px 6px 8px;
                border-radius: 4px;
                &:nth-child(2n){
                    background: #f8f8f8;
                }
                .add-condition-del-cell{
                    display: none;
                    position: absolute;
                    top: 50%;
                    bottom: 0;
                    right: 6px;
                    margin-top: -10px;
                    .ivu-icon-md-close{
                        font-size: 16px;
                    }
                }
                &:hover .add-condition-del-cell{
                    display: block;
                }
            }
            .add-condition-row + .add-condition-row{
                margin-top: 5px;
            }
        }
    }
    .and-box + .mtop{
        margin-top: 10px;
    }
    .pr60{
        margin-left: 68px;
    }
</style>
