var net = require('net');

exports.playPleXBMC = function(req, res) {
	var client = new net.Socket();
	
	client.connect(9090, req.params.playerIp, function() {
		client.write('{"id":1,"jsonrpc":"2.0","method":"Player.Open","params":{"item":{"file":"plugin:\/\/plugin.video.plexbmc\/?url=http://' + 
			req.params.serverIp + ':32400/library/metadata/' + req.params.metadataId + '&mode=5&id=1"}}}');
		client.destroy();
		res.end();
	});

	client.on('error', function(data) {
		res.send("Error", 500);
	});
}