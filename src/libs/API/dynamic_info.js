import {fetch, post} from '../http';

//根据节点id获取动态信息列表
export function getDynamicByNodeId(params) {
    return fetch('/platform/dynamic_info/findNodeInfoList',params);
}

//根据动态信息id和来源类型获取动态信息资源
export function getResListByDynamicId(params) {
    return fetch('/platform/dynamic_info/findNodeInfo',params);
}