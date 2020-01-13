import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findDrugList (params) {
    return fetch('drug/findList', params);
}

export function delDrug (params) {
    return fetch('drug/deleteDrug', params);
}

export function addDrug (params) {
    return post('drug/addDrug', params);
}

export function editDrug (params) {
    return post('drug/updateDrug', params);
}
