
<p align="center">
  <h1>quick-vue-admin</h1>
</p>

简体中文 | [English](./README.zh-CN.md)

# 简介

开箱即用的基于配置的后台管理解决方案，最少的编写代码，通过配置文件即可实现：增，删，改，查，翻页 的功能。
它基于 [vue](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)和[MongoDB](https://www.mongodb.com/)。它使用了最新的前端技术栈，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级后台产品。

 - [文档](https://linzhixian.github.io/quick-vue-admin-document)
  
 - [讨论组](https://gitter.im/quick-vue-admin/discuss)
 
## 依赖
- nodejs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(需要单独安装)
- koa 2.0.0  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(项目依赖模块)
- Element UI 2.x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(项目依赖模块)
- MongoDB 3.x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(需要单独安装)

## 功能
```
- 登录 / 注销


- CRUD(增、删、改、查)
  - 通过编写一个元配置文件即可自动生成完整的：增、删、改、查、翻页 功能
  - 自动更新、保存数据到MongoDB
  - 自动创建索引到MongoDB

- 数据关联

- 权限验证
  - 菜单权限控制
  - 基于用户+角色的权限管理
  - 
- 支持自定义组件

- 错误页面  
  - 404
```

## 准备

- 安装好本地nodejs环境
- 本地或远程安装MongoDB:默认端口：27017

## 开始

```bash
# 克隆项目到本地
git clone https://github.com/linzhixian/quick-vue-admin.git

# 安装依赖
npm install

# 设置MongoDB的连接参数
  修改文件：[HOME]/config/development.js
              mongodb_url: { //数据库地址
                 "host": "127.0.0.1",
                  "port": 27017,
                  "dbname": "quickadmin",
                  "poolSize": 1
                }
# 启动服务
npm run dev
```

启动浏览器打开地址： http://localhost:9001.
默认登录帐号：用户名:admin ,密码:admin

## 构建
```bash
# build for production environment
npm run build
```
## 运行
```bash
# 运行在开发环境下
npm run dev
#运行在生产环境下
npm run pm2
```
## 联系
   -  Email:<fly_go@hotmail.com>
   - 微信:flygobaby
   
  ![](https://linzhixian.github.io/quick-vue-admin-document/wechat.jpg)

## Changelog
  Detailed changes for each release are documented in the [release notes](https://github.com/linzhixian/quick-vue-admin/releases).

## Donate

If you find this project useful, you can buy author a glass of juice


![](https://linzhixian.github.io/quick-vue-admin-document/wechatAndAlipay.jpg)


## License

[MIT](https://github.com/linzhixian/quick-vue-admin/blob/master/LICENSE)

Copyright (c) 2018-present ZhiXian Lin
