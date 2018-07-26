var utility = require('utility');
var ApiError = require('../../error/ApiError');
var ApiErrorNames = require('../../error/ApiErrorNames');

var config = require('../../../config');

let path = "/login";
let needParams = ["username", "password"];




async function doRequest(ctx, next) {
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    if (!username) username = ctx.request.query.username;
    if (!password) password = ctx.request.query.password;
    if (!username) username = "unknow";
    if (!password) password = "unknow";
    console.log("login 1");
    let user = await findUser(ctx.db, username, password);
    if (!user) {
        console.log("login 1.1");
        user = await findGunProducer(ctx.db, username, password);
        if (user) {
            console.log("login 1.2");
            user.roles = [4];
            user.type = 'gunProducer';
        }
    }
    console.log(user);
    if (user) {
        user.right = {};
        if (user.roles && user.roles.length > 0) {
            console.log("login 2");
            let roles = await findRoles(ctx.db, user.roles);
            console.log(roles);
            for (let role of roles) {
                if (role.right) {
                    user.right = Object.assign(user.right, role.right);
                }
            }
            console.log("login 3");
        }
        console.log("login 4");
        console.log("setSessionUser：" + JSON.stringify(user));
        ctx.session.user = user;
        user.password = null;
        ctx.body = {
            user
        };

    } else {
        console.log("login fail ");
        throw new ApiError(ApiErrorNames.LOGIN_FAIL);
    }
}

function findUser(db, username, password) {
    let find = {
        username,
        password
    };
    console.log("findUser:" + JSON.stringify(find));
    return new Promise((resolve) => {
        db.getCollection("user").findOne(find, null, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents[0]);
            } else {
                resolve(null);
            }
        })
    });
}

function findRoles(db, roleIds) {
    return new Promise((resolve) => {
        //   t.find = function (conditions, callback, projects, sort, limit,skip)
        db.getCollection("role").find({ _id: { $in: roleIds } }, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents);
            } else {
                resolve([]);
            }
        })
    });
}

function findGunProducer(db, username, password) {
    console.log("findGunProducer:" + username + ":" + password);
    return new Promise((resolve) => {
        db.getCollection("gunProducer").findOne({
            enable: true,
            username,
            password
        }, null, function(reply) {
            console.log("login 1.3" + reply.documents.length);
            if (reply.documents.length > 0) {
                resolve(reply.documents[0]);
            } else {
                resolve(null);
            }
        })
    });
}
export {
    path,
    needParams,
    doRequest
};