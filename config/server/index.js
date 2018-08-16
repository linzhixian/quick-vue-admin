var development_env = require("./development");
var product_env = require("./product");

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
    development: development_env,
    product: product_env,
}[process.env.NODE_ENV || 'product']