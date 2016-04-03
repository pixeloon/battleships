$(function() {
    console.log("sanity check");
    var socket = io(); // initiate handshake
    var player = "";
    var ships = [];
    var A = { location: [] };
    var B = { location: [] };
    var C = { location: [] };
    var D1 = { location: [] };
    var D2 = { location: [] };






    $(".start").on('click', () => {
        player = prompt("Please enter your name");
        $(".start").text("Hello " + player + "!  Once a second player has joined, the game starts.");
        socket.emit("player joined", player);
    });

    socket.on("start game", game => {
        $(".start").text("Players: " + game[0].player + " and " + game[1].player);
        $(".messages").text("To place your ships, select the right number of tiles, enter the matching letters and click submit.");
        $(".selection").append("<button type='submit' disable>Submit Ships</button");
        drawGrid();
    });

    $(".selection").on('click', () => {
        var selection = document.querySelectorAll('#tile');
        // debugger
        Array.prototype.slice.call(selection).forEach(el => {
            el.removeEventListener("click", clickHandler);
            // ships.push(el.value);
        });
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
            tile.addEventListener("dblclick", dblclickHandler);
            tile.setAttribute("id", "tile");
            $('.maingrid').append(tile);

            if ((i < 12) || (i % 11 === 0)) {
                tile.style.backgroundColor = ("#FFF");
                tile.removeAttribute("id", "tile");
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
        tiles = document.querySelectorAll('#tile');
        Array.prototype.slice.call(tiles).forEach((el) => {
            if (counter === 10) {
                // go to next letter
                rowCounter++;
                // reset column numbering
                counter = 0;
            }
            row = arrLocation[rowCounter];
            col = counter + 1;
            el.setAttribute('data-location', row + col);
            counter++;
        });
    }

    function clickHandler(e) {

        var location;

        if ($('#aircraftcarrier').is(':checked')) {
            $(e.target).text("A");
            location = $(e.target).attr("data-location");
            if (A.location.length < 5) {
                A.location.push(location);
            } else {
                $(e.target).text("");
                alert("Aircraft Carrier is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#battleship').is(':checked')) {
            $(e.target).text("B");
            location = $(e.target).attr("data-location");
            if (B.location.length < 4) {
                B.location.push(location);
            } else {
                $(e.target).text("");
                alert("Battleship is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#cruiser').is(':checked')) {
            $(e.target).text("C");
            location = $(e.target).attr("data-location");
            if (C.location.length < 3) {
                C.location.push(location);
            } else {
                $(e.target).text("");
                alert("Cruiser is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#destroyer1').is(':checked')) {
            $(e.target).text("D");
            location = $(e.target).attr("data-location");
            if (D1.location.length < 2) {
                D1.location.push(location);
            } else {
                $(e.target).text("");
                alert("Destroyer 1 is deployed. Select a different ship, or click submit.");
            }
        }
        if ($('#destroyer2').is(':checked')) {
            $(e.target).text("D");
            location = $(e.target).attr("data-location");
            if (D2.location.length < 2) {
                D2.location.push(location);
            } else {
                $(e.target).text("");
                alert("Destroyer 2 is deployed. Select a different ship, or click submit.");
            }
        }

        console.log("Location: " + $(e.target).attr("data-location"));
        console.log("Ships: " + JSON.stringify(A) + JSON.stringify(B) + JSON.stringify(C) + JSON.stringify(D1) + JSON.stringify(D2));
        this.removeEventListener("click", clickHandler);
    }

    function dblclickHandler(e) {
        $(e.target).css("background", "red");
    }

});
