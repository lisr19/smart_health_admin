import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询文章列表
export function findApkVersionList (params) {
    return fetch('apkVersion/findList', params);
}

export function delApkVersion (params) {
    return fetch('apkVersion/del', params);
}

export function addApkVersion (params) {
    return post('apkVersion/add', params);
}
