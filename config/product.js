/**
 * 生产环境的配置内容
 */

module.exports = {
    serverId: '0',
    env: 'product', //环境名称
    port: 8123, //服务端口号
    mongodb_url: { //数据库地址
        "host": "47.100.254.174",
        "port": 28055,
        "dbname": "tcAd",
        "user":"tcAd",
        "pass":"tcAddFd394GFk!334dMn",
        "poolSize": 2
    },
     dataDir: "/data",
    apkToolUrl:"http://localhost:9111/apktool/controller"
}



