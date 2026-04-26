const cells = document.querySelectorAll(".cell");
const playerDisplay = document.getElementById("current-player");
const resetButton = document.getElementById("reset");
const surrenderButton = document.getElementById("surrender");
const saveGameButton = document.getElementById("save-game");
const pastGamesButton = document.getElementById("past-games");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");

let currentPlayer = "X";
let savedGames = [];
let activeGameId = null;

function makeGameId() {
    return `game-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function getBoardState() {
    return [...cells].map((cell) => cell.textContent || "");
}

function applyBoardState(board) {
    board.forEach((value, i) => {
        cells[i].textContent = value;
    });
}

function getBoardWinner(board) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of winConditions) {
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }

    return null;
}

function getSavedGameLabel(board) {
    const winner = getBoardWinner(board);
    if (winner) return `${winner} wins`;
    if (board.every((cell) => cell !== "")) return "Draw";
    return "In progress";
}

function renderSavedGames() {
    historyList.innerHTML = "";
    if (savedGames.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No saved games yet.";
        historyList.append(emptyItem);
        return;
    }

    savedGames.forEach((game, index) => {
        const item = document.createElement("li");
        const title = document.createElement("p");
        title.className = "history-game-title";
        title.textContent = `Game ${index + 1}: ${getSavedGameLabel(game.board)}`;

        const preview = document.createElement("div");
        preview.className = "history-board";

        game.board.forEach((value) => {
            const previewCell = document.createElement("span");
            previewCell.className = "history-board-cell";
            previewCell.textContent = value;
            preview.append(previewCell);
        });

        item.append(title, preview);
        item.addEventListener("click", () => {
            applyBoardState(game.board);
            currentPlayer = game.nextPlayer;
            activeGameId = game.id ?? null;
            updatePlayerDisplay();
        });
        historyList.append(item);
    });
}

async function fetchHistory() {
    try {
        const response = await fetch("http://localhost:3000/boards");
        if (!response.ok) return;

        const serverGames = await response.json();
        if (!Array.isArray(serverGames)) return;

        savedGames = serverGames.map((game, index) => ({
            ...game,
            id: game.id ?? `saved-${index}`,
        }));
    } catch (error) {
        console.error(error);
    }
}

function updatePlayerDisplay() {
    playerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updatePlayerDisplay();
}

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        if (cell.textContent !== "") return;

        cell.textContent = currentPlayer;
        const gameEnded = endGame();
        if (!gameEnded) {
            switchPlayer();
        }
    });
});

resetButton.addEventListener("click", () => {
    cells.forEach((cell) => {
        cell.textContent = "";
    });
    currentPlayer = "X";
    activeGameId = null;
    updatePlayerDisplay();
});

surrenderButton.addEventListener("click", () => {
    alert(`${currentPlayer} has surrendered! ${currentPlayer === "X" ? "O" : "X"} wins!`);
});

saveGameButton.addEventListener("click", async () => {
    const board = getBoardState();
    const gameStatus = getSavedGameLabel(board);
    const gameId = activeGameId ?? makeGameId();
    const gameToSave = { id: gameId, board, nextPlayer: currentPlayer };

    const existingIndex = savedGames.findIndex((game) => game.id === gameId);

    try {
        const response = await fetch("http://localhost:3000/boards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameToSave),
        });

        if (!response.ok) {
            throw new Error("Save request failed");
        }
    } catch (error) {
        console.error(error);
    }

    activeGameId = gameStatus === "In progress" ? gameId : null;
    await fetchHistory();
    renderSavedGames();
    alert(existingIndex >= 0 ? "Game save updated." : "Game saved to history.");
});

pastGamesButton.addEventListener("click", async () => {
    historyPanel.hidden = !historyPanel.hidden;
    if (historyPanel.hidden) return;

    await fetchHistory();
    renderSavedGames();
});

// Start game with player X.
updatePlayerDisplay();
function checkWin() {
    const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //cols
    [0, 4, 8], [2, 4, 6] //diagonals
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (
            cells[a].textContent === currentPlayer &&
            cells[b].textContent === currentPlayer &&
            cells[c].textContent === currentPlayer
        ) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return [...cells].every((cell) => cell.textContent !== "");
}

function endGame() {
    if (checkWin()) {
        alert(`${currentPlayer} wins!`);
        return true;
    } else if (checkDraw()) {
        alert("It's a draw!");
        return true;
    }
    return false;
}

updatePlayerDisplay();

