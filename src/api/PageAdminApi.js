import axios from 'axios';

let base = '/api/admin';

export const callBatchRemove = (params, key) => callAjax(params, key, 'batchremove');
export const callAdd = (params, key) => callAjax(params, key, 'add');
export const callEdit = (params, key) => callAjax(params, key, 'edit');
export const callListPage = (params, key) => callAjax(params, key, 'listpage');
export const callList = (params, key) => callAjax(params, key, 'list');
export const callTreeRemove = (params, key) => callAjax(params, key, 'removeTree');
export const addTree = (params, key) => callAjax(params, key, 'addTree');
export const updateTree = (params, key) => callAjax(params, key, 'updateTree');


export const callAjax = (params, key, action) => {
    let config = null;
    if (params instanceof FormData) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };

    }
    return axios.post(`${base}${key}/${action}`, params, config);
};