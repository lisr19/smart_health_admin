import {fetch, post} from '../http';
/**
 * @param params 对象参数
 * @returns {*}
 */

// 查询文章列表
export function findArticleList (params) {
    return fetch('article/findList', params);
}

export function delArticle (params) {
    return fetch('article/deleteArticle', params);
}

export function addArticle (params) {
    return post('article/addArticle', params);
}

export function editArticle (params) {
    return post('article/updateArticle', params);
}

export function addText (params) {
    return post('article2/add', params);
}

export function findTextList (params) {
    return fetch('article2/findList', params);
}

export function delText (params) {
    return fetch('article2/del', params);
}

export function editText (params) {
    return post('article2/update', params);
}

//添加文章标签
export function addLabel(params){
    return post('article/addLabel',params)
}

//删除文章标签
export function delLabel(params) {
    return fetch('article/delLabel',params)
}