import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询用户列表
export function findUserList (params) {
    return fetch('user/findList', params);
}

// 查询角色列表
export function getRoleList (params) {
    return fetch('user/findList', params);
}

// 系统用户添加
export function doUserAddBySystem (params) {
    return post('user/addUser', params);
}

// 系统用户编辑
export function doEditBySysUser (params) {
    return post('user/updateUser', params);
}

// 用户删除
export function doUserDel (params) {
    return fetch('user/delUser', params);
}

// 查询用户所在组
export function getGroupList (params) {
    return fetch('group/findGroupByUser', params);
}

//添加用户标签
export function doUserLabelAdd(params) {
    return post('user/addLabel',params)
}

//删除用户标签
export function doUserLabelDel(params) {
    return fetch('user/delLabel',params)
}