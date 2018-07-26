import axios from 'axios';

let base = '/api/admin';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const requestLogout = params => { return axios.post(`${base}/logout`, params).then(res => res.data); };


export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/sys/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/sys/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/sys/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/sys/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/sys/user/add`, { params: params }); };




