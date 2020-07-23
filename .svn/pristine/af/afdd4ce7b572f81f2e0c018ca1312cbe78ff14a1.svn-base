<template>
    <div class="slide-create-box">
        <edit-title :loading="saveBtnStatus" @cancel-click="cancel" @ok-click="ok" :title="title" :disabled="hasChanged"></edit-title>
        <div class="slide-scroll-box dialog-padding20">
            <Card dis-hover class="pl20 pr20">
                <!-- 新建事件 -->
                <Form ref="formValidate" label-position="left" :label-width="110" :model="formValidate" :rules="ruleValidate">
                    <Form-item label="事件ID" prop="code">
                        <Input class="width400" :maxlength='32' v-model.trim="formValidate.code" placeholder="请输入英文ID，长度为32个字以内" />
                        <Tooltip class="f16 tip" transfer content="仅支持小写字母、下划线、数字组成，并以小写字母开头，长度为32个字符以内，不能跟其他事件ID重复，新建后不可修改。" placement="right" max-width="200">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </Form-item>
                    <Form-item label="事件名称" prop="name">
                        <Input :maxlength="20" class="width400" v-model.trim="formValidate.name" placeholder="请输入事件中文名称，长度为20字以内" />
                        <Tooltip class="f16 tip" transfer content="长度为20字以内，不能跟其他事件名称重复。" placement="right" max-width="200">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </Form-item>
                    <Form-item label="事件描述" prop="description">
                        <Input :maxlength='100' class="width400" type="textarea" v-model.trim="formValidate.description" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入事件描述，长度为100字以内" />
                    </Form-item>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                saveBtnStatus: false,
                formValidate: {
                    code: '',
                    name: '',
                    description: ''
                },
                ruleValidate: {
                    code: [
                        {
                            required: true,
                            message: '请输入事件英文ID，长度为32个字以内',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^[a-z][a-z0-9_]*$/,
                            message: '只支持小写英文字母、数字、下划线，并以小写字母开头',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入事件中文名称，长度为20字以内',
                            trigger: 'blur'
                        },
                        {
                            pattern: this.$config.reg_input.reg,
                            message: this.$config.reg_input.msg,
                            trigger: 'blur'
                        }
                    ]
                },
                dataBack: {}
            };
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.formValidate, this.dataBack);
            }
        },
        components: {
            editTitle
        },
        // created: {},
        mounted() {
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            cancel() {
                this.$emit('cancelCreatEvent', false);
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        const params = {
                            name: this.formValidate.name,
                            code: this.formValidate.code,
                            description: this.formValidate.description
                        };
                        this.$axios.post(`${this.$config.apiDomain}/events`, params)
                            .then(({
                                data
                            }) => {
                                this.saveBtnStatus = false;
                                this.$Message.destroy();
                                this.$Message.success('已添加');
                                this.$emit('submitCreatEvent', data);
                            })
                            .catch(() => {
                                this.saveBtnStatus = false;
                            });
                    }
                });
            }
        },
        watch: {},
        destroyed() {}
    };
</script>
