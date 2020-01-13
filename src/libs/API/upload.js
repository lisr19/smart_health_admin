import {fetch, post} from '../http';

//上传图片
export function uploadImg (params) {
    return post('upload/img', params);
}