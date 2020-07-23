<template>
    <Modal v-model="isShow" :closable="false" :mask-closable="false" :width="460">
        <div class="publish-title">
            <Icon class="publish-title-help" type="ios-help-circle" />
            <span>发布到公共的资源？</span>
        </div>
        <div style="padding:20px 20px 0 20px">
            <Form
                ref="formValidate"
                label-position="left"
                :label-width="60"
                :model="formValidate"
                :rules="ruleValidate">
                <Form-item label="名称" prop="name">
                    <Input :maxlength='20' v-model="formValidate.name" placeholder="请输入特性名称"></Input>
                </Form-item>
                <Form-item label="目录" prop="catalogName">
                    <Input value="公共目录" readonly style="width:85px;margin-right:5px;"></Input>
                    <Cascader
                        :data="catalogList"
                        :value="catalogs"
                        @on-change="setCatalog"
                        placeholder="请选择目录"
                        transfer
                        change-on-select
                        style="width:218px;display:inline-block;">
                    </Cascader>
                </Form-item>
            </Form>
        </div>
        <div slot="footer">
            <Button @click="cancel" type="text" size="large">取消</Button>
            <Button type="primary" @click="ok" size="large">确定</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        props: {
            isShow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                catalogList: [],
                formValidate: {
                    name: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入特性名称', trigger: 'blur' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur' }
                    ]
                },
                catalogs: []
            };
        },
        methods: {
            setCatalog(catalog) {
                this.catalogs = catalog;
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    this.formValidate.catalogName = this.catalogs;
                    if (valid) {
                        this.$emit('publish', this.formValidate);
                    }
                });
            },
            cancel() {
                this.$emit('cancel');
            },
            init() {
                // 获取公共的目录
                this.$axios.get(`${this.$config.apiDomain}/catalog-tree`, {
                    params: {
                        type: 'trait',
                        visibility: 'public',
                        authorized: false
                    }
                })
                    .then(({ data }) => {
                        const catalogData = data.children || [];
                        if (!catalogData.length) return;
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
                    });
            }
        },
        watch: {
            isShow(val) {
                if (val) {
                    this.formValidate.name = '';
                    this.formValidate.catalogName = [];
                    this.catalogs = [];
                    this.init(); // 每次显示都调目录更新
                } else {
                    this.$refs.formValidate.resetFields();
                }
            }
        },
        mounted() {}
    };
</script>

<style scoped lang="less">
    .publish-title{
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        color: #17233d;
        .publish-title-help{
            color: #ff9900;
            font-size: 28px;
            margin: -8px 5px 0 2px;
        }
    }
</style>
