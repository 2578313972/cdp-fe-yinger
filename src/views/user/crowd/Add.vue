<template>
    <div class="mask-bg">
        <edit-title :disabled="saveDisabled" :loading="saveLoading" @cancel-click="cancel" @ok-click="ok" :title="title"></edit-title>
        <div class="custom-dialog-content">
            <div class="m20">
                <Card dis-hover>
                    <p slot="title">基本信息</p>
                    <Form class="mt20" ref="formValidate" label-position="left" :label-width="70" :model="formValidate" :rules="ruleValidate" style="padding:0 20px">
                        <Form-item label="名称" prop="crowdName">
                            <Input :maxlength='20' v-model="formValidate.crowdName" placeholder="请输入人群名称" style="width:500px;"/>
                        </Form-item>
                        <Form-item label="目录" prop="catalogName">
                            <Input :value="tabView=='group'?groupName:status_config[tabView]" readonly style="width:220px; margin-right:10px;"/>
                            <Cascader
                                transfer
                                change-on-select
                                :data="catalogList"
                                v-model="formValidate.catalogName"
                                style="width:270px;display:inline-block;"></Cascader>
                        </Form-item>
                        <Form-item label="描述" prop="des">
                            <Input :maxlength='100' type="textarea" v-model="formValidate.des" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入描述" style="width:500px;"/>
                        </Form-item>
                    </Form>
                </Card>
            </div>
            <!-- 本期先隐藏，下个版本添加 @晓晴5.17-->
            <!-- <div class="m20">
                <Card dis-hover>
                    <p slot="title">附属人群</p>
                     <Table class="smce-table-noscroll" ref="selection"
                        :columns="columns"
                        :data="accessoryList"
                        @on-selection-change="onChange">
                    </Table>
                </Card>
            </div> -->
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        props: {
            tabView: {
                default: 'self',
                type: String
            },
            groupID: {
                default: '',
                type: String
            },
            groupName: { // 当前运营组名称
                default: '',
                type: String
            },
            hierarchy_id: {
                default: [],
                type: Array
            }
        },
        data() {
            return {
                title: '新建人群',
                status_config: {}, // tab状态
                saveDisabled: false, // 保存置灰
                saveLoading: false, // 保存loading
                catalogList: [], // 目录list
                formValidate: {
                    crowdName: '',
                    catalogName: this.hierarchy_id,
                    des: ''
                },
                ruleValidate: {
                    crowdName: [
                        { required: true, message: '请输入人群名称', trigger: 'blur' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur' }
                    ]
                },
                selectList: [], // 选中的附属人群
                accessoryList: [], // 附属人群list
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    }
                ]
            };
        },
        methods: {

            init() {
                this.status_config = this.$config.status_config;
                this.getCatalog();
                this.getAccessoryList();
            },

            // get 目录list
            getCatalog() {
                this.$axios.get(`${this.$config.apiDomain}/catalog-tree`, {
                    params: {
                        group_id: (this.tabView == 'group') ? this.groupID : undefined,
                        type: 'crowd',
                        visibility: this.tabView, // public-公共, group-运营组, self-私有
                        authorized: false
                    }
                })
                    .then(({ data }) => {
                        let catalogData = data.children || [];
                        if (!catalogData.length) return;
                        if (this.tabView == 'group') {
                            catalogData = data.children;
                        }
                        (function aaa(arr) {
                            arr.forEach((item) => {
                                item.label = item.name;
                                item.value = item.id;
                                if (item.children && item.children.length) aaa(item.children);
                            });
                        }(catalogData));
                        this.$nextTick(() => {
                            this.catalogList = catalogData;
                        });
                    })
                    .catch(() => {});
            },

            // get 附属人群list
            getAccessoryList() {
                this.$axios.get(`${this.$config.apiDomain}/crowds/auxiliary/define`)
                    .then(({ data }) => {
                        this.accessoryList = data;
                    })
                    .catch(() => {});
            },
            cancel() {
                this.$emit('cancel', false);
            },

            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // axios 提交
                        this.saveLoading = true;
                        const selectList = [];
                        this.selectList.forEach((item) => {
                            selectList.push(item.auxiliary_type);
                        });
                        const params = {
                            group_id: this.groupID || undefined, // 组id
                            catalog_id: this.formValidate.catalogName[this.formValidate.catalogName.length - 1] || 0, // 目录
                            name: this.formValidate.crowdName.trim(), // 名称
                            description: this.formValidate.des.trim(), // 描述
                            auxiliary_types: selectList,
                            visibility: this.tabView
                        };
                        this.$axios.post(`${this.$config.apiDomain}/crowds/base`, params)
                            .then(({ data }) => {
                                this.cancel();
                                this.$router.push({
                                    path: '/crowd/detail',
                                    query: {
                                        name: 'detail',
                                        code: data.code,
                                        tabView: this.tabView,
                                        groupID: this.groupID
                                    }
                                });
                            })
                            .catch(() => {
                                this.saveLoading = false;
                                this.saveDisabled = false;
                            });
                    } else {
                    // 提示框输入不合格
                    }
                });
            },

            onChange(sel) {
                this.selectList = sel;
            }

        },
        components: {
            editTitle
        },
        mounted() {
            this.init();
        }
    };
</script>
