<template>
    <Row type="flex" align="middle" justify="start">
        <!-- 只有一个参数的情况下 -->
        <template v-if="!!paramDefines && paramDefines.length == 1">
            <!-- <Col v-if="paramIndex != 1">
                <Select class="w120" readonly :value="value.param_type" @on-change="setParamDefine">
                    <Option v-for="(option, index) in paramDefines" :value="option.param_type" :key="index">{{option.name}}</Option>
                </Select>
            </Col>  by cwq 。 删除后，使用pre_tip and suffix_tip展示-->
            <Col class="tip prefix" v-if="selectParamDefine.prefix_tip">
                {{selectParamDefine.prefix_tip}}
            </Col>
            <Col v-if="value.is_script">
                <ExpressControl
                    v-bind="$props"
                    is_sub
                    :traitOrCrowd="traitOrCrowd"
                    :triggerParent="triggerParent"
                    :resultTypeCode="typeCode"
                    :value="scriptValue"
                    @on-change="setScript">
                </ExpressControl>
            </Col>

            <!-- trait -->
            <Col v-else-if="value.source == 'trait'">
                <TraitInput
                    v-bind="$props"
                    :closable="true"
                    :data-type="[value.data_type]"
                    :value="traitValue"
                    :filterIds="filterIds"
                    :URI="URI"
                    :multiple="value.is_multiple"
                    @on-change="setTrait" ></TraitInput>
            </Col>

             <Col v-else-if="value.source == 'enum'">
                <CustomInput
                    :optionalValues="enumValues"
                    :multiple="value.is_multiple"
                    inputType="EnumValue"
                    :value='inputValue'
                    @on-change="setInput"></CustomInput>
            </Col>

            <!-- input -->
            <Col class="inline" v-else-if="value.source == 'input'">
                   <CustomInput
                :addressOptionalValues ="addressValuesObj"
                :multiple="value.is_multiple"
                :inputType="value.data_type"
                :value='inputValue'
                @on-change="setInput"></CustomInput>
            </Col>
            <Col class="tip suffix" v-if="selectParamDefine.suffix_tip">
                {{selectParamDefine.suffix_tip }}
            </Col>

            <!-- constat -->
        </template>

        <!-- 当有多个的情况 -->
        <Row type="flex" align="middle" justify="start" v-else-if="!!paramDefines && paramDefines.length > 1">
            <!-- <label>2</label> -->
            <Col class="tip prefix" v-if="selectParamDefine.prefix_tip">
                {{selectParamDefine.prefix_tip}}
            </Col>
            <Col>
                <Select class="w120" :value="value.param_type" @on-change="setParamDefine">
                    <Option v-for="(option, index) in paramDefines" :value="option.param_type" :key="index">{{option.name}}</Option>
                </Select>
            </Col>
            <Col v-if="value.is_script">
                <ExpressControl
                    v-bind="$props"
                    is_sub
                    :traitOrCrowd="traitOrCrowd"
                    :triggerParent="triggerParent"
                    :resultTypeCode="typeCode"
                    :value="scriptValue"
                    @on-change="setScript">
                </ExpressControl>
            </Col>
            <Col v-else-if="value.source == 'input'">
                <!-- input -->
                <CustomInput
                    :multiple="value.is_multiple"
                    :addressOptionalValues ="addressValuesObj"
                    :bool-or-void="boolOrVoid"
                    :inputType="value.data_type"
                    :inputTypeDataType="value.obj_data_data_type||''"
                    :inputTypeDataCode="(object.value&&object.value[0])||''"
                    :value='inputValue'
                    :triggerParent="triggerParent"
                    @on-change="setInput">
                </CustomInput>
            </Col>
             <Col v-else-if="value.source == 'enum'">
             <!-- 因为enum source 的data_type 是string，所有这里的inputType写死为固定值，通过multiple来判断是否可以多选 -->
                <CustomInput
                    :optionalValues="enumValues"
                    :multiple="value.is_multiple"
                    inputType="EnumValue"
                    :value='inputValue'
                    @on-change="setInput"></CustomInput>
            </Col>
            <Col v-else-if="value.source == 'trait'">
                <!-- {{value.name}} -->

                <!-- 强制加上:selfCrowd="false"、:groupCrowd="false",因为这里的时候不可能有人群，解决Bug【SMCERS-432】 -->
                <TraitInput
                    v-bind="$props"
                    :closable="true"
                    :data-type="[value.data_type]"
                    :value="traitValue"
                    :filterIds="filterIds"
                    :URI="URI"
                    :multiple="value.is_multiple"
                    :selfCrowd="false"
                    :groupCrowd="false"
                    @on-change="setTrait" ></TraitInput>
            </Col>
            <Col class="tip suffix" v-if="selectParamDefine.suffix_tip">
                {{selectParamDefine.suffix_tip }}
            </Col>
        </Row>
    </Row>
</template>

