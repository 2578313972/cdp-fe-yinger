<template>
    <div class="inline">
        <ConditionCascade
            :disabled="disabled"
            :multiple="multiple"
            :catalogChild="traitAndCrowdOptions"
            :catalogParent="catalogOptions"
            :titleCatalog="selectCatalogs"
            :value="curSelected"
            @on-show="cleanOptionalInfo"
            @findCatalog="getCatalogs"
            @curChecked="selectTraitOrCrowd"
            @searchCatalog = "searchInputRes"
            :loading="loading"
            :placeholder="placeholder"
            :btnColor='btnColor'
            :btnType='btnType'
            :btnText='btnText'
            :isShowTag='isShowTag'
            :isShowTagList='isShowTagList'
            :count='count'
            :closable="closable"
        >
        </ConditionCascade>
    </div>
</template>

<script>
    import _ from 'lodash';
    import api from './strategyApi';
    import ConditionCascade from '../ConditionCascade';
    import Model from './strategyModel';

    const { TraitModel, CrowdModel } = Model;

    export default {
        name: 'trait-input',
        components: { ConditionCascade },
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            count: {
                type: [Number, String],
                default: Infinity
            },
            closable: {
                type: Boolean,
                default: false
            },
            btnColor: {
                type: String,
                default: 'default'
            },
            btnType: {
                type: Boolean,
                default: false
            },
            btnText: {
                type: String,
                default: '特性'
            },
            isShowTag: {
                type: Boolean,
                default: true
            },
            isShowTagList: {
                type: Boolean,
                default: false
            },
            value: {
                type: Object,
                default() {
                    return {}; /** value:[],names:[],source,data_type */
                }
            },
            filterIds: { // 必须含code,scope;如:filterIds=[{code:"123", scope:"user"}]
                type: Array,
                default() {
                    return [];
                }
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            dataType: Array, //  允许使用的特性类型
            common: Object, //  通用的设置    {id,code,name,visibility,isVirtual}
            event: Object, //  需要显示的Event的特性
            group: Object, //  当前组，包括ID，name
            template: Object, // 当前渠道的id和name -- 目前在template项目中使用
            URI: Object, /* 策略的接口地址修改，可不传，有默认值
                                {
                                    search:`${config.apiDomain}/searcher/traits-and-crowds`,
                                    catalogs:`${config.apiDomain}/template/catalogs`,
                                    traits:`${config.apiDomain}/traits`,
                                    crowds:`${config.apiDomain}/crowds/drop/list`,
                                    events:`${config.apiDomain}/events/${eventCode}`,


                                    searchParams:{},    // 搜索的参数
                                    catalogsParams:{},  // 目录的参数
                                    traitsParams:{},    // 特性的参数
                                    crowdsParams:{},    // 人群的参数
                                    eventsParams:{},    // 事件特性的参数
                                }
                                */
            isGetCatalogs: { // 是否需要请求目录
                type: Boolean,
                default: true
            },
            selfTrait: {
                type: Boolean,
                default: false
            },
            allCrowd: {
                type: Boolean,
                default: false
            },
            publicTrait: {
                type: Boolean,
                default: true
            },
            groupTrait: {
                type: Boolean,
                default: false
            },
            templateTrait: { // 是否有渠道特性 -- 目前在template项目中使用
                type: Boolean,
                default: false
            },
            resType: {
                type: String,
                default: null
            },
            selfCrowd: {
                type: Boolean,
                default: false
            },
            groupCrowd: {
                type: Boolean,
                default: false
            },
            scope: { // 特性的级别（事件级别还是用户级别）
                type: String,
                default: 'user'
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                keyword: null, // 用于Bug【SMCERS-445】，搜索时的结果抛弃
                isRoot: true, // 用于Bug【SMCERS-445】，点击path或目录时
                catalogs: null,
                traits: null,
                crowds: null,
                searchResults: null,
                selectCatalogs: null,
                parentCatalog: null,
                loading: false
            };
        },
        created() {

        },
        mounted() {
        },
        computed: {
            valueCode() {
                return (this.value.value && this.value.value) || [];
            },
            mounted() {
            },
            curSelected() {
                // 当前选中的特性或者人群。
                if (!this.value) {
                    return [];
                }
                const names = !!this.value && !!this.value.names ? this.value.names : [];
                const scopes = !!this.value && !!this.value.scopes ? this.value.scopes : [];
                // const source = !!this.value ? this.value.source : '';
                const data_type = this.value ? this.value.data_type : '';
                const items = _.map(this.value.value, (code, i) => (code ? {
                    code,
                    name: names[i] ? names[i] : '',
                    scope: scopes[i] ? scopes[i] : '',
                    data_type
                } : null));
                return _.compact(items);
            },
            traitAndCrowdOptions() {
                // 保证具体目录不包含全量人群
                if (!!this.searchResults && !this.searchResults.length) {
                    return [];
                }

                let result = [];

                // 全量人群（区分角色，目前只有“人群对比分析”添加）
                const allCrowdName = {
                    ROLE_C_ADMIN: '渠道全量人群',
                    ROLE_D_OPERATOR: '节点全量人群',
                    ROLE_D_ADMIN: '节点全量人群'
                };
                !!this.allCrowd && result.push(
                    {
                        code: '$cr-all',
                        name: allCrowdName[this.$config.login_info.role_id] || '全量人群',
                        calc_status: 'calc_success',
                        res_type: 'crowd'
                    }
                );

                if (!!this.traits && this.traits.length > 0) {
                    result = _.map(this.traits, trait => new TraitModel(trait));
                } else if (!!this.crowds && this.crowds.length > 0) {
                    result = _.map(this.crowds, crowd => new CrowdModel(crowd));
                } else if (!!this.searchResults && this.searchResults.length > 0) {
                    return this.searchResults;
                    // 保证具体目录不包含全量人群
                } else if (this.parentCatalog) {
                    return [];
                }
                return result;
            },
            catalogOptions() {
                if (!!this.catalogs && this.catalogs.length > 0 && !!this.parentCatalog) {
                    // 当前有选中的目录。
                    return this.catalogs;
                } if (this.parentCatalog != null) {
                    return [];
                }

                // 显示默认
                const result = [];
                const template = this.template || {};
                // 通用
                !!this.common && result.push({
                    id: 0,
                    name: '属性',
                    visibility: 'public',
                    isVirtual: true,
                    ...this.common,
                    res_type: this.resType || 'trait',
                    scope: this.scope
                });
                // 事件
                !!this.event && result.push({
                    id: 0,
                    name: '事件',
                    ...this.event,
                    visibility: 'event',
                    res_type: this.resType || 'event_trait',
                    isVirtual: true,
                    template_type: template.template_type,
                    scope: this.scope
                });
                // 公共特性
                !!this.publicTrait && result.push({
                    id: 0,
                    name: '公共特性',
                    visibility: 'public',
                    res_type: this.resType || 'trait',
                    isVirtual: true,
                    scope: this.scope
                });
                // 私有的特性
                !!this.selfTrait && result.push({
                    id: 0,
                    name: '私有的特性',
                    visibility: 'self',
                    res_type: this.resType || 'trait',
                    isVirtual: true,
                    scope: this.scope
                });
                // 运营组特性
                !!this.groupTrait && !!this.group && result.push({
                    ...this.group,
                    group_id: this.group.id,
                    name: `${this.group.name}的特性`,
                    id: 0,
                    visibility: 'group',
                    res_type: this.resType || 'trait',
                    isVirtual: true,
                    scope: this.scope
                });
                // 渠道
                !!this.templateTrait && !!this.template && result.push({
                    ...template,
                    template_type: template.template_type,
                    name: `${template.name}的渠道`,
                    id: 0,
                    visibility: 'template',
                    res_type: this.resType || 'trait',
                    isVirtual: true,
                    scope: this.scope
                });
                // 私有的人群
                !!this.selfCrowd && result.push({
                    id: 0,
                    name: '私有的人群',
                    visibility: 'self',
                    res_type: this.resType || 'crowd',
                    isVirtual: true,
                    scope: this.scope
                });
                // 运营组人群
                !!this.groupCrowd && !!this.group && result.push({
                    ...this.group,
                    group_id: this.group.id,
                    name: `${this.group.name}的人群`,
                    id: 0,
                    visibility: 'group',
                    res_type: this.resType || 'crowd',
                    isVirtual: true,
                    scope: this.scope
                });

                return result;
            }
        },
        methods: {
            cleanOptionalInfo() {
                this.parentCatalog = null;
                this.catalogs = null;
                this.traits = null;
                this.crowds = null;
                this.searchResults = null;
            },
            trim(value) {
                if (value == null) {
                    return '';
                }
                return value.trim();
            },
            filterTraitIds(traitList) {
                // return _.chain(traitList).filter(trait => !~this.filterIds.indexOf(trait.code)).value();
                const filterContents = [];
                const filterIds = this.filterIds || [];
                const spaceStr = '-#@:|=|:@#-';
                filterIds.map((item) => {
                    filterContents.push(this.trim(item.scope) + spaceStr + this.trim(item.code));
                });
                return _.chain(traitList).filter(trait => !~filterContents.indexOf(this.trim(trait.scope) + spaceStr + this.trim(trait.code))).value();
            },
            // 搜索特性
            searchInputRes(keyword) {
                const that = this;
                let params = null;
                this.cleanOptionalInfo();

                this.keyword = keyword;

                // 异步的形式调用。。为了使用async 和 await，可以做成promise的形式调用。
                if (!keyword || keyword.length == 0) {
                    return;
                }
                if (that.templateTrait && that.template && !!that.template.template_type) {
                    params = {
                        template_type: that.template && that.template.template_type,
                        q: keyword,
                        event_code: (that.event && that.event.code) || null,
                        data_type: _.compact(that.dataType)
                    };
                } else {
                    params = {
                        public_trait: that.publicTrait,
                        self_trait: that.selfTrait,
                        group_trait: that.groupTrait,
                        event_code: (that.event && that.event.code) || null,
                        group_id: (that.group && that.group.id) || null,
                        template_type: (that.template && that.template.template_type) || null, // 仅template中会使用，即当visibility: 'template'时，才使用
                        self_crowd: that.selfCrowd,
                        group_crowd: that.groupCrowd,
                        q: keyword,
                        data_type: _.compact(that.dataType)
                    };
                }
                void (async function () {
                    that.loading = true;
                    try {
                        // 处理参数
                        that.extendParams(params, 'search');

                        // 先清空，防止搜索时全量人群闪烁
                        that.searchResults = [];

                        const result = await api.searchTraitAndCrowds(params, that.URI);

                        // 修复Bug【SMCERS-445】
                        // that.searchResults = result.items;

                        if (that.dataType && that.dataType.length > 0) {
                            const dataType = that.dataType;
                            // 根据类型过滤掉不能选择的特性
                            that.searchResults = that.keyword == '' ? [] : _.chain(result.items).filter((trait) => {
                                let traitDataType = trait.data_type;
                                if (~trait.data_type.indexOf('TimeLine')) {
                                    traitDataType = 'TimeLine';
                                }
                                return !!~dataType.indexOf(traitDataType);
                            }).value();
                        } else {
                            that.searchResults = that.keyword == '' ? [] : result.items;
                        }

                        that.searchResults = that.filterTraitIds(that.searchResults);
                    } catch (e) {
                        that.loading = false;
                    }
                    that.loading = false;
                }());
            },
            extendParams(params, type) {
                params = params || {};
                const uri = this.URI || {};
                const extendParam = uri[`${type}Params`] || {};
                Object.keys(extendParam).map((key) => {
                    params[key] = extendParam[key];
                });
            },
            // 获取catalog
            getCatalogs(catalog) {
                const that = this;
                this.catalogs = null;
                this.traits = null;
                this.crowds = null;
                this.searchResults = null;
                if (!catalog) {
                    // 修复Bug【SMCERS-445】
                    that.isRoot = true;// params.parent_id == 0 ? true : false;
                    // 选择了最上层的目录。
                    this.parentCatalog = null;
                    return;
                }
                if (catalog.isVirtual) {
                    // 修复Bug【SMCERS-445】
                    // that.isRoot = true;         // 这话的没有实在意义了，因为被下面的赋值覆盖了
                    // 虚拟目录。保存起来
                    this.parentCatalog = catalog;
                }
                // 修复Bug【SMCERS-445】
                that.isRoot = false;

                // catalog参数
                let params = {};
                const template_type = this.parentCatalog && this.parentCatalog.template_type;
                const parent_id = catalog.id || 0;
                params.visibility = this.parentCatalog.visibility;
                params.type = this.parentCatalog.res_type;
                params.group_id = this.parentCatalog.group_id;
                params.parent_id = catalog.id || 0;
                // 仅template中会使用，即当visibility: 'template'时，才使用
                params.template_type = template_type;
                let traitParams = null;
                let crowdParams = null;
                let eventCode = null;

                if (this.parentCatalog.res_type === 'trait' || (!!this.templateTrait && this.parentCatalog.res_type === 'event')) {
                    traitParams = {
                        size: -1,
                        include_sub_catalog: false,
                        data_type: _.compact(that.dataType)
                    };
                    traitParams.visibility = this.parentCatalog.visibility;
                    traitParams.group_id = this.parentCatalog.group_id;
                    traitParams.catalog_id = catalog.id || 0;
                    // 仅template中会使用，即当visibility: 'template'时，才使用
                    traitParams.template_type = template_type;
                    traitParams.scope = this.scope;
                    traitParams.size = -1;
                } else if (this.parentCatalog.res_type === 'crowd') {
                    crowdParams = {
                        size: -1,
                        ...this.parentCatalog
                    };
                    crowdParams.catalog_id = catalog.id || 0;
                // crowdParams.visibility = this.parentCatalog.visibility;
                // crowdParams.group_id = this.parentCatalog.group_id;
                // crowdParams.catalog_id = this.parentCatalog.catalog_id;
                } else if (this.parentCatalog.res_type === 'event_trait') {
                    // 事件特性
                    if (!this.event || !this.event.code) {
                        console.error('event 为空');
                        return;
                    }
                    params = null; // 事件没有下级目录
                    eventCode = catalog.code;
                }

                void (async function () {
                    try {
                        // 获取子目录
                        that.loading = true;
                        let result = null;
                        if (!!params && that.isGetCatalogs !== false) {
                            // 处理参数
                            that.extendParams(params, 'catalogs');
                            result = await api.getCatalogs(params, that.URI);
                            if (!that.isRoot) { // 修复Bug【SMCERS-445】, 因为在根目录下不可能需要发起请求；防止上次发出的请求因响应慢而被接收
                                that.catalogs = result;
                            }
                        }

                        // 获取目录里面的特性
                        if (traitParams) {
                            // 处理参数
                            that.extendParams(traitParams, 'traits');
                            result = await api.getTraits(traitParams, that.URI);
                            if (!that.isRoot) { // 修复Bug【SMCERS-445】
                                that.traits = result.items;

                                that.traits = that.filterTraitIds(that.traits);
                            }
                        } else if (crowdParams) {
                            // 处理参数
                            that.extendParams(crowdParams, 'crowds');
                            result = await api.getCrowdsDropList(crowdParams, that.URI);
                            result.items.forEach((i) => {
                                i.id = i.crowd_code;
                                i.res_type = 'crowd';
                            });
                            if (!that.isRoot) { // 修复Bug【SMCERS-445】
                                that.crowds = result.items;

                                that.crowds = that.filterTraitIds(that.crowds);
                            }
                        } else if (eventCode) {
                            const eventTraitParam = {
                                size: -1,
                                template_type,
                                parent_id
                            };
                            // 处理参数
                            that.extendParams(eventTraitParam, 'events');
                            // 拉取事件的特性
                            result = await api.eventDetail(eventCode, eventTraitParam, that.URI);
                            if (!that.isRoot) { // 修复Bug【SMCERS-445】
                                that.traits = _.concat(result.basic_traits, result.traits);
                                if (that.dataType && that.dataType.length > 0) {
                                    const dataType = that.dataType;
                                    // 根据类型过滤掉不能选择的特性
                                    that.traits = _.chain(that.traits).filter((trait) => {
                                        let traitDataType = trait.data_type;
                                        if (~trait.data_type.indexOf('TimeLine')) {
                                            traitDataType = 'TimeLine';
                                        }
                                        return !!~dataType.indexOf(traitDataType);
                                    }).value();
                                }

                                that.traits = that.filterTraitIds(that.traits);
                            }
                        }
                        that.loading = false;
                    } catch (e) {
                        that.loading = false;
                    }
                }());
            },
            selectTraitOrCrowd(selectedItems) {
                if (_.isEqual(selectedItems, this.curSelected)) {
                    return;
                }

                const codes = _.map(selectedItems, item => item.code);

                const names = _.map(selectedItems, item => item.name);

                const scopes = _.map(selectedItems, item => item.scope);

                const dataTypes = _.chain(selectedItems).map(t => t.data_type).uniq().value();

                const sources = _.chain(selectedItems).map(t => t.res_type || t.scope).uniq().compact()
                    .value();

                if (dataTypes.length > 1) {
                // alert('选择了不同类型的数据')
                }

                if (sources.length > 1) {
                // alert('选择了不同类型的数据')
                }

                const result = {
                    data_type: dataTypes[0],
                    // data_types: dataTypes,
                    time_line_config: selectedItems[0] ? selectedItems[0].time_line_config : undefined,
                    source: sources[0],
                    value: codes,
                    names,
                    scopes
                };
                this.$emit('on-change', result);
            }
        }
    };
</script>

<style scoped lang="less">
    .inline{
        display: inline-block;
        vertical-align: middle; // 解决人群的“更新方式”上下样式不对齐的问题 ，Bug【SMCERS-134】
    }
</style>
