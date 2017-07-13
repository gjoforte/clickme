var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var model = require('./models/clickme');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

var routes = require('./controllers/index')(app);

server.listen(config.port, function() {
    console.log('Server up and listening on port %d', config.port);
    model.setup(function(data) {
		if((data.new_val != null) && (data.old_val != null)) {
			io.emit('update', data.new_val);
		}
    });
});
