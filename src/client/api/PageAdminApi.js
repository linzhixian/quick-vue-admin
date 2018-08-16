import axios from 'axios';

let base = '/api/admin';

var ajax=function(action) {
	return (params, key) => callAjax(params, key, action);
}

export const callBatchRemove = ajax('batchremove')
export const callAdd =ajax('add')
export const callEdit =ajax('edit')
export const callListPage =ajax('listpage')
export const callList =ajax('list')
export const callTreeRemove =ajax('removeTree')
export const addTree =ajax('addTree')
export const updateTree =ajax('updateTree')


/*export const callBatchRemove = (params, key) => callAjax(params, key, 'batchremove');
export const callAdd = (params, key) => callAjax(params, key, 'add');
export const callEdit = (params, key) => callAjax(params, key, 'edit');
export const callListPage = (params, key) => callAjax(params, key, 'listpage');
export const callList = (params, key) => callAjax(params, key, 'list');
export const callTreeRemove = (params, key) => callAjax(params, key, 'removeTree');
export const addTree = (params, key) => callAjax(params, key, 'addTree');
export const updateTree = (params, key) => callAjax(params, key, 'updateTree');
*/


export const callAjax = (params, key, action) => {
    let config = null;
    if (params instanceof FormData) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };

    }
    return axios.post(`${base}${key}/${action}`, params, config);
};