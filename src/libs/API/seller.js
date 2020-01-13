import {fetch, post} from '../http';

export function addSeller (params) {
    return post('seller/add', params);
}

export function findSellerList (params) {
    return fetch('seller/findList', params);
}

export function delSeller (params) {
    return fetch('seller/del', params);
}

export function editSeller (params) {
    return post('seller/update', params);
}
