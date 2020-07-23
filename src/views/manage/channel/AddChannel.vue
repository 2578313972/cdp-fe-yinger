<template>
    <div class="add-channel">
        <Form ref="formArea" label-position="left" :model="formItem" :rules="ruleForm" :label-width="60">
            <edit-title :loading="btnLoading" @cancel-click="cancel" @ok-click="commit" title="新建渠道数据集"></edit-title>
            <div class="custom-dialog-content">
                <Card dis-hover class="m24 p24" :padding="0">
                    <FormItem class="name" prop="name" label="名称">
                        <Input class="name-input" v-model.trim="formItem.name" placeholder="请输入渠道数据集名称" :maxlength="20"/>
                    </FormItem>
                    <FormItem class="type no-marginb" prop="type" label="类型">
                        <RadioGroup
                            class="senior-radio"
                            v-model="formItem.type"
                            type="button"
                            @on-change="handleCatalClick">
                            <Radio
                                v-for="option in catalogArr"
                                :label="option.channel_catalog_name"
                                :key="option.code"
                                style="border-radius: 0;">
                                <i :class="option.icon_type"></i>
                                {{option.channel_catalog_name}}
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem class="no-marginb">
                        <RadioGroup
                            class="junior-radio"
                            v-if="childObj[catalogName] && childObj[catalogName]"
                            v-model="childType"
                            type="button"
                            size="small">
                            <Radio
                            v-for="option in childObj[formItem.type]"
                            :label="option.code"
                            :key="option.code"
                            style="border-radius: 0;">{{option.name}}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <!-- <FormItem class="template" prop="template" label="模板：">
                        <Select class="template-select" v-model="formItem.template_type">
                            <Option v-for="item in templateList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </FormItem> -->
                </Card>
            </div>
        </Form>
    </div>
</template>
<script>
    import editTitle from '@/components/EditTitle';

    export default {
        name: 'AddChannel',
        components: {
            editTitle
        },
        props: ['isShowAddChannel'],
        data() {
            return {
                radioGroup: [],
                catalogArr: [],
                childObj: {},
                btnLoading: false,
                formItem: {
                    name: '',
                    type: ''
                // template_type: ''
                },
                templateList: [],
                catalogName: '',
                childType: '',
                ruleForm: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur' }
                    ],
                    type: [{ required: true, message: '请选择渠道类型', trigger: 'change' }]
                }
            };
        },
        created() {
            this.getType();
            this.getTemplate();
        },
        methods: {
            // 获取类型数据
            getType() {
                const url = `${this.$config.apiDomain}/sys/channels/type`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        this.radioGroup = this.dealData(data);
                        this.catalogArr = this.radioGroup.catalogArr;
                        this.childObj = this.radioGroup.childObj;
                    });
            },
            // 获取模板类型
            getTemplate() {
                const url = `${this.$config.apiDomain}/template/template_type`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        this.templateList = data;
                    });
            },
            // 数据处理
            dealData(data) {
                const catalogArr = [];
                const childObj = {};
                const childItemArr = [];
                const tempArr = [];
                data.forEach((item) => {
                    const channel_catalog_name = item.channel_catalog_name;
                    if (!channel_catalog_name) {
                        item.channel_catalog_name = item.name;
                        catalogArr.push(item);
                    } else if (tempArr.indexOf(channel_catalog_name) > -1) {
                        childItemArr.push(item);
                        childObj[channel_catalog_name] = childItemArr;
                    } else {
                        tempArr.push(channel_catalog_name);
                        catalogArr.push(item);
                        childItemArr.push(item);
                    }
                });
                tempArr.forEach((item) => {
                    const childArr = childItemArr.filter(i => i.channel_catalog_name === item);
                    if (childArr.length) {
                        childObj[item] = childArr;
                    }
                });
                return {
                    catalogArr,
                    childObj
                };
            },
            // 新增渠道集请求
            addChannel(data) {
                this.btnLoading = true;
                const url = `${this.$config.apiDomain}/sys/channels`;
                this.$axios
                    .post(url, data)
                    .then(() => {
                        this.btnLoading = false;
                        this.$Message.success('已添加');
                        this.$emit('add-channel', false);
                        this.$emit('get-data');
                    })
                    .catch(() => {
                        this.btnLoading = false;
                    });
            },
            // 处理父级数据
            getCatalogId(data) {
                let id = '';
                data.forEach((item) => {
                    if (item.channel_catalog_name === this.catalogName) {
                        id = item.code;
                    }
                });
                return id;
            },
            // 提交
            commit() {
                this.$refs.formArea.validate((valid) => {
                    if (valid) {
                        const cataId = this.getCatalogId(this.catalogArr);
                        const data = {
                            channel_type_code: this.childType || cataId,
                            name: this.formItem.name
                        // template_type: this.formItem.template_type
                        };
                        this.addChannel(data);
                    }
                });
            },
            cancel() {
                this.$emit('add-channel', false);
            },
            // 点击父级select触发
            handleCatalClick(data) {
                this.catalogName = data;
                this.childType = this.childObj[data] && this.childObj[data][0].code;
            }
        }
    };
</script>
<style lang="less">
.add-channel {
    width: 750px;
    height: 100%;
    font-size: 14px;
    .no-marginb {
        margin-bottom: 6px;
    }
}
</style>
