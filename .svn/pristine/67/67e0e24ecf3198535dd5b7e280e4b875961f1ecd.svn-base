import _ from 'lodash';
import qs from 'qs';
import axios from '../utils/axios';
import config from '@/utils/config';

const getCatalogTree = async ({
    type, visibility, group_id, owner, authorized, sub_visibility
}) => {
    let params = {
        type,
        visibility,
        group_id,
        owner,
        authorized,
        sub_visibility
    };
    params = _.pickBy(params, value => (value != null && value !== ''));
    try {
        const result = await axios.get(`${config.apiDomain}/catalog-tree`, {
            params,
            paramsSerializer: params => qs.stringify(params, { indices: false })
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

export default {
    getCatalogTree
};
