
<template>
    <div class="mask-bg trait-create">
        <edit-title
            :loading="loading"
            @cancel-click="cancel"
            @ok-click="ok"
            :title="title">
        </edit-title>
        <div class="custom-dialog-content">
            <div class="m20">
                <Card dis-hover>
                    <p slot="title">基本信息</p>
                    <Form
                        class="mt20 pl20 pr20"
                        ref="formValidate"
                        label-position="left"
                        :label-width="80"
                        :model="formValidate"
                        :rules="ruleValidate">
                        <Form-item label="名称" prop="traitName">
                            <Input
                                :maxlength='20'
                                v-model="formValidate.traitName"
                                placeholder="请输入名称"
                                class="width500"/>
                        </Form-item>
                        <Form-item label="目录" prop="catalogName">
                            <Input
                                :value="tabView=='group'?groupName:status_config[tabView]"
                                readonly
                                class="mr10 form-cur-catalog"/>
                            <Cascader
                                transfer
                                change-on-select
                                :data="catalogList"
                                v-model="formValidate.catalogName"
                                class="form-catalog">
                            </Cascader>
                        </Form-item>
                        <Form-item label="类型" prop="m_type">
                            <Select
                                placeholder="请选择特性类型"
                                v-model="formValidate.m_type"
                                @on-change="changeType"
                                class="mr10 width500">
                                <Option
                                    v-for="(item,index) in typeList"
                                    :key="index"
                                    :value="item.code">
                                    {{item.name}}
                                </Option>
                            </Select>
                            <Tooltip
                                max-width="200"
                                :content="toolTip"
                                placement="right">
                                <i class="fa fa-question-circle-o f16"></i>
                            </Tooltip>
                        </Form-item>
                        <Form-item label="配置">
                            <div v-show="formValidate.m_type=='TimeLine'">
                                <span class="line-height">记录最近</span>
                                <InputNumber :min="0" :step="1" v-model="TimeLine_day" class="timeline-day" placeholder="数字填写"></InputNumber>
                                <span class="line-height">天的一个</span>
                                <Select
                                    class="timeline-type"
                                    v-model="TimeLine_Type"
                                    placeholder="请选择类型">
                                    <Option value="Number">数字</Option>
                                    <Option value="Counter">计数器</Option>
                                </Select>
                                <span class="line-height">类型的特性</span>
                            </div>
                            <div v-show="formValidate.m_type=='Enum'">
                                <span class="line-height">设置分类值可选范围为（最多20个）</span>
                                <Select class="enum-type" v-model="Enum_type" placeholder="请选择类型">
                                    <Option value="input">自定义</Option>
                                    <Option value="Zodiac">十二星座</Option>
                                    <Option value="ChineseZodiac">十二生肖</Option>
                                </Select>
                                <Form
                                    class="smce-tootip-width form-multiple"
                                    v-show="Enum_type=='input'"
                                    v-on:submit.native="stopFormAction">
                                    <multiple-tag
                                        filterWords="$"
                                        :is-view="false"
                                        :tag-arr="Enum_tagArr"
                                        :max-tag-num="20"
                                        isShowTip
                                        canKeyDel
                                        tipContent="可输入一个或多个文本，文本中不能包含$符号"
                                        :tag-width="300"
                                        v-on:change-tag="changeTag">
                                    </multiple-tag>
                                </Form>
                            </div>
                            <div v-show="formValidate.m_type=='String'">
                                <span>选择数据格式为</span>
                                <Select class="enum-type " v-model="stringType"  placeholder="请选择类型" style="width:400px">
                                <Option value="all">不限</Option>
                                    <Option v-for="(item,index) in StringList" :value="item.value"  :key="index">{{item.label}}</Option>
                                </Select>
                            </div>
                            <div v-show="(formValidate.m_type!='Enum')&&(formValidate.m_type!='TimeLine')&&(formValidate.m_type!='String')">
                                <span class="line-height">无需特殊配置</span>
                            </div>
                        </Form-item>
                        <Form-item label="描述" prop="des">
                            <Input
                                :maxlength='100'
                                type="textarea"
                                class="width500"
                                v-model.trim="formValidate.des"
                                :autosize="{minRows: 2,maxRows: 3}"
                                placeholder="请输入描述"/>
                        </Form-item>
                    </Form>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';
    import MultipleTag from '@/components/MultipleTag';

    export default {
        props: {
            tabView: {
                default: 'public',
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
                title: '新建特性',
                status_config: {}, // tab状态
                type: 'trait', // 当前页类型，trait或crowd
                loading: false, // 保存loading
                catalogList: [],
                typeList: [], // 类型list
                toolTip: '请选择类型', // 类型后的toolTip提示语
                formValidate: {
                    traitName: '',
                    catalogName: this.hierarchy_id,
                    m_type: '', // model类型
                    des: ''
                },
                ruleValidate: {
                    traitName: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { pattern: this.$config.reg_input.reg, message: this.$config.reg_input.msg, trigger: 'blur' }
                    ],
                    m_type: [
                        { required: true, message: '请选择特性类型', trigger: 'change' }
                    ]
                },
                TimeLine_day: null, // TimeLine多少天
                TimeLine_Type: 'Number', // TimeLine计数类型
                Enum_type: 'input', // Enum类型
                Enum_tagArr: [], // Enum自定义的value
                stringType: 'all',
                StringList: [],
                special_value: 0
            };
        },
        methods: {

            // 阻止表单默认提交刷新页面行为
            stopFormAction(e) {
                e.preventDefault();
            },

            init() {
                this.status_config = this.$config.status_config;
                // 获取目录list
                this.getTree();
                // 获取类型列表
                this.getTypeList();
            },

            getTree() { // 获取目录list
                this.$axios.get(`${this.$config.apiDomain}/catalog-tree`, {
                    params: {
                        type: this.type,
                        visibility: this.tabView,
                        group_id: this.groupID || undefined,
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

            getTypeList() { // 获取类型列表
                this.$axios.get(`${this.$config.apiDomain}/types`)
                    .then(({ data }) => {
                        this.typeList = data;
                    })
                    .catch(() => {});
            },
            // 获取文本类型的配置list
            getStringConfig() {
                // GET /types/{data_type}/limit-types
                this.$axios.get(`${this.$config.apiDomain}/types/${this.formValidate.m_type}/limit-types`)
                    .then(({ data }) => {
                        data.forEach((item) => {
                            item.label = this.status_config[item.format_limit_code];
                            item.value = item.format_limit_code;
                        });
                        this.StringList = data;
                    })
                    .catch(() => {});
            },
            // 切换类型
            changeType(type) {
                const a = this.$lodash.filter(this.typeList, o => type === o.code);
                this.toolTip = a[0].description || '';
                if (type == 'String') {
                    this.getStringConfig();
                }
            },
            cancel() {
                this.$emit('cancel', false);
            },

            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        const param = {
                            visibility: this.tabView, // public,group,self
                            group_id: this.groupID || undefined, // 当visibility == group时必填
                            name: this.formValidate.traitName.trim(), // 特性名称,
                            catalog_id: this.formValidate.catalogName[this.formValidate.catalogName.length - 1] || 0,
                            is_id: false, // false，不知道什么时候为true
                            data_type: this.formValidate.m_type, // 类型
                            description: this.formValidate.des.trim(),
                            format_limit_code: (this.stringType && this.stringType !== 'all') ? this.stringType : undefined
                        };
                        // 枚举
                        if (this.formValidate.m_type === 'Enum') {
                            if (this.Enum_type == 'input' && this.Enum_tagArr.length == 0) {
                                this.$Message.destroy();
                                this.$Message.error('分类值不能为空，请输入或选择分类值');
                                return;
                            }
                            if (this.Enum_type == 'input' && this.Enum_tagArr.length > 20) {
                                this.$Message.destroy();
                                this.$Message.error('最多填写20个');
                                return;
                            }
                            param.optional_config = {
                                value_type_code: this.Enum_type, // Enum类型,自定义-input, 十二生肖--ChineseZodiac, 十二星座--Zodiac。
                                values: (this.Enum_type == 'input') ? this.Enum_tagArr : [] // Enum自定义的value,如：["你","好"]。
                            };
                        }
                        // timeline
                        if (this.formValidate.m_type === 'TimeLine') {
                            if (this.TimeLine_day == null) {
                                this.$Message.destroy();
                                this.$Message.error('请设置天数');
                                return;
                            }
                            param.time_line_config = {
                                capture_date: +this.TimeLine_day, // TimeLine多少天
                                capture_unit: 'day', // 单位
                                capture_type: this.TimeLine_Type // TimeLine计数类型, Number, Counter
                            };
                        }
                        this.loading = true;
                        const _this = this;
                        this.$api.trait.createTrait(param)
                            .then((data) => {
                                this.$Message.destroy();
                                this.$Message.success('已添加');
                                this.cancel();
                                _this.$router.push({
                                    path: '/trait/detail',
                                    query: {
                                        name: 'detail',
                                        code: data.code,
                                        tabView: _this.tabView,
                                        groupID: _this.groupID
                                    }
                                });
                                _this.loading = false;
                            })
                            .catch(() => {
                                _this.loading = false;
                            });
                    }
                });
            },
            changeTag(arr) { // 添加多个条件
                this.Enum_tagArr = arr;
            }

        },
        components: {
            editTitle,
            MultipleTag
        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang="less">
    .trait-create{
        .multiple-tag{
            .ivu-form-item{
                &:after,
                &:before{
                    display: none;
                }
            }
        }
    }
</style>

<style scoped lang="less">
    .form-cur-catalog{
        width:220px; float:left;
    }
    .form-catalog{
        width:270px; display:inline-block;
    }
    .form-multiple{
        display:inline-block;
        vertical-align: top;
    }
    .timeline-day{
        margin:0 5px;
        width:100px;
    }
    .timeline-type{
        margin:0 5px;
        width:220px;
    }
    .enum-type{
        margin:0 5px;
        width:140px;
    }
    .line-height{
        line-height:32px;
    }
</style>
