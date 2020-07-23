<template>
    <div class="slide-create-box">
        <edit-title :loading="saveBtnStatus" :disabled="hasChanged" @cancel-click="cancelEdit" @ok-click="okEdit" :title="titleName"></edit-title>
        <div class="dialog-padding20 slide-scroll-box">
            <Card dis-hover>
                <div style="padding:0 20px;">
                    <Form class="mt20" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left" :label-width="90">
                        <Form-item label="账号名称" prop="name">
                            <Input class="width400" :maxlength="20" v-model.trim="formValidate.name" placeholder="请输入账号名称"></Input>
                        </Form-item>
                        <Form-item label="URL" prop="notify_url">
                            <Input class="width400" :maxlength="100" placeholder="请输入URL" v-model.trim="formValidate.notify_url"></Input>
                            <Tooltip max-width="240" content="外部系统用来接收系统消息通知的接口URL，必须以http:// 或 https://开头" placement="top">
                                <i class="fa fa-question-circle-o f16"></i>
                            </Tooltip>
                        </Form-item>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                formValidate: {
                    name: '',
                    notify_url: ''
                },
                ruleValidate: {
                    name: [{
                               required: true,
                               message: '请输入账号名称',
                               trigger: 'blur'
                           },
                           {
                               pattern: this.$config.reg_input.custom_reg,
                               message: this.$config.reg_input.custom_msg,
                               trigger: 'blur'
                           }
                    ],
                    notify_url: [{
                        pattern: /(http|https):\/\/([\S]+\/?)\S*$/,
                        message: 'URL必须以http:// 或 https://开头，且不能包含空格',
                        trigger: 'blur'
                    }, {
                        validator: this.validateUrl,
                        trigger: 'blur'
                    }
                    ]
                },
                dataBack: {}
            };
        },
        props: {
            titleName: {
                type: String,
                default: ''
            },
            accountInfo: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        components: {
            editTitle
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.formValidate, this.dataBack);
            }
        },
        mounted() {
            if (this.accountInfo.name) {
                this.formValidate.name = this.accountInfo.name;
                this.formValidate.notify_url = this.accountInfo.notify_url;
            }
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            validateUrl(rule, value, callback) {
                const result = value.match(/(\d{1,}\.){3}\d{1,}/g);
                const expIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                const reg = result && result[0].match(expIp);

                if (result && !reg) {
                    callback(new Error('URL中包含的IP地址不合法'));
                } else {
                    callback();
                }
            },
            cancelEdit() {
                this.$parent.$parent.showEidt = false;
            },
            okEdit() {
                this.handleSubmit('formValidate');
            },
            saveAccount() {
                const accountInfo = this.formValidate;
                const url = '/open-platform/create';
                const mUrl = `/open-platform/modify/${this.accountInfo.userId}/base`;
                const apiUrl = this.accountInfo.name ? mUrl : url;
                const params = {
                    sys_name: accountInfo.name,
                    notify_url: accountInfo.notify_url
                };
                this.$axios({
                    method: this.accountInfo.name ? 'put' : 'post',
                    url: `${this.$config.apiDomain}${apiUrl}`,
                    data: params
                })
                    .then(() => {
                        const tipMsg = this.accountInfo.name ? '已修改' : '已添加';
                        this.updateList(tipMsg);
                    })
                    .catch(() => {
                        this.saveBtnStatus = false;
                    });
            },
            updateList(tipMsg) {
                this.saveBtnStatus = false;
                this.cancelEdit();
                this.$Message.destroy();
                this.$Message.success(tipMsg);
                this.$parent.$parent.getData();
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        this.saveAccount();
                    } else {
                        this.saveBtnStatus = false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.oacc_width{
    width:500px;
}
</style>
