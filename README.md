# quick-vue-admin
Least coding ,support config CRUD admin integration solution based on Element UI 2.x with MongoDB.


# Live Demo:
 https://linzhixian.github.io/element-vue-admin
 
## Dependencies
- nodejs
- koa 2.0.0
- Element UI 2.x
- MongoDB 3.x

## Features
```
- Login / Logout

- Permission Authentication
  - Menu permission
  - User Role permission

- CRUD CONFIG
  - through create one meta config file to auto generate CRUD page
  - auto create collection in MongoDB
  - auto create index in MongoDB
 

- Error Page
  - 401
  - 404
```

## Getting started

```bash
# clone the project
git clone https://github.com/linzhixian/quick-vue-admin.git

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9001.

## Build
```bash
# build for production environment
npm run build
```
## Run
```bash
# Run for development environment
npm run dev
# Run for production environment
npm run pm2
```
