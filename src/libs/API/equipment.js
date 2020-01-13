import {fetch, post} from '../http';

/**查询设备列表
 * @param params 参数对象
 * @returns {*}
 * */

//获取摄像头列表
export function getCameraList(params) {
    return fetch('/platform/camera/findList',params);
}

//添加设备
export function doCameraAdd(params) {
    return post('/platform/camera/add',params);
}

//编辑设备
export function doCameraEdit(params) {
    return post('/platform/camera/update',params);
}

//删除设备（可批量删除）
export  function doCameraDel(params){
    console.log(params);
    return fetch('/platform/camera/del',params);
}