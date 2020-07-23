import _ from 'lodash';
import qs from 'qs';
import utils from '@/utils';
import config from '@/utils/config';
import axios from '@/utils/axios';
import Model from '@/model';

const { TraitModel } = Model;
const { debouncePromise } = utils;
const throttle_wait = config.throttle_wait;
const debounce_wait = config.debounce_wait;

const getTraits = async (params, URI) => {
    URI = URI || {};
    if (params && params.template_type != '' && params.template_type != null) {
        const templateTraitsResult = await getTemplateTraits(params, URI);
        return templateTraitsResult;
    }
    try {
        let result = await axios.get(URI.traits || `${config.apiDomain}/traits`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        result = result.data;
        result.items = result.items.map(trait => new TraitModel(trait));
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// 在Template系统中使用
const getTemplateTraits = async (params, URI) => {
    try {
        let result = await axios.get(URI.traits || `${config.apiDomain}/template/traits`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        result = result.data;
        result.items = result.items.map(trait => new TraitModel(trait));
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};
const getTraitDetail = async (traitCode) => {
    if (!traitCode) {
        return null;
    }
    try {
        const result = await axios.get(`${config.apiDomain}/traits/${traitCode}`);
        return new TraitModel(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getTraitDependant = async (traitCode, params) => {
    if (!traitCode) {
        console.error('trait code cant null');
        return null;
    }

    try {
        let result = await axios.get(`${config.apiDomain}/traits/${traitCode}/dependant`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        result = result.data;
        result.items = result.items.map(trait => new TraitModel(trait));
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const getTraitBeDependent = async (traitCode, params) => {
    if (!traitCode) {
        console.error('trait code cant null');
        return null;
    }

    try {
        let result = await axios.get(`${config.apiDomain}/traits/${traitCode}/be-dependent`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        result = result.data;
        result.items = result.items.map(trait => new TraitModel(trait));
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const createTrait = async (trait) => {
    try {
        const result = await axios.post(`${config.apiDomain}/traits`, trait);
        return new TraitModel(result.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const modifyTrait = async (traitCode, { name, description, catalog_id }) => {
    if (!traitCode) {
        throw new Error('null params');
    }
    const body = {
        name,
        description,
        catalog_id
    };

    try {
        const result = await axios.put(`${config.apiDomain}/traits/${traitCode}`, body);
        return new TraitModel(result.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const modifyTraitStrategies = async (traitCode, is_recalc, strategies) => {
    try {
        const result = await axios.put(`${config.apiDomain}/traits/${traitCode}/strategies?is_recalc=${is_recalc}`, strategies);
        return new TraitModel(result.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const changeTraitLifeCycle = async (traitCode, is_recalc, lifecycle_status) => {
    try {
        const result = await axios.put(`${config.apiDomain}/traits/${traitCode}/change-lifecycle`, {
            is_recalc,
            lifecycle_status
        });
        return new TraitModel(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteTrait = async (traitCode) => {
    try {
        const result = await axios.delete(`${config.apiDomain}/traits/${traitCode}`);
        return new TraitModel(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const publish = async (traitCode, { catalog_id, name }) => {
    const body = {
        catalog_id,
        name
    };
    try {
        const result = await axios.post(`${config.apiDomain}/traits/${traitCode}/publish`, body);
        return new TraitModel(result.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};


export default {
    getTraits: debouncePromise(getTraits, debounce_wait / 4), // 特性列表
    getTemplateTraits,
    getTraitDetail, // 特性详情
    getTraitDependant, // 依赖哪些特性
    getTraitBeDependent, // 被哪些特性依赖
    modifyTraitStrategies: _.throttle(modifyTraitStrategies, throttle_wait), // 修改策略
    modifyTrait: _.throttle(modifyTrait, throttle_wait), // 修改基础属性，名字，描述，目录。
    changeTraitLifeCycle: _.throttle(changeTraitLifeCycle, throttle_wait), // 激活或者冻结
    deleteTrait: _.throttle(deleteTrait, throttle_wait), // 删除特性
    publish: _.throttle(publish, throttle_wait), // 发布
    createTrait: _.throttle(createTrait, throttle_wait) // 创建新特性
};
