import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findVideoTypeList (params) {
    return fetch('videoType/findList', params);
}

export function delVideoType (params) {
    return fetch('videoType/del', params);
}

export function addVideoType (params) {
    return post('videoType/add', params);
}

export function updateVideoType (params) {
    return post('videoType/update', params);
}
