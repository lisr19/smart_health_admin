import {fetch, post} from '../http';

export function addDoctor (params) {
    return post('doctor/add', params);
}

export function findDoctorList (params) {
    return fetch('doctor/findList', params);
}

export function delDoctor (params) {
    return fetch('doctor/del', params);
}

export function editDoctor (params) {
    return post('doctor/update', params);
}
