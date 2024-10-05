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

function Player (name, token, id) {
    return { name, token, id };
}

function Cell () {

}

const game = (function GameController () {
    const players = [Player('One', 'X', 1), Player('Two', 'O', 10)]

    let currentPlayer = players[0];
    
    const board = Gameboard();
    
    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0]
        }
    }
    
    const playRound = (row, column) => {
        if (board.getCell(row, column)) return console.log('Cell already occupied');

        board.placeToken(row, column, currentPlayer)
        checker()
        changePlayer()
        console.log(board.getBoard())
        console.log(`Player ${currentPlayer.name} turn`)
    }
    
    const getPlayer = () => currentPlayer;
    console.log(board.getBoard())
    console.log(`Player ${currentPlayer.name} turn`)

    const checker = () => {
        const rows = board.getBoard().length;
        const columns = board.getBoard()[0].length;
        for (let i = 0; i < rows; i++) {
            let sum = 0;
            for(let j = 0; j < columns; j++) {
                board.getCell(i, j) === players[0].token ? sum += players[0].id : undefined;
                board.getCell(i, j) === players[1].token ? sum += players[1].id : undefined;
            }
            console.log(`Row ${i + 1}: `, sum)
            if (sum === currentPlayer.id * columns) console.log(`Player ${currentPlayer.name} won in row ${i + 1}`);
        }

        for (let i = 0; i < columns; i++) {
            let sum = 0;
            for(let j = 0; j < rows; j++) {
                board.getCell(j, i) === players[0].token ? sum += players[0].id : undefined;
                board.getCell(j, i) === players[1].token ? sum += players[1].id : undefined;
            }
            console.log(`Column ${i + 1}: `, sum)
            if (sum === currentPlayer.id * columns) console.log(`Player ${currentPlayer.name} won in column ${i + 1}`);
        }
    }
    
    return { playRound, getPlayer, checker };
})();