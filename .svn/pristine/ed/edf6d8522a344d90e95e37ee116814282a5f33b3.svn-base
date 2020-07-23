<template>
    <div>
        <div class="update-type">
            <p>请选择一种更新类型：</p>
            <RadioGroup :value="value.update_type" @on-change="updateType">
                <Radio v-for="(item,index) in update_type.type_list" :key="index" :label="item.key">
                    <span>{{item.value}}</span>
                </Radio>
            </RadioGroup>
        </div>
        <div class="update-type" v-show="value.update_type==='cycle'">
            <p>更新方式：</p>
            <div class="inline-box">
                <Select
                    :value="value.sub_update_type"
                    style="width:120px;margin:0 10px;"
                    @on-change="updatePeriod">
                    <Option value="daily">每天</Option>
                    <Option value="weekly">每周</Option>
                    <Option value="monthly">每月</Option>
                </Select>
                <div v-if="value.sub_update_type=='daily'" class="inline-box">
                    <span>更新</span>
                </div>
                <div v-if="value.sub_update_type=='weekly'" class="inline-box">
                    <span>且</span>
                    <Select :value="value.range" @on-change="changeDate" style="width:160px;margin:0 10px;">
                        <Option v-for="(item,index) in 8" :key="index" :value="`${index}`" v-if="index">每周{{upper_case[`${index}`]}}</Option>
                    </Select>
                    <span>更新</span>
                </div>
                <div v-if="value.sub_update_type=='monthly'" class="inline-box">
                    <span>且</span>
                    <Select :value="value.range" @on-change="changeDate" style="width:160px;margin:0 10px;">
                        <Option v-for="(item,index) in 32" :key="index" :value="`${index}`" v-if="index">每月{{index}}号</Option>
                        <Option value="L">每月最后一天</Option>
                    </Select>
                    <span>更新</span>
                </div>
            </div>
            <!-- 2019-4-16 10:20am。需求变更选择人群变化更新时，去掉选择人群的更新方式。 -->
            <!-- <div v-if="value.update_type=='trigger'" class="inline-box">
                <TraitInput
                    v-bind="propsData"
                    :closable="true"
                    :value="traitInputVal"
                    :filterIds="filterIds"
                    @on-change="updateTraitTriggerCode">
                </TraitInput>
            </div> -->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            tabView: { // 我的，运营组的，
                type: String,
                default: ''
            },
            groupId: {
                type: String,
                default: ''
            },
            crowdAscription: {
                type: String,
                default: ''
            },
            value: {
                type: Object,
                default() {
                    return {};
                }
            },
            filterIds: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                update_type: { // 更新相关
                    type: 'once', // 更新类型model
                    type_list: [ // 更新类型
                        {
                            key: 'once',
                            value: '手动更新'
                        },
                        {
                            key: 'cycle',
                            value: '周期性更新'
                        }
                        // jira问题979,2019/5/23柏璐需求将人群触发方式暂时在界面上隐藏，后端未改。
                        // {
                        //     key: 'trigger',
                        //     value: '人群变化时触发更新'
                        // }
                    ],
                    options: [ // 具体更新方式
                        {
                            period_type: 'daily', // 周期性更新model
                            day_type: '1',
                            week_type: '1'
                        }
                    ]
                },
                upper_case: {
                    1: '一',
                    2: '二',
                    3: '三',
                    4: '四',
                    5: '五',
                    6: '六',
                    7: '日'
                },
                propsData: {
                    group: {}, // 当前组，包括ID，name
                    event: null, // 需要显示的Event的特性
                    selfTrait: false,
                    publicTrait: false,
                    groupTrait: false,
                    selfCrowd: false,
                    groupCrowd: false,
                    disabled: false,
                    value: {}
                }
            };
        },
        methods: {

            updateTraitTriggerCode(a) { // 选中的人群变化更新
                const trigger = { ...this.value };
                trigger.trigger_crowd_code = a.value[0];
                trigger.trigger_crowd_name = a.names[0];
                trigger.sub_update_type = 'condition';
                this.changeTrigger(trigger);
            },

            updateType(k) {
                const trigger = { ...this.value };
                trigger.update_type = k;
                trigger.sub_update_type = undefined;
                trigger.range = undefined;
                trigger.trigger_crowd_code = undefined;
                trigger.trigger_crowd_name = undefined;
                this.changeTrigger(trigger);
            },
            updatePeriod(v) {
                const trigger = { ...this.value };
                trigger.sub_update_type = v;
                trigger.range = undefined;
                this.changeTrigger(trigger);
            },
            changeTrigger(trigger) {
                if (!this.$lodash.isEqual(trigger, this.value)) {
                    this.$emit('on-change', trigger);
                }
            },
            changeDate(v) { // 切换时间，每周几每月几
                const trigger = { ...this.value };
                trigger.range = v;
                this.changeTrigger(trigger);
            }

        },
        computed: {
            traitInputVal() {
                const inputData = {};
                if (!this.value.trigger_crowd_code) {
                    return null;
                }
                inputData.value = [this.value.trigger_crowd_code];
                inputData.names = [this.value.trigger_crowd_name];
                inputData.source = 'crowd';
                return inputData;
            }
        },

        mounted() {
            if (this.tabView === 'self') {
                this.propsData.selfCrowd = true;
            }
            if (this.tabView === 'group') {
                this.propsData.group.id = this.groupId;
                this.propsData.group.name = this.crowdAscription;
                this.propsData.groupCrowd = true;
            }
        }

    };
</script>

<style scoped lang="less">
    .update-type{
        p{
            line-height: 50px; display: inline-block;font-weight: bold;
        }
        .inline-box{
            display: inline-block;
        }
    }
</style>
