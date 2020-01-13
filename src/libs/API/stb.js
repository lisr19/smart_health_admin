import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findStbList (params) {
    return fetch('stb/findList', params);
}

export function delStb (params) {
    return fetch('stb/del', params);
}

export function addStb (params) {
    return post('stb/add', params);
}

export function editStb (params) {
    return post('stb/update', params);
}
