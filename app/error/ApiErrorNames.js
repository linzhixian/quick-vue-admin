/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.ILLEGAL_PARAM = "illegal param";
ApiErrorNames.ILLEGAL_GUN = "illegal gun";
ApiErrorNames.LOGIN_FAIL = "login_fail";
ApiErrorNames.FAIL = "fail";
ApiErrorNames.DUPLICATE_KEY = "duplicate";

ApiErrorNames.ENTITY_NOFIND = "entity_nofind";
ApiErrorNames.NO_LOGIN = "no_LOGIN";
ApiErrorNames.NORIGHT = "no_right";
ApiErrorNames.NOFILE = "no_file";
ApiErrorNames.EMPTY_INPUT = "empty_input";
ApiErrorNames.NO_URL = "no_url";
ApiErrorNames.MATCHING_ERROR = "matching_error";

ApiErrorNames.SDKFILE_DUPLICATE="SDKFILE_DUPLICATE"


/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' });
error_map.set(ApiErrorNames.ILLEGAL_PARAM, { code: 101, message: '非法参数' });
error_map.set(ApiErrorNames.ILLEGAL_GUN, { code: 102, message: '非法枪支' });
error_map.set(ApiErrorNames.LOGIN_FAIL, { code: 103, message: '登陆失败：错误的用户名或密码' });
error_map.set(ApiErrorNames.FAIL, { code: 104, message: '失败' });
error_map.set(ApiErrorNames.ENTITY_NOFIND, { code: 105, message: '实体没找到' });
error_map.set(ApiErrorNames.NO_LOGIN, { code: 106, message: '没有登陆' });
error_map.set(ApiErrorNames.NORIGHT, { code: 107, message: '缺乏权限' });
error_map.set(ApiErrorNames.NOFILE, { code: 108, message: '缺少文件上传' });
error_map.set(ApiErrorNames.EMPTY_INPUT, { code: 109, message: '选项不能为空' });

error_map.set(ApiErrorNames.DUPLICATE_KEY, { code: 110, message: '数据已存在' });

error_map.set(ApiErrorNames.SDKFILE_DUPLICATE, { code: 111, message: 'SDK文件重复' });

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
        console.log(error_name);
        console.log(error_map);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }

    return error_info;
}

module.exports = ApiErrorNames;
error_map.set(ApiErrorNames.FAIL, { code: 104, message: '失败' });