function Gameboard () {
    const board = [];
    const size = 3;

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell());
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

    const getSize = () => size;

    const placeToken = function (row, column, player) {
        board[row][column].placeToken(player);
    }

    return { printBoard, getCell, placeToken, getSize };
}

function Player (name, token, id) {
    return { name, token, id };
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
    const players = [Player('One', 'X', 1), Player('Two', 'O', 20)];

    let currentPlayer = players[0];
    
    const board = Gameboard();
    
    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
    }
    
    const playRound = (row, column) => {
        if (board.getCell(row, column)) return console.log('Cell already occupied');

        board.placeToken(row, column, currentPlayer);
        console.log(board.printBoard());
        checker();
        changePlayer();
        console.log(`Player ${currentPlayer.name} turn`);
    }
    
    const getPlayer = () => currentPlayer.name;
    console.log(board.printBoard());
    console.log(`Player ${currentPlayer.name} turn`);

    const checker = () => {
        const size = board.getSize();
        const victoryPoints = currentPlayer.id * size;
        // Row
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum += board.getCell(i, j);
            }
            console.log(`Row ${i + 1}: `, sum)
            if (sum === victoryPoints) return console.log(`Player ${currentPlayer.name} won in row ${i + 1}`);
        }
        // Column
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum += board.getCell(j, i);
            }
            console.log(`Column ${i + 1}: `, sum)
            if (sum === victoryPoints) return console.log(`Player ${currentPlayer.name} won in column ${i + 1}`);
        }
        // Diagonal
        let diagonal1 = 0;
        let diagonal2 = 0;
        for (let i = 0; i < size; i++) {
            diagonal1 += board.getCell(i, i)
        }
        for (let i = 0; i < size; i++) {
            diagonal2 += board.getCell(i, (size - 1) - i);
        }
        console.log(`Diagonal 1: `, diagonal1)
        console.log(`Diagonal 2: `, diagonal2)

        if (diagonal1 === victoryPoints) return console.log(`Player ${currentPlayer.name} won in diagonal`);
        if (diagonal2 === victoryPoints) return console.log(`Player ${currentPlayer.name} won in diagonal`);
    }
    
    return { playRound, getPlayer, getBoard: board.printBoard };
}

const controller = (function ScreenController () {
    const game = GameController();
    const gameBoardDiv = document.querySelector('.board');
    const gamePlayerDiv = document.querySelector('.player')

    gameBoardDiv.addEventListener('click', (e) => {
        const element = e.target;
        if (!element.dataset.row) return;
        game.playRound(element.dataset.row, element.dataset.column)
        updateScreen()
    })

    const updateScreen = () => {
        gamePlayerDiv.textContent = game.getPlayer()
        const fragment = document.createDocumentFragment();
        const currentBoard = game.getBoard();

        for (let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const cellBtn = document.createElement('button');
                cellBtn.dataset.row = i;
                cellBtn.dataset.column = j;
                cellBtn.textContent = game.getBoard()[i][j]

                fragment.appendChild(cellBtn);
            }
        }
        gameBoardDiv.replaceChildren(fragment);
    }
    updateScreen()
})();