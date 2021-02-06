/**
 * @author AntonioRuiz96
 * Credits to ceci_cifu for helping me with cool ideas.
 */

var winners = [];
var matchesCount=1;
var gameOver =0;
var winSound = new Audio('./audio/winSound.wav');
var loseSound = new Audio('./audio/loseSound.flac');
var turnSound = new Audio('./audio/turnSound.wav');
var gameMode = document.getElementById("gamemode").value;
var playerTurn = 1;

//Load the board
loadBoard(4);

var boardSize = document.getElementsByTagName("li").length;
var rowNum = document.getElementById("column1").getElementsByTagName("li").length;
var columnNum = document.getElementsByTagName("ul").length;
console.log(boardSize, rowNum, columnNum);

function loadBoard(size){
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
        
        document.getElementById("board").innerHTML ="";
        for (var i = 0; i < size; i++) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML + "<ul id='column" + (i+1) + "'></ul>";
                for (var j = 0; j < size; j++) {
                        document.getElementById("column"+ (i+1)).innerHTML = document.getElementById("column"+(i+1)).innerHTML +"<li id='col"+(i+1)+"pos" + (j+1) +  "' onclick='placeToken("+(i+1)+", " + (j+1) + ")'></li>";
                }
        }
        boardSize = document.getElementsByTagName("li").length;
        rowNum = document.getElementById("column1").getElementsByTagName("li").length;
        columnNum = document.getElementsByTagName("ul").length;
        console.log(boardSize, rowNum, columnNum);
        restartGame();
}

function placeToken(x, y){
        if (gameOver == 0 && document.getElementById("col"+x+"pos"+y).style.backgroundColor != "red" &&
        document.getElementById("col"+x+"pos"+y).style.backgroundColor != "yellow") {
                turnSound.play();
        }
        if(gameOver == 0){
                var cell = document.getElementById("col"+x+"pos"+y);
                
                if(cell.style.backgroundColor != "red" && cell.style.backgroundColor != "yellow"){
                        if(gameMode=="localmulti" && playerTurn == 1){
                        cell.style.backgroundColor="red";
                        playerTurn=2;
                        checkWinner(x,y, "player1");
                        }else if(gameMode=="localmulti" &&  playerTurn == 2){
                        cell.style.backgroundColor="yellow";
                        playerTurn=1;
                        checkWinner(x,y, "player2"); 
                        }
                        
                        if(gameOver == 0 && gameMode == "single"){
                                cell.style.backgroundColor="red";
                                checkWinner(x,y, "player");
                                randomThrow();
                        }
                }
        } 
}

function randomThrow(){
        var condition = true;
        var fullCells = 0;
        var x;
        var y
        while(condition == true){
        x = Math.floor((Math.random() * columnNum) + 1);
        y = Math.floor((Math.random() * columnNum) + 1);
        var cell = document.getElementById("col"+x+"pos"+y);
                if (cell.style.backgroundColor != "red" && cell.style.backgroundColor != "yellow"){
                        cell.style.backgroundColor="yellow";
                        condition = false;
                }
        }

        checkWinner(x,y, "machine");
}

function checkWinner(x,y,player){
        var champion = "";
        initialCell = document.getElementById("col"+x+"pos"+y);
        var matchCount = 0;
        var directionX = 0;
        var directionY = 0;
        var fullCells = 0;

        for (var i = 0; i < columnNum; i++) {//full board Check
                for (var j = 0; j < rowNum ; j++) {
                        if(document.getElementById("col"+(i+1)+"pos"+(j+1)).style.backgroundColor == "red" 
                        || document.getElementById("col"+(i+1)+"pos"+(j+1)).style.backgroundColor == "yellow"){
                                fullCells++;
                        }
                }
        }

        for (var i = 1; i < 9; i++) {//X Y Direction changer
                switch (i) {
                        case 1:
                                directionY=-1;
                                directionX=0;
                                break;
                        case 2:
                                directionX=1;
                                directionY=-1;
                                break;
                        case 3:
                                directionX=1;
                                directionY=0;
                                break;
                        case 4:
                                directionX=1;
                                directionY=1;
                                break;
                        case 5:
                                directionY=1;
                                directionX=0;
                                break;
                        case 6:
                                directionY=1;
                                directionX=-1;
                                break;
                        case 7:
                                directionX=-1;
                                directionY=0;
                                break;
                        case 8:
                                directionX=-1;
                                directionY=-1;
                                break;

                        default:
                                break;
                }
                for (var k = 0; k < columnNum; k++) {//columns
                        for (var j = 0; j < rowNum; j++) {//row
                                for (var z = 0; z < 4; z++) {//Cell checks
                                        try {
                                                var posX = 0;
                                                var posY = 0;
                                                if (directionX==1 && directionY == 0) {// --Loop values assuming 4x4--
                                                        posX = (k+1) + z;// 1234 1234 1234 1234 || 2345 2345 2345 2345...
                                                        posY = j+1; // 1111 2222 3333 4444 || 1111 2222 3333 4444...
                                                }else if (directionX ==1 && directionY == 1) {
                                                        posX = (k+1)+ z;//k=0>>1234 1234 1234 1234 ||k=1 2345 2345... ||k=2 3456 3456 3456...|| 4567 ...
                                                        posY = (j+1)+ z;//>>1234 2345 3456 4567 || 1234 2345... || 1234 2345 3456... || 1234 ...
                                                }else if (directionX == 1 && directionY == -1) {
                                                        posX = (k+1)+z;//k=0 j=0 -->1,2,3,4 || k=0 j=1 1,2,3,4 || k=0 j=2 1,2,3,4 ||>> k=0 j=3 1,2,3,4 || k=1 j=0 2,3,4,5 ||...|| k=3 j=3 4,5,6,7
                                                        posY = (j+1)-z;//k=0 j=0 -->1,0,-1,-2 || k=0 j=1 2,1,0,-1 || k=0 j=2 3,2,1,0 ||>> k=0 j=3 4,3,2,1 || k=1 j=0 1,0,-1,-2 ||...||k=3 j=3 4,3,2,1
                                                }else if (directionX == 0 && directionY == 1) {
                                                        posX = k+1; // 1111 1111 1111 1111 || 2222 2222 2222 2222
                                                        posY = (j+1)+z; // 1234 2345 3456 4567 || 1234 2345 3456 4567
                                                }else if (directionX == 0 && directionY == -1) {
                                                        posX = k+1;//1111 1111 1111 1111 || 2222 2222 2222 2222 || 3333
                                                        posY = (j+1)-z;//10-1-2 210-1 3210 4321|| 10-1-2 210-1 3210 4321 || 10-1-2
                                                }else if (directionX == -1 && directionY == 1) {
                                                        posX = (k+1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1 210-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                                                        posY = (j+1) + z;//1234 2345 3456 4567 || 1234 2345 3456 4567 || 1234 2345 3456 4567 ||1234 2345 3456 4567 
                                                }else if (directionX == -1 && directionY == -1) {
                                                        posX = (k+1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1110-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                                                        posY = (k+1) - z;////10-1-2 210-1 3210 4321|| 10-1-2 210-1 3210 4321 || 10-1-2 210-1 3210 4321 || 10-1-2 210-1 3210 4321
                                                }else if (directionX == -1 && directionY == 0) {
                                                        posX = (k+1) - z;//10-1-2 10-1-2 10-1-2 10-1-2 || 210-1 210-1 210-1 210-1 || 3210 3210 3210 3210 || 4321 4321 4321 4321
                                                        posY = j+1;//1111 2222 3333 4444 || 1111 2222 3333 4444 || 1111 2222 3333 4444 || 1111 2222 3333 4444
                                                }
                                                if (initialCell.style.backgroundColor == document.getElementById("col"+posX+"pos"+posY).style.backgroundColor) {
                                                        matchCount++;
                                                        console.log(matchCount);
                                                    } 
                                        } catch (error) {}
                                }
                                if (matchCount == 4) {
                                        break;
                                }else{
                                matchCount=0;
                                }   
                        }if (matchCount == 4) {
                                break;
                        }
                                   
                }
                
                if (matchCount == 4) {
                        champion = player;
                        gameOver =1;
                        if(champion == "player"){
                                winSound.play();
                                document.getElementById("button1").style.display = "none";
                                document.getElementById("text").innerHTML ="You've won! Write your name: <br>" + 
                                "<p><input id='winnername' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
                        }else if(champion == "player1"){
                                winSound.play();
                                document.getElementById("button1").style.display = "none";
                                document.getElementById("text").innerHTML ="Player1 has won! Write your name: <br>" + 
                                "<p><input id='winnername' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
                        }else if(champion == "player2"){
                                winSound.play();
                                document.getElementById("button1").style.display = "none";
                                document.getElementById("text").innerHTML ="Player2 has won! Write your name: <br>" + 
                                "<p><input id='winnername' type='text'></p><p><button onclick='saveValue()'>Save</button></p>";
                        }else if (champion == "machine"){
                                loseSound.play();
                                matchesCount++;
                                document.getElementById("button1").style.display = "";
                                document.getElementById("text").innerHTML ="You've lost (lol)";
                        }
                        break;
                }else{
                        matchCount=0;
                }
        }
        if (matchCount == 0 && fullCells == boardSize) {
                matchesCount++;
                document.getElementById("button1").style.display = "";
                document.getElementById("text").innerHTML ="-- Draw --";
        }

}

function saveValue(){
        var ganador = {
                name: document.getElementById("winnername").value,
                numTiradas: matchesCount,
                game: gameMode
            };
        winners.push(ganador);
        matchesCount = 1;
        console.log(winners);
        document.getElementById("text").innerHTML = "List of Champions: <br>"
        for (var i = 0; i < winners.length; i++) {
                document.getElementById("text").innerHTML =document.getElementById("text").innerHTML + 
                "<br>" + "Winner nº "+ (i+1) + " : "+ winners[i].name + " || Matches needed: "+ winners[i].numTiradas + " || Game mode: " + winners[i].game;
                
        }
        document.getElementById("button1").style.display = "";
}

function restartGame(){
        for (var i = 0; i < columnNum; i++) {
                for (var j = 0; j < rowNum ; j++) {
                        document.getElementById("col"+(i+1)+"pos"+(j+1)).style.backgroundColor = "white";
                }
        }
        gameOver = 0;
}

function gameModeChange() {
       gameMode=document.getElementById("gamemode").value;
       playerTurn =1;
       restartGame();
}