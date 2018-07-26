const ApiErrorNames = require('./ApiErrorNames');


/**
 * 自定义Api异常
 */
class ApiError extends Error{
    
    //构造方法 other:附加信息只会记录在日志里
    constructor(error_name,other){
        super();
    
        var error_info = ApiErrorNames.getErrorInfo(error_name);

        this.name = error_name;
        this.code = error_info.code;
        this.message = error_info.message;
        if(other) {
            this.other=other;
        }
    }
}



module.exports = ApiError;