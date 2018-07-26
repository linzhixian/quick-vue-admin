export async function query(db, collection, ids) {
    let result = [];
    for (let _id of ids) {
        let data = await queryOne(db, collection, _id);
        if (data) {
            result.push(data);
        }
    }
    return result;
}

export function queryOne(db, collection, _id,projects) {
    return new Promise((resolve) => {
        db.getCollection(collection).findOne({ _id }, projects, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents[0]);
            } else {
                resolve(null);
            }
        });
    });
}

export function queryOneByCondition(db, collection, conditions) {
    return new Promise((resolve) => {
        db.getCollection(collection).findOne(conditions, null, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents[0]);
            } else {
                resolve(null);
            }
        });
    });
}

export function queryByCondition(db, collection, conditions) {
    return new Promise((resolve) => {
        db.getCollection(collection).find(conditions, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents);
            } else {
                resolve([]);
            }
        }, null, null, null, null);
    });
}

export function query_id(db, coll) {
    return new Promise((resolve) => {
        db.getCollection("id_sequence").findOne({ coll }, null, function(reply) {
            if (reply.documents.length > 0) {
                resolve(reply.documents[0].id);
            } else {
                resolve(null);
            }
        });
    });
}

export function save(db, collection, doc) {
    return new Promise((resolve) => {
        db.getCollection(collection).save(doc, function(reply) {
            resolve(reply)
        });
    });
}
export function updateOrInsert(db, collection, set, inc) {
    return new Promise((resolve) => {
        db.getCollection(collection).update({ _id: set._id }, { $set: set, $inc: inc }, { "upsert": true }, function(reply) {
            resolve(reply)
        });
    });
}

export function update(db, collection, set) {
    return new Promise((resolve) => {
        db.getCollection(collection).update({ _id: set._id }, { $set: set }, { "upsert": false }, function(reply) {
            resolve(reply)
        });
    });
}

export function batchAdd(db, collection, docs) {
    return new Promise((resolve) => {
        let inserts=[]
        for(let one of docs) {
            // { insertOne: { document: { a: 1 } } }
            inserts.push({'insertOne':{document:one}})
        }
        //  t.bulkInsert = function(operations, cb, options)
        db.getCollection(collection).bulkInsert(inserts, null, function(insertedCount) {
            resolve(insertedCount)
        });
    });
}
export function remove(db,collection,filter) {
    return new Promise((resolve) => {     
        db.getCollection(collection).deleteMany(filter,  function(deleteCount) {
            resolve(deleteCount)
        });
    });
}

  