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
            game[0].deployment.push("dummy");
            game[1].deployment.push("dummy");
            io.emit("turn player1", game, player);
        }
    });

    socket.on("attempt player1", (attemptdata) => {
        hitAtIndex = game[1].deployment.findIndex(val => val === attemptdata);
        if (hitAtIndex !== -1) {
            player2Hits.push(attemptdata);
            game[1].deployment.splice(hitAtIndex, 1);
            console.log("Player 2 deployment: " + game[1].deployment);
            // check for loser
            if (game[1].deployment.length === 1) {
                io.emit("player1 wins",game);
            }
            game[1].hits = player2Hits;
            io.emit("turn player1", game);
        } else {
            player2Fails.push(attemptdata);
            game[1].fails = player2Fails;
            console.log("Failed attempt by Player 1 onto Player 2" + player2Fails + " = " + game[1].fails);
            io.emit("fail player1", game, attemptdata);
        }

    });

    socket.on("attempt player2", (attemptdata) => {
        hitAtIndex = game[0].deployment.findIndex(val => val === attemptdata);
        if (hitAtIndex !== -1) {
            player1Hits.push(attemptdata);
            game[0].deployment.splice(hitAtIndex, 1);
            console.log("Player 1 deployment: " + game[0].deployment);
            // check for loser
            if (game[0].deployment.length === 1) {
                io.emit("player2 wins",game);
            }
            game[0].hits = player1Hits;
            io.emit("turn player2", game);
        } else {
            player1Fails.push(attemptdata);
            game[0].fails = player1Fails;
            console.log("Failed attempt by Player 2 onto Player 1" + player1Fails + " = " + game[0].fails);
            io.emit("fail player2", game, attemptdata);
        }

    });

    socket.on("end player1", (attemptdata) => {
        io.emit("turn player2", game);
    });

    socket.on("end player2", (attemptdata) => {
        io.emit("turn player1", game);
    });

});

app.get("/", (req, res) => {
    res.render("index", { game: game });
});

server.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});
