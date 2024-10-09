function Gameboard () {
    const board = [];
    let filledCells = 0;
    let savedSize = 3;

    const createBoard = (size = savedSize) => {
        filledCells = 0;
        savedSize = size;
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i].push(Cell());
            }
        }
        while (board.length > size) {
            board.pop();
        }
    }
    // Return board array with token instead of player id
    const printBoard = () => board.map((value) => {
        return value.map((value) => {
            return value.getToken();
        });
    });
    // Get the player id inside of a cell
    const getCell = (row, column) => {
        return board[row][column].getValue();
    }
    // Place and register action
    const placeToken = (row, column, player) => {
        board[row][column].placeToken(player);
        filledCells++;
    }
    // Easy method to know how many cells are already occupied
    const getFilledCells = () => filledCells;
    createBoard();
    return { printBoard, getCell, placeToken, createBoard, getFilledCells };
}

function Player (name, token, color) {
    return { name, token, id: Math.random(), color };
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
    // Start the game with two player with fallback support
    const startGame = (playerOneName, playerTwoName, playerOneColor, playerTwoColor, boardSize) => {
        players[0] = Player(playerOneName || 'One', 'X', playerOneColor || '#0000ff');
        players[1] = Player(playerTwoName || 'Two', 'O', playerTwoColor || '#ff0000');
        currentPlayer = players[0];
        resetGame(boardSize);
    }
    
    const changePlayer = () => {
        currentPlayer === players[0] ? currentPlayer = players[1] : currentPlayer = players[0];
        console.log(board.printBoard());
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
        checkWin();
        if (isGameFinished) return;
        
        changePlayer();
    }
    // Reset board, game and player status
    const resetGame = (boardSize) => {
        isGameFinished = false;
        currentPlayer = players[0];
        gameStatus = '';
        board.createBoard(boardSize);
        console.log(board.printBoard());
        console.log(`Player ${currentPlayer.name} turn`);
    }
    
    const getPlayer = () => currentPlayer;
    // Return game status and clear it
    const getStatus = () => {
        const currentStatus = gameStatus;
        gameStatus = '';
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
            currentPlayer.color = 'black';
            isGameFinished = true;
            return;
        }
    }
    return { playRound, getPlayer, getBoard: board.printBoard, getStatus, startGame };
}

(function ScreenController () {
    const game = GameController();
    const gameBoardDiv = document.querySelector('.board');
    const gamePlayerDiv = document.querySelector('.player-turn');
    const gameStatusDiv = document.querySelector('.game-status');
    const playerOneName = document.querySelector('#player1-input')
    const playerTwoName = document.querySelector('#player2-input')
    const playerOneColor = document.querySelector('#player1-color');
    const playerTwoColor = document.querySelector('#player2-color');
    const startBtn = document.querySelector('#start');
    let previousPlayer = '';
    
    gameBoardDiv.addEventListener('click', (e) => {
        if (!e.target.dataset.row) return;
        const element = e.target;
        let skipDraw = game.playRound(element.dataset.row, element.dataset.column);
        updateScreen(skipDraw);
    })
    // Start a new game with custom name or revert to default
    startBtn.addEventListener('click', () => {
        const boardSize = prompt('Board size?');
        game.startGame(playerOneName.value, playerTwoName.value, playerOneColor.value, playerTwoColor.value, +boardSize);
        updateScreen();
    })
    // Handle the entire user interface creating and updating
    const updateScreen = (skipDraw) => {
        gameStatusDiv.textContent = game.getStatus();
        if (skipDraw) return; // Skip the recreating of the board html when unneeded
        
        const currentPlayer = game.getPlayer();
        const currentBoard = game.getBoard();
        const fragment = document.createDocumentFragment();
        
        gameBoardDiv.style.setProperty('--board-size', game.getBoard().length);
        gamePlayerDiv.textContent = `Player ${currentPlayer.name} turn (${currentPlayer.token})`;
        for (let i = 0; i < currentBoard.length; i++) {
            for(let j = 0; j < currentBoard.length; j++) {
                const cellBtn = document.createElement('button');
                cellBtn.textContent = currentBoard[i][j];
                cellBtn.dataset.row = i;
                cellBtn.dataset.column = j;
                cellBtn.classList.toggle('board-button')
                if (currentPlayer != previousPlayer) cellBtn.style.color = previousPlayer.color;
                if (cellBtn.textContent === currentPlayer.token) cellBtn.style.color = currentPlayer.color;
                fragment.appendChild(cellBtn);
            }
        }
        previousPlayer = currentPlayer; // Saves old player to correctly represent color
        gameBoardDiv.replaceChildren(fragment);
    }
    game.startGame(); // Start a game with default player
    updateScreen(); // Update screen on page load
})();