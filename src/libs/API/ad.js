import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findAdList (params) {
    return fetch('advertisement/findList', params);
}

export function delAd (params) {
    return fetch('advertisement/del', params);
}

export function addAd (params) {
    return post('advertisement/add', params);
}

export function editAd (params) {
    return post('advertisement/update', params);
}
