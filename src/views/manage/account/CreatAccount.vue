<template>
    <div class="slide-create-box">
        <edit-title :loading="saveBtnStatus" :disabled="hasChanged" @cancel-click="cancelEdit" @ok-click="okEdit" :title="titleName"></edit-title>
        <div class="dialog-padding20 slide-scroll-box">
            <Card dis-hover>
                <Tabs v-if="!accountInfo" @on-click="handleSelect" :value="activeName">
                    <TabPane label="手工开通" name="manual"></TabPane>
                    <TabPane disabled label="批量上传" name="upload"></TabPane>
                </Tabs>
                <div v-show="activeName=='manual'" style="padding:0 10px;">
                    <Form class="mt20 " ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left" :label-width="80">
                        <Form-item label="员工ID" prop="employeeId">
                            <Input :maxlength="64" v-model.trim="formValidate.employeeId" placeholder="请输入员工ID"></Input>
                        </Form-item>
                        <Form-item label="用户名" prop="username">
                            <Input v-model.trim="formValidate.username" :maxlength="20" placeholder="请输入用户名"></Input>
                        </Form-item>
                        <Form-item label="姓名" prop="name">
                            <Input  v-model.trim="formValidate.name" :maxlength="20" placeholder="请输入姓名"></Input>
                        </Form-item>
                        <Form-item label="邮箱" prop="email">
                            <Input :maxlength="50" v-model.trim="formValidate.email" placeholder="请输入邮箱"></Input>
                        </Form-item>
                        <Form-item label="手机" prop="mobile">
                            <Input :maxlength="11" v-model.trim="formValidate.mobile" placeholder="请输入手机"></Input>
                        </Form-item>
                    </Form>
                </div>
                <div v-show="activeName=='upload'">
                    <div class="down-template"><a>下载模板</a></div>
                    <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
                        <div style="padding: 50px 0">
                            <Icon type="ios-filing" size="52" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                        </div>
                    </Upload>
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
                activeName: 'manual',
                formValidate: {
                    name: '',
                    mobile: '',
                    employeeId: '',
                    email: '',
                    username: ''
                },
                ruleValidate: {
                    name: [{
                               required: true,
                               message: '请输入姓名',
                               trigger: 'blur'
                           },
                           {
                               pattern: this.$config.reg_input.custom_reg,
                               message: this.$config.reg_input.custom_msg,
                               trigger: 'blur'
                           }
                    ],
                    mobile: [{
                        pattern: /^(1[3|5|7|8][0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|19[8|9]|166)\d{8}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    }],
                    employeeId: [{
                                     required: true,
                                     message: '请输入员工ID',
                                     trigger: 'blur'
                                 },
                                 {
                                     pattern: this.$config.reg_input.custom_reg,
                                     message: this.$config.reg_input.custom_msg,
                                     trigger: 'blur'
                                 }],
                    email: [{
                                required: true,
                                message: '请输入邮箱',
                                trigger: 'blur'
                            },
                            {
                                pattern: /^[A-Za-z0-9_\u4e00-\u9fa5-.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                                message: '邮箱格式不正确',
                                trigger: 'blur'
                            }
                    ],
                    username: [{
                                   required: true,
                                   message: '请输入用户名',
                                   trigger: 'blur'
                               },
                               {
                                   pattern: this.$config.reg_input.custom_reg,
                                   message: this.$config.reg_input.custom_msg,
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
                this.formValidate.mobile = this.accountInfo.mobile;
                this.formValidate.employeeId = this.accountInfo.employeeId;
                this.formValidate.email = this.accountInfo.email;
                this.formValidate.username = this.accountInfo.username;
            }
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            // 选择tab
            handleSelect(currentName) {
                this.activeName = currentName;
            },
            cancelEdit() {
                this.$parent.$parent.showEidt = false;
            },
            okEdit() {
                this.handleSubmit('formValidate');
            },
            idValidate(name) {
                // @on-keyup="idValidate('employeeId')"
                this.formValidate[name] = this.formValidate[name].replace(/[^\d]/g, '');
            },
            editAccount() {
                const accountInfo = this.formValidate;
                const url = '/sys/users';
                const apiUrl = this.accountInfo.name ? `${url}/${this.accountInfo.userId}` : url;
                const params = {
                    email: accountInfo.email,
                    employee_id: accountInfo.employeeId,
                    mobile: accountInfo.mobile,
                    name: accountInfo.name,
                    username: accountInfo.username
                };
                this.$axios({
                    method: this.accountInfo.name ? 'put' : 'post',
                    url: `${this.$config.apiDomain}${apiUrl}`,
                    data: params
                })
                    .then(() => {
                        const tipMsg = this.accountInfo.name ? '已修改' : '已添加';
                        this.updateList(tipMsg, !this.accountInfo.name);
                    })
                    .catch(() => {
                        this.saveBtnStatus = false;
                    });
            },
            updateList(tipMsg, isAdd) {
                this.saveBtnStatus = false;
                this.cancelEdit();
                this.$Message.destroy();
                this.$Message.success(tipMsg);
                // 更新列表
                this.$tools.bus.$emit('updateAccountList', isAdd);
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        this.editAccount();
                    } else {
                        this.saveBtnStatus = false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .down-template {
        text-align: right;
        padding-bottom: 16px;
    }
</style>
