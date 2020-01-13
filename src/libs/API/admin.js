import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findAdminList (params) {
    return fetch('admin/findList', params);
}

export function delAdmin (params) {
    return fetch('admin/del', params);
}

export function addAdmin (params) {
    return post('admin/add', params);
}

export function editAdmin (params) {
    return post('admin/update', params);
}
