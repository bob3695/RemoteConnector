var RemoteState = require('../models/remoteState.js');

exports.getStates = function(req, res) {
	RemoteState.find(function (err, remoteStates) {

		remoteStates.forEach(function (remoteState) {
			res.write(remoteState.name + ": " + remoteState.val + "\n");
		});

		res.end();
	});
}

exports.getState = function(req, res) {
	RemoteState.findOne({"name": req.params.name}, function (err, remoteState) {
		if (remoteState == null) {
			res.send("Didn't find anything!\n");
		}
		else {
			res.send(remoteState.name + ": " + remoteState.val + "\n");
		}
	});
}

exports.setState = function(req, res) {
	RemoteState.findOne({name: req.params.name}, function(err, remoteState) {
		if (remoteState == null) {
			var remoteState = new RemoteState({name: req.params.name, val: req.params.val});
		}
		else {
			remoteState.val = req.params.val;
		}
		
		remoteState.save();
		res.send('Saved!\n');
	});
}