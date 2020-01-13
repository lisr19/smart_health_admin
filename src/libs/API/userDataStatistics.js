import {fetch, post} from '../http';

//查询data总数量
export function findDataCount(params) {
    return fetch('userDataStatistics/findDataCount', params);
}

//用户注册数量
export function findRegisterUserCount(params) {
    return fetch('userDataStatistics/findRegisterUserCount', params);
}

//获取年龄分布
export function findUserAgeDistribution(params) {
    return fetch('userDataStatistics/findUserAgeDistribution', params);
}

//获取体检异常数据
export function findExceptionDataCount(params){
    return fetch('userDataStatistics/findExceptionDataCount', params)
}