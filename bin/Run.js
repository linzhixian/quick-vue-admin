#!/usr/bin/env node
let init =require("./Init")

init().then(function(){
	var current_path = process.cwd();
    require(current_path + '/bin/Main')
})
