<template>
    <div class="slide-create-box">
        <!-- 配置属性 -->
        <edit-title
            :loading="saveBtnStatus"
            :disabled="attributeType==='old'?hasChanged:hasChangedNew"
            :title="title"
            @cancel-click="cancel"
            @ok-click="ok">
        </edit-title>
        <div class="slide-scroll-box dialog-padding20">
            <Card dis-hover class="pl20 pr20">
                <div class="mt10 mb20">
                    <span class="mr20"> 配置方式：</span>
                    <RadioGroup v-model="attributeType" @on-change="changeOldNew">
                        <Radio label="old"><span>选择已有属性添加</span></Radio>
                        <Radio label="new"><span>自定义新建并添加</span></Radio>
                    </RadioGroup>
                </div>
                <!-- 选择已有 -->
                <div v-if="attributeType==='old'" class="pb200">
                    <Alert class="mb16" show-icon>从属性列表中选择已有的属性信息，配置到当前事件中</Alert>
                    <Row class="mt10 mb10">
                        <Col span="2" class="line-height30">选择属性：</Col>
                        <Col span="22">
                            <TraitInput
                                btnText="添加属性"
                                v-bind="eventParams"
                                :closable="true"
                                :btnType="true"
                                :URI="URL"
                                :isShowTagList="true"
                                :multiple="true"
                                :value="objectAndDefine"
                                @on-change="setTraitlist">
                            </TraitInput>
                        </Col>
                    </Row>
                </div>
                <!-- 自定义新建 -->
                <div v-if="attributeType==='new'">
                    <Alert class="mb16" show-icon>自定义新建属性，将在新建后自动配置到当前事件中，并添加到属性列表中</Alert>
                    <CreateAttribute
                        :createURI="apiUrl"
                        ref="createAttr"
                        @updateEvenAttrtList="updateEvenAttrtList"
                        @changeLoading="changeLoading"
                        @changed="changed">
                    </CreateAttribute>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import TraitInput from '@/components/strategy/TraitInput';
    import editTitle from '@/components/EditTitle';
    import CreateAttribute from './CreateAttribute.vue';

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            eventCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                hasChangedNew: false,
                saveBtnStatus: false,
                apiUrl: {
                    url: `/events/${this.eventCode}/traits`,
                    type: 'eventAttr'
                },
                attributeType: 'old',
                eventParams: {
                    scope: 'event',
                    publicTrait: false,
                    value: {},
                    isGetCatalogs: false,
                    common: {
                        code: '',
                        name: '属性'
                    }
                },
                objectAndDefine: {
                    value: [],
                    names: []
                },
                URL: {
                    traits: `${this.$config.apiDomain}/events/${this.eventCode}/event-traits`,
                    search: `${this.$config.apiDomain}/events/${this.eventCode}/event-traits`,
                    searchParams: {
                        scope: 'event',
                        publicTrait: false,
                        visibility: 'public'
                    }
                },
                dataBack: []
            };
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.$lodash.cloneDeep(this.objectAndDefine.value).sort(), this.dataBack);
            }
        },
        components: {
            TraitInput,
            editTitle,
            CreateAttribute
        },
        mounted() {
            this.dataBack = this.$lodash.cloneDeep(this.objectAndDefine.value).sort();
        },
        methods: {
            changeOldNew() {
                this.objectAndDefine = {
                    value: [],
                    names: []
                };
            },
            changed(val) {
                this.hasChangedNew = val;
            },
            changeLoading(val) {
                this.saveBtnStatus = val;
            },
            setTraitlist(val) {
                this.objectAndDefine = this.$lodash.cloneDeep(val);
            },
            // /取消创建
            cancel() {
                this.$emit('cancelAttributeConfig', false);
            },
            updateEvenAttrtList() {
                this.$emit('submitAttributeConfig', this.eventCode);
            },
            ok() {
                // 从已有的属性里面选择关联
                if (this.attributeType === 'old') {
                    this.saveBtnStatus = true;
                    if (!this.objectAndDefine.value.length) {
                        this.$Message.destroy();
                        this.$Message.error('请先添加属性');
                        return;
                    }
                    const params = this.objectAndDefine.value;
                    this.$axios.post(`${this.$config.apiDomain}/events/${this.eventCode}/relation/trait`, params)
                        .then(({
                            data
                        }) => {
                            this.saveBtnStatus = false;
                            this.$Message.destroy();
                            this.$Message.success('已添加');
                            this.$emit('submitAttributeConfig', data);
                        })
                        .catch(() => {
                            this.saveBtnStatus = false;
                        });
                }
                // 自定义新建属性
                else {
                    this.$refs.createAttr.handleSubmit('formValidate');
                }
            }
        }
    };
</script>
