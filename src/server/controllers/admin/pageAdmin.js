const R = require('ramda')
var fs = require('fs')
const os = require('os');
const pathUtil = require('path');
var dateFormat = require('dateformat');
const makeDir = require('make-dir');
const md5File = require('md5-file')


let { utility, ApiError, ApiErrorNames, config, services, baseDao,nav_menu,metaIndex,metaIndexServer} = require('../../include');

import actionMap from "./pageActions";

let moduleMap = metaIndex;


let entityNameToId = {};

for (let oneMenu of nav_menu) {
    if (oneMenu.children) {
        for (let om of oneMenu.children) {
            if (metaIndex[om.path]) {
                entityNameToId[metaIndex[om.path].entityName] = om.id;
            }
        }
    }
}


let path = "/:path*/:actionName";

let needParams = [];







function hasRight(user, entityName, actionName) {
    if (user.type == 'root') return true;
    let mid = entityNameToId[entityName];
    if (!mid) {
        console.log("---hasRight:no find mid:" + entityName);
        return false;
    }
    console.log("---mid:" + mid);
    let right = user.right;
    if (!right || !right[mid]) return false;
    if (actionName == 'listpage' || actionName == 'list') return true; //默认都有list权限
    if (actionName == 'batchremove') actionName = 'remove'; //batchremove 等同于remove
    if (!right[mid][actionName]) return false;
    return true;
}
async function doRequest(ctx, next) {
    console.log("pageAdminUser:" + JSON.stringify(ctx.session.user));
    if (!ctx.session.user) {
        throw new ApiError(ApiErrorNames.NO_LOGIN);
    }
    console.log("--doRequest:params" + JSON.stringify(ctx.params));
    let {
        path,
        actionName
    } = ctx.params;
    console.log("--doRequest:pageAdmin：" + path);
    let metaData = moduleMap["/" + path];
    if (!hasRight(ctx.session.user, path, actionName)) {
        console.log("noright--" + entityName + ":" + actionName);
        throw new ApiError(ApiErrorNames.NORIGHT, actionName);
    }

    console.log("--doRequest:1");
    if (metaData) {
        console.log("findServer:","/" + path+'_server')
        let serverMetaData = metaIndexServer["/" + path+'_server'];
        if(serverMetaData) {
            console.log("findServerRes:",serverMetaData)
            metaData.serverMeta=serverMetaData
        }
        let entityName = metaData.entityName;
        console.log("--doRequest:2" + entityName);
        checkNeedParams(path, actionName, metaData.columnsDef, ctx.request.body);
        console.log("--doRequest:2" + entityName);
        //  try {
        let result = await exec(entityName, actionName, metaData, ctx);
        console.log("--doRequest:3" + entityName + ",result=" + JSON.stringify(result));
        if (!result) {
            throw new ApiError(ApiErrorNames.LOGIN_FAIL);
        }
        /*        } catch (e) {
                    throw e;
                }*/
    } else {

        throw new ApiError(ApiErrorNames.ENTITY_NOFIND, path);
    }
}

async function exec(entityName, actionName, metaData, ctx) {

    let amethod = actionMap[actionName];
    let serverHook=metaData.serverHook
    if(metaData.serverMeta &&　metaData.serverMeta) {
        console.log("exec",actionName,"serverMeta use serverHook")
        serverHook=metaData.serverMeta
    }
    let result = await amethod(ctx, entityName, serverHook, metaData);
    return result;
}


function getAddRequireProps(columnsDef) {
    let props = [];
    if (columnsDef) {        
        let find=R.compose(R.map(R.prop('prop')),R.filter(R.propEq('required', true)))
        props=find(columnsDef)
        //props=R.insertAll(1,find(columnsDef),props)
    }    
    return props;
}

function getEditRequireProps(columnsDef) {
    let props = getAddRequireProps(columnsDef);   
    props.push('_id')
    return props;
}

function checkNeedParams(path, actionName, columnsDef, requestBody) {
    let needParams = {
        add: getAddRequireProps(columnsDef),
        edit: getEditRequireProps(columnsDef),
        batchremove: ['ids'],
        remove: ['id'],
        listpage: ['pageSize', 'page']
    };
    let data = requestBody;
    if (requestBody.fields) {
        data = requestBody.fields;
    }
    if (needParams[actionName]) {
        for (let item of needParams[actionName]) {
            if (!data[item] || data[item] == '') {
                throw new ApiError(ApiErrorNames.ILLEGAL_PARAM, "缺少" + item + "在" + path + "的" + actionName + "请求");
            }
        }
    }
}

export {
    path,
    needParams,
    doRequest
};