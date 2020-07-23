<template>
    <div>
    <template v-if="inputType == 'String'">
        <!--
            文本属性。
            选择事件触发，且是文本或文本集合时，且在条件中，即true，显示能搜能加组件显示待选值。
            反之，其他类型特性 即false.显示多项添加组件。
        -->
        <Form
            :label-width="0"
            v-on:submit.native="stopFormAction">
            <MultipleTag
                :isSelect="(triggerParent.trigger_type=='event')&&(inputTypeDataType=='String'||inputTypeDataType=='StringList')&&(boolOrVoid=='Bool')"
                :tagWidth="222"
                :max-tag-num="multiple? 20 :1"
                :is-view='false'
                :tagArr="values"
                :can-key-del="true"
                :listData="stringList"
                @change-tag="setStringInput">
            </MultipleTag>
        </Form>
    </template>
    <template v-else-if="inputType == 'Number'">
        <Form :label-width="0" :rules="inputRules" v-on:submit.native="stopFormAction">
            <MultipleTag
                number
                formProp="numberValue"
                :tagWidth="222"
                :max-tag-num="multiple? 20 :1"
                :is-view='false'
                :tagArr="values"
                :can-key-del="true"
                @change-tag="setStringInput">
            </MultipleTag>
        </Form>
    </template>
    <template v-else-if="inputType == 'Date'">
        <DatePicker :value="dataValue" :multiple="multiple" class="w220 inline" inputType="date" placeholder="请选择日期" @on-change="dateInput"></DatePicker>
    </template>
    <template v-else-if="inputType == 'Time'">
        <TimePicker v-if="!multiple" :value="timeValue" class="w120 inline" inputType="time" placeholder="请选择时间" @on-change="dateInput"></TimePicker>
        <Form v-else-if="multiple" :label-width="0" v-on:submit.native="stopFormAction">
            <!-- :tagWidth="108" 这里的值正常应该是222，因为时刻控件要对齐的原因，要好好计算，先不修改-->
            <MultipleTag
                :tagWidth="108"
                :max-tag-num="multiple? 20 :1"
                type="Time"
                :is-view='false'
                :tagArr="timeValue"
                :can-key-del="true"
                @change-tag="timeInput"
            >
            </MultipleTag>
        </Form>
    </template>
    <template v-else-if="inputType == 'Address'">
        <multi-selection class="inline" :multiple="multiple"  :listData="addressOptionalValues" :checkedList="addressValue" @handleChange="addressInput"></multi-selection>
    </template>
    <template v-else-if="inputType == 'EnumValue' || inputType == 'EnumArrayValue'">
        <Select :value="values" @on-change="enumValueInput" :multiple="multiple">
            <Option v-for="(value, index) in optionalValues" :value="value" :key="index">{{value}}</Option>
        </Select>
    </template>
    </div>
</template>
<script>
    import _ from 'lodash';
    import MultipleTag from '../MultipleTag';
    import MultiSelection from '@/components/MultiSelection';

    export default {
        name: 'custom-input',
        components: { MultipleTag, MultiSelection },
        props: {
            inputType: {
                type: String,
                validator(value) {
                    return ['String', 'Number', 'Date', 'Time', 'Address', 'EnumValue', 'EnumArrayValue'].indexOf(value) !== -1;
                }
            },
            boolOrVoid: {
                Type: String,
                default: 'Bool'
            },
            inputTypeDataType: { // 选中事件的配置类型
                type: String,
                default: ''
            },
            inputTypeDataCode: { // 选中事件的code
                type: String,
                default: ''
            },
            // 外层触发方式，包含 trigger_type, trait_update_type。
            triggerParent: {
                type: Object,
                default() {
                    return {};
                }
            },
            optionalValues: {
                type: Array,
                default() {
                    return [];
                }
            },
            addressOptionalValues: {

            },
            value: {
                type: Array
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                inputRules: {
                    Type: Object,
                    default() {
                        return {
                            numberValue: [
                                { type: 'number', trigger: 'blur' }
                            ]
                        };
                    }
                },
                stringList: [] // 待选值获取接口list
            };
        },
        computed: {
            values() {
                return this.value || [];
            },
            dataValue() {
                const val = this.values[0] ? (this.values.length > 1 ? this.values : this.values[0]) : '';
                // return !!this.values[0] ?  this.value[0] : "";
                return val;
            },
            timeValue() {
                return this.multiple ? (this.values || []) : (this.values[0] ? this.values[0] : '');
            },
            addressValue() {
                return this.values.map(v => ({
                    value: v
                }));
            },
            numberValue() {
                return !!this.value && !!this.value[0] ? this.value[0] : '';
            }
        },
        methods: {
            // 阻止表单默认提交刷新页面行为
            stopFormAction(e) {
                e.preventDefault();
            },
            setStringInput(values) {
                this.$emit('on-change', values);
            },
            // 事件属性为文本和文本集合时，显示能搜能选能加。
            setStringInputString(values) {
                this.$emit('on-change', values);
            },
            // 地址多选得到的数组
            addressInput(selectAddresses) {
                const values = this.$lodash.map(selectAddresses, address => address.value);
                this.setStringInput(values);
            },

            numberInput(val) {
                const re = /^[0-9]*$/;
                const valStr = val.target.value;
                if (re.test(valStr)) {
                    this.setStringInput([valStr]);
                }
            },
            dateInput(val) {
                // this.setStringInput([val])
                const vals = (`${val}`).split(',');
                this.setStringInput(vals);
            },
            timeInput(value) {
                this.setStringInput(value);
            },
            enumValueInput(value) {
                if (_.isArray(value)) {
                    this.setStringInput(value);
                } else {
                    this.setStringInput([value]);
                }
            }
        },
        mounted() {
            if (this.boolOrVoid === 'Bool' && this.triggerParent.trigger_type === 'event') {
                if (this.inputTypeDataType === 'StringList' || this.inputTypeDataType === 'String') {
                    // console.log(this.inputTypeDataType, '文本集合');
                    this.$axios.get(`${this.$config.apiDomain}/traits/${this.inputTypeDataCode}/enum-values?scope=event`)
                        .then(({ data }) => {
                            this.stringList = data.values || [];
                        }).catch(() => {});
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .inline{
        display: inline-block;
    }
    .w220{
        width: 222px;
    }
    .w120{
        width: 120px;
    }
</style>
