let boardState = []; // declaring an array - don't need a size
let table = document.getElementById("board"); // getting the board from html file
let gameType = "S";
let winner = 0;
let current;
let player;
let AI;
for(let i = 0; i < 3; i++) {
    let row = table.insertRow(); // inserting rows
    boardState.push([]);  // .push - inserting something into array - creating a 2D array
    for(let j = 0; j < 3; j++) { // inserting columns 
        let cell = row.insertCell();
        let button = document.createElement("button"); // inserting buttons
        button.className = "gameInputBtn";
        button.x = j;   // assigning coordinates
        button.y = i;
        button.onclick = clickMove; // calling the click function once a button is clicked
        cell.appendChild(button); // puts button inside the cell
        boardState[i].push(0); // initially array is full of 0's
    }
}

function changeAllButtons(state) {
    for(let row of table.children[0].children) {
        for(let cell of row.children) {
            cell.children[0].disabled = !state;
            console.log(state)
        }
    }
}

changeAllButtons(false);

function clickSingle() {
    reset();
    gameType = "S";
    player = window.prompt("Which letter would you like to be?");
    setLetters(player, AI);
    let first = window.prompt("Which player would like to go first?");
    setLetters(first, current);
}

function setLetters(one, two) {
    if(one == "X" || one == "x"){
        two = 0;
    } else if(one == "O" || one == "o") {
        two = 1;
    } else {
        confirm("Invalid entry; set to X by default");
        two = 0;
    }
}

function clickMulti() {
    reset();
    gameType = "M";
    let first = window.prompt("Which player would like to go first?");
    setLetters(first, current);
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
    if(direction == 0) {
        entry = boardState[0][0]
    } else {
        entry = boardState[0][2];
    }
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
            confirm("X won!");
        } else if(winner = 2) {
            confirm("O won!")
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
}

function clickMove() {
    console.log(this.x, this.y); // printing x and y coordinates
    current = !current;
    if(current == 1) {
      this.innerHTML = "X";
      boardState[this.y][this.x] = 1; // turns entry from 0 to 1
    } else {
      this.innerHTML = "O";
      boardState[this.y][this.x] = 2; // turns entry from 0 to 2
    }
    //this.innerHTML = "X"; // makes button become X once its clicked on
    console.log(boardState);  // printing board array
    this.disabled = true; // disables a button after it's clicked on
    solve();
    let over = 1;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(boardState[j][i] == 0) {
                over = 0;
            }
        }
    }
    if(over == 1 && winner == 0) {
        confirm("Tie");
        changeAllButtons(false);
    }
}