
<p align="center">
  <h1>quick-vue-admin</h1>
</p>

简体中文 | [English](./README.md)

# 简介

开箱即用的基于配置的后台管理解决方案，最少的编写代码，通过配置文件即可实现：增，删，改，查，翻页 的功能。
它基于 [vue](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)和MongoDB。它使用了最新的前端技术栈，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级后台产品。

# 在线演示:
 https://linzhixian.github.io/element-vue-admin
 
## 依赖
- nodejs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(需要单独安装)
- koa 2.0.0  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(项目依赖模块)
- Element UI 2.x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(项目依赖模块)
- MongoDB 3.x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(需要单独安装)

## 功能
```
- 登录 / 注销

- 权限验证
  - 菜单权限控制
  - 基于用户+角色的权限管理

- CRUD(增、删、改、查)
  - 通过编写一个元配置文件即可自动生成完整的：增、删、改、查、翻页 功能
  - 自动更新、保存数据到MongoDB
  - 自动创建索引到MongoDB

- 支持自定义组件

- 错误页面  
  - 404
```

## 准备

# 安装好本地nodejs环境
# 本地或远程安装MongoDB

## 开始

```bash
# 克隆项目到本地
git clone https://github.com/linzhixian/quick-vue-admin.git

# 安装依赖
npm install

# 设置MongoDB的连接参数
  打开：[HOME]/config/development.js
  ```
   mongodb_url: { //数据库地址
        "host": "192.168.1.20",
        "port": 27017,
        "dbname": "tcAd",
        "poolSize": 1
    }
  ```
# 启动服务
npm run dev
```

启动浏览器打开地址： http://localhost:9001.

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

## License

[MIT](https://github.com/linzhixian/quick-vue-admin/blob/master/LICENSE)

Copyright (c) 2018-present ZhiXianLin
