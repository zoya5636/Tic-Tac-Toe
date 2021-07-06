let boardState = []; // declaring an array - don't need a size
let btnArr = [];
let table = document.getElementById("board"); // getting the board from html file
let gameType = "S";
let winner = 0;
let current = 1;
let player;
let AI;
let level;
for(let i = 0; i < 3; i++) {
    let row = table.insertRow(); // inserting rows
    boardState.push([]);  // .push - inserting something into array - creating a 2D array
    btnArr.push([]);
    for(let j = 0; j < 3; j++) { // inserting columns 
        let cell = row.insertCell();
        let button = document.createElement("button"); // inserting buttons
        button.className = "gameInputBtn";
        button.x = j;   // assigning coordinates
        button.y = i;
        btnArr[i].push(button);
        button.onclick = clickMove; // calling the click function once a button is clicked
        cell.appendChild(button); // puts button inside the cell
        boardState[i].push(0); // initially array is full of 0's
    }
}

function changeAllButtons(state) {
    for(let row of table.children[0].children) {
        for(let cell of row.children) {
            cell.children[0].disabled = !state;
        }
    }
}

changeAllButtons(false);

/*function level(n) {

}*/

function clickSingle() {
    reset();
    gameType = "S";
    player = window.prompt("Which letter would you like to be?");
    if(player == "X" || player == "x") {
        AI = 2;
        player = 1;
    } else if(player == "O" || player == "o") {
        AI = 1;
        player = 2;
    } else {
        alert("Invalid entry; you are X by default");
        player = 1;
        AI = 2;
    }
    current = setFirst();
}

function setFirst() {
    let current;
    let first = window.prompt("Which player would like to go first?");
    if(first == "X" || first == "x"){
        current = 1;
    } else if(first == "O" || first == "o") {
        current = 2;
    } else {
        alert("Invalid entry; set to X by default");
        current = 1;
    }
    return current;
}

function clickMulti() {
    reset();
    gameType = "M";
    current = setFirst();
}

function solveRowCol(rowCol) {
    let turn;
    let x;
    let won;
    for(let i = 0; i < 3; i++) {
        won = 1;
        x = 0;
        if(rowCol == 0) {
            if(boardState[i][0] != 0) {
                turn = boardState[i][0];
                x = 1;
            }
        } else {
            if(boardState[0][i] != 0) {
                turn = boardState[0][i];
                x = 1;
            }
        }
        if(x == 1) {
            for(let j = 0; j < 3; j++) {
                if( ((rowCol == 0) && (boardState[i][j] != turn)) || ((rowCol == 1) && (boardState[j][i] != turn)) ) {
                    won = 0;
                }
            }
            if(won == 1) {
                winner = turn;
                return 1;
            }
        }
    }
    return 0;
}

function solveDiagonal(direction) {
    let entry;
    let won;
    if(direction == 0) entry = boardState[0][0]
    else entry = boardState[0][2];
    if(entry != 0) {
        won = 1;
        turn = entry;
        for(let i = 0; i < 3; i++) {
            if( ((direction == 0) && (boardState[i][i] != turn)) ||
                ((direction == 1) && (boardState[i][2 - i] != turn)) ) {
                won = 0;
            }
        }
    }
    if(won == 1) {
        winner = turn;
        return 1;
    }
    return 0;
}

function solve() {
    if(solveRowCol(0) == 1 || solveRowCol(1) == 1 || solveDiagonal(0) == 1 || solveDiagonal(1) == 1) {
        if(winner == 1) {
            alert("X won!");
        } else if(winner = 2) {
            alert("O won!")
        }
        changeAllButtons(false);
    }
}

function reset() {
    changeAllButtons(true);
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            boardState[j][i] = 0;
        }
    }
    for(let row of table.children[0].children) {
        for(let cell of row.children) {
            cell.children[0].innerHTML = "";
        }
    }
    winner = 0;
}

/*

AI logic:
----------------------------------------------------------
1) check if you can win in one move (2 aligned)
2) check if opponent can win in one move (2 aligned)
3) check if opponent can win in two moves ("cornered")
4) check if you can win in two moves (1 aligned)
5) play randomly

*/