<script>
    import _ from 'lodash';
    import api from './strategyApi';


    export default {
        name: 'params-selector',
        props: {
            paramIndex: {
                type: Number,
                default: 1
            },
            typeCode: {
                type: String,
                required: true
            },
            operatorCode: {
                type: String,
                required: true
            },
            boolOrVoid: {
                Type: String,
                default: 'Bool'
            },
            traitOrCrowd: { // 在人群还是特性的页面，crowd,trait
                type: String,
                default: ''
            },
            // 外层主触发方式，包含 trigger_type, trait_update_type。
            triggerParent: {
                type: Object,
                default() {
                    return {};
                }
            },
            event: Object, // 需要显示的Event的特性
            group: Object, // 当前组，包括ID，name
            template: Object, // 当前渠道的id和name -- 目前在template项目中使用
            URI: { // 策略的接口地址修改，可不传，用于人群策略给traitinput限制data_type的以及搜索参数
                type: Object,
                default() {
                    return {};
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
            selfCrowd: {
                type: Boolean,
                default: false
            },
            templateTrait: { // 是否有渠道特性 -- 目前在template项目中使用
                type: Boolean,
                default: false
            },
            groupCrowd: Boolean,
            curParamCodes: {
                type: Array,
                default() {
                    return [];
                }
            },
            object: {
                type: Object
            },
            resType: {
                type: String,
                default: null
            },
            scope: { // 特性的级别（事件级别还是用户级别）
                type: String,
                default: 'user'
            },
            value: {
                type: Object,
                default() {
                    return {};
                }
            },
            time_line_config: {
                type: Object,
                default() {
                    return {};
                }
            },
            disabled: {
                type: Boolean,
                default: false
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
                paramDefines: [],
                enumValues: [],
                addressValuesObj: [],
                selectParamDefine: {}
            };
        },
        created() {
            this.loadOptionParams();
        },
        watch: {
            typeCode(nV, oV) {
                if (!_.isEqual(nV, oV)) {
                    this.loadOptionParams();
                }
            },
            operatorCode(nV, oV) {
                if (!_.isEqual(nV, oV)) {
                    this.loadOptionParams();
                }
            },
            curParamCodes(nV, oV) {
                if (!_.isEqual(nV, oV)) {
                    this.loadOptionParams();
                }
            }
        },
        methods: {
            async loadOptionParams() {
                const params = {};
                if (this.curParamCodes && this.curParamCodes.length > 0) {
                    params.cur_param_type = this.curParamCodes;
                }
                this.paramDefines = await api.getNextAvailableParam(this.typeCode, this.operatorCode, params, this.triggerParent, this.traitOrCrowd);
                // if只返回一种情况。

                // 如果当前没有传进来值，设置默认选择第一个

                if (this.paramDefines.length > 0) {
                    if (!!this.value.param_type && this.value.param_type.length > 0) {
                        // 当前有值 param_type 是string类型
                        const selectParamDefine = _.find(this.paramDefines, d => d.param_type == this.value.param_type) || {};
                        this.selectParamDefine = selectParamDefine;
                    // this.setParamDefine(this.value.code)
                    }
                    else {
                        this.setParamDefine(this.paramDefines[0].param_type);
                    }
                }

                if (_.findIndex(this.paramDefines, define => define.source == 'enum') != -1) {
                    //
                    if (!this.object || !this.object.value || !this.object.value[0] || this.object.data_type != 'Enum') {
                        // 没有主参，或者主参数不为enum。
                        console.error('在获取Enum类型的可选值得时候，没有主参，或者主参数不为enum。');
                    }
                    const optionalValuesObj = await api.getEnumOptionalValues(this.object.value[0]);
                    this.enumValues = optionalValuesObj.values;
                }
                if (_.findIndex(this.paramDefines, define => define.data_type == 'Address') != -1) {
                    const addressValuesObj = await api.getMetaAreaMap();
                    this.addressValuesObj = addressValuesObj;
                }
            },
            setParamDefine(paramTypeCode) {
                const selectParamDefine = _.find(this.paramDefines, d => d.param_type == paramTypeCode) || {};

                if (selectParamDefine.source === 'constant' || selectParamDefine.source == 'function') {
                    selectParamDefine.value = [selectParamDefine.const_value];
                    this.setParamValue(selectParamDefine.value);
                }
                this.selectParamDefine = selectParamDefine;
                this.$emit('on-select-change', selectParamDefine);
            },
            setParamValue(nValue) {
                // 分离param的整体返回，只返回选择的值。防止重复赋值导致重绘。结合上面的setParamDefine来返回param的其他配置信息。
                this.$emit('on-change', nValue.value, nValue.names, nValue.scopes);
            },
            setInput(vs) {
                this.setParamValue({ value: vs });
            },
            setTrait(trait) {
                // TODO 判断选择的参数是否满足定义
                this.setParamValue(trait);
            },
            setScript(script) {
                this.$emit('on-change-script', script);
            }
        },
        computed: {
            inputValue() {
                return this.value.value ? this.value.value : []; // value是个数组。
            },
            traitValue() {
                return this.value;
            },
            scriptValue() {
                const result = this.value.script;
                result.object.data_type_limit = [this.value.data_type];
                !!result.result_type || (result.result_type = this.typeCode);
                return result;
            }
        }
    };
</script>

<style scoped lang="less">
    .inline{
        display: inline-block;
    }
    .w120{
        min-width: 110px;
    }
    .tip{
        font-size: 14px;
        &.prefix{
            padding-right: 14px;
            padding-left: 0px;
        }
        &.suffix{
            padding-left: 14px;
        }
    }
</style>
