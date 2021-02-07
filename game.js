/**
 * @author AntonioRuiz96
 * Credits to ceci_cifu for helping me with cool ideas and development!
 */

var winners = [];
var matchesCount = 1;
var gameOver = 0;
var winSound = new Audio('./audio/winSound.wav');
var loseSound = new Audio('./audio/loseSound.flac');
var turnSound = new Audio('./audio/turnSound.wav');
var gameMode = document.getElementById("gameMode").value;
var playerTurn = 1;
var conn = null;
var peer = null;
var playerData = {//TODO add variable to capture when the game is over and who the winner
    ID: null,
    playerTurn: 0,
    cell: {
        x: null,
        y: null
    },
    time: null
}

//Load the board
loadBoard(4);
initMultiplayer();

var boardSize = document.getElementsByTagName("li").length;
var rowNum = document.getElementById("column1").getElementsByTagName("li").length;
var columnNum = document.getElementsByTagName("ul").length;

function loadBoard(size) {
    switch (parseInt(size)) {
        case 4:
            document.getElementById("board").style.height = "257px";
            document.getElementById("board").style.width = "257px";
            break;
        case 6:
            document.getElementById("board").style.height = "385px";
            document.getElementById("board").style.width = "385px";
            break;
        case 8:
            document.getElementById("board").style.height = "513px";
            document.getElementById("board").style.width = "513px";
            break;
        default:
            break;
    }

    document.getElementById("board").innerHTML = "";
    for (var i = 0; i < size; i++) {
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML + "<ul id='column" + (i + 1) + "'></ul>";
        for (var j = 0; j < size; j++) {
            document.getElementById("column" + (i + 1)).innerHTML = document.getElementById("column" + (i + 1)).innerHTML + "<li class='nonColored' id='col" +
                (i + 1) + "pos" + (j + 1) + "' onclick='placeToken(" + (i + 1) + ", " + (j + 1) + ")'></li>";
        }
    }
    boardSize = document.getElementsByTagName("li").length;
    rowNum = document.getElementById("column1").getElementsByTagName("li").length;
    columnNum = document.getElementsByTagName("ul").length;
    console.log(boardSize, rowNum, columnNum);
    restartGame();
}

function placeToken(x, y) {

    if (gameOver == 0 && document.getElementById("col" + x + "pos" + y).style.backgroundColor != "red" &&
        document.getElementById("col" + x + "pos" + y).style.backgroundColor != "yellow") {
        turnSound.play();
    }
    if (gameOver == 0) {
        var cell = document.getElementById("col" + x + "pos" + y);

        if (cell.style.backgroundColor != "red" && cell.style.backgroundColor != "yellow") {
            if (gameOver == 0 && gameMode == "localmulti" && playerTurn == 1) {
                cell.style.backgroundColor = "red";
                cell.className = "";
                playerTurn = 2;
                checkWinner(x, y, "player1");
            } else if (gameOver == 0 && gameMode == "localmulti" && playerTurn == 2) {
                cell.style.backgroundColor = "yellow";
                cell.className = "";
                playerTurn = 1;
                checkWinner(x, y, "player2");
            }

            if (gameOver == 0 && gameMode == "online") {
                if (playerData.playerTurn == 0) {
                    return;
                } else if (playerData.playerTurn == 1) {
                    cell.style.backgroundColor = "red";
                    playerData.playerTurn = 2;

                } else if (playerData.playerTurn == 2) {
                    cell.style.backgroundColor = "yellow";
                    playerData.playerTurn = 1;
                }
                cell.className = "";
                playerData.cell.x = x;
                playerData.cell.y = y;
                playerData.ID = peer.id;
                playerData.time = new Date().getTime();
                conn.send(playerData);
                playerData.playerTurn = 0;
                checkWinner(x, y, peer.id);
                console.log(playerData);

            }

            if (gameOver == 0 && gameMode == "single") {
                cell.style.backgroundColor = "red";
                cell.className = "";
                checkWinner(x, y, "player");
                randomThrow();
            }
        }
    }
}

function randomThrow() {
    var condition = true;
    var fullCells = 0;
    var x;
    var y
    while (condition == true) {
        x = Math.floor((Math.random() * columnNum) + 1);
        y = Math.floor((Math.random() * columnNum) + 1);
        var cell = document.getElementById("col" + x + "pos" + y);
        if (cell.style.backgroundColor != "red" && cell.style.backgroundColor != "yellow") {
            cell.style.backgroundColor = "yellow";
            cell.className = "";
            condition = false;
        }
    }

    checkWinner(x, y, "machine");
}

