// display iife for #message div
const displayController = (() => {
    const renderMessage = (message) => {
        const box = document.querySelector("#message");
        box.innerHTML = message;
    }
    return {
        renderMessage
    };
})();

// since it will run only 1 time hence IIFE, also gameboard array is hidden.
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];
    const render = () => {
        let boardHTML = "";
        // automatically selects 1st parameter as arr[index] and 2nd parameter as index
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });
        const board = document.querySelector(".gameboard");
        board.innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });
    };

    const update = (index, mark) => {
        gameboard[index] = mark;
        render();
    };

    // returning gameboard without return keyword
    const getGameboard = () => gameboard;

    return {
        render, update, getGameboard
    };
})();

// factory function for creating multiple players
const createPlayer = (name, mark) => {
    return {
        name, mark
    };
};

// game will start only 1 time - IIFE
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer((document.querySelector("#player1").value === "" ? "X" : document.querySelector("#player1").value), "X"),
            createPlayer((document.querySelector("#player2").value === "" ? "O" : document.querySelector("#player2").value), "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        });
    };

    const handleClick = (e) => {
        if (gameOver)
            return;
        const index = parseInt(e.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "")
            return;
        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].name)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
        }
        else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie");
        }
        currentPlayerIndex ^= 1;
    };

    const restart = () => {
        for (let i = 0; i < 9; i++)
            Gameboard.update(i, "");
        Gameboard.render();
        const box = document.querySelector("#message");
        box.innerHTML = "";
        gameOver = false;
        currentPlayerIndex = 0;
    };

    return {
        start, handleClick, restart
    };
})();

const checkForWin = (board) => {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c])
            return true;
    }
    return false;
};

const checkForTie = (board) => {
    return board.every((cell) => cell !== "");
};

const restartBtn = document.querySelector("#restartBtn");
restartBtn.addEventListener("click", () => {
    Game.restart();
});

const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener("click", () => {
    Game.start();
});