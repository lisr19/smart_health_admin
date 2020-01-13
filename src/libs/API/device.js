import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询设备列表
export function findDeviceList (params) {
    return fetch('deviceType/findList', params);
}

// 添加设备
export function addDevice (params) {
    return post('deviceType/add', params);
}

// 修改设备
export function updateDevice (params) {
    return post('deviceType/update', params);
}

// 删除设备
export function delDevice (params) {
    return fetch('deviceType/del', params);
}
