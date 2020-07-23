<template>
    <div class="inline">
        <Select
            style="min-width:120px;max-width:290px;"
            :key="typeCode"
            :value="curOperatorCode"
            @on-change="selectOperator">
            <Option v-for="(option) in optionsList" :value="option.code" :key="option.code">{{option.name}}</Option>
        </Select>
    </div>
</template>


<script>

    import _ from 'lodash';
    import model from './strategyModel';

    const { Operator } = model;

    export default {
        name: 'operator-selector',
        props: {
            resultTypeCode: {
                type: String,
                required: true
            },
            optionalConfig: { // 分类的自定义，12星座，12生肖配置
                type: Object,
                default() {
                    return {};
                }
            },
            typeCode: {
                type: String,
                required: true
            },
            value: {
                type: Operator,
                default() {
                    return new Operator();
                }
            },
            options: {
                type: Array,
                default() {
                    return [];
                }
            },
            is_sub: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
            // options:[],
            };
        },
        computed: {
            curOperatorCode() {
                return this.value.code ? this.value.code : '';
            },
            optionsList() {
                if (this.resultTypeCode === 'Void' && this.optionalConfig.value_type_code === 'input') { // 分类的自定义
                    const arr = this.options.filter(o => o.code === 'set');
                    return arr;
                }
                if (this.resultTypeCode === 'Void' && this.optionalConfig.value_type_code === 'Zodiac') { // 分类的12星座
                    const arr = this.options.filter(o => o.code !== 'to_symbolic');
                    return arr;
                }
                if (this.resultTypeCode === 'Void' && this.optionalConfig.value_type_code === 'ChineseZodiac') { // 分类的12生肖
                    const arr = this.options.filter(o => o.code !== 'to_zodiac');
                    return arr;
                }
                return this.options;
            }
        },
        methods: {
            selectOperator(optCode) {
                let operator = _.find(this.options, opt => opt.code == optCode);
                if (!operator) {
                    operator = {};
                }
                this.$emit('on-change', operator);
            }
        }
    };
</script>

<style scoped lang="less">
    .inline{
        display: inline-block;
    }
</style>
