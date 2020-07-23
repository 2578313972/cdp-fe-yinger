<template>
    <div class="crowd-strategy">
        <div class="crowd-strategy-edit">
            <!-- 审核状态和计算状态在人群中的处理
            1、待审核时，不可点击激活、修改、删除、重算
            2、计算中时，不可点击冻结、修改、重算
            3、清理中时，不可点击激活、修改、删除
            -->
            <span v-if="(calcStatus=='res_calculating') || (calcStatus=='cleaning')" >
                <i class="fa fa-circle bg-calculating"></i> {{$config.status_config[calcStatus]}}
            </span>
            <Button
                v-role-button="`strategy_crowd_button_${tabView}`"
                v-if="!isEdit && !(auditStatus=='pending'||calcStatus=='res_calculating'||calcStatus=='cleaning')"
                type="primary"
                @click="edit">修改
            </Button>
            <div v-if="isEdit">
                <Button type="primary" @click="cancel" style="margin-right:5px">取消</Button>
                <Button type="primary" :loading="loading" :disabled="!hasChanged" @click="commit">
                    {{activeStatus=='freeze'?'保存':'提交审核'}}
                </Button>
            </div>
            <Button
                ghost
                type="primary"
                v-show="auditStatus=='pending'"
                style="margin-left:5px"
                @click="auditDetail">审核详情
            </Button>
        </div>
        <!-- 人群更新方式 -->
        <Card dis-hover>
            <p slot="title">选择更新方式</p>
            <Update
                :value="strategy.trigger"
                v-if="crowdCatalogName"
                ref="update"
                :tabView="tabView"
                :groupId="groupId"
                :filterIds="filterIds"
                :crowdAscription="crowdCatalogName"
                @on-change="updateTrigger">
            </Update>
        </Card>
        <!-- 人群设置筛选条件 -->
        <Card dis-hover style="margin-top:24px">
            <p slot="title">设置筛选条件</p>
            <Condition
                :value="strategy.conditions"
                :filterIds="filterIds"
                traitOrCrowd="crowd"
                :group="group"
                :groupTrait="tabView == 'group'"
                :groupCrowd="tabView == 'group'"
                :selfTrait="tabView == 'self'"
                :selfCrowd="tabView == 'self'"
                :event="null"
                :URI="crowdCanSelectTypeCode"
                :logic-type="strategy.condition_logic_type"
                @on-change="updateConditions($event)"
                @on-change-logic-type="updateLogicType($event)">
            </Condition>
        </Card>
        <Drawer v-model="showAuditDetail" width="1000" :mask-closable="false">
            <audit-detail v-if="showAuditDetail" :auditId="crowdListContent.id" :auditType="`crowd`"></audit-detail>
        </Drawer>
        <div v-show="!isEdit" class="overlay"></div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Update from './Update'; // 策略更新类型
    import strategyModel from '@/components/strategy';
    import auditDetail from '@/components/AuditDetail';
    // 查看审核详情
    const { Expression } = strategyModel;

    const traitTriggerCmp = function (trigger, other) {
        for (const i in trigger) {
            if (!trigger[i]) delete trigger[i];
        }
        if (_.isEqual(trigger, other)) {
            return true;
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
            return condition.isEqual(new Expression(other));
        }
        return true;
    };

    const traitStrategyCmp = function (strategy, other) {
        strategy.conditions = strategy.conditions ? strategy.conditions : [];
        other.conditions = other.conditions ? other.conditions : [];
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
        return result;
    };


    export default {
        name: '',
        props: {
            // 我的-self,公共的-public,运营组的-group
            tabView: {
                type: String,
                default: ''
            },
            // 运营组下--组id
            groupId: {
                type: String,
                default: ''
            },
            // 人群code
            crowdCode: {
                type: [String, Number],
                default() {
                    return '';
                }
            },
            // 当前目录名称,用于运营组时一级条件包的文件夹名称
            crowdAscription: {
                type: String,
                default: ''
            },
            crowdListContent: { // 详情信息
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                loading: false,
                isEdit: false, // 点击了修改按钮，显示提交和取消
                group: {},
                crowdCatalogName: '',
                strategy: {
                    trigger: { update_type: 'once' },
                    conditions: [],
                    condition_logic_type: 'and'
                },
                crowdCanSelectTypeCode: {
                    traitsParams: {
                        data_type: ['Number', 'Bool', 'Enum', 'String', 'Badge', 'Date', 'StringSet', 'Address']
                    },
                    searchParams: {
                        data_type: ['Number', 'Bool', 'Enum', 'String', 'Badge', 'Date', 'StringSet', 'Address']
                    }
                },
                showAuditDetail: false // 查看审核详情
            };
        },
        methods: {

            init() {
                this.crowdCatalogName = this.crowdAscription;
                if (this.tabView === 'group') {
                    this.group.id = this.groupId;
                    this.group.name = this.crowdAscription;
                }
            },

            updateLogicType(type) {
                this.strategy.condition_logic_type = type;
                this.strategy = this.$lodash.cloneDeep(this.strategy);
            },
            updateTrigger(trigger) {
                // this.strategy.conditions = [];
                this.strategy.trigger = trigger;
                this.strategy = this.$lodash.cloneDeep(this.strategy);
            },

            updateConditions(conditions) {
                this.strategy.conditions = conditions;
                this.strategy = this.$lodash.cloneDeep(this.strategy);
            },

            strategyVerify(strategy) {
                // 最少一个条件
                if (!strategy.conditions || !strategy.conditions.length) {
                    this.$Message.destroy();
                    this.$Message.error('至少添加一个条件');
                    return false;
                }
                // 条件完整性判断
                const unPassConditions = this.$lodash.filter(strategy.conditions, (condition) => {
                    if (condition instanceof Expression) {
                        return !condition.check();
                    }
                    const conditionExpression = new Expression(condition);
                    return !conditionExpression.check();
                });
                if (unPassConditions.length > 0) {
                    this.$Message.destroy();
                    this.$Message.error('策略不完整');
                    return false;
                }

                // trigger
                const trigger = strategy.trigger;
                if (trigger.update_type == 'cycle') {
                    if (!trigger.sub_update_type || trigger.sub_update_type === '') {
                        this.$Message.destroy();
                        this.$Message.error('策略不完整');
                        return false;
                    }
                    if ((trigger.sub_update_type == 'weekly' || trigger.sub_update_type == 'monthly') && !trigger.range) {
                        this.$Message.destroy();
                        this.$Message.error('策略不完整');
                        return false;
                    }
                }
                // 由于2019-4-16需求变更，选择人群触发更新，去掉选择人群，因此暂注掉必选人群的校验。
                // if(trigger.update_type=='trigger'&&!trigger.trigger_crowd_code){
                //     this.$Message.destroy();
                //     this.$Message.error('策略不完整')
                //     return false;
                // }
                // 由于2019-4-16需求变更，条件里必须选一个人群，故加次校验。
                const oneMoreCrowd = strategy.conditions.map(item => item.object.source);
                if (trigger.update_type == 'trigger' && !oneMoreCrowd.includes('crowd')) {
                    this.$Message.destroy();
                    this.$Message.error('至少选择一个人群');
                    return false;
                }
                return true;
            },

            // 提交
            commit() {
                /**
                 * source 参数解释： input user crowd constant script session event 。
                 */
                const checkPass = this.strategyVerify(this.strategy);
                if (!checkPass) return;
                const params = {
                    trigger: this.strategy.trigger, // 触发方式
                    conditions: this.strategy.conditions || [], // 条件
                    condition_logic_type: this.strategy.condition_logic_type // 且或
                };
                /* {
                    "condition_logic_type": "and",        //且-and，或-or.
                    "need_recalc":true,                        //是否明天重计算
                    "crowd_update_type": {                 // 更新方式
                        "update_type": 'cycle',                //周期-cycle ，一次更新-once, 触发更新-trigger
                        "trigger_crowd_code": '',        //人群变化时触发更新 这种更新方式中，所依赖的人群
                        "sub_update_type": 'weekly',          //每天-daily, 每周-weekly, 每月-monthly。 人群触发变更传 condition。上传 upload。
                        "range":'4'                           //周1-7，月1-31 ，L----每月最后一天传L。
                    },
                    "crowd_conditions": [
                        {
                            "object":{     //一级条件主体
                                "source": "crowd",
                                "is_multiple":false,
                                "data_type": "Badge",
                                "value": ["AC201810130003"]
                            },
                            "operation": {
                                "case_sensitivity": true,   //识别大小写，这里都为true
                                "code": "exists",
                                "name": "存在",
                                "params_count": 0,
                                "result_data_type": "Bool"
                            }
                        }
                    ]
                }; */

                this.loading = true;
                this.$axios.put(`${this.$config.apiDomain}/crowds/${this.crowdCode}/condition`, params)
                    .then(({ data }) => {
                        this.loading = false;
                        this.$emit('updateDetail', data);
                        this.$Message.success(`${this.activeStatus == 'freeze' ? '保存' : '提交审核'}成功`);
                    })
                    .catch((error) => {
                        this.loading = false;
                        console.log(error);
                    });
            },
            // 修改
            edit() {
                this.isEdit = true;
            },
            // 取消
            cancel() {
                this.isEdit = false;
                this.strategy.trigger = this.$lodash.cloneDeep(this.crowdListContent.trigger);
                this.strategy.conditions = this.$lodash.cloneDeep(this.crowdListContent.conditions);
                this.strategy.condition_logic_type = this.crowdListContent.condition_logic_type;
            },
            // 人群审核详情
            auditDetail() {
                this.showAuditDetail = true;
            }
        },

        components: {
            Update,
            auditDetail
        },

        watch: {
            // 监听变化更新isEdit，可能新建添加策略然后点了激活。
            crowdListContent: {
                handler(val) {
                    this.isEdit = false;
                    if (val.trigger) this.strategy = this.$lodash.cloneDeep(val);
                },
                deep: true
            }
        },

        computed: {
            filterIds() { // 去掉自己本身，公共特性接口全部返回，前端限制不显示当前本身特性。
                const auxiliaryCrowds = this.crowdListContent.auxiliary_crowds.map(o => ({ code: o.code }));
                return [...auxiliaryCrowds, { code: this.crowdCode }];
            },
            calcStatus() { // 计算状态
                return this.crowdListContent.calc_status;
            },
            auditStatus() { // 审核状态
                return this.crowdListContent.audit_status;
            },
            activeStatus() { // 激活状态
                return this.crowdListContent.lifecycle_status;
            },
            hasChanged() {
                // 若未变化则提交是否置灰。
                const strategy = this.strategy;
                const other = this.crowdListContent;
                const result = traitStrategyCmp(strategy, other);
                if (!result) {
                    return true;
                }
                return false;
            }
        },

        mounted() {
            this.init();
            if (this.crowdListContent.trigger) {
                this.strategy = Object.assign({}, this.crowdListContent);
            }
        }
    };
</script>

<style scoped lang="less">
    .title-trash{
        font-size:18px;
        margin-right:10px;
        cursor: pointer;
    }
    .title-show{
        font-size:18px;
        cursor: pointer;
    }
    .crowd-strategy{
        position: relative;
        .crowd-strategy-edit{
            text-align:right;
            margin-bottom:15px;
        }
        .bg-calculating{
            color: #ff9900;
        }
        .overlay{
            position:absolute;
            top: 48px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            cursor:not-allowed;
            background-color: rgba(255, 255, 255, 0);
            border-radius: 4px;
            z-index: 3;
        }
    }
</style>
