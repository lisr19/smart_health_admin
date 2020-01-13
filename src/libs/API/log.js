import {fetch, post} from '../http';

/**
 * @param params 对象参数
 * @returns {*}
 */

// 获取日志数据列表
export function findLogList (params) {
    return fetch('/log/findList', params);
}
