import utils from '@/utils';
import config from '@/utils/config';
import axios from '@/utils/axios';
import qs from 'qs';

const { debouncePromise } = utils;
const debounce_wait = config.debounce_wait;

const getCrowdsBeDependentByTrait = async (traitCode, params) => {
    try {
        const result = await axios.get(`${config.apiDomain}/traits/${traitCode}/dependent-crowds`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const getCrowds = async (params) => {
    // 当params.node_visibility存在的时候，也就是当前tab为“同节点其他的”，不需要传catalog_id
    const defaultParams = {
        visibility: 'public',
        page: 1,
        rows: 10,
        catalog_id: params.node_visibility ? undefined : 0,
        lifecycle_status: 'all'
    };
    try {
        const result = await axios.get(`${config.apiDomain}/crowds`, {
            params: { ...defaultParams, ...params },
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export default {
    getCrowdsBeDependentByTrait: debouncePromise(getCrowdsBeDependentByTrait, debounce_wait / 4),
    getCrowds: debouncePromise(getCrowds, debounce_wait / 4)
};
