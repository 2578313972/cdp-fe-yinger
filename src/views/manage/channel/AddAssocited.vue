<template>
    <div class="mask-bg">
        <edit-title @cancel-click="cancel" @ok-click="ok" :disabled="hasChanged" :title="drawerType=='edit'?'修改渠道关联':'新建渠道关联'"></edit-title>
        <div class="custom-dialog-content">
            <Card dis-hover class="m24" :padding="0">
                <p slot="title"><span>基本信息</span> <span class="title-des">（请先选择渠道，再选择特性）</span></p>
                <Form class="mt24" ref="formValidate" label-position="left" :label-width="110" :model="formValidate" :rules="ruleValidate" style="padding:0 24px">
                    <Form-item label="渠道一" prop="source_channel_code">
                        <Select :disabled="isdisabled" v-model="formValidate.source_channel_code" :label-in-value="true" @on-change="changeSourceChannel" placeholder='请选择资源渠道'>
                            <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="渠道一特性" :class="{ 'diy-form-item-error': source_trait_error }" class="diy_star">
                        <TraitInput placeholder="请选择特性" :URI="SOURCE_URI" :disabled="source_disabled" class="touch_trait" v-bind="source_traitData" :value="add_source_trait"  @on-change="updateSourceTrait" >
                        </TraitInput>
                        <div v-show="source_trait_error" class="ivu-form-item-error-tip">请选择资源特性</div>
                    </Form-item>
                    <Form-item label="渠道二" prop="target_channel_code">
                        <Select :disabled="isdisabled" v-model="formValidate.target_channel_code" :label-in-value="true" @on-change="changeTargetChannel" placeholder='请选择资源渠道'>
                            <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="渠道二特性" :class="{ 'diy-form-item-error': target_trait_error }" class="diy_star">
                        <TraitInput placeholder="请选择特性" :URI="TARGET_URI" :disabled="target_disabled" class="touch_trait" v-bind="target_traitData" :value="add_target_trait"   @on-change="updateTargetTrait">
                        </TraitInput>
                        <div v-show="target_trait_error" class="ivu-form-item-error-tip">请选择目标特性</div>
                    </Form-item>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
    import TraitInput from '@/components/strategy/TraitInput.vue';
    import EditTitle from '@/components/EditTitle';

    export default {
        props: {
            drawerType: {
                type: String,
                default: ''
            },
            editChannel: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                // title: "添加渠道关联",
                source_trait_error: false,
                target_trait_error: false,
                channelList: [],
                add_source_trait: {},
                add_target_trait: {},
                // 用于选择特性类型
                source_traitData: {
                    publicTrait: true,
                    value: {}
                // disabled:is_trait_input
                },
                target_traitData: {
                    publicTrait: true,
                    value: {}
                },
                // 用于表单验证
                formValidate: {
                    source_channel_code: '',
                    target_channel_code: '',
                    source_channel_name: '',
                    target_channel_name: ''
                },
                mapping_code: '',
                // 是否必填
                ruleValidate: {
                    // 所属活动
                    source_channel_code: [{
                        required: true,
                        message: '请选择资源渠道',
                        trigger: 'change'
                    }],
                    target_channel_code: [{
                        required: true,
                        message: '请选择目标渠道',
                        trigger: 'change'
                    }]
                },
                SOURCE_URI: {},
                TARGET_URI: {},
                dataBack: {},
                source_disabled: true,
                target_disabled: true
            };
        },
        computed: {
            isdisabled() {
                return this.drawerType == 'edit';
            },
            hasChanged() {
                return this.$lodash.isEqual({
                    ...this.formValidate,
                    add_source_trait: this.add_source_trait.value,
                    add_target_trait: this.add_target_trait.value
                }, this.dataBack);
            }
        },
        components: {
            EditTitle,
            TraitInput
        },
        mounted() {
            this.init();
            this.dataBack = this.$lodash.cloneDeep({
                ...this.formValidate,
                add_source_trait: this.add_source_trait.value,
                add_target_trait: this.add_target_trait.value
            });
        },
        methods: {
            init() {
                this.getChannel();
                this.isChannel();
            },
            // 获取渠道列表
            getChannel() {
                this.$axios.get(`${this.$config.apiDomain}/sys/channels?size=-1`)
                    .then(({
                        data
                    }) => {
                        data.items.forEach((item) => {
                            item.label = item.name;
                            item.value = item.channel_id;
                        });
                        this.channelList = data.items;
                    })
                    .catch(() => {
                        this.btnLoading = false;
                    });
            },
            isChannel() {
                // 如果是修改，给弹框赋值 否则，置空
                if (this.drawerType === 'edit') {
                    // 当从编辑进来时，disabled取消掉
                    this.source_disabled = false;
                    this.target_disabled = false;

                    this.add_source_trait = {
                        names: [this.editChannel.mappings[0].trait_name],
                        value: [this.editChannel.mappings[0].trait_code],
                        source: 'trait'
                    };
                    this.add_target_trait = {
                        names: [this.editChannel.mappings[1].trait_name],
                        value: [this.editChannel.mappings[1].trait_code],
                        source: 'trait'
                    };
                    this.formValidate.source_channel_code = this.editChannel.mappings[0].channel_code;
                    this.formValidate.target_channel_code = this.editChannel.mappings[1].channel_code;
                    this.mapping_code = this.editChannel.mapping_code;
                    this.addSOURCE_URI();
                    this.addTARGET_URI();
                } else {
                    this.formValidate = {};
                }
            },
            // 切换资源渠道
            changeSourceChannel(val) {
                this.add_source_trait = {};
                this.formValidate.source_channel_name = val.label;
                if (this.formValidate.source_channel_name) {
                    this.source_disabled = false;
                    this.addSOURCE_URI();
                }
            },
            // 切换目标渠道
            changeTargetChannel(val) {
                this.add_target_trait = {};
                this.formValidate.target_channel_name = val.label;
                if (this.formValidate.target_channel_name) {
                    this.target_disabled = false;
                    this.addTARGET_URI();
                }
            },
            // 添加渠道一的特性面板请求URL
            addSOURCE_URI() {
                this.SOURCE_URI = {
                    traits: `${this.$config.apiDomain}/traits/channel/${this.formValidate.source_channel_code}`,
                    traitsParams: {
                        channel_code: this.formValidate.source_channel_code,
                        lifecycle_status: 'active',
                        data_type: 'String',
                        authorized: false
                    },
                    catalogs: `${this.$config.apiDomain}/catalogs/channel/${this.formValidate.source_channel_code}`,
                    catalogsParams: {
                        authorized: false
                    },
                    search: `${this.$config.apiDomain}/searcher/traits-and-crowds/channel_code/${this.formValidate.source_channel_code}`,
                    searchParams: {
                        lifecycle_status: 'active',
                        data_type: 'String',
                        authorized: false
                    }
                };
            },
            // 添加渠道二的特性面板请求URL
            addTARGET_URI() {
                this.TARGET_URI = {
                    traits: `${this.$config.apiDomain}/traits/channel/${this.formValidate.target_channel_code}`,
                    traitsParams: {
                        channel_code: this.formValidate.target_channel_code,
                        lifecycle_status: 'active',
                        data_type: 'String',
                        authorized: false
                    },
                    catalogs: ` ${this.$config.apiDomain}/catalogs/channel/${this.formValidate.target_channel_code}`,
                    catalogsParams: {
                        authorized: false
                    },
                    search: ` ${this.$config.apiDomain}/searcher/traits-and-crowds/channel_code/${this.formValidate.target_channel_code}`,
                    searchParams: {
                        lifecycle_status: 'active',
                        data_type: 'String',
                        authorized: false
                    }
                };
            },
            // 取消创建
            cancel() {
                this.$emit('cancelAddAssociated', false);
            },
            // 提交创建渠道关联 在此判断是新建还是修改,再发起请求
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (!this.add_source_trait.names) {
                        this.source_trait_error = true;
                        valid = false;
                    }
                    if (!this.add_target_trait.names) {
                        this.target_trait_error = true;
                        valid = false;
                    }
                    if (valid) {
                        if (this.formValidate.source_channel_code === this.formValidate.target_channel_code) {
                            this.$Message.destroy();
                            this.$Message.error('渠道1和渠道2不能相同');
                            return;
                        }
                        // 修改
                        if (this.drawerType === 'edit') {
                            const params = [{
                                                channel_code: this.formValidate.source_channel_code,
                                                trait_code: this.add_source_trait.value[0]
                                            },
                                            {
                                                channel_code: this.formValidate.target_channel_code,
                                                trait_code: this.add_target_trait.value[0]
                                            }
                            ];
                            this.$axios.put(`${this.$config.apiDomain}/id-mappings/${this.mapping_code}`, params)
                                .then(() => {
                                    this.$tools.bus.$emit('updateChannelList', true);
                                    this.$emit('submitAddAssociated', false);
                                    this.$Message.destroy();
                                    this.$Message.success('已修改');
                                });
                        }
                        // 创建
                        else {
                            /**
                             * 按照顺序传给后端
                             * 渠道一: source_channel add_source_trait
                             * 渠道二：target_channel add_target_trait
                             */
                            const param = [];
                            param[0] = {
                                channel_code: this.formValidate.source_channel_code,
                                channel_name: this.formValidate.source_channel_name,
                                trait_code: this.add_source_trait.value[0],
                                trait_name: this.add_source_trait.names[0]
                            };
                            param[1] = {
                                channel_code: this.formValidate.target_channel_code,
                                channel_name: this.formValidate.target_channel_name,
                                trait_code: this.add_target_trait.value[0],
                                trait_name: this.add_target_trait.names[0]
                            };
                            this.$axios.post(`${this.$config.apiDomain}/id-mappings`, param)
                                .then(() => {
                                    this.$tools.bus.$emit('updateChannelList', true);
                                    this.$emit('submitAddAssociated', false);
                                    this.$Message.destroy();
                                    this.$Message.success('已添加');
                                });
                        }
                    }
                });
            },
            // 更新资源特性面板
            updateSourceTrait(val) {
                this.add_source_trait = this.$lodash.cloneDeep(val);
                this.source_trait_error = false;
            },
            // 更新目标特性面板
            updateTargetTrait(val) {
                this.add_target_trait = this.$lodash.cloneDeep(val);
                this.target_trait_error = false;
            }
        },
        watch: {},
        destroyed() {}
    };
</script>
<style lang="less">
    .diy-form-item-error {
        .tag-input{
            border-color: #ed4014!important;
            &.active {
                box-shadow: 0 0 0 2px rgba(237,64,20,.2)!important;
            }
        }
        .ivu-select-arrow{
            color: #ed4014!important;
        }
    }
    .diy_star {
        .ivu-form-item-label:after {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed3f14;
        }
    }
    .custom-dialog-content {
        .ivu-card-head {
            padding: 18px 24px;
        }
    }
</style>

<style scoped lang="less">
    .touch_trait {
        display: block; // width: 50%
        width: 100%;
    }
    .title-des {
        font-size: 12px;
        font-weight: 500;
        color: #808695;
        padding-left: 10px;
        i {
            color: #008cf8;
            padding: 0 5px;
            font-style: normal;
            font-size: 14px;
            vertical-align: bottom;
        }
    }
</style>
