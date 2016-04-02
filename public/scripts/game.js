$(function() {
    console.log("sanity check");
    var socket = io(); // initiate handshake
    drawGrid();

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
            // location = arrLocation[rowCount] + counter;
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

    function clickHandler() {
        console.log("You clicked");
    }

});
