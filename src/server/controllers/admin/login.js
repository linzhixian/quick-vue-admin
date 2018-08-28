
let { utility, ApiError, ApiErrorNames, config, services, baseDao ,pwdmd5,metaIndex} = require('../../include')


let path = "/login";
let needParams = ["username", "password"];


async function doRequest(ctx, next) {
    if(ctx.session.lastTime) {
        if((new Date().getTime()-ctx.session.lastTime)<2*1000) {
             ctx.session.lastTime=new Date().getTime()
             console.log("--登录太频繁--")
              throw new ApiError(ApiErrorNames.LOGIN_FAIL);
        }           
    }
    ctx.session.lastTime=new Date().getTime()
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    if (!username) username = ctx.request.query.username;
    if (!password) password = ctx.request.query.password;
    if (!username) username = "unknow";
    if (!password) password = "unknow";        
    let user=await ctx.db("user").findOne({username})
    console.log(user);
    let pmd5=utility.md5(user.password+pwdmd5)
    if(pmd5!=password) {
        throw new ApiError(ApiErrorNames.LOGIN_FAIL);
    }

    if (user) {
        user.right = {};
        if (user.type!='root') {    
         if(user.enable==false) throw new ApiError(ApiErrorNames.LOGIN_FAIL);
        if(user.roles && user.roles.length > 0)       {
            let roles = await findRoles(ctx.db, user.roles);  

            for (let role of roles) {
                if (role.right) {
                    user.right = Object.assign(user.right, role.right);
                }
            }     
            let subPermissions=[]
            for(let key of Object.keys(user.right))  {
                 for(let path of Object.keys(metaIndex))  {
                    if(metaIndex[path].id==key) {
                        if(metaIndex[path].subPermissions) {
                            subPermissions=subPermissions.concat(metaIndex[path].subPermissions)
                        }
                        break;
                    }
                 }
                
            }
            for(let one of subPermissions) {
                 for(let path of Object.keys(metaIndex))  {
                    if(one==path) {
                        if(!user.right[metaIndex[one].id]) {
                            user.right[metaIndex[one].id]=true
                        }
                    }
                 }
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


async function findRoles(db, roleIds) {        
        let findDocs=await db("role").find({ _id: { $in: roleIds } })
        let docs=await findDocs.toArray()
        return docs
}


export {
    path,
    needParams,
    doRequest
};