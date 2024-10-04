function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push('')
        }
    }

    const getBoard = () => board;

    const getCell = (row, column) => {
        return board[row][column];
    }

    const placeToken = function (row, column, player) {
        board[row][column] = player.token
    }

    return { getBoard, getCell, placeToken };
}

function Player (name, token) {
    return { name, token };
}

const player1 = Player('One', 'X');
const player2 = Player('Two', 'O');

const game = (function GameController () {
    let currentPlayer = player1;
    const board = Gameboard();
    const changePlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1
        }
    }
    const playRound = (row, column) => {
        if (board.getCell(row, column)) return console.log('Cell already occupied');

        board.placeToken(row, column, currentPlayer)
        changePlayer()
        console.log(board.getBoard())
    }
    const getPlayer = () => currentPlayer;

    return { playRound, getPlayer };
})();