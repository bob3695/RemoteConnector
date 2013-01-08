var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var remoteStateSchema = new Schema({
	name: String,
	val: Number
});

module.exports = mongoose.model('RemoteState', remoteStateSchema);