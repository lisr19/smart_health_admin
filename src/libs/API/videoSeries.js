import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询列表
export function findVideoSeriesList (params) {
    return fetch('videoSeries/findList', params);
}

export function delVideoSeries (params) {
    return fetch('videoSeries/del', params);
}

export function addVideoSeries (params) {
    return post('videoSeries/add', params);
}

export function editVideoSeries (params) {
    return post('videoSeries/update', params);
}
