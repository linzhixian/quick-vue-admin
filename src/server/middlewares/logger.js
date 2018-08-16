//log工具
const logUtil = require('../utils/log_util');

module.exports=async (ctx, next) => {   
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
  
    await next();
 
    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
     console.log("---catch error in logger"+error.message);
    ms = new Date() - start;

    //记录异常日志
    logUtil.logError(ctx, error, ms);
    //返回错误信息    
    ctx.body = { status: { code: "1", msg: error.name + ":" + error.message } };

  }
}