<template>
    <div class="slide-create-box">
        <edit-title :loading="saveBtnStatus" :disabled="hasChanged" @cancel-click="cancelEdit" @ok-click="okEdit" :title="titleName"></edit-title>
        <div class="slide-scroll-box">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <div class="dialog-padding20">
                    <Card dis-hover>
                        <div class="form-title">运营组名称</div>
                        <Form-item prop="name" class="mb10">
                            <Input class="width400" :maxlength="20" v-model.trim="formValidate.name" placeholder="请输入运营组名称"></Input>
                        </Form-item>
                    </Card>
                    <Card dis-hover class="mt20">
                        <div class="form-title">运营组成员</div>
                        <!-- <div v-if="!isOperSpe">
                            <div class="form-sub-title">责任人</div>
                            <Form-item prop="groupLeader" class="mb10">
                                <Select placeholder="请选择责任人" @on-change="getGroupLeader" v-model="formValidate.groupLeader" filterable class="width400">
                                    <Option v-for="item in selectLeaderData" :value="item.value" :label="item.name" :key="item.value">
                                        <span>{{item.name}}</span>
                                        <span class="name-email">{{item.label}}</span>
                                    </Option>
                                </Select>
                            </Form-item>
                            <div class="form-sub-title form-sub-title-line">组员</div>
                        </div> -->
                        <Form-item class="mb10">
                            <Select placeholder="请选择组员" @on-change="getGroupMember" v-model="formValidate.groupMember" multiple filterable class="width400">
                                <Option v-for="item in selectMemberData" :value="item.value" :label="item.name" :key="item.value">
                                    <span>{{item.name}}</span>
                                    <span class="name-email">{{item.label}}</span>
                                </Option>
                            </Select>
                        </Form-item>
                    </Card>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                groupId: '',
                selectLeaderData: [],
                leaderData: '',
                changedLeader: '',
                selectMemberData: [],
                memberData: [],
                changedMember: [],
                formValidate: {
                    name: '',
                    // groupLeader: "",
                    groupMember: []
                },
                ruleValidate: {
                    name: [{
                               required: true,
                               message: '请输入名称',
                               trigger: 'blur'
                           },
                           {
                               pattern: this.$config.reg_input.reg,
                               message: this.$config.reg_input.msg,
                               trigger: 'blur'
                           }
                    ],
                    groupLeader: [{
                        required: true,
                        message: '请选择一个责任人',
                        trigger: 'change'
                    }]
                },
                dataBack: {}
            };
        },
        props: {
            titleName: {
                type: String,
                default: '添加运营组'
            },
            groupInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            orgInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            // 是否是运营专员
            isOperSpe: {
                type: Boolean,
                default: false
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
        methods: {
            getGroupLeader(val) {
                const hasLeader = this.changedMember.indexOf(val) !== -1;
                if (hasLeader) {
                    this.$Message.destroy();
                    this.$Message.error({
                        content: '该成员已被设为组员',
                        duration: 3
                    });
                // this.$nextTick(() => {
                //     this.formValidate.groupLeader = this.changedLeader;
                // });
                } else {
                    this.formValidate.groupLeader = val;
                    this.changedLeader = val;
                }
            },
            getGroupMember(val) {
                // let hasMember = val.indexOf(this.changedLeader) !== -1;
                // if (hasMember) {
                // this.$Message.destroy();
                // this.$Message.error({
                //     content: '该成员已被设为负责人',
                //     duration: 3
                // })
                // this.$nextTick(() => {
                //     this.formValidate.groupMember = this.changedMember;
                // });
                // } else {
                this.formValidate.groupMember = val;
                this.changedMember = val;
                this.getMemberVal();
            // }
            },
            cancelEdit() {
                // this.$parent.$parent.showEidt = false;
                this.$emit('show-drawer', false);
            },
            okEdit() {
                this.handleSubmit('formValidate');
            },
            getLeaderData() {
                let apiUrl = '/sys/groups/channel-leaders';
                const params = {
                    size: -1
                };
                // 某个运营部门下
                if (this.orgInfo.org_id) {
                    apiUrl = `/sys/groups/${this.orgInfo.org_id}/org-leaders`;
                }
                // 运营专员下负责人为自己（不传），故返回空的Promise
                if (this.isOperSpe) {
                    return new Promise(((resolve) => {
                        resolve();
                    }));
                }
                return this.$axios.get(`${this.$config.apiDomain}${apiUrl}`, {
                    params
                });
            },
            getMemberData() {
                const org_id = this.$config.login_info.auth_info.org_id;
                const apiUrl = `/sys/orgs/${org_id}/org-members`;
                const params = {
                    size: -1
                };
                // 某个运营部门下
                // if (this.orgInfo.org_id) {
                //     apiUrl = `/sys/groups/${this.orgInfo.org_id}/dept-operators`;
                // }
                // // 运营专员下
                // if (this.isOperSpe) {
                //     apiUrl = "/sys/groups/operators";
                // }
                return this.$axios.get(`${this.$config.apiDomain}${apiUrl}`, {
                    params
                });
            },
            getCondition() {
                const userId = this.$config.login_info.user_info.user_id;
                this.$axios.all([this.getMemberData()]).then(
                    this.$axios.spread((perms) => {
                        // 两个请求现在都执行完成
                        // acct &&
                        //     acct.data.forEach(item => {
                        //         this.selectLeaderData.push({
                        //             name: item.name,
                        //             label: item.username,
                        //             value: item.user_id
                        //         });
                        //     });
                        perms && perms.data.items.forEach((item) => {
                            this.selectMemberData.push({
                                name: item.name,
                                label: item.username,
                                value: item.user_id
                            });
                        });
                        if (this.groupInfo.name) {
                            this.groupId = this.groupInfo.groupId;
                            this.formValidate.name = this.groupInfo.name;
                            this.formValidate.groupLeader = this.groupInfo.leaderId;
                            this.formValidate.groupMember = this.groupInfo.groupMembersArr;
                            this.getMemberVal();
                        } else if (this.isOperSpe) {
                            // 运营专员下责任人为自己
                            const selfUserId = this.$config.login_info.user_info.user_id;
                            this.formValidate.groupLeader = selfUserId;
                        }
                        // this.changedLeader = this.formValidate.groupLeader;
                        if (!this.groupInfo.name) {
                            this.formValidate.groupMember = [userId];
                        }
                        this.changedMember = this.formValidate.groupMember;
                        this.dataBack = this.$lodash.cloneDeep(this.formValidate);
                    }),
                );
            },
            getMemberVal() {
                const memberData = this.selectMemberData.filter(item => this.formValidate.groupMember.indexOf(item.value) !== -1);
                this.memberData = memberData;
            },
            editGroup() {
                const groupInfo = this.formValidate;
                const apiUrl = '/sys/groups';
                let ajaxMethods = '';
                let tipMsg = '';
                if (this.groupInfo.name) {
                    ajaxMethods = 'put';
                    tipMsg = '已修改';
                } else {
                    ajaxMethods = 'post';
                    tipMsg = '已添加';
                }
                const sysOperatorDtos = this.memberData.map(item => ({
                    // name: item.name,
                    user_id: item.value
                // username: item.label
                }));
                const params = {
                    group_id: this.groupId || undefined,
                    // leader_id: groupInfo.groupLeader,
                    name: groupInfo.name,
                    // sys_operator_dtos: sysOperatorDtos
                    group_members: sysOperatorDtos
                };
                // 某个运营部门下
                // if (this.orgInfo.org_id) {
                //     if (!this.groupInfo.name) {
                //         apiUrl = `/sys/groups/org`;
                //         params.org_id = this.orgInfo.org_id;
                //     }
                // }
                // // 运营专员下
                // if (this.isOperSpe) {
                //     apiUrl = `/sys/groups/`;
                //     params.leader_id = undefined;
                // }
                this.$axios({
                    method: ajaxMethods,
                    url: `${this.$config.apiDomain}${apiUrl}`,
                    data: params
                })
                    .then(() => {
                        this.updateList(tipMsg);
                    })
                    .catch(() => {
                        this.saveBtnStatus = false;
                    });
            },
            updateList(msg) {
                this.saveBtnStatus = false;
                this.cancelEdit();
                this.$Message.destroy();
                this.$Message.success(msg);
                // 更新列表
                this.$tools.bus.$emit('updateGroupList');
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        this.editGroup();
                    } else {
                        this.saveBtnStatus = false;
                    }
                });
            }
        },
        mounted() {
            this.getCondition();
        }
    };
</script>

<style lang="less" scoped>
    .form-title {
        font-size: 14px;
        font-weight: bold;
        padding-bottom: 10px;
    }
    .form-sub-title {
        font-size: 14px;
        padding: 5px 0;
    }
    .form-sub-title-line {
        margin-top: 20px;
    }
</style>
