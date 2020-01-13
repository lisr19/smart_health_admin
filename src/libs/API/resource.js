import {fetch, post} from '../http';

/**查询设备列表
 * @param params 参数对象
 * @returns {*}
 * */


//查询动态资源列表
export function getDynamicList(params) {
    return fetch('/platform/dynamic_info/findList',params);
}

//审核动态资源
export function UpdateStatus(params) {
    return post('/platform/dynamic_info/updateStatus',params);
}

//批量审核动态资源
export function UpdateManyStatus(params) {
    return post('/platform/dynamic_info/updateManyStatus',params);
}