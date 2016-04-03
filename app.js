var express = require('express');
var app = express();
var locus = require("locus");


var server = require('http').Server(app);
var io = require('socket.io')(server);

var game = [];

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// io / socket connection
io.on('connection', function(socket) {
    socket.on("player joined", function(player) {
        game.push({ player: player, socketId: socket.id });
        game.id++;
        if (game.length === 2) {
            io.emit("start game", game);
        }
    });
});

// eval(locus);

app.get("/", (req, res) => {
    res.render("index", { game: game });
});

server.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});
