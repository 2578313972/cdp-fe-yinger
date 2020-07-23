import _ from 'lodash';
import qs from 'qs';
import axios from '../utils/axios';
import config from '@/utils/config';

/** 性别（这个可能是别的特性）分布：【同特性饱和度分析接口】
 */
const getSexStatData = async ({ crowdCode, traitCode, max_dimension_num }) => {
    let params = {
        max_dimension_num
    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.get(`${config.apiDomain}/crowds-analytics/${crowdCode}/items/${traitCode}`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

/** channelCode：渠道code; type:1--列表，2--详情；
 */
const getTextData = async ({ channelCode, mold }) => {
    let params = {
    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.get(`${config.apiDomain}/crowds-analytics/${channelCode}/items/${mold}`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

const getConfigData = async ({ crowdCode }) => {
    let params = {

    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.get(`${config.apiDomain}/crowds-analytics/${crowdCode}/configuration`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

/** 获取通用数据
 */
const getCommonData = async (url, params) => {
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.get(`${url}`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

/** 添加长期跟踪
 */
const addTrackingData = async ({ crowdCode, traitCode }) => {
    let params = {
    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.post(`${config.apiDomain}/crowds-analytics/${crowdCode}/tracking/${traitCode}/add`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

/**  删除长期跟踪
 */
const delTrackingData = async ({ crowdCode, traitCode }) => {
    let params = {
    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.delete(`${config.apiDomain}/crowds-analytics/${crowdCode}/tracking/${traitCode}`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};


export default {
    getSexStatData,
    getTextData,
    getConfigData,
    getCommonData,
    addTrackingData,
    delTrackingData
};
