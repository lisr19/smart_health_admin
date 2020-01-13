import {fetch, post} from '../http';

export function addLabel (params) {
    return post('label/add', params);
}

export function findLabelList (params) {
    return fetch('label/findList', params);
}

export function delLabel (params) {
    return fetch('label/del', params);
}

export function editLabel (params) {
    return post('label/update', params);
}
