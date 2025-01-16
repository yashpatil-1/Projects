const gridContainer = document.querySelector(".grid");
const gridSize = 4;
let board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
let score = 0;

function initializeBoard() {
    addRandomNumber(); 
    addRandomNumber(); 
    renderBoard();     
}

function addRandomNumber() {
    let emptyCells = [];
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderBoard() {
    gridContainer.innerHTML = ""; 
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            const value = board[row][col];

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add("filled");
            } else {
                cell.textContent = ""; 
                cell.classList.remove("filled");
            }

            gridContainer.appendChild(cell);
        }
    }

    document.getElementById('score').textContent = score;
}

function move(direction) {
    let moved = false;
    let beforeMove = JSON.parse(JSON.stringify(board)); 
    
    if (direction === "left" || direction === "right") {
        for (let row = 0; row < gridSize; row++) {
            let currentRow = board[row];
            if (direction === "right") {
                currentRow = currentRow.reverse();
            }
            let newRow = slideAndMerge(currentRow);
            if (direction === "right") {
                newRow = newRow.reverse();
            }
            if (!arraysEqual(currentRow, newRow)) {
                moved = true;
                board[row] = newRow;
            }
        }
    } else if (direction === "up" || direction === "down") {
        for (let col = 0; col < gridSize; col++) {
            let currentCol = board.map(row => row[col]);
            if (direction === "down") {
                currentCol = currentCol.reverse();
            }
            let newCol = slideAndMerge(currentCol);
            if (direction === "down") {
                newCol = newCol.reverse();
            }
            for (let row = 0; row < gridSize; row++) {
                if (board[row][col] !== newCol[row]) {
                    moved = true;
                    board[row][col] = newCol[row];
                }
            }
        }
    }

    if (moved) {
        addRandomNumber(); 
        renderBoard(); 
        checkGameOver(); 
    } else if (arraysEqual(board, beforeMove)) {
        checkGameOver();
    }
}

function slideAndMerge(arr) {
    let newArr = arr.filter(num => num !== 0);
    for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] === newArr[i + 1]) {
            newArr[i] = newArr[i] * 2; 
            score += newArr[i]; 
            newArr[i + 1] = 0; 
        }
    }
    newArr = newArr.filter(num => num !== 0); 
    while (newArr.length < gridSize) {
        newArr.push(0); 
    }
    return newArr;
}

function arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function checkGameOver() {
    let possibleMoves = false;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                possibleMoves = true;
                break;
            }
            if (row < gridSize - 1 && board[row][col] === board[row + 1][col]) {
                possibleMoves = true;
                break;
            }
            if (col < gridSize - 1 && board[row][col] === board[row][col + 1]) {
                possibleMoves = true;
                break;
            }
        }
        if (possibleMoves) break;
    }

    if (!possibleMoves) {
        alert("Game Over! Please refresh the page to play again.");
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        move("left");
    } else if (event.key === "ArrowRight") {
        move("right");
    } else if (event.key === "ArrowUp") {
        move("up");
    } else if (event.key === "ArrowDown") {
        move("down");
    }
});

initializeBoard();