function isValid(row, col) {
    if(row >= 3 || col >= 3 || row < 0 || col < 0) {
        return 0;
    }
    return 1;
}

function playAIMove(turn, row, col, deltaRow, deltaCol) {
    if(turn == 0) {
        boardState[row + deltaRow][col + deltaCol] = AI;
        return [row + deltaRow, col + deltaCol];
    } else {
        boardState[row + (2*deltaRow)][col + (2*deltaCol)] = AI;
        return [row + (2*deltaRow), col + (2*deltaCol)];
    }
}

// returns 1 if move made, 0 if not
function oneOrTwoMove(turn) {
    // turn can be AI or player for oneMove, should be 0 for twoMoves
    let fEntry = 0;
    let turn1 = turn;
    if(turn == 0) turn1 = AI;
    while(1) {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(boardState[j][i] == turn1) {
                    if(isValid(j - 1, i) == 1 && isValid(j - 2, i) == 1 &&
                    boardState[j - 1][i] == turn && boardState[j - 2][i] == fEntry) {
                        return playAIMove(turn, j, i, -1, 0);
                    } else if(isValid(j + 1, i) == 1 && isValid(j + 2, i) == 1 &&
                      boardState[j + 1][i] == turn && boardState[j + 2][i] == fEntry) {
                        return playAIMove(turn, j, i, 1, 0);
                    } else if(isValid(j, i - 1) == 1 && isValid(j, i - 2) == 1 &&
                      boardState[j][i - 1] == turn && boardState[j][i - 2] == fEntry) {
                        return playAIMove(turn, j, i, 0, -1);
                    } else if(isValid(j, i + 1) == 1 && isValid(j, i + 2) == 1 &&
                      boardState[j][i + 1] == turn && boardState[j][i + 2] == fEntry) {
                        return playAIMove(turn, j, i, 0, 1);
                    } else if(isValid(j - 1, i - 1) == 1 && isValid(j - 2, i) == 1 &&
                      boardState[j - 1][i - 1] == turn && boardState[j - 2][i - 2] == fEntry) {
                        return playAIMove(turn, j, i, -1, -1);
                    } else if(isValid(j + 1, i + 1) == 1 && isValid(j + 2, i + 2) == 1 &&
                      boardState[j + 1][i + 1] == turn && boardState[j + 2][i + 2] == fEntry) {
                        return playAIMove(turn, j, i, 1, 1);
                    } else if(isValid(j - 1, i + 1) == 1 && isValid(j - 2, i) == 1 &&
                      boardState[j - 1][i + 1] == turn && boardState[j - 2][i + 2] == fEntry) {
                        return playAIMove(turn, j, i, -1, 1);
                    } else if(isValid(j + 1, i - 1) == 1 && isValid(j + 2, i - 2) == 1 &&
                      boardState[j + 1][i - 1] == turn && boardState[j + 2][i - 2] == fEntry) {
                        return playAIMove(turn, j, i, 1, -1);
                    }
                }
            }
        }
        if(turn == 0) break;
        fEntry = turn;
        turn = 0;
    }
    return 0;
}



function randomMove() {
    let center = 0;
    let poss = [];
    let size = 0;
    if(boardState[1][1] == player) {
        center = 1;
        if(boardState[0][0] == 0) {
            poss.push([0, 0]);
            size++;
        }
        if(boardState[0][2] == 0) {
            poss.push([0, 2]);
            size++;
        }
        if(boardState[2][0] == 0) {
            poss.push([2, 0]);
            size++;
        }
        if(boardState[2][2] == 0) {
            poss.push([2, 2]);
            size++;
        }
    } else if(boardState[1][1] == 0) {
        boardState[1][1] = AI;
        return [1, 1];
    }
    if( (center == 1 && size == 0) || center == 0 ) {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(boardState[j][i] == 0) {
                    poss.push([j, i]);
                    size++;
                }
            }
        }
    }
    if(size == 0) {
        return 0;
    }
    let move = Math.floor(Math.random() * size);
    /*console.log(poss);
    console.log(move);
    console.log(poss[move][0]);
    console.log(poss[move][1]);
    console.log("board:")
    console.log(boardState[poss[move][0]][poss[move][1]]);*/
    boardState[poss[move][0]][poss[move][1]] = AI;
    return [poss[move][0], poss[move][1]];
}

