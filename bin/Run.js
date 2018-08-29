#!/usr/bin/env node
let generateMetaFiles=require("../src/shared/meta/GenerateMetaFiles")
generateMetaFiles().then(function(){
	var current_path = process.cwd();
    require(current_path + '/bin/Main')
})

