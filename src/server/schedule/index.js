
var schedule = require("node-schedule");


var task1 = require("./DeleteTable.js")
var task2 = require("./DeleteAdminLog.js")

console.log("---load schedule")

var rule = new schedule.RecurrenceRule();
rule.hour=16
rule.minute =36
rule.second=10
//每天凌晨2点触发
var s1 = schedule.scheduleJob(rule, function () {
    console.log("execute-----")    
    task1.exeuteTask();
    task2.exeuteTask();
});
    task1.exeuteTask();
    task2.exeuteTask();