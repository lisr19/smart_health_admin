import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询文章列表
export function findDiseaseList (params) {
    return fetch('disease/findList', params);
}

export function delDisease (params) {
    return fetch('disease/deleteDisease', params);
}

export function addDisease (params) {
    return post('disease/addDisease', params);
}

export function editDisease (params) {
    return post('disease/updateDisease', params);
}
