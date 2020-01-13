import {fetch, post} from '../http';

export function login (userInfo) {
    // return post('/platform/user/login',userInfo)
    return post('/admin/login', userInfo);
}
