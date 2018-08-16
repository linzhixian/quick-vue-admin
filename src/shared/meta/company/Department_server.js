var utility = require('utility');

module.exports = {
	beforeAdd(doc,ctx) {
		doc.addTime=utility.YYYYMMDDHHmmss()
		return doc 
	}
}