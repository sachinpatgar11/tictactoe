// src/TicTacToe.jsx
import React, { useState, useEffect } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerX, setPlayerX] = useState({ name: "Player 1", symbol: "X" });
  const [playerO, setPlayerO] = useState({ name: "Player 2", symbol: "O" });
  const [isEditingX, setIsEditingX] = useState(false);
  const [isEditingO, setIsEditingO] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);
  const [timer, setTimer] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isDraw, setIsDraw] = useState(false);
  const [lastMove, setLastMove] = useState(null); // Track last move

  const currentWinner = calculateWinner(board);

  useEffect(() => {
    if (currentWinner) {
      setWinner(currentWinner.symbol);
      setWinningSquares(currentWinner.line);
      setIsDraw(false);
      clearTimer();
      startWinnerTimer();
      return;
    }

    if (board.every((square) => square !== null)) {
      setIsDraw(true);
      setWinner(null);
      startDrawTimer();
    } else {
      setIsDraw(false);
      clearTimer();
    }
  }, [board]);

  const startWinnerTimer = () => {
    setSecondsRemaining(15);
    clearTimer();
    setTimer(
      setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleRestart();
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    );
  };

  const startDrawTimer = () => {
    setSecondsRemaining(10);
    clearTimer();
    setTimer(
      setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleRestart();
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    );
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? playerX.symbol : playerO.symbol;
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setLastMove(index); // Set last move
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningSquares.includes(index);
    const isLastMoveSquare = index === lastMove;

    return (
      <button
        className={`flex items-center justify-center w-24 h-24 text-4xl font-bold rounded-lg transition-transform transform 
                    ${
                      isWinningSquare
                        ? "bg-green-500"
                        : isLastMoveSquare
                        ? "bg-green-300"
                        : "bg-white"
                    } border-4 border-blue-400 hover:bg-blue-300`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true); // X always starts first
    setWinner(null);
    setWinningSquares([]);
    setIsDraw(false);
    clearTimer();
    setLastMove(null); // Reset last move
  };

  const handleNameChange = (e, player) => {
    if (player === "X") {
      setPlayerX({ ...playerX, name: e.target.value });
    } else {
      setPlayerO({ ...playerO, name: e.target.value });
    }
  };

  const toggleEditX = () => {
    setIsEditingX(!isEditingX);
  };

  const toggleEditO = () => {
    setIsEditingO(!isEditingO);
  };

  const handleSymbolChange = (symbol) => {
    if (symbol === "X") {
      setPlayerX({ ...playerX, symbol: "X" });
      setPlayerO({ ...playerO, symbol: "O" });
      setIsXNext(true); // X starts first
    } else {
      setPlayerO({ ...playerO, symbol: "O" });
      setPlayerX({ ...playerX, symbol: "X" });
      setIsXNext(false); // O starts first
    }
    handleRestart(); // Reset the game board
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 px-4 pb-10">
      <h1 className="text-4xl font-bold mb-6 mt-10">Tic Tac Toe</h1>
      <div className="flex flex-col md:flex-row justify-center mb-4 space-y-4 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <label>
            Player X Name:
            <input
              type="text"
              value={playerX.name}
              onChange={(e) => handleNameChange(e, "X")}
              readOnly={!isEditingX}
              className="ml-2 p-2 border border-gray-300 rounded"
            />
          </label>
          <div className="mt-2 flex justify-center space-x-2">
            <button
              className="edit-button bg-blue-500 text-white rounded px-4 py-2"
              onClick={toggleEditX}
            >
              {isEditingX ? "Save" : "Edit"}
            </button>
            <button
              className="bg-blue-500 text-white rounded px-4 py-2"
              onClick={() => {
                handleSymbolChange("X");
                setIsXNext(true); // Set next player to Player 1
              }}
            >
              Select X
            </button>
          </div>
        </div>
        <div className="text-center">
          <label>
            Player O Name:
            <input
              type="text"
              value={playerO.name}
              onChange={(e) => handleNameChange(e, "O")}
              readOnly={!isEditingO}
              className="ml-2 p-2 border border-gray-300 rounded"
            />
          </label>
          <div className="mt-2 flex justify-center space-x-2">
            <button
              className="edit-button bg-blue-500 text-white rounded px-4 py-2"
              onClick={toggleEditO}
            >
              {isEditingO ? "Save" : "Edit"}
            </button>
            <button
              className="bg-blue-500 text-white rounded px-4 py-2"
              onClick={() => {
                handleSymbolChange("O");
                setIsXNext(false); // Set next player to Player 2
              }}
            >
              Select O
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {board.map((_, index) => renderSquare(index))}
      </div>
      <div className="text-xl font-bold mb-4">
        {winner
          ? `Winner: ${winner === playerX.symbol ? playerX.name : playerO.name}`
          : isDraw
          ? `It's a draw!`
          : `Next player: ${isXNext ? playerX.name : playerO.name}`}
      </div>
      {(winner || isDraw) && (
        <div className="text-lg font-bold mb-4">
          The game will restart in {secondsRemaining} seconds.
        </div>
      )}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="bg-red-500 text-white rounded px-4 py-2"
          onClick={handleRestart}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { symbol: squares[a], line: [a, b, c] }; // Return the winning symbol and the winning line
    }
  }

  return null;
}

export default TicTacToe;
