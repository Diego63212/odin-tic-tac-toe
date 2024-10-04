const debug = (function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(' ')
        }
    }

    const getBoard = () => board;

    const getCell = (row, column) => {
        return board[row][column];
    }

    const placeToken = function (row, column, player) {
        board[row][column] = player.token
        return getBoard();
    }

    return { getBoard, getCell, placeToken }
})();

function Player (name, token) {
    return { name, token}
}

const player1 = Player('One', 'X')
const player2 = Player('Two', 'O')

/* function gameController */