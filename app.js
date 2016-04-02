var express = require('express');
var app = express();


var server = require('http').Server(app);
var io = require('socket.io')(server);

var grid = [{player:1},{player: 2}];

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// io / socket connection
io.on('connection', function(socket) {



});



app.get("/", (req, res) => {
    res.render("index", { grid: grid });
});

server.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});