import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
// import Vue from 'vue';

axios.defaults.timeout = 30000;
axios.defaults.baseURL = 'http://192.168.0.123:8080/smart_health/'; // 内网baseurl
// axios.defaults.baseURL = 'http://192.168.1.169:8080/smart_health'//权
// axios.defaults.baseURL = 'http://120.24.0.130:8080/smart_health/';


// http request 拦截器
axios.interceptors.request.use(
    config => {
    // 以下是token存于cookie的处理  del by allen 2018.5.30
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    //     config.data = JSON.stringify(config.data);
    // config.headers = { // 设置请求头的content-type
    //   // 'Content-Type': 'application/x-www-form-urlencoded'
    //   'Content-Type': 'application/json'
    // };
    // if(token){
    //   config.params = {'token':token}
    //   config.headers.Authorization = token;
    // }

    // 判断请求方式是否为以下三种
        if (config.method === 'post' || 'put' || 'delete') {
            // 序列化
            config.data = qs.stringify(config.data);
        }
        // 若是有token , 就给头部授权带上token
        if (localStorage.token) {
            config.headers.authorization = localStorage.token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.headers.refreshToken) {
            let res = fetch('AdminRefreshToken');
            if (res && !res.code) {
                localStorage.setItem('token', res.data);
            }
        }
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, data) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: data, headers: {'phone': Cookies.get('user')}})
            .then(response => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {headers: {'phone': Cookies.get('user')}})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            });
    });
}
