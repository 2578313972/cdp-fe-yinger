<template>
    <div class="mask-bg">
        <edit-title :disabled="saveBtnStatus" @cancel-click="cancel" @ok-click="ok" :title="title"></edit-title>
        <div class="custom-dialog-content">
            <div class="common-card">
                <Form class="mt20" ref="formValidate" label-position="left" :label-width="90" :model="formValidate" :rules="ruleValidate" style="padding:0 20px">
                    <!-- 防止浏览器自动填充密码 -->
                    <label style="display:none;"><input type="password" name="emptyPwd"></label>
                    <Form-item label=" 用户名">
                        <span>{{userName}}</span>
                    </Form-item>
                    <Form-item label="原始密码" prop="old">
                        <Input type="password" autocomplete="off" v-model="formValidate.old" placeholder="请输入原始密码"></Input>
                    </Form-item>
                    <Form-item label="新密码" prop="new">
                        <Input type="password" autocomplete="off" v-model="formValidate.new" placeholder="请输入新密码（6-32位）"></Input>
                    </Form-item>
                    <Form-item label="确认密码" prop="confirmNew">
                        <Input type="password" autocomplete="off" v-model="formValidate.confirmNew" placeholder="请确认新密码（6-32位）"></Input>
                    </Form-item>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';
    import md5 from 'blueimp-md5';
    import sha1 from 'js-sha1';

    export default {
        name: '',
        data() {
            return {
                title: '修改密码',
                saveBtnStatus: false, // 保存loading
                userName: '',
                formValidate: {
                    old: '',
                    new: '',
                    confirmNew: ''
                },
                ruleValidate: {
                    old: [
                        { required: true, message: '请输入原始密码', trigger: 'blur' }
                    ],
                    new: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator: this.validateNewPassCheck, trigger: 'blur' }
                    ],
                    confirmNew: [
                        { required: true, message: '请确认新密码', trigger: 'blur' },
                        { validator: this.validatePassCheck, trigger: 'blur' }
                    ]
                }

            };
        },
        components: {
            editTitle
        },
        methods: {
            init() {
                this.userName = this.$config.login_info.user_info.username;
            },
            // 校验新密码输入
            validateNewPassCheck(rule, value, callback) {
                if (value.length > 32 || value.length < 6) {
                    callback(new Error('请确认新密码（6-32位）'));
                }
                else if (/\s+/g.test(value)) {
                    callback(new Error('密码输入有误'));
                } else {
                    callback();
                }
            },
            // 校验密码一致
            validatePassCheck(rule, value, callback) {
                if (value !== this.formValidate.new) {
                    callback(new Error('确认密码不一致，请检查输入'));
                } else {
                    callback();
                }
            },
            cancel() {
                this.$emit('cancel', false);
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // axios 提交
                        const params = {
                            user_id: this.$config.login_info.user_info.user_id,
                            old_pwd: sha1(`smce${md5(this.formValidate.old)}2019`), // this.formValidate.old,
                            new_pwd: sha1(`smce${md5(this.formValidate.new)}2019`), // this.formValidate.new,
                            confirm_pwd: sha1(`smce${md5(this.formValidate.confirmNew)}2019`) // this.formValidate.confirmNew
                        };
                        this.$axios.put(`${this.$config.apiDomain}/user/pwd`, params)
                            .then(() => {
                                this.$Message.success('已修改');
                                // 修改成功关闭弹框并返回登录页
                                this.cancel();
                                setTimeout(() => {
                                    window.location.href = this.$config.sys_config.logout_url;
                                }, 2000);
                            })
                            .catch(() => {
                            });
                    } else {
                    // 提示框输入不合格
                    }
                });
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
