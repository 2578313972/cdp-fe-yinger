<template>
    <Row :gutter="16" type="flex" align="middle" justify="start">
        <!-- 更新表达式不允许修改主object -->
        <Col v-if="resultTypeCode != 'Void'">
            <!-- 如果object是表达式 -->
            <template v-if="objectAndDefine.is_script">
                <ExpressControl
                    :group="group"
                    :event="event"
                    :is_sub=true
                    :traitOrCrowd="traitOrCrowd"
                    :triggerParent="triggerParent"
                    :resultTypeCode="resultTypeCode"
                    :bool-or-void="boolOrVoid"
                    @on-change="setObjectScript"
                    :value="objectAndDefine.script">
                </ExpressControl>
            </template>
            <!-- 如果object是一个输入-->
            <template v-else>
                <TraitInput
                    :key="expression.id"
                    v-bind="$props"
                    :closable="true"
                    :URI="URI"
                    :filterIds="filterIds"
                    :dataType="objectAndDefine.data_type_limit || objDataTypeLimit"
                    @on-change="setObject" :value="objectAndDefine">
                </TraitInput>
            </template>
        </Col>
           <Col  v-if="!!objectAndDefine && !!objectAndDefine.data_type">
               <!-- 算子 -->
            <OperatorSelector
                :key="objectAndDefine.data_type"
                @on-change="setOperator"
                :value="operatorAndDefine"
                :result-type-code="resultTypeCode"
                :options="operatorDefines"
                :optional-config="trait.optional_config||{}"
                :type-code="objectAndDefine.data_type">
            </OperatorSelector>
           </Col>
       <!-- 参数获取 -->
           <template v-if="operatorAndDefine.has_params ||  (!!paramsAndDefine && paramsAndDefine.length > 0)">
            <Col v-for="(option, index) in paramsAndDefine" :key="index">
                <ParamsSelector
                    :param-index="index + 1"
                    :key="expression.id"
                    v-bind="$props"
                    @on-select-change="(param) => setParam(index, param)"
                    @on-change="(paramValue,names,scopes) => setParamValue(index, paramValue, names,scopes)"
                    @on-change-script="(script) => setParamScript(index, script)"
                    :value="option"
                    :time_line_config="time_line_config"
                    :object="object"
                    :bool-or-void="boolOrVoid"
                    :URI="URI"
                    :traitOrCrowd="traitOrCrowd"
                    :filterIds="filterIds"
                    :triggerParent="triggerParent"
                    :typeCode="option.obj_data_data_type"
                    :curParamCodes="option.cur_param_codes"
                    :operatorCode="option.opt_code">
                </ParamsSelector>
            </Col>
       </template>
    </Row>
</template>

