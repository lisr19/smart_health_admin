import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询组列表
export function getGroupList (params) {
    return fetch('group/findList', params);
}

// 添加组
export function addGroup (params) {
    return post('group/addGroup', params);
}

// 修改组
export function editGroup (params) {
    return post('group/updateGroup', params);
}

// 添加组成员
export function addGroupMember (params) {
    return post('group/addMember', params);
}
