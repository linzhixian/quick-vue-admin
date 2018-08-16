
let { utility, ApiError, ApiErrorNames, config, services, baseDao } = require('../../include')


let path = "/login";
let needParams = ["username", "password"];


async function doRequest(ctx, next) {
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    if (!username) username = ctx.request.query.username;
    if (!password) password = ctx.request.query.password;
    if (!username) username = "unknow";
    if (!password) password = "unknow";    
    let user = await findUser(ctx.db, username, password);
    console.log(user);
    if (user) {
        user.right = {};
        if (user.roles && user.roles.length > 0) {            
            let roles = await findRoles(ctx.db, user.roles);            
            for (let role of roles) {
                if (role.right) {
                    user.right = Object.assign(user.right, role.right);
                }
            }            
        }

        ctx.session.user = user;
        user.password = null;
        ctx.body = {
            user
        };

    } else {        
        throw new ApiError(ApiErrorNames.LOGIN_FAIL);
    }
}

function findUser(db, username, password) {
    let find = {
        username,
        password
    };    
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


export {
    path,
    needParams,
    doRequest
};