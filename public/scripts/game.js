$(function() {
    console.log("sanity check");
    var socket = io(); // initiate handshake
    var player = "";
    var $tiles;
    var ships = [];
    var A = [];
    var B = [];
    var C = [];
    var D1 = [];
    var D2 = [];
    var myTurn = false;
    var attempt = "";


    // player sign-on
    $(".start").on('click', () => {
        player = prompt("Please enter your name");
        $(".start").text("Hello " + player + "!  Once a second player has joined, the game starts.");
        socket.emit("player joined", player);
    });

    // determine start of game
    socket.on("start game", game => {
        $(".start").text("Players: " + game[0].player + " and " + game[1].player);
        $(".messages").text("To place your ships, select the right number of tiles, enter the matching letters and click submit.");
        $(".selection").append("<button type='submit' disable>Submit Ships</button");
        drawGrid();
    });
    // Submitting ship selection
    $(".selection").on('click', () => {
        $tiles = document.querySelectorAll('.tile');
        // debugger
        Array.prototype.slice.call($tiles).forEach(el => {
            el.removeEventListener("click", clickHandler);
        });
        ships.push(A);
        ships.push(B);
        ships.push(C);
        ships.push(D1);
        ships.push(D2);

        ships = flatten(ships);


        console.log("Ships:" + ships + " at an index " + ships[1]);
        socket.emit("ships submitted", ships, player);
        $('.selection').empty();
        $('.messages').empty();
    });

    // Player 1's turn
    socket.on('turn player1', game => {

        // if player 1
        if (game[0].player === player) {
            myTurn = true;
            // check "hits" if there was a successful hit
            console.log("Hits on Player 2:" + game[1].hits);
            if (game[1].hits !== undefined) {
                // debugger
                game[1].hits.forEach(el => {
                    // format as CSS id
                    el = "#" + el;
                    $(el).css("background", "green");
                });
            }

            Array.prototype.slice.call($tiles).forEach(el => {
                el.addEventListener("dblclick", dblclickHandler1);
            });

            $(".messages").text("Your turn. Double-click to hit.");
        } else {
            // if player 2
            if (game[1].hits !== undefined) {
                game[1].hits.forEach(el => {
                    // format as CSS id
                    el = "#" + el;
                    $(el).css("background", "red");
                });
            }
        }

    });

    // Player 2's turn
    socket.on('turn player2', game => {
        // if player 1
        if (game[1].player === player) {
            myTurn = true;
            // check "hits" if there was a successful hit
            if (game[0].hits !== undefined) {
                // debugger
                game[0].hits.forEach(el => {
                    // format as CSS id
                    el = "#" + el;
                    $(el).css("background", "green");
                });
            }

            Array.prototype.slice.call($tiles).forEach(el => {
                el.addEventListener("dblclick", dblclickHandler2);
            });

            $(".messages").text("Your turn. Double-click to hit.");
        } else {
            // if player 1
            if (game[0].hits !== undefined) {
                game[0].hits.forEach(el => {
                    // format as CSS id
                    el = "#" + el;
                    $(el).css("background", "red");
                });
            }
        }

    });

    socket.on("fail player1", (game, attemptdata) => {
        if (game[0].player === player) {
            myTurn = false;
            attemptdata = "#" + attemptdata;
            $(attemptdata).css("background", "orange");
        } 

        $(".messages").text("Player 2's Turn");
        socket.emit("end player1",attemptdata);

    });

    socket.on("fail player2", (game, attemptdata) => {
        if (game[1].player === player) {
            myTurn = false;
            attemptdata = "#" + attemptdata;
            $(attemptdata).css("background", "orange");
        } 

        $(".messages").text("Player 1's Turn");
        socket.emit("end player2",attemptdata);

    });


    function drawGrid() {
        var location;
        var tiles;
        var colCount = 0;
        var rowCount = 0;
        var counter = 0;
        var rowCounter = 0;
        var arrLocation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        for (i = 0; i <= 120; i++) {
            var tile = document.createElement("div");

            tile.style.float = ("left");
            tile.style.height = ("50px");
            tile.style.width = ("50px");

            if (i % 2 === 0) {
                tile.style.backgroundColor = ("gray");

            } else {
                tile.style.backgroundColor = ("lightgray");
            }
            tile.addEventListener("click", clickHandler);
            tile.classList.add("tile");
            $('.maingrid').append(tile);

            if ((i < 12) || (i % 11 === 0)) {
                tile.style.backgroundColor = ("#FFF");
                tile.classList.remove("tile");
                tile.removeEventListener("click", clickHandler);
                if ((i > 0) && (i < 11)) {
                    colCount++;
                    tile.innerHTML = colCount;

                } else if ((i > 0) && (i % 11 === 0)) {

                    tile.innerHTML = arrLocation[rowCount];
                    rowCount++;
                }
            }
        }

        tiles = document.querySelectorAll('.tile');
        Array.prototype.slice.call(tiles).forEach((el) => {
            if (counter === 10) {
                // go to next letter
                rowCounter++;
                // reset column numbering
                counter = 0;
            }
            row = arrLocation[rowCounter];
            col = counter + 1;
            el.setAttribute('id', row + col);
            counter++;
        });
    }

    function clickHandler(e) {

        var location;

        if ($('#aircraftcarrier').is(':checked')) {
            $(e.target).text("A");
            location = $(e.target).attr("id");
            if (A.length < 5) {
                A.push(location);
            } else {
                $(e.target).text("");
                alert("Aircraft Carrier is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#battleship').is(':checked')) {
            $(e.target).text("B");
            location = $(e.target).attr("id");
            if (B.length < 4) {
                B.push(location);
            } else {
                $(e.target).text("");
                alert("Battleship is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#cruiser').is(':checked')) {
            $(e.target).text("C");
            location = $(e.target).attr("id");
            if (C.length < 3) {
                C.push(location);
            } else {
                $(e.target).text("");
                alert("Cruiser is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#destroyer1').is(':checked')) {
            $(e.target).text("D");
            location = $(e.target).attr("id");
            if (D1.length < 2) {
                D1.push(location);
            } else {
                $(e.target).text("");
                alert("Destroyer 1 is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#destroyer2').is(':checked')) {
            $(e.target).text("D");
            location = $(e.target).attr("id");
            if (D2.length < 2) {
                D2.push(location);
            } else {
                $(e.target).text("");
                alert("Destroyer 2 is deployed. Select a different ship, or click submit.");
            }
        }

        this.removeEventListener("click", clickHandler);
    }

    function dblclickHandler1(e) {

        if (myTurn === true) {
            $(e.target).attr('data-status', "hit");
            attempt = $(e.target).attr('id');

            console.log("Attempt from clickHandler: " + attempt + ". Type: " + typeof attempt);
            socket.emit('attempt player1', attempt, player);
            myTurn = false;
            Array.prototype.slice.call($tiles).forEach(el => {
                el.removeEventListener("dblclick", dblclickHandler1);
            });
        }
    }


    function dblclickHandler2(e) {

        if (myTurn === true) {
            $(e.target).attr('data-status', "hit");
            attempt = $(e.target).attr('id');

            console.log("Attempt from clickHandler: " + attempt + ". Type: " + typeof attempt);
            socket.emit('attempt player2', attempt, player);
            myTurn = false;
            Array.prototype.slice.call($tiles).forEach(el => {
                el.removeEventListener("dblclick", dblclickHandler2);
            });
        }
    }

    function flatten(arr) {
        return arr.reduce(function(start, next) {
            return start.concat(next);
        }, []);
    }

});