<script>
    import _ from 'lodash';
    import model from './strategyModel';
    import api from './strategyApi';

    const { Expression } = model;
    const ExpressControl = {
        name: 'express-control',
        props: {
            value: {
                type: Object,
                default() {
                    return new Expression({}, {}, []);
                }
            },
            trait: { // 当前特性全部返回信息，用于分类算子的选项去除
                type: Object,
                default() {
                    return {};
                }
            },
            // 外层主触发方式，包含 trigger_type, trait_update_type。
            triggerParent: {
                type: Object,
                default() {
                    return {};
                }
            },
            traitOrCrowd: { // 在人群还是特性的页面，crowd,trait
                type: String,
                default: ''
            },
            is_sub: false,
            /*
                2019-8-26，by 潘玉珠 补充。
                resultTypeCode这参数应该是区分请求bool还是void类型的，从而区分是条件部分->bool,更新部分->void。
                不知道为什么在这个文件开始嵌套再传给expressControl就变成了具体的code值。
                因此新增接收boolOrVoid。用来区分bool还是void类型。
                boolOrVoid在一个表达式中是固定的，不会随着逻辑而串改。
            */
            resultTypeCode: { // 表达式想要的结果类型
                Type: String,
                default: 'Bool'
            },
            boolOrVoid: {
                Type: String,
                default: 'Bool'
            },
            objDataTypeLimit: { // 主参trait类型限制列表
                Type: Array
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
            templateTrait: { // 是否有渠道特性 -- 目前在template项目中使用
                type: Boolean,
                default: false
            },
            selfCrowd: {
                type: Boolean,
                default: false
            },
            resType: {
                type: String,
                default: null
            },
            scope: { // 特性的级别（事件级别还是用户级别）
                type: String,
                default: 'user'
            },
            groupCrowd: Boolean,
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
        created() {
            this.debounceEmitExpressionChange = _.debounce(this.emitExpressionChange, 200);

        // 初始化算子列表。
        },
        mounted() {
            this._loadOperatorsDefine(this.object);
        },
        components: {},
        data() {
            return {
                time_line_config: {}, // timeline参数项，比如过去30天。用于禁不可选的时间范围。
                expression: new Expression(this.value),
                operatorDefines: [] // [{"code":"equal","name":"等于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"exists","name":"存在","data_type":"Bool","has_params":false,"has_more_operation":false},{"code":"gt","name":"大于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"gte","name":"大于等于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"lt","name":"小于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"lte","name":"小于等于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"not_equal","name":"不等于","data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"not_exists","name":"不存在","data_type":"Bool","has_params":false,"has_more_operation":false},{"code":"range","name":"区间","data_type":"Bool","has_params":true,"has_more_operation":false}],
            };
        },
        watch: {
            value() {
                this.expression = this.value;
            },
            object(nObject, oObject) {
                this._loadOperatorsDefine(nObject, oObject);
            }
        },
        computed: {
            object() {
                return this.expression.object;
            },
            objectAndDefine() {
                let result = null;
                result = this.expression.object;
                return result;
            },
            operator() {
                return this.expression.operation;
            },
            operatorAndDefine() {
                // const operatorAndDefine = new Operator(this.expression.operation);
                return this.expression.operation;
            },
            params() {
                return this.expression.params;
            },
            paramsAndDefine() {
                let result = [];
                // 当操作符有参数的时候，需要第一个参数输入
                // if(!!this.operator && this.operator.has_params){
                //     result.push({
                //           opt_code: this.operator.code,
                //           obj_data_data_type: this.objectAndDefine.data_type || "",
                //           cur_param_codes:null
                //     })
                // }

                // 增加已经选择的参数的判断
                if (this.params && this.params.length != 0) {
                    const curParamCodes = [];
                    result = [];
                    let preParam = null;
                    for (const key in this.params) {
                        const param = this.params[key];
                        if (param) {
                            if (preParam) curParamCodes.push(preParam.param_type);
                            preParam = param;
                            result.push({
                                ...param,
                                opt_code: this.operator.code,
                                obj_data_data_type: this.objectAndDefine.data_type || '',
                                cur_param_codes: [...curParamCodes]
                            });
                        }
                    }
                }
                return result;
            }
        },
        methods: {
            setObject(object) {
                this.time_line_config = object.time_line_config; // timeline的参数项，比如过去30天。
                const expression = new Expression(
                    {
                        ...this.expression, object, operation: {}, params: []
                    },
                );
                this.debounceEmitExpressionChange(expression);
            },
            setOperator(operator) {
                operator.has_more_operation = operator.has_more_operation && !this.is_sub; //    子表达式不允许再进行更多的子表达式级联
                const params = [];
                if (operator.has_params) {
                    params.push({});
                }
                const expression = new Expression(
                    {
                        ...this.expression, object: this.object, operation: operator, params, result_type: this.resultTypeCode
                    },
                );
                this.debounceEmitExpressionChange(expression);
            },
            setParam(index, param) {
                // for(let i =0; i< this.params.length; i++){
                //     if(i > index){
                //         delete this.params[i];
                //     }
                // }
                if (index > 20) {
                    return;
                // 防止服务器数据错误后，导致无线刷后继参数
                }
                const newParams = [...(_.take(this.params, index)), param];
                if (param.has_more_params) {
                    newParams.push({});
                }
                const expression = new Expression(
                    {
                        ...this.expression,
                        params: newParams,
                        result_type: this.resultTypeCode
                    },
                );
                this.debounceEmitExpressionChange(expression);
            },
            setParamValue(index, paramValue, names, scopes) {
                const updataPara = _.get(this.params, index);
                updataPara.value = paramValue;
                updataPara.names = names;
                updataPara.scopes = scopes;
                this.debounceEmitExpressionChange(this.expression);
            },
            setParamScript(index, script) {
                const updataParam = _.get(this.params, index);
                updataParam.script = script;
                this.debounceEmitExpressionChange(this.expression);
            },
            emitExpressionChange(expression) {
                // console.log('expression = ',a1);
                this.$emit('on-change', expression);
            },
            setObjectScript(expression) {
                // 设置object子表达式
                const operation = expression.operation;
                // const oObject = this.expression.object; //保留老的object；
                let newExpression = null;
                if (!operation || !operation.code || operation.data_type == this.resultTypeCode || operation.result_data_type == this.resultTypeCode) {
                    // if(expression.result_type == this.resultTypeCode || !expression.operator || !expression.operator.code){
                    // 如果子表达式的结果跟想要的结果类型一样，取消子表达式
                    const object = expression.object;
                    const operator = expression.operation;
                    const params = [];
                    if (operator.has_params) {
                        params.push({});
                    }
                    newExpression = new Expression(
                        {
                            ...this.expression,
                            object,
                            operation: operator,
                            params,
                            result_type: this.resultTypeCode
                        },
                    );
                } else { // 子表达式更新
                    const object = this.object;
                    object.script = expression;
                    newExpression = new Expression(
                        {
                            ...this.expression,
                            object,
                            operation: {},
                            params: [],
                            result_type: this.resultTypeCode
                        },
                    );
                }
                this.debounceEmitExpressionChange(newExpression);
            },
            _loadOperatorsDefine(nObject, oObject) {
                if (nObject && nObject.data_type && this.resultTypeCode) {
                    if (!oObject || oObject.data_type != nObject.data_type || !this.operatorDefines || !this.operatorDefines.length) {
                        // 老大object与新的object 类型不一样。或者当前没有可用的算子
                        const that = this;
                        // that.operatorDefines = [{"code":"equal","name":"等于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"exists","name":"存在","result_data_type":"Bool","has_params":false,"has_more_operation":false},{"code":"gt","name":"大于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"gte","name":"大于等于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"lt","name":"小于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"lte","name":"小于等于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"not_equal","name":"不等于","result_data_type":"Bool","has_params":true,"has_more_operation":false},{"code":"not_exists","name":"不存在","result_data_type":"Bool","has_params":false,"has_more_operation":false},{"code":"range","name":"区间","result_data_type":"Bool","has_params":true,"has_more_operation":false}];
                        api.getOperators(nObject.data_type, {
                            ...this.triggerParent,
                            result_data_type: this.resultTypeCode
                        }, this.traitOrCrowd).then((data) => {
                            that.operatorDefines = data;
                        });
                    }
                }
            }
        }
    };
    export default ExpressControl;
</script>
