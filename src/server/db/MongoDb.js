const R = require('ramda')
const f = require('util').format;
var MongoClient = require('mongodb').MongoClient;

exports.connect = async function(dbConfig) {
    let { user, pass, host, port, dbname, poolSize } = dbConfig
    let uri = null
    if (user && pass) {
        uri = f('mongodb://%s:%s@%s:%s/?authMechanism=%s&authSource=%s', user, pass, host, port, 'SCRAM-SHA-1', dbname);
    } else {
        uri = f('mongodb://%s:%s/authSource=%s', host, port, dbname);
    }
    try {
        let client = await MongoClient.connect(uri, { poolSize, reconnectTries: Number.MAX_VALUE })
        let db = client.db(dbname)

        return wrapperDb(db)
    } catch (err) {
        error(err)
    }
}
let testDb = async function(db) {
    let collection = db.collection("user")
    let findX = collection.findOne
    let result = await findX.bind(collection)({})
    console.log("-----findOnexxxxxxx", result)
}

function error(error) {
    var errorMsg = error.stack || error.message || error || 'unknow error';
    console.log(errorMsg);
}

let collectionMap = {}

function wrapperDb(db) {
    return {
        collection: function(collName) {
            if (!collectionMap[collName]) collectionMap[collName] = wrapperCollectin(db, collName)
            return collectionMap[collName]
        }
    }

}




const FNAMES = ['aggregate',
    'bulkWrite',
    'count',
    //'countDocuments',
    'createIndex',
    //'createIndexes',
    'deleteMany',
    'deleteOne',
    'distinct',
    'drop',
   //'dropAllIndexes',
    //'dropIndex',
    //'dropIndexes',
    //'ensureIndex',
    //'estimatedDocumentCount',
    'find',
    'findAndModify',
    'findAndRemove',
    'findOne',
    'findOneAndDelete',
    'findOneAndReplace',
    'findOneAndUpdate',
    //'geoHaystackSearch',
    'group',
    //'indexes',
    //'indexExists',
    //'indexInformation',
   // 'initializeOrderedBulkOp',
    //'initializeUnorderedBulkOp',
    'insert',
    'insertMany',
    'insertOne',
    //'isCapped',
    //'listIndexes',
    //'mapReduce',
    //'options',
    //'parallelCollectionScan',
    //'reIndex',
    'remove',
    'rename',
    'replaceOne',
    'save',
    //'stats',
    'update',
    'updateMany',
    'updateOne',
    //'watch'
]

function bindCollFn(coll) {    
    var toAll = (result, fnName) => {
        result[fnName] = coll[fnName].bind(coll)
        return result;
    };
    return R.reduce(toAll, {})(FNAMES)
}

function wrapperCollectin(db, collName) {
    let coll = db.collection(collName)    
    return R.merge(bindCollFn(coll),{insert: R.partial(insertWithAutoIncrement, [db, coll, collName])})
}

//自动生成_id,如果不需要可设置options.autoincrement=false
async function insertWithAutoIncrement(db, coll, collName, docs, options, callback) {

    if (!docs._id && (!options || (options && 　options.autoincrement != false))) {
        docs._id = await nextSeq(db, collName)
    }
    return coll.insert(docs, options, callback)
}
async function nextSeq(db, collname) {
    let reply = await db.collection("id_sequence").findAndModify({ coll: collname }, null, { $inc: { id: 1 } }, { upsert: true, new: true })
    if (reply.ok == 1) {
        return reply.value.id.toString()
    } else {
        return null
    }
}