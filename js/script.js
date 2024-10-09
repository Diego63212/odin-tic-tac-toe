function Gameboard () {
    const board = [];
    let filledCells = 0;

    const createBoard = (size = 3) => {
        filledCells = 0;
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i].push(Cell());
            }
        }
    }

    const printBoard = () => board.map((value) => {
        return value.map((value) => {
            return value.getToken();
        });
    });

    const getCell = (row, column) => {
        return board[row][column].getValue();
    }

    const placeToken = (row, column, player) => {
        board[row][column].placeToken(player);
        filledCells++;
    }

    const getFilledCells = () => filledCells;
    createBoard();
    return { printBoard, getCell, placeToken, createBoard, getFilledCells };
}

function Player (name, token, id, color) {
    return { name, token, id, color };
}

function Cell () {
    let value = 0;
    let token = '';

    const placeToken = (player) => {
        value = player.id;
        token = player.token;
    }
    const getValue = () => value;
    const getToken = () => token;

    return { placeToken, getValue, getToken }
}

function GameController () {
    const board = Gameboard();
    const players = [];
    let currentPlayer;
    let isGameFinished = false;
    let gameStatus = '';

    const startGame = (playerOneName, playerTwoName, playerOneColor, playerTwoColor) => {
        players[0] = Player(playerOneName || 'One', 'X', Math.random(), playerOneColor || '#0000ff')
        players[1] = Player(playerTwoName || 'Two', 'O', Math.random(), playerTwoColor || '#ff0000')
        currentPlayer = players[0];
        resetGame();
    }
    
    const changePlayer = () => {
        currentPlayer === players[0] ? currentPlayer = players[1] : currentPlayer = players[0];
        console.log(`Player ${currentPlayer.name} turn`);
    }
    
    const playRound = (row, column) => {
        if (isGameFinished) {
            resetGame();
            return;
        }
        if (board.getCell(row, column)) {
            console.log('Cell already occupied');
            gameStatus = 'Cell already occupied';
            return true; 
        }

        board.placeToken(row, column, currentPlayer);
        console.log(board.printBoard());
        checkWin();
        if (isGameFinished) return;

        changePlayer();
    }

    const resetGame = () => {
        isGameFinished = false;
        currentPlayer = players[0];
        gameStatus = '';
        board.createBoard();
        console.log(board.printBoard());
        console.log(`Player ${currentPlayer.name} turn`);
    }
    
    const getPlayer = () => currentPlayer;

    const getStatus = () => {
        const currentStatus = gameStatus;
        gameStatus = ''; // Reset status
        return currentStatus
    };
    // Check win condition by sum of cell values
    const checkWin = () => {
        const size = board.printBoard().length;
        const victoryPoints = currentPlayer.id * size;
        // Row
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum += board.getCell(i, j);
            }
            console.log(`Row ${i + 1}: `, sum)
            if (sum === victoryPoints) {
                console.log(`Player ${currentPlayer.name} won in row ${i + 1}`);
                gameStatus = `Player ${currentPlayer.name} won in row ${i + 1}`;
                isGameFinished = true;
                return;
            }
        }
        // Column
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum += board.getCell(j, i);
            }
            console.log(`Column ${i + 1}: `, sum);
            if (sum === victoryPoints) {
                console.log(`Player ${currentPlayer.name} won in column ${i + 1}`);
                gameStatus = `Player ${currentPlayer.name} won in column ${i + 1}`;
                isGameFinished = true;
                return;
            }
        }
        // Diagonal
        let diagonal1 = diagonal2 = 0;
        for (let i = 0; i < size; i++) {
            diagonal1 += board.getCell(i, i)
        }
        for (let i = 0; i < size; i++) {
            diagonal2 += board.getCell(i, (size - 1) - i);
        }
        console.log(`Diagonal 1: `, diagonal1);
        console.log(`Diagonal 2: `, diagonal2);
        if (diagonal1 === victoryPoints || diagonal2 === victoryPoints) {
            console.log(`Player ${currentPlayer.name} won in diagonal`);
            gameStatus = `Player ${currentPlayer.name} won in diagonal`;
            isGameFinished = true;
            return;
        }
        // Tie
        if (size * size === board.getFilledCells()) {
            console.log('Game board is full (Tied)');
            gameStatus = 'Game board is full (Tied)';
            isGameFinished = true;
            return;
        }
    }
    return { playRound, getPlayer, getBoard: board.printBoard, getStatus, startGame };
}

(function ScreenController () {
    const game = GameController();
    const gameBoardDiv = document.querySelector('.board');
    const gamePlayerDiv = document.querySelector('.player');
    const gameStatusDiv = document.querySelector('.status');
    const playerOneName = document.querySelector('#player1-input')
    const playerTwoName = document.querySelector('#player2-input')
    const playerOneColor = document.querySelector('#player1-color');
    const playerTwoColor = document.querySelector('#player2-color');
    const startBtn = document.querySelector('#start');
    let previousPlayer = '';
    gameBoardDiv.style.setProperty('--board-size', game.getBoard().length);

    gameBoardDiv.addEventListener('click', (e) => {
        if (!e.target.dataset.row) return;
        const element = e.target;
        let skipDraw = game.playRound(element.dataset.row, element.dataset.column);
        updateScreen(skipDraw);
    })
    
    startBtn.addEventListener('click', () => {
        game.startGame(
            playerOneName.value || undefined,
            playerTwoName.value || undefined, 
            playerOneColor.value || undefined,
            playerTwoColor.value || undefined,
        )
        updateScreen()
    })
    
    const updateScreen = (skipDraw) => {
        gameStatusDiv.textContent = game.getStatus();
        if (skipDraw) return;
        
        const currentPlayer = game.getPlayer();
        const currentBoard = game.getBoard();
        const fragment = document.createDocumentFragment();
        
        gamePlayerDiv.textContent = `Player ${currentPlayer.name} turn (${currentPlayer.token})`;
        for (let i = 0; i < currentBoard.length; i++) {
            for(let j = 0; j < currentBoard.length; j++) {
                const cellBtn = document.createElement('button');
                cellBtn.dataset.row = i;
                cellBtn.dataset.column = j;
                cellBtn.classList.toggle('board-button')
                cellBtn.textContent = currentBoard[i][j];
                if (cellBtn.textContent === currentPlayer.token) {
                    cellBtn.style.color = currentPlayer.color;
                } else if (currentPlayer != previousPlayer) {
                    cellBtn.style.color = previousPlayer.color
                }
                fragment.appendChild(cellBtn);
            }
        }
        previousPlayer = currentPlayer;
        gameBoardDiv.replaceChildren(fragment);
    }
    game.startGame();
    updateScreen();
})();