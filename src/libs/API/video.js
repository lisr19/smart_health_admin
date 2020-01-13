import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findVideoList (params) {
    return fetch('video/findList', params);
}

export function delVideo (params) {
    return fetch('video/del', params);
}

export function addVideo (params) {
    return post('video/add', params);
}

export function editVideo (params) {
    return post('video/update', params);
}
