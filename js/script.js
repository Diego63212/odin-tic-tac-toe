function Gameboard() {
    const board = [];
    const size = 3;

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell())
        }
    }

    const getBoard = (form) => board.map((value) => {
        return value.map((value) => {
            return value.getData(form)
        })
    });

    const getCell = (row, column) => {
        return board[row][column].getData('value');
    }

    const getSize = () => size;

    const placeToken = function (row, column, player) {
        board[row][column].placeToken(player);
    }

    return { getBoard, getCell, placeToken, getSize };
}

function Player (name, token, id) {
    return { name, token, id };
}

function Cell () {
    let data = { value: 0, token: ''}

    const placeToken = (player) => {
        data.value = player.id;
        data.token = player.token;
    };
    const getData = (form) => data[form];

    return { placeToken, getData }
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
        console.log(board.getBoard('token'))
        console.log(`Player ${currentPlayer.name} turn`)
    }
    
    const getPlayer = () => currentPlayer;
    console.log(board.getBoard('token'))
    console.log(`Player ${currentPlayer.name} turn`)

    const checker = () => {
        const size = board.getSize();
        // Row
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum+= board.getCell(i, j);
            }
            console.log(`Row ${i + 1}: `, sum)
            if (sum === currentPlayer.id * size) console.log(`Player ${currentPlayer.name} won in row ${i + 1}`);
        }
        // Column
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for(let j = 0; j < size; j++) {
                sum += board.getCell(j, i);
            }
            console.log(`Column ${i + 1}: `, sum)
            if (sum === currentPlayer.id * size) console.log(`Player ${currentPlayer.name} won in column ${i + 1}`);
        }
        // Diagonal hardcoded
        let sum1 = sum2 = 0;;
        sum1 += board.getCell(0,0) + board.getCell(1,1) + board.getCell(2,2)
        sum2 += board.getCell(2,0) + board.getCell(1,1) + board.getCell(0,2)
        if (sum1 === currentPlayer.id * size) console.log(`Player ${currentPlayer.name} won in diagonal`);
        if (sum2 === currentPlayer.id * size) console.log(`Player ${currentPlayer.name} won in diagonal`);
    }
    
    return { playRound, getPlayer, checker };
})();