import _ from 'lodash';
import config from '@/utils/config';
import axios from '@/utils/axios';
import qs from 'qs';
// import cacheData from './operator.json';

import api from '@/api';

const throttle_wait = config.throttle_wait;

const cache = {
    data: {},
    get(key) {
        const k = _.isString(key) ? key : qs.stringify(key, { indices: false });
        return this.data[k];
    },
    set(key, value) {
        const k = _.isString(key) ? key : qs.stringify(key, { indices: false });
        this.data[k] = value;
    }
};

const initBaseTypeOperationCache = async () => {
    const result = await axios.get(`${config.apiDomain}/types/cache`);
    cache.data = result.data;
    // console.log(cache.data);
};

const getNextAvailableParam = async (typeCode, operatorCode, { cur_param_type }, triggerParent, resource_type) => {
    const keyObj = {
        cur_param_type,
        data_type: typeCode,
        operator_code: operatorCode,
        resource_type,
        ...triggerParent
    };

    try {
        const cacheResult = cache.get(keyObj);
        if (cacheResult) {
            return _.cloneDeep(cacheResult);
        }

        const result = await axios.get(`${config.apiDomain}/types/${typeCode}/operators/${operatorCode}/next-available-param`, {
            params: {
                ...triggerParent,
                cur_param_type,
                resource_type
            },
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        const results = _.map(result.data, (paramDefine) => {
            const newParamDefine = { ...paramDefine };
            delete newParamDefine.code;
            return newParamDefine;
        });
        cache.set(keyObj, results);
        return _.cloneDeep(results);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getOperators = async (dataType, params, resource_type) => {
    const keyObj = {
        ...params,
        resource_type,
        data_type: dataType
    };
    const cacheResult = cache.get(keyObj);
    if (cacheResult) {
        return _.cloneDeep(cacheResult);
    }
    try {
        const result = await axios.get(`${config.apiDomain}/types/${dataType}/operators`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false }),
            resource_type
        });
        cache.set(keyObj, result.data);
        return _.cloneDeep(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const searchTraitAndCrowds = async (params, URI) => {
// const searchTraitAndCrowds = async ({public_trait, self_trait,group_trait,event_code,group_id,template_type,self_crowd,group_crowd,key_word,data_type,size=-1,data_type}, URI) => {
    URI = URI || {};
    params = params || {};
    params.size = params.size == null ? -1 : params.size;
    params = _.pickBy(params, value => (value != null && value !== ''));
    if (params && params.template_type != '' && params.template_type != null) {
        const templateSearcherTraitsResult = await getTemplateSearcherTraits(params, URI);
        return templateSearcherTraitsResult;
    }

    try {
        const result = await axios.get(URI.search || `${config.apiDomain}/searcher/traits-and-crowds`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return _.cloneDeep(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getTemplateSearcherTraits = async ({
    template_type, key_word, event_code, data_type
}, URI) => {
    URI = URI || {};
    const params = {
        template_type, key_word, event_code, data_type
    };
    try {
        const result = await axios.get(URI.search || `${config.apiDomain}/template/searcher/traits`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return _.cloneDeep(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCrowdsDropList = async (params, URI) => {
    URI = URI || {};
    params = params || {};

    // 为了扩展性， 不再指定Key
    // const getCrowdsDropList = async({catalog_id,group_id, hierarchy_id, lifecycle_status, visibility, order, q, page, size ,sort}) => {
    // const params = {
    //     catalog_id,
    //     group_id,
    //     hierarchy_id,
    //     lifecycle_status,
    //     visibility,
    //     order,
    //     q,
    //     page,
    //     size ,
    //     sort
    // }
    try {
        const result = await axios.get(URI.crowds || `${config.apiDomain}/crowds/drop/list`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return _.cloneDeep(result.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// 在Template系统中使用
const getTemplateCatalogs = async (params, URI) => {
    URI = URI || {};
    try {
        const param = {
            template_type: params.template_type,
            type: params.type,
            parent_id: params.parent_id
        };
        const result = await axios.get(URI.catalogs || `${config.apiDomain}/template/catalogs`, {
            params: { ...param, size: -1 },
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return _.cloneDeep(result.data.items);
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getCatalogs = async (params, URI) => {
    URI = URI || {};
    // const paramModel = {    //参数实例
    //     group_id: 1,
    //     parent_id :0,
    //     type :'trait',
    //     visibility: 'public'
    // };

    // 当params的参数下面的结果时，请求被拉截到getTemplateCatalogs中,在这种情况下的特征是visibility＝“template”且template_type有值
    // params = {
    //     "visibility": "template",
    //     "type": "***",
    //     "parent_id": **,
    //     "template_type": "***"
    // }
    if (params && params.visibility == 'template') {
        const templateCatalogsResult = await getTemplateCatalogs(params, URI);
        return templateCatalogsResult;
    }

    try {
        const result = await axios.get(URI.catalogs || `${config.apiDomain}/catalogs`, {
            params: { ...params, size: -1 },
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return _.cloneDeep(result.data.items);
    } catch (error) {
        console.error(error);
        return null;
    }
};

// const getEventList = async ({
//   catalog_id, name_key_word, order, page, size, sort
// }) => {
//   const params = {
//     catalog_id, name_key_word, order, page, size, sort
//   };
//   try {
//     const result = await axios.get(`${this.$config.apiDomain}/events`, {
//       params,
//       paramsSerializer: params => qs.stringify(params, { indices: false })
//     });
//     return result.data;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// };

const eventDetail = async (eventCode, params, URI) => {
    URI = URI || {};
    try {
        const result = await axios.get(URI.events || `${config.apiDomain}/events/${eventCode}`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const getEnumOptionalValues = async (traitCode) => {
    try {
        const result = await axios.get(`${config.apiDomain}/traits/${traitCode}/enum-values`);
        return result.data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

const getMetaAreaMap = async () => {
    try {
        let result = cache.get('meta-areas-list');
        if (result) {
            return _.cloneDeep(result);
        }
        result = await axios.get(`${config.apiDomain}/meta-areas/list`);
        cache.set('meta-areas-list', result.data);
        return _.cloneDeep(result.data);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default {
    getNextAvailableParam,
    searchTraitAndCrowds: _.throttle(searchTraitAndCrowds, throttle_wait),
    getOperators,
    getCrowdsDropList,
    getCatalogs,
    getTraits: api.trait.getTraits,
    getEnumOptionalValues,
    eventDetail,
    getMetaAreaMap,
    initBaseTypeOperationCache
};
global.$cache = cache;
