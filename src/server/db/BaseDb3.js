/**
 * Created by Administrator on 2015/6/12.
 */
var utility = require("utility");
const f = require('util').format;

var maxDbIdleTime = 50000;

function log(str) {
    console.error(utility.logDate() + ":" + str);
}

function error(error) {
    var errorMsg = error.stack || error.message || error || 'unknow error';
    log(errorMsg);
}

function debug(str) {
    log(str);
}

function BaseDb() {
    this.dburl = null;
    this.user = null;
    this.pass = null;
    this.dbname=null;
    this.poolSize = 5;
    this.conn = null;    
    this.client=null;
    var MongoClient = require('mongodb').MongoClient;
    this.init = function(options, cb) {
        let {user,pass,host,port,dbname,poolSize}=options
            
        if(user && pass) {
         this.dburl = f('mongodb://%s:%s@%s:%s/?authMechanism=%s&authSource=%s',user, pass,host, port, 'SCRAM-SHA-1',dbname);        
        } else {
            this.dburl = f('mongodb://%s:%s/authSource=%s',host, port, dbname); 
        }
        this.user = user;
        this.pass = pass;
        this.dbname=dbname;
        if (poolSize)
            this.poolSize =poolSize;
        var parent = this;
        //log("connecting to:" + this.dburl);
        this.open(function(aconn) {
             log("connected to:" + parent.dburl);
             parent.conn = aconn;    
             cb(parent)                
        });  


    };


    this.close = function() {
        log("close db:" + this.dburl);
        if (this.conn && this.conn.close) {
            this.conn.close();
        }
    };
    this.listCollections = function(cb) {
        this.open(function(thedb) {
            thedb.listCollections().toArray(function(err, names) {
                if (err) {
                    error(err);
                }
                cb(names);
            });
        });
    };
    this.getCollection = function(collName) {
        return this.db(collName);
    };

    this.connect = function(cb) {
        let theThis=this
        var user = this.user;
        var pass = this.pass;
        MongoClient.connect(this.dburl, { poolSize: this.poolSize,reconnectTries:Number.MAX_VALUE }, function(err, client) {
            if (err) {
                error(err);
                cb(null);
            } else {
                theThis.client=client
                let thedb=client.db(theThis.dbname)
 
                    cb(thedb);
                
            }

        });
    };
    this.open = function(cb) {
        var parent = this;
         parent.connect(cb);
    };


    this.getDb = function() {
        return this.conn;
    }
    this.nextSeq = function(key, cb) {
        this.conn.collection("id_sequence").findAndModify({ coll: key }, null, { $inc: { id: 1 } }, { upsert: true, new: true }, function(err, reply) {
            var _id = null;
            debug("getSeq:" + reply);
            if (reply.ok == 1) {
                debug("getSeq:" + _id);
                _id = reply.value.id.toString();
                cb(_id);
            } else {
                error(reply.lastErrorObject);
                cb(null);
            }

        });
    }
    this.db = function(collectionName) {
        var t = {};
        var parent = this;
        t.close = function(db) {
            if (db && db.close) {
                 db.close();
            }
        };
        t.execute = function(cb) {
            if (parent.conn) {
                cb(parent.conn);
            } else {
                setTimeout(function() {
                    cb(parent.conn);
                }, 200);
            }
        };
        t.getConn = function(cb) {
            this.execute(function(theconn) {
                cb(theconn.collection(collectionName));
            });
        };

        t.save = function(doc, cb) {
            this.execute(function(thedb) {
                if (thedb) {
                    if (!doc._id) {
                        console.log("saveGun noid" + doc);
                        //{coll:collName},{$inc:{id:1}},{upsert:true,new:true}
                        thedb.collection("id_sequence").findAndModify({ coll: collectionName }, null, { $inc: { id: 1 } }, { upsert: true, new: true }, function(err, reply) {
                            var _id = null;
                            debug("getSeq:" + reply);
                            if (reply.ok == 1) {
                                debug("getSeq:" + _id);
                                _id = reply.value.id.toString();

                            } else {
                                error(reply.lastErrorObject);
                            }
                            doc._id = _id;
                            debug("insertOne:" + doc);
                            thedb.collection(collectionName).insertOne(doc, function(err, r) {

                                if (err || r.insertedCount != 1) {

                                    if (cb) {
                                        cb(false);
                                    } else {
                                        debug("--insertOneFail:" + cb + collectionName + ":" + JSON.stringify(doc));
                                    }
                                } else {
                                    if (cb)
                                        cb(true);
                                }
                                t.close(thedb);
                            });
                            t.close(thedb);
                        });
                    } else {
                        thedb.collection(collectionName).insertOne(doc, function(err, r) {
                            if (err || r.insertedCount != 1) {
                                console.log("-----saveResult:", err, r)
                                if (cb) {
                                    cb(false);
                                } else {
                                    debug("--insertOneFail:" + cb + collectionName + ":" + JSON.stringify(doc));
                                }
                            } else {
                                if (cb)
                                    cb(true);
                            }
                            t.close(thedb);
                        });
                    }

                }
            });
        };
        t.update = function(conditions, update, options, cb) {
            this.execute(function(thedb) {
                if (thedb) {
                    if (!options) options = {};
                    thedb.collection(collectionName).updateOne(conditions, update, options, function(err, r) {
                        if (err || !(r.matchedCount == 1 || r.upsertedCount == 1)) {
                            debug("--updateOneFail:" + collectionName + ",conditions=" + JSON.stringify(conditions) + ",update=" + JSON.stringify(update) + ",options=" + JSON.stringify(options));
                            if (err) console.log(err.stack || err.message || err || 'unknow error');
                            if (cb) cb(false);
                        } else {
                            if (cb)
                                cb(true, r);
                        }
                        t.close(thedb);
                    });


                }
            });
        };
        t.find = function(conditions, callback, projects, sort, limit, skip) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }
                //console.log("Connected correctly to server for find:" + collectionName);

                var findDocs = thedb.collection(collectionName).find(conditions);
                if (sort) {
                    findDocs = findDocs.sort(sort);
                }
                if (projects) {
                    findDocs = findDocs.project(projects);
                }
                if (skip) {
                    findDocs = findDocs.skip(skip);
                }
                if (limit) findDocs = findDocs.limit(limit);
                findDocs.toArray(function(err, docs) {
                    if (err) {
                        error(err);
                        callback({ documents: [] });
                    } else {
                        callback({ documents: docs });
                    }
                    t.close(thedb);
                });
            });
        };
        t.findOne = function(conditions, projects, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }
                if (projects) {
                    thedb.collection(collectionName).find(conditions).limit(1).project(projects).toArray(function(err, docs) {
                        if (err) {
                            error(err);
                            callback({ documents: [] });
                        } else {
                            callback({ documents: docs });
                        }
                        t.close(thedb);
                    });
                } else {
                    thedb.collection(collectionName).find(conditions).limit(1).toArray(function(err, docs) {
                        if (err) {
                            error(err);
                            callback({ documents: [] });
                        } else {
                            callback({ documents: docs });
                        }
                        t.close(thedb);
                    });
                }
            });
        };
        t.findMany = function(conditions, projects, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }
                // console.log("Connected correctly to server for find:"+collectionName);
                if (projects) {
                    thedb.collection(collectionName).find(conditions).project(projects).toArray(function(err, docs) {
                        if (err) {
                            error(err);
                            callback({ documents: [] });
                        } else {
                            callback({ documents: docs });
                        }
                        t.close(thedb);
                    });
                } else {
                    thedb.collection(collectionName).find(conditions).toArray(function(err, docs) {
                        if (err) {
                            error(err);
                            callback({ documents: [] });
                        } else {
                            callback({ documents: docs });
                        }
                        t.close(thedb);
                    });
                }
            });
        };
        t.count = function(query, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback(-1);
                    return;
                }
                //  console.log("Connected correctly to server for find:" + collectionName);
                thedb.collection(collectionName).count(query, function(err, count) {
                    if (err) {
                        callback(-1);
                    } else {
                        callback(count);
                    }
                    t.close(thedb);
                });
            });
        };
        t.aggregate = function(pipeline, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback([]);
                    return;
                }
                thedb.collection(collectionName).aggregate(pipeline, function(err, results) {
                    if (err) {
                        callback([]);
                    } else {
                        callback(results);
                    }
                    t.close(thedb);
                });
            });
        };
        t.deleteMany = function(filter, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback([]);
                    return;
                }
                thedb.collection(collectionName).deleteMany(filter, null, function(err, results) {
                    if (err) {
                        if (callback)
                            callback(0);
                    } else {
                        if (callback)
                            callback(results.deletedCount);
                    }
                    t.close(thedb);
                });
            });
        };
        t.findOneAndSkip = function(skip, callback) {
            this.findManyAndSkip(1, skip, callback);
        };
        t.findManyAndSkip = function(limit, skip, callback, projects, sort) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }
                //console.log("Connected correctly to server for find:"+collectionName);
                var find = thedb.collection(collectionName).find();
                if (sort) find = find.sort(sort);
                if (projects) find = find.project(projects);
                find.skip(skip).limit(limit).toArray(function(err, docs) {
                    if (err) {
                        error(err);
                        callback({ documents: [] });
                    } else {
                        callback({ documents: docs });
                    }
                    t.close(thedb);
                });
            });
        };
        t.bulkInsert = function(operations, cb, options) {
            this.execute(function(thedb) {
                if (thedb) {
                    thedb.collection(collectionName).bulkWrite(operations, options, function(err, r) {
                        if (err || r.insertedCount == 0) {
                            console.error(err);
                            console.error("--bulkInsert:" + collectionName + ":" + JSON.stringify(operations));
                            if (cb)
                                cb(0);
                        } else {
                            if (cb)
                                cb(r.insertedCount);
                        }
                        t.close(thedb);
                    });

                }
            });
        };
        t.ensureIndex = function(fieldOrSpec, options, callback) {
            this.execute(function(thedb) {
                if (thedb) {
                    var collection = thedb.collection(collectionName);
                    if (!options) options = {};
                    options.background = true;
                    collection.createIndex(fieldOrSpec, options, function(err, indexName) {
                        console.log("ensureIndex:" + err);
                        if(callback) callback(err,indexName)
                    });
                }
            });
        };
        t.findOneAndUpdate = function(conditions, update, options, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }

                thedb.collection(collectionName).findOneAndUpdate(conditions, update, options, function(err, reply) {
                    if (reply.ok == 1) {
                        callback({ documents: [reply.value] });
                    } else {
                        error(reply.lastErrorObject);
                        callback({ documents: [] });
                    }
                    t.close(thedb);
                });
            });
        };
        t.findAndModify = function(conditions, update, options, callback) {
            this.execute(function(thedb) {
                if (!thedb) {
                    callback({ documents: [] });
                    return;
                }
                //(query, sort, doc, options, callback)
                thedb.collection(collectionName).findAndModify(conditions, null, update, options, function(err, reply) {
                    if (reply.ok == 1) {
                        callback({ documents: [reply.value] });
                    } else {
                        error(reply.lastErrorObject);
                        callback({ documents: [] });
                    }
                    t.close(thedb);
                });
            });
        };
        return t;
    };

}

//module.exports = BaseDb;

function init(dbOptions,cb) {
    console.log("--init", dbOptions)
    var db = new BaseDb();
    db.init(dbOptions,cb);
    return db;
}
exports.init = init;