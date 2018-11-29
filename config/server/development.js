/**
 * 开发环境的配置内容
 */
module.exports = {
    serverId: '0',
    env: 'development', //环境名称
    port: 9001, //服务端口号    
    mongodb: { //数据库地址
        "host": "192.168.1.20",
        "port": 27017,
        "dbname": "quickVueAdmin",
        "poolSize": 1
    },
    dataDir: "/data",
    dbKeepDays:10,
    logKeepDays:10,
     httpResponse:{maxAge:0}
}