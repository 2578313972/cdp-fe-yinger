<template>
    <!-- 新建属性/修改属性 -->
    <Form ref="formValidate" label-position="left" :label-width="110" :model="formValidate" :rules="ruleValidate">
        <Form-item label="属性ID" prop="code">
            <Input :disabled="isDisabled" class="width400" :maxlength='32' v-model.trim="formValidate.code" placeholder="请输入属性ID" />
            <Tooltip class="f16 tip" transfer content="仅支持输入小写英文字母、数字、下划线，并以小写字母开头，长度为32字以内，不能跟渠道内其他属性ID重复，新建后不可修改" placement="right" max-width="200">
                <i class="fa fa-question-circle-o"></i>
            </Tooltip>
        </Form-item>
        <Form-item label="属性名称" prop="name">
            <Input :maxlength="20" class="width400" v-model.trim="formValidate.name" placeholder="请输入属性名称" />
            <Tooltip class="f16 tip" transfer content="请输入属性名称，将在选择事件属性时显示，长度为20字以内" placement="right" max-width="200">
                <i class="fa fa-question-circle-o"></i>
            </Tooltip>
        </Form-item>
        <Form-item label="属性类型" prop="type">
            <Select :disabled="isDisabled" class="width400" v-model="formValidate.type" @change="changeType">
                <Option v-for="item in typeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
            <Tooltip class="f16 tip" transfer content="选择属性类型，将按照类型解析接收到的事件中的数据，在新建后不可修改" placement="right" max-width="200">
                <i class="fa fa-question-circle-o"></i>
            </Tooltip>
        </Form-item>
        <Form-item label="可选值" prop="value">
            <p v-if="!isString">无需特殊配置</p>
            <multiple-tag class="width400" v-else :is-view="false" :tag-arr="formValidate.value" tag-placeholder="请输入可选值" isShowTip canKeyDel tipContent="将应用于特性算子，在需要匹配文本类的特性值时，提示输入可匹配的可选值" :tag-width="400" v-on:change-tag="changeTag">
            </multiple-tag>
        </Form-item>
        <Form-item label="描述" prop="description">
            <Input class="width400" :maxlength='100' type="textarea" v-model.trim="formValidate.description" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入描述，长度为100字以内" />
        </Form-item>
    </Form>
</template>

<script>
    import MultipleTag from '@/components/MultipleTag';

    export default {
        props: {
            formWidth: {
                type: Number,
                default: 300
            },
            createURI: {
                type: Object,
                default() {
                    return {
                        url: '',
                        type: ''
                    };
                }
            },
            editInfo: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                isDisabled: false,
                formValidate: {
                    code: '',
                    name: '',
                    type: '',
                    value: [],
                    description: ''
                },
                ruleValidate: {
                    code: [{
                               required: true,
                               message: '请输入属性ID',
                               trigger: 'blur'
                           },
                           {
                               pattern: /^[a-z][a-z0-9_]*$/,
                               message: '只支持小写英文字母、数字、下划线，并以小写字母开头',
                               trigger: 'blur'
                           }
                    ],
                    name: [{
                               required: true,
                               message: '请输入属性名称',
                               trigger: 'blur'
                           },
                           {
                               pattern: this.$config.reg_input.reg,
                               message: this.$config.reg_input.msg,
                               trigger: 'blur'
                           }
                    ],
                    type: [{
                        required: true,
                        message: '请选属性类型',
                        trigger: 'change'
                    }]
                },
                typeList: [],
                dataBack: {}
            };
        },
        computed: {
            isString() {
                return this.formValidate.type === 'String' || this.formValidate.type === 'StringList';
            },
            hasChanged() {
                return this.$lodash.isEqual(this.formValidate, this.dataBack);
            }
        },
        components: {
            MultipleTag
        },
        created() {
            this.getTypes();
        },
        mounted() {
            if (this.editInfo.code) {
                this.isDisabled = true;
                this.formValidate.name = this.editInfo.name;
                this.formValidate.type = this.editInfo.data_type;
                this.formValidate.code = this.editInfo.code;
                this.formValidate.value = (this.isString && this.editInfo.optional_config !== '-') ? this.editInfo.optional_config.split(',') : [];
                this.formValidate.description = this.editInfo.description === '-' ? '' : this.editInfo.description;
            }
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            changeType(val) {
                this.formValidate.type = val;
            },
            getTypes() {
                const apiUrl = '/types';
                const params = {
                    datatype_scope: 'event'
                };
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        this.typeList = data;
                    });
            },
            changeTag(val) {
                this.formValidate.value = val;
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('changeLoading', true);
                        this.editAttr();
                    } else {
                        this.$emit('changeLoading', false);
                    }
                });
            },
            updateList(tipMsg, isAdd) {
                this.$emit('changeLoading', false);
                this.$tools.bus.$emit('hideDrawer');
                this.$Message.destroy();
                this.$Message.success(tipMsg);
                // 更新列表
                this.$tools.bus.$emit('updateList', isAdd);
            },
            editAttr() {
                const editInfo = this.formValidate;
                let apiUrl = '';
                if (this.editInfo.code) {
                    apiUrl = `/properties/${this.editInfo.code}`;
                } else {
                    apiUrl = this.createURI.url;
                }
                const params = {
                    optional_config: (this.isString && !!editInfo.value.length) ? {
                        values: editInfo.value
                    } : undefined,
                    trait_code: editInfo.code,
                    trait_description: editInfo.description,
                    trait_display_name: editInfo.name,
                    data_type: editInfo.type
                };
                this.$axios({
                    method: this.editInfo.code ? 'put' : 'post',
                    url: `${this.$config.apiDomain}${apiUrl}`,
                    data: params
                })
                    .then(() => {
                        const tipMsg = this.editInfo.name ? '已修改' : '已添加';
                        this.updateList(tipMsg, !this.editInfo.code);
                        if (this.createURI.type == 'eventAttr') {
                            this.$emit('updateEvenAttrtList');
                        }
                    })
                    .catch(() => {
                        this.$emit('changeLoading', false);
                    });
            }
        },
        watch: {
            hasChanged() {
                this.$emit('changed', this.hasChanged);
            }
        }
    };
</script>

<style scoped lang="less">
    .tip {
        margin-left: 6px;
    }
</style>
