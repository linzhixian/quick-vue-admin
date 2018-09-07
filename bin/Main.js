#!/usr/bin/env node
require('babel-register');
var http = require('http');
var app = require('../src/server/app');
let port = require('../config/server').port;

console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);

let server =null
app.init().then((callback)=>{    
    server=http.createServer(callback);
    server.listen(port);   
    server.on('listening', ()=>{ console.log('Listening on ' + server.address().port)});
})