function checkWinner(x, y, player) {
    var champion = "";
    initialCell = document.getElementById("col" + x + "pos" + y);
    var matchCount = 0;
    var directionX = 0;
    var directionY = 0;
    var fullCells = 0;

    for (var i = 0; i < columnNum; i++) {//full board Check
        for (var j = 0; j < rowNum; j++) {
            if (document.getElementById("col" + (i + 1) + "pos" + (j + 1)).style.backgroundColor == "red"
                || document.getElementById("col" + (i + 1) + "pos" + (j + 1)).style.backgroundColor == "yellow") {
                fullCells++;
            }
        }
    }

    for (var i = 1; i < 9; i++) {//X Y Direction changer
        switch (i) {
            case 1:
                directionY = -1;
                directionX = 0;
                break;
            case 2:
                directionX = 1;
                directionY = -1;
                break;
            case 3:
                directionX = 1;
                directionY = 0;
                break;
            case 4:
                directionX = 1;
                directionY = 1;
                break;
            case 5:
                directionY = 1;
                directionX = 0;
                break;
            case 6:
                directionY = 1;
                directionX = -1;
                break;
            case 7:
                directionX = -1;
                directionY = 0;
                break;
            case 8:
                directionX = -1;
                directionY = -1;
                break;

            default:
                break;
        }//TODO make game posible to swap 3 in a row to 6 in a row with all "4"s converted to variable
        for (var k = 0; k < columnNum; k++) {//columns
            for (var j = 0; j < rowNum; j++) {//row
                for (var z = 0; z < 4; z++) {//Cell checks
                    try {
                        var posX = 0;
                        var posY = 0;
                        if (directionX == 1 && directionY == 0) {// --Loop values assuming 4x4--
                            posX = (k + 1) + z;// 1234 1234 1234 1234 || 2345 2345 2345 2345...
                            posY = j + 1; // 1111 2222 3333 4444 || 1111 2222 3333 4444...
                        } else if (directionX == 1 && directionY == 1) {
                            posX = (k + 1) + z;//k=0>>1234 1234 1234 1234 ||k=1 2345 2345... ||k=2 3456 3456 3456...|| 4567 ...
                            posY = (j + 1) + z;//>>1234 2345 3456 4567 || 1234 2345... || 1234 2345 3456... || 1234 ...
                        } else if (directionX == 1 && directionY == -1) {
                            posX = (k + 1) + z;//k=0 j=0 -->1,2,3,4 || k=0 j=1 1,2,3,4 || k=0 j=2 1,2,3,4 ||>> k=0 j=3 1,2,3,4 || k=1 j=0 2,3,4,5 ||...|| k=3 j=3 4,5,6,7
                            posY = (j + 1) - z;//k=0 j=0 -->1,0,-1,-2 || k=0 j=1 2,1,0,-1 || k=0 j=2 3,2,1,0 ||>> k=0 j=3 4,3,2,1 || k=1 j=0 1,0,-1,-2 ||...||k=3 j=3 4,3,2,1
                        } else if (directionX == 0 && directionY == 1) {
                            posX = k + 1; // 1111 1111 1111 1111 || 2222 2222 2222 2222
                            posY = (j + 1) + z; // 1234 2345 3456 4567 || 1234 2345 3456 4567
                        } else if (directionX == 0 && directionY == -1) {
                            posX = k + 1;//1111 1111 1111 1111 || 2222 2222 2222 2222 || 3333
                            posY = (j + 1) - z;//10-1-2 210-1 3210 4321|| 10-1-2 210-1 3210 4321 || 10-1-2
                        } else if (directionX == -1 && directionY == 1) {
                            posX = (k + 1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1 210-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                            posY = (j + 1) + z;//1234 2345 3456 4567 || 1234 2345 3456 4567 || 1234 2345 3456 4567 ||1234 2345 3456 4567 
                        } else if (directionX == -1 && directionY == -1) {
                            posX = (k + 1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1110-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                            posY = (k + 1) - z;////10-1-2 210-1 3210 4321|| 10-1-2 210-1 3210 4321 || 10-1-2 210-1 3210 4321 || 10-1-2 210-1 3210 4321
                        } else if (directionX == -1 && directionY == 0) {
                            posX = (k + 1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1 210-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                            posY = j + 1;//1111 2222 3333 4444 || 1111 2222 3333 4444 || 1111 2222 3333 4444 || 1111 2222 3333 4444
                        }

                        if (posX <= rowNum && posY <= columnNum && posX > 0 && posY > 0) {//out of index checkout
                            if (initialCell.style.backgroundColor == document.getElementById("col" + posX + "pos" + posY).style.backgroundColor) {
                                matchCount++;
                                //console.log(matchCount);
                            }
                        }

                    } catch (error) { console.log(error) }
                }
                if (matchCount == 4) {
                    break;
                } else {
                    matchCount = 0;
                }
            } if (matchCount == 4) {
                break;
            }

        }

        if (matchCount == 4) {
            champion = player;
            gameOver = 1;
            if (champion == "player") {
                winSound.play();
                document.getElementById("resetBtn").style.display = "none";
                document.getElementById("text").innerHTML = "You've won! Write your name: <br>" +
                    "<p><input id='winnerName' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
            } else if (champion == "player1") {
                winSound.play();
                document.getElementById("resetBtn").style.display = "none";
                document.getElementById("text").innerHTML = "Player1 has won! Write your name: <br>" +
                    "<p><input id='winnerName' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
            } else if (champion == "player2") {
                winSound.play();
                document.getElementById("resetBtn").style.display = "none";
                document.getElementById("text").innerHTML = "Player2 has won! Write your name: <br>" +
                    "<p><input id='winnerName' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
            } else if (champion == "machine") {
                loseSound.play();
                matchesCount++;
                document.getElementById("resetBtn").style.display = "initial";
                document.getElementById("text").innerHTML = "You've lost (lol)";
            }
            break;
        } else {
            matchCount = 0;
        }
    }
    if (matchCount == 0 && fullCells == boardSize) {
        matchesCount++;
        document.getElementById("resetBtn").style.display = "initial";
        document.getElementById("text").innerHTML = "-- Draw --";
    }

}

function saveValue() {
    var ganador = {
        name: document.getElementById("winnerName").value,
        numThrows: matchesCount,
        game: gameMode
    };
    winners.push(ganador);
    matchesCount = 1;
    console.log(winners);
    document.getElementById("text").innerHTML = "List of Champions: <br>"
    for (var i = 0; i < winners.length; i++) {
        document.getElementById("text").innerHTML = document.getElementById("text").innerHTML +
            "<br>" + "Winner nº " + (i + 1) + " : " + winners[i].name + " || Matches needed: " + winners[i].numThrows + " || Game mode: " + winners[i].game;

    }
    document.getElementById("resetBtn").style.display = "initial";
}

function restartGame() {
    for (var i = 0; i < columnNum; i++) {
        for (var j = 0; j < rowNum; j++) {
            document.getElementById("col" + (i + 1) + "pos" + (j + 1)).style.backgroundColor = "white";
        }
    }
    gameOver = 0;
}

function gameModeChange() {
    gameMode = document.getElementById("gameMode").value;
    if (gameMode == "single" || gameMode == "localmulti") {
        document.getElementById("resetBtn").style.display = "initial";
        playerTurn = 1;
    }

    if (document.getElementById("gameMode").value == "online") {
        document.getElementById("resetBtn").style.display = "none";
        var mpContainer = document.getElementById("multiplayerContainer");
        mpContainer.innerHTML = `<input id='code' type='text' value="${peer.id}" disabled>`;
        mpContainer.innerHTML += "<input id='connect' type='text' placeholder='Introduce the ID code to connect to another player'>";
        mpContainer.innerHTML += "<button id='connectButton' type='text'>Connect</button>";
        document.getElementById("connectButton").addEventListener("click", (e) => {
            if (conn) {
                conn.close();
            }

            const idValue = document.getElementById("connect").value;
            conn = peer.connect(idValue);

            conn.on('open', function () {
                console.log("Connected to: " + conn.peer);//connects to the other peer (player 2)
                document.getElementById("multiplayerContainer").innerHTML = "connected to:" + conn.peer;
                playerData.playerTurn = 1;
                conn.send(playerData);
            });

            conn.on('data', function (data) {
                playerData = data;
                document.getElementById("col" + playerData.cell.x + "pos" + playerData.cell.y).style.backgroundColor = "red";
                document.getElementById("col" + playerData.cell.x + "pos" + playerData.cell.y).className = "";
                console.log(data);
            });

            conn.on('close', function () {
                conn = null;
            });
        });
    } else {
        document.getElementById("multiplayerContainer").innerHTML = "";
    }
    restartGame();
}

// Connection

function initMultiplayer() {
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);
    });

    peer.on('connection', function (c) {
        if (conn && conn.open) {
            c.on('open', function () {
                c.send("Already connected to another client");
                setTimeout(function () { c.close(); }, 500);
            });
            return;
        }
        conn = c;
        console.log("Connected to: " + conn.peer);//This one is the host (player 1)
        document.getElementById("multiplayerContainer").innerHTML = "Este es el HOST";
        ready();
    });

    peer.on('disconnected', function () {
        console.log('Connection lost. Please reconnect');
    });

    peer.on('close', function () {
        conn = null;
        console.log('Connection destroyed');
    });

    peer.on('error', function (err) {
        console.log(err);
    });
}

function ready() {
    conn.on('data', function (data) {
        playerData = data;
        if (playerData.cell.x != null || playerData.cell.y != null) {
            document.getElementById("col" + playerData.cell.x + "pos" + playerData.cell.y).style.backgroundColor = "yellow";
            document.getElementById("col" + playerData.cell.x + "pos" + playerData.cell.y).className = "";
        }
        console.log(data);
    });
    conn.on('close', function () {
        conn = null;
    });
}