/*function makeTrapMove(row1, col1, row2, col2, playerLetter, AILetter) {
    if(boardState[row1][col1] == playerLetter && boardState[row2][col2] == 0) {
        boardState[row2][col2] = AILetter;
        return [row2, col2];
    } else if(boardState[row2][col2] == playerLetter && boardState[row1][col1] == 0) {
        boardState[row1][col1] = AILetter;
        return [row1, col1];
    }
    return 0;
}

function trapCheck() {
    let AILetter = AI;
    let playerLetter = player;
    if(AI == 0) {
        AILetter = 2;
    } else {
        playerLetter = 0;
    }
    if(boardState[1][1] == playerLetter) {
        if(boardState[2][0] == 2) {
            console.log("a");
        }
        let coor = makeTrapMove(0, 0, 2, 0, playerLetter, AILetter);
        if(coor != 0) {
            return coor;
        }
        coor = makeTrapMove(0, 0, 0, 2, playerLetter, AILetter);
        if(coor != 0) {
            return coor;
        }
        coor = makeTrapMove(0, 2, 2, 2, playerLetter, AILetter);
        if(coor != 0) {
            return coor;
        }
        coor = makeTrapMove(2, 2, 2, 0, playerLetter, AILetter);
        if(coor != 0) {
            return coor;
        }
    }
    return 0;
}*/

function updateCurrent() {
    if(current == 1) {
        current = 2;
    } else {
        current = 1;
    }
}

function AIMove() {
    //console.log("AI move");
    //winOneMove();
    let moveMade = 0;
    let coor = oneOrTwoMove(AI);
    //console.log(coor);
    if(coor != 0) {
        console.log("1");
        moveMade = 1;
    }
    //loseOneMove();
    if(moveMade == 0) {
        coor = oneOrTwoMove(player);
        if(coor != 0) {
            console.log("2");
            moveMade = 1;
        }
    }
    // trap check
    /*if(moveMade == 0) {
        coor = trapCheck();
        if(coor != 0) {
            console.log("2.5");
            moveMade = 1;
        }
    }*/
    //winTwoMoves();
    if(moveMade == 0) {
        coor = oneOrTwoMove(0);
        if(coor != 0) {
            console.log("3");
            moveMade = 1;
        }
    }
    if(moveMade == 0) {
        coor = randomMove();
        if(coor != 0) {
            console.log("4");
            moveMade = 1;
        }
    }
    
    updateCurrent();

    if(moveMade == 1) {
        if(AI == 1) {
            btnArr[coor[0]][coor[1]].innerHTML = "X";
        } else {
            btnArr[coor[0]][coor[1]].innerHTML = "O";
        }
        return 1;
    }
    return 0;
}

function clickMove() {
    //console.log(this.x, this.y); // printing x and y coordinates
    if(current == 1) {
        this.innerHTML = "X";
        boardState[this.y][this.x] = 1; // turns entry from 0 to 1
    } else {
        this.innerHTML = "O";
        boardState[this.y][this.x] = 2; // turns entry from 0 to 2
    }
    updateCurrent();
    //console.log("cccc");
    //this.innerHTML = "X"; // makes button become X once its clicked on
    //console.log(boardState);  // printing board array
    this.disabled = true; // disables a button after it's clicked on
    /*this.style.display = 'none';
    this.style.display = 'block';*/
    if(gameType == "S") {
        AIMove();
    }
    setTimeout(solve, 100);
    let over = 1;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(boardState[j][i] == 0) {
                over = 0;
            }
        }
    }
    if(over == 1 && winner == 0) {
        alert("Tie");
        changeAllButtons(false);
    }
}

