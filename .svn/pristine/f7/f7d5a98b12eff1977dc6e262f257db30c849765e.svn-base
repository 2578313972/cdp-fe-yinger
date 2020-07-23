<template>
<div class="base-info bottom-shadow">
    <Form class="form-wrapper" :model="formItem" :rules="ruleForm" ref="formArea" v-on:submit.native="stopFormAction">
        <Row class="title">
            <Col span="12" class="name">
                <edit-input
                    class="node-name"
                    form-prop="name"
                    v-model="formItem.name"
                    :edit-show="showEdit"
                    @change="change"
                    @confirm-info="saveNodeInfo"
                    @cancel-edit="cancelEdit"
                    @change-status="changeStatus">
                </edit-input>
            </Col>
            <Col span="12" class="upload">
                <a :href="downloadLink">下载模板</a>
                <Tooltip
                    class="tooltip"
                    transfer
                    max-width="250"
                    content="对不存在子节点的，可导入文件进行初始化设置；对已存在子节点的无法导入"
                    placement="right">
                    <Upload
                        :show-upload-list="false"
                        multiple
                        :format="['xlsx', 'xls']"
                        :on-format-error="handleFormatError"
                        :max-size="1024"
                        :on-exceeded-size="uploadSizeError"
                        :action="uploadLink"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :on-error="handleError">
                        <Button>
                            <span class="iconfont icon-file_upload custom-icon"></span>
                            导入子节点
                        </Button>
                    </Upload>
                </Tooltip>
            </Col>
        </Row>
        <Row class="content-wrapper">
            <Col span="24" class="root-info">
                <span class="info-name">用户归属规则：</span>
                <span class="info-detail">{{rootInfo.res_name}}
                    <Tooltip class="tooltip" :content="ruleContent" placement="right">
                        <span class="iconfont icon-action_help_outline"></span>
                    </Tooltip>
                </span>
                <span class="info-name">用户数：</span>
                <span>共
                    <span class="customer-count">{{(orgInfo.customer_count || 0) | formatAmount}}</span>人
                </span>
            </Col>
            <Col span="24" v-if="rootInfo.ascription_type !== 'all'">
                <multiple-tag class="node-code-wrapper nopl"
                    ref="multag"
                    :hasEditIcon="true"
                    labelName="节点编码："
                    :form-label-width="76"
                    :is-view="isView"
                    :tag-arr="formItem.user_trait_values"
                    canKeyDel
                    customReg
                    :tagPlaceholder="tagPlaceholder"
                    :tag-width="multagWidth"
                    @change-tag="changeTag"
                    @change-status="changeTagStatus"
                    @confirm="confirm"
                    @close="close">
                </multiple-tag>
            </Col>
        </Row>
    </Form>
</div>
</template>

