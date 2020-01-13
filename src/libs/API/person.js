import {fetch, post} from '../http';

// 查找个人用户信息
export function findPersonInfo (params) {
    return fetch('user/findList', params);
}

// 编辑个人用户信息
export function editPersonInfo (params) {
    return post('user/updateUser', params);
}
