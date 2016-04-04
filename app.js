var express = require('express');
var app = express();
var locus = require("locus");
var player1, player2;
var player1Hits = [];
var player1Fails = [];
var player2Hits = [];
var player2Fails = [];


var server = require('http').Server(app);
var io = require('socket.io')(server);

var game = [];

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// io / socket connection
io.on('connection', function(socket) {
    socket.on("player joined", function(player) {
        game.push({ player: player, socketId: socket.id });
        if (game.length === 2) {
            io.emit("start game", game);
        }
    });

    socket.on("ships submitted", (ships, player) => {
        playerAtIndex = game.findIndex(val => val.player === player);
        game[playerAtIndex].deployment = ships;
        if ((game[0].hasOwnProperty('deployment')) && (game[1].hasOwnProperty('deployment'))) {
            console.log("Player 1 deployment: " + game[0].deployment);
            io.emit("turn player1", game, player);
        }
    });

    socket.on("attempt player1", (attemptdata) => {
        hitAtIndex = game[1].deployment.findIndex(val => val === attemptdata);
        console.log("Server side attempt: " + attemptdata + " Hit index: " + hitAtIndex);
        if (hitAtIndex !== -1) {
            player2Hits.push(attemptdata);
            // debugger
            game[1].deployment.splice(hitAtIndex, 1);
            game[1].hits = player2Hits;
            io.emit("turn player1", game);
        } else {
            player1Fails.push(attemptdata);
            io.emit("fail player1", game, attemptdata);
        }

    });

    socket.on("attempt player2", (attemptdata) => {
        hitAtIndex = game[0].deployment.findIndex(val => val === attemptdata);
        console.log("Server side attempt: " + attemptdata + " Hit index: " + hitAtIndex);
        if (hitAtIndex !== -1) {
            player1Hits.push(attemptdata);
            // debugger
            game[0].deployment.splice(hitAtIndex, 1);
            game[0].hits = player2Hits;
            io.emit("turn player2", game);
        } else {
            player2Fails.push(attemptdata);
            io.emit("fail player2", game, attemptdata);
        }

    });

    socket.on("end player1", () => {
        io.emit("turn player2", game);
    });

    socket.on("end player2", () => {
        io.emit("turn player1", game);
    });

});

app.get("/", (req, res) => {
    res.render("index", { game: game });
});

server.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});
