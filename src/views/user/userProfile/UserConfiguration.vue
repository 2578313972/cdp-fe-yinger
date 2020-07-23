<template>
    <div class="mask-bg">
        <edit-title :loading="submitLoading" @cancel-click="cancel" @ok-click="ok" :title="title" :disabled="hasChanged"></edit-title>
        <div class="custom-dialog-content">
            <div class=" m20">
                <!-- 用户列表 -->
                <Card dis-hover class="mb10 ">
                    <p slot="title">用户列表</p>
                    <TraitInput
                        v-bind="trait_params"
                        :closable="true"
                        :count="4"
                        :btnType="true"
                        :URI="traitURL"
                        :isShowTagList="true"
                        :multiple="true"
                        @on-change="setTraitlist"
                        :value="objectAndDefine">
                    </TraitInput>
                </Card>
                <Card dis-hover>
                    <p slot="title">用户详情</p>
                    <!-- 特性组合模块 -->
                    <Card dis-hover class="mb20">
                        <p slot="title">特性组合模块(最多添加3个特性模块)</p>
                        <a href="#" slot="extra" @click.prevent="changeLimit">
                        </a>
                        <div v-for="(item,index) in formValidate.traitModuleList" :key="index">
                            <Row class="mt10 line-height30">
                                <Col span="2"> 组合{{index+1}}名称
                                </Col>
                                <Col span="20">
                                <Input :maxlength='20' v-model.trim="item.group_name" placeholder="请输入组合名称" class="width500"  />
                                </Col>
                                <Col span="1" offset="1">
                                <Icon type="ios-trash" size="18" @click="delModule(item,index)"></Icon>
                                </Col>
                            </Row>
                            <Row class="mt10 mb10 line-height30">
                                <Col span="2"> 添加特性
                                </Col>
                                <Col span="20">
                                <TraitInput
                                    placeholder="添加特性"
                                    v-bind="trait_params"
                                    :closable="true"
                                    :count="8"
                                    :btnType="true"
                                    :URI="traitURL"
                                    :isShowTagList="true"
                                    :multiple="true"
                                    @on-change="(val) => setTraitModule(val,index)"
                                    :value="formValidate.traitModuleDefine[index]">
                                </TraitInput>
                                </Col>
                            </Row>
                            <hr class="hr" />
                        </div>
                        <Button @click="addTraitCombination">添加特性组合模块</Button>
                    </Card>
                    <!-- 行为事件模块 -->
                    <Card dis-hover>
                        <p slot="title">行为事件模块(最多添加3个事件模块)</p>
                        <div v-for="(item,index) in formValidate.eventModuleList" :key="index">
                            <Row class="mt10 line-height30">
                                <Col span="2"> 事件{{index+1}}
                                </Col>
                                <Col span="20">
                                <Select v-model="formValidate.eventModuleList[index].event_info.code" style="width:200px" @on-change="changeEvent(item,index)">{{item}}
                                    <Option v-for="item in eventTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="1" offset="1">
                                <Icon type="ios-trash" size="18" @click="delModule(item,index)"></Icon>
                                </Col>
                            </Row>
                            <Row class="mt10 mb10 line-height30">
                                <Col span="2"> 添加属性
                                </Col>
                                <Col span="20">
                                <TraitInput
                                    :disabled="!formValidate.eventModuleList[index].event_info.code"
                                    btnText="属性"
                                    v-bind="event_params"
                                    :closable="true"
                                    :count="3"
                                    :btnType="true"
                                    :URI="setEventURL(item)"
                                    :isShowTagList="true"
                                    :multiple="true"
                                    @on-change="(val) => setEventModule(val,index)"
                                    :value="formValidate.eventModuleDefine[index]">
                                </TraitInput>
                                </Col>
                            </Row>
                            <hr class="hr" />
                        </div>
                        <Button @click="addEventCombination">添加行为事件模块</Button>
                    </Card>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import qs from 'qs';
    import editTitle from '@/components/EditTitle';
    import TraitInput from '@/components/strategy/TraitInput';

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            customizeData: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                submitLoading: false,
                trait_params: {
                    publicTrait: true,
                    value: {}
                },
                event_params: {
                    scope: 'event',
                    publicTrait: false,
                    value: {},
                    isGetCatalogs: false,
                    common: {
                        code: '',
                        name: '属性'
                    }
                },
                traitURL: {
                    traitsParams: {
                        lifecycle_status: 'active',
                        data_type: ['String', 'Number', 'Bool', 'Date', 'Address', 'Enum', 'Badge', 'StringSet'],
                        authorized: false
                    },
                    searchParams: {
                        visibility: 'public',
                        authorized: false,
                        lifecycle_status: 'active',
                        data_type: ['String', 'Number', 'Bool', 'Date', 'Address', 'Enum', 'Badge', 'StringSet']
                    },
                    catalogsParams: {
                        authorized: false
                    }
                },
                eventURL: {

                },
                objectAndDefine: {
                    value: [],
                    names: []
                },
                eventTypeList: [],
                dataBack: {},
                formValidate: {
                    userList: {}, // 用户列表
                    traitModuleList: [], // 特性模块列表（给后端）
                    eventModuleList: [], // 事件模块列表（给后端）
                    traitModuleDefine: [], // 特性模块组件返回值
                    eventModuleDefine: [] // 事件模块组件返回值
                }
            };
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.dataCollation(), this.dataBack);
            }
        },
        components: {
            editTitle,
            TraitInput
        },
        // created: {},
        mounted() {
            this.getData();
            this.dataBack = this.$lodash.cloneDeep(this.dataCollation());
        },
        methods: {
            dataCollation() {
                const traitModule = this.$lodash.cloneDeep(this.formValidate.traitModuleList);
                traitModule.forEach((v) => {
                    v.trait_list = v.trait_list.map(item => (item.code)).sort();
                });
                const eventModule = this.$lodash.cloneDeep(this.formValidate.eventModuleList);
                eventModule.forEach((v) => {
                    v.trait_list = v.trait_list.map(item => (item.code)).sort();
                });
                return {
                    userList: this.$lodash.cloneDeep(this.objectAndDefine.value).sort(),
                    traitModule,
                    eventModule
                };
            },
            setEventURL(item) {
                return {
                    traits: `${this.$config.apiDomain}/events/${item.event_info.code}/traits`,
                    search: `${this.$config.apiDomain}/events/${item.event_info.code}/traits`,
                    searchParams: {
                        size: -1
                    }
                };
            },
            // 获取配置数据
            getData() {
                // 一、用户列表  userList
                if (this.customizeData.list_view_traits && this.customizeData.list_view_traits.trait_list) {
                    this.formValidate.userList = {
                        trait_list: []
                    };

                    this.customizeData.list_view_traits.trait_list.forEach((item) => {
                        this.objectAndDefine.value.push(item.code);
                        this.objectAndDefine.names.push(item.name);
                        this.formValidate.userList.trait_list.push({
                            code: item.code
                        });
                    });
                }

                // 二、特性模块 traitModuleList
                this.customizeData.detail_view_traits = this.customizeData.detail_view_traits || [];
                if (this.customizeData.detail_view_traits.length) {
                    const traitModule = [];

                    this.customizeData.detail_view_traits.forEach((item, index) => {
                        this.formValidate.traitModuleList.push({
                            group_name: item.group_name,
                            trait_list: []

                        });

                        traitModule[index] = {
                            value: [],
                            names: []
                        };

                        item.trait_list.forEach((v) => {
                            traitModule[index].value.push(v.code);
                            traitModule[index].names.push(v.name);
                            this.formValidate.traitModuleList[index].trait_list.push({
                                code: v.code
                            });
                        });
                    });
                    this.formValidate.traitModuleDefine = traitModule; // 给组件
                }

                // 三、事件模块  eventModuleList
                this.customizeData.events = this.customizeData.events || [];
                if (this.customizeData.events.length) {
                    const eventModule = [];
                    this.customizeData.events.forEach((item, index) => {
                        item.event_info = item.event_info || {};
                        item.trait_list = item.trait_list || [];
                        eventModule[index] = {
                            value: [],
                            names: []
                        };
                        this.formValidate.eventModuleList.push({
                            trait_list: [],
                            event_info: {
                                code: item.event_info.code
                            }
                        });
                        item.trait_list.forEach((v) => {
                            eventModule[index].value.push(v.code);
                            eventModule[index].names.push(v.name);
                            this.formValidate.eventModuleList[index].trait_list.push({
                                code: v.code
                            });
                        });
                    });

                    this.formValidate.eventModuleDefine = eventModule; // 给组件
                }

                // 获取事件列表
                this.$axios.get(`${this.$config.apiDomain}/events`, {
                    params: {
                        authorized: false,
                        size: -1,
                        event_type: ['business_event']
                    },
                    paramsSerializer: params => qs.stringify(params, {
                        indices: false
                    })
                }).then(({
                    data
                }) => {
                    this.eventTypeList = data.items;
                    this.eventTypeList.forEach((item) => {
                        item.value = item.code;
                        item.label = item.name;
                    });
                });
            },
            // /取消创建
            cancel() {
                this.$emit('cancelUserConfiguration', false);
            },
            // 确认提交
            ok() {
                // 代码优化
                let result = true;
                const trait = this.formValidate.traitModuleList;
                const event = this.formValidate.eventModuleList;
                for (let i = 0; i < trait.length; i++) {
                    if (trait[i].group_name == '') {
                        this.$Message.destroy();
                        this.$Message.error(`请补全组合${i + 1} 名称`);
                        result = false;
                        return;
                    } if (!(this.$config.reg_input.reg.test(trait[i].group_name))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        result = false;
                        return false;
                    }
                }
                for (let y = 0; y < event.length; y++) {
                    if (event[y].event_info.code == '' || event[y].event_info.code == undefined) {
                        this.$Message.destroy();
                        this.$Message.error(`请选择事件${y + 1}`);
                        result = false;
                        return false;
                    }
                }
                if (result) {
                    const params = {
                        events: this.formValidate.eventModuleList,
                        list_view_traits: this.formValidate.userList,
                        detail_view_traits: this.formValidate.traitModuleList
                    };

                    this.submitLoading = true;
                    this.$axios.put(`${this.$config.apiDomain}/user-profile-config`, params)
                        .then(() => {
                            this.submitLoading = false;
                            this.$Message.success('已提交');
                            this.$emit('submitCreateUnit', false);
                        })
                        .catch((error) => {
                            this.submitLoading = false;
                            console.error(error);
                        });
                }
            },

            setObject(val, type, index) {
                // 用户列表
                if (type === 'userList') {
                    if (val.names.length > 4) {
                        return;
                    }
                    this.objectAndDefine = this.$lodash.cloneDeep(val);
                    this.formValidate.userList = {
                        trait_list: []
                    };
                    val.value.forEach((item) => {
                        this.formValidate.userList.trait_list.push({
                            code: item
                        });
                    });
                }
                // 特性组合 + 行为事件的两个模块
                else {
                    if (type === 'traitModule') {
                        if (val.names.length > 8) {
                            return;
                        }
                    } else if (type === 'eventModule') {
                        if (val.names.length > 3) {
                            return;
                        }
                    }

                    this.formValidate[`${type}Define`].splice(index, 1, this.$lodash.cloneDeep(val));
                    this.formValidate[`${type}List`][index].trait_list = [];
                    val.value.forEach((item) => {
                        this.formValidate[`${type}List`][index].trait_list.push({
                            code: item
                        });
                    });
                }
            },
            // 用户列表的特性 添加
            setTraitlist(val) {
                return this.setObject(val, 'userList');
            },
            // 特性组合的特性 添加
            setTraitModule(val, index) {
                return this.setObject(val, 'traitModule', index);
            },
            // 行为事件的属性 添加
            setEventModule(val, index) {
                return this.setObject(val, 'eventModule', index);
            },
            // 添加特性组合模块
            addTraitCombination() {
                if (this.formValidate.traitModuleList.length > 2) {
                    this.$Message.destroy();
                    return this.$Message.error('最多添加3个组合');
                }
                this.formValidate.traitModuleList.push({
                    group_name: '',
                    trait_list: []
                });
                this.formValidate.traitModuleDefine.push({
                    value: '',
                    names: ''
                });
            },
            // 添加事件模块
            addEventCombination() {
                if (this.formValidate.eventModuleList.length > 2) {
                    this.$Message.destroy();
                    return this.$Message.error('最多添加3个组合');
                }
                this.formValidate.eventModuleList.push({
                    trait_list: [],
                    event_info: {
                        code: ''
                    }
                });
                this.formValidate.eventModuleDefine.push({
                    value: '',
                    names: ''
                });
            },
            // 删除特性/事件模块
            delModule(item, index) {
                // 为处理iview的modal组件异步调用时，点击确定后，loading取消与modal关闭间歇，按钮可点击的bug
                let delState = false;
                const type = item.event_info ? 'event' : 'trait';
                this.$Modal.confirm({
                    title: '提示',
                    content: `确认删除${type === 'event' ? '事件' : '特性'}组合${index + 1}吗?`,
                    loading: true,
                    onOk: () => {
                        if (delState) {
                            return;
                        }

                        this.formValidate[`${(type)}ModuleList`].splice(index, 1);
                        this.formValidate[`${(type)}ModuleDefine`].splice(index, 1);
                        delState = true;
                        this.$Modal.remove();
                    }
                });
            },
            // 切换事件-请求对应属性
            changeEvent(v, i) {
                // 事件选择重复判断+提示
                const val = v.event_info.code;
                const eventCode = [];
                this.formValidate.eventModuleList[i].trait_list = [];
                this.formValidate.eventModuleList.forEach((item) => {
                    eventCode.push(item.event_info.code);
                });
                eventCode.splice(i, 1);
                const result = eventCode.indexOf(val) !== -1;
                this.formValidate.eventModuleDefine[i] = {
                    value: '',
                    names: ''
                };
                if (result) {
                    this.formValidate.eventModuleList[i].trait_list = [];
                    this.formValidate.eventModuleList[i].event_info.code = null;
                    this.$Message.error(`事件${i + 1}选择重复`);
                    return;
                }
                // 请求事件对应属性
                this.eventURL = {
                    traits: `${this.$config.apiDomain}/events/${val}/traits`,
                    search: `${this.$config.apiDomain}/events/${val}/traits`,
                    searchParams: {
                        size: -1
                    }
                };
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">

</style>