<script>
    import { cloneDeep } from 'lodash';
    import MultipleTag from '@/components/MultipleTag.vue';
    import EditInput from '@/components/EditInput.vue';

    export default {
        name: 'NodeInfo',
        components: {
            MultipleTag,
            EditInput
        },
        props: {
            rootInfo: {
                type: Object,
                default: () => ({})
            },
            orgInfo: {
                type: Object,
                default: () => ({})
            },
            rootId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                multagWidth: 50,
                tempForm: {},
                formItem: {
                    name: '',
                    user_trait_values: []
                },
                ruleForm: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur, change' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur, change' }
                    ]
                },
                downloadLink: `${this.$config.apiDomain}/sys/orgs/org-template`,
                uploadLink: '',
                isView: true,
                btnLoading: false,
                ruleContent: '',
                showEdit: true,
                tagPlaceholder: '无'
            };
        },
        mounted() {
            this.getInfo();
        },
        methods: {
            // 阻止表单默认提交刷新页面行为
            stopFormAction(e) {
                e.preventDefault();
            },
            // 获取节点最新数据
            getInfo() {
                const {
                    name,
                    user_trait_values,
                    org_id
                } = this.orgInfo;
                const trait_arr_temp = cloneDeep(user_trait_values);
                // 用于缓存form表单之前的数据，用来显示保存按钮的状态
                this.tempForm = { name, user_trait_values };
                this.formItem = {
                    name,
                    user_trait_values: trait_arr_temp
                };
                // 基本信息用户归属规则提示信息
                this.ruleContent = this.rootInfo.ascription_type === 'all'
                    ? '将渠道内全量用户划分到各节点'
                    : '通过特性将用户数据划分到相应节点，与节点编码精确匹配的用户数据，将被划分到当前节点的数据权限范围内';
                // 导入子节点链接信息
                this.uploadLink = `${this.$config.apiDomain}/sys/orgs/org-importing?org_id=${org_id}`;
            },
            change(val) {
                this.formItem.name = val;
            },
            // 修改input框编辑状态
            changeStatus(val) {
                this.showEdit = val;
            },
            // 修改tag自定义输入框编辑状态
            changeTagStatus(status) {
                this.isView = status;
            },
            // tag自定义输入框确认事件
            confirm() {
                this.saveNodeInfo();
            },
            // 关闭tag编辑框编辑状态
            close() {
                this.getInfo();
                this.showEdit = true;
            },
            // 取消保存
            cancelEdit() {
                this.getInfo();
                this.isView = true;
                this.showEdit = true;
            },
            // 保存
            saveNodeInfo() {
                this.$refs.formArea.validate((valid) => {
                    if (valid) {
                        if (JSON.stringify(this.tempForm) === JSON.stringify(this.formItem)) {
                            this.showEdit = true;
                            this.isView = true;
                        } else {
                            this.sendRequest();
                        }
                    }
                });
            },
            // 发送修改请求
            sendRequest() {
                this.btnLoading = true;
                const { name, user_trait_values } = this.formItem;
                const params = {
                    name,
                    user_trait_values: JSON.stringify(user_trait_values)
                };
                const url = `/sys/orgs/${this.orgInfo.org_id}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${url}`, params)
                    .then(() => {
                        this.btnLoading = false;
                        this.showEdit = true;
                        this.isView = true;
                        this.$Message.success('已修改');
                        const tempOrgInfo = Object.assign(this.orgInfo, {
                            name,
                            user_trait_values
                        });
                        this.$tools.bus.$emit('watchRootId', tempOrgInfo);
                        this.$emit('update-architect-info', tempOrgInfo);
                    })
                    .catch(() => {
                        // 请求发送失败时保持提交前状态，用户可再次进行提交
                        this.btnLoading = false;
                    });
            },
            // 文件上传前
            beforeUpload() {
                this.$emit('loading', true);
            },
            // 文件上传成功回调
            handleSuccess() {
                this.$Message.info({
                    content: '导入成功',
                    duration: 3
                });
                const params = {
                    org_id: this.rootInfo.org_id
                };
                this.$emit('loading', false);
                this.$tools.bus.$emit('finishUploadTreeData', params);
            },
            // 文件大小超限回调
            uploadSizeError() {
                this.$Message.destroy();
                this.$Message.error({
                    content: '无法导入，文件大小超过限制',
                    duration: 5
                });
                this.$emit('loading', false);
            },
            // 文件类型上传出错回调
            handleFormatError() {
                this.$Message.destroy();
                this.$Message.error({
                    content: '无法导入，请检查文件格式',
                    duration: 5
                });
                this.$emit('loading', false);
            },
            // 文件上传失败回调
            handleError(error, res) {
                this.$Message.destroy();
                this.$Message.error({
                    content: res.message,
                    duration: 5
                });
                this.$emit('loading', false);
            },
            // 更新父组件tag数组
            changeTag(item) {
                this.formItem = Object.assign({}, this.formItem, {
                    user_trait_values: item
                });
            },
            // 处理&兼容节点编码数据格式
            dealTraitCodeArr(data) {
                let { user_trait_values } = data;
                if (user_trait_values) {
                    if (user_trait_values.indexOf('[') > -1
                        && user_trait_values.indexOf(']') > -1) {
                        user_trait_values = JSON.parse(user_trait_values);
                    } else {
                        const tempArr = [];
                        user_trait_values && user_trait_values.length && tempArr.push(user_trait_values);
                        user_trait_values = tempArr;
                    }
                }
                data = Object.assign(data, {
                    user_trait_values
                });
                return data;
            }
        },
        watch: {
            orgInfo: {
                handler() {
                    this.getInfo();
                    this.showEdit = true;
                    this.isView = true;
                    (!this.formItem.user_trait_values || this.formItem.user_trait_values === '[]') && (this.tagPlaceholder = '无');
                    this.$refs.multag && (this.$refs.multag.isActive = false);
                },
                deep: true
            },
            isView() {
                this.tagPlaceholder = !this.isView ? '请添加' : '无';
                this.multagWidth = !this.isView ? 300 : 50;
            }
        }
    };
</script>

<style lang="less">
.base-info {
    padding: 24px;
    background: #fff;
    font-family: 'PingFangSC-Regular', sans-serif;
    font-size: 14px;
    color: #17233D;
    line-height: 21px;
    .iconfont {
        cursor: pointer;
    }
    .title {
        padding-bottom: 20px;
        .node-name {
            .edit-input-label {
                font-size: 20px;
            }
            .ivu-form-item-content {
                line-height: normal;
            }
        }
        .upload {
            text-align: right;
            a {
                margin-right: 10px;
            }
            .custom-icon {
                margin-right: 3px;
                color: #17233D;
            }
        }
    }
    .content-wrapper {
        .root-info {
            padding-bottom: 5px;
            .info-name {
                font-family: 'PingFangSC-Medium', sans-serif;
            }
            .info-detail {
                padding-right: 16px;
            }
            .customer-count {
                color: #2185F0;
            }
        }
        .node-code-wrapper {
            padding-top: 10px;
        }
    }
}
</style>
