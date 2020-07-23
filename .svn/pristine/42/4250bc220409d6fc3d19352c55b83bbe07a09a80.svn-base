<template>
    <div class="add-architect">
        <Form ref="formArea" :model="formItem" :rules="ruleForm">
            <edit-title :loading="btnLoading" @cancel-click="cancel" @ok-click="save" title="新建运营架构"></edit-title>
            <div class="custom-dialog-content">
                <div class="dialog-padding20 content common-card">
                    <FormItem class="content-name" prop="name">
                        <p class="sub-title">运营架构名称</p>
                        <Input class="name-input" :maxlength="20" v-model.trim="formItem.name" placeholder="请输入架构名称"/>
                    </FormItem>
                    <FormItem class="content-config" prop="userRule">
                        <p class="sub-title">用户归属规则</p>
                        <RadioGroup v-model="formItem.userRule" vertical @on-change="handleRadio">
                            <Radio label="all">
                                <span>全量用户</span>
                                <Tooltip class="tooltip" content="架构上各节点均覆盖渠道内全量用户" placement="right">
                                    <i class="fa fa-question-circle-o f16"></i>
                                </Tooltip>
                            </Radio>
                            <Row>
                                <Col>
                                    <Radio :label="traitItem" class="trait-radio">
                                        <span>通过特性匹配</span>
                                    </Radio>
                                    <Select v-model="traitItem" @on-change="handleSelect" class="trait-select">
                                        <Option v-for="item in confList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                    </Select>
                                    <Tooltip class="tooltip" content="架构上各节点将只包含特性值与节点编码精确匹配的用户" :max-width="200" transfer>
                                        <i class="fa fa-question-circle-o f16"></i>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </RadioGroup>
                    </FormItem>
                </div>
            </div>
        </Form>
    </div>
</template>
<script>
    import EditTitle from '@/components/EditTitle';

    export default {
        name: 'AddArchitect',
        components: {
            EditTitle
        },
        props: {
            title: {
                type: String,
                default: '添加'
            },
            detail: {
                type: Object,
                default: () => ({
                    name: ''
                })
            },
            rootInfo: {
                type: Object
            }
        },
        created() {
            this.getConfig();
        },
        data() {
            return {
                btnLoading: false,
                confList: [],
                traitItem: '',
                formItem: {
                    name: '',
                    userRule: 'all'
                },
                ruleForm: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur' }
                    ],
                    userRule: [
                        { required: true, message: '请选择特性', trigger: 'change' }
                    ]
                },
                ascription_type: {
                    all: 'all'
                }
            };
        },
        methods: {
            handleSelect(val) {
                if (val) {
                    this.formItem.userRule = this.traitItem = val;
                } else {
                    this.traitItem = '';
                }
            },
            handleRadio(val) {
                this.formItem.userRule = val;
                this.traitItem = '';
            },
            // 取消
            cancel() {
                this.$emit('close-modal', false);
                this.$refs.formArea.resetFields();
            },
            // 保存
            save() {
                this.$refs.formArea.validate((valid) => {
                    if (valid) {
                        const { name, userRule } = this.formItem;
                        if (this.title === '添加') {
                            const params = {
                                name: name.trim(),
                                res_code: userRule,
                                ascription_type: this.ascription_type[userRule] || 'trait'
                            };
                            const apiUrl = '/sys/orgs';
                            this.sendRequest(apiUrl, 'post', params);
                        } else if (this.title === '修改') {
                            const apiUrl = `/sys/orgs/${this.rootInfo.orgId}?name=${name}&res_code=${userRule}`;
                            this.sendRequest(apiUrl, 'put');
                        }
                    }
                });
            },
            // 获取用户配置请求
            getConfig() {
                const url = '/traits?size=-1&data_type=String&data_type=StringSet&visibility=public&authorized=false&lifecycle_status=active';
                this.$axios
                    .get(`${this.$config.apiDomain}${url}`)
                    .then(({ data }) => {
                        this.confList = data.items;
                    });
            },
            // 发送保存请求
            sendRequest(url, method, params) {
                this.btnLoading = true;
                this.$axios[method](`${this.$config.apiDomain}${url}`, params)
                    .then(() => {
                        this.btnLoading = false;
                        this.$refs.formArea.resetFields();
                        // 更新成功后获取最新架构树
                        this.$emit('get-root-tree-name');
                        this.$emit('get-root-tree');
                        this.$Message.success(`已${this.title}`);
                        this.$emit('close-modal', false);
                    })
                    .catch(() => {
                        this.btnLoading = false;
                    });
            }
        }
    };
</script>
<style scoped lang="less">
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
    clear: both;
}
.clearfix {
    zoom: 1;
}
.add-architect {
    height:100%;
    width: 750px;
    form{
        height:100%;
    }
    .title {
        padding: 10px 20px;
        border-bottom: 1px solid #eee;
        background: #fff;
        h3 {
            float: left;
            padding-top: 6px;
            font-size: 16px;
            font-weight: bold;
        }
        .button {
            float: right;
            .save {
                margin-left: 15px;
            }
        }
        .ivu-form-item {
            margin-bottom: 0;
        }
    }
    .content {
        .sub-title {
            font-size: 14px;
            font-weight: bold;
        }
        .content-name {
            margin-bottom: 20px;
            .sub-title {
                margin-bottom: 5px;
            }
            .name-input {
                width: 450px;
            }
        }
        .content-config {
            margin-bottom: 20px;
            .ivu-select {
                width: 346px;
            }
            .trait-radio {
                display: inline-block;
            }
            .tooltip {
                margin-left: 5px;
            }
        }
    }
}
</style>
