import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询用户列表
export function findUserList (params) {
    return fetch('vipUser/findList', params);
}

export function pushArticleToSingle (params) {
    return post('pushMessage/pushArticleToSingle', params);
}
