import { useState, useEffect } from 'react'
import './App.css'
import Square from './Square';
import confetti from 'canvas-confetti';
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [role, setRole] = useState(null);

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line;
  const isDraw = !winner && squares.every(square => square !== null);

  useEffect(() => {
    socket.on("role", (assignedRole) => {
      setRole(assignedRole);
    });

    socket.on("state", ({ gameState, isXNext }) => {
      setSquares(gameState);
      setIsXNext(isXNext);
    });

    return () => {
      socket.off("role");
      socket.off("state");
    };
  }, []);

  useEffect(() => {
    if (winner) confetti();
  }, [winner]);

  function handleClick(index) {
    if (
      (isXNext && role !== 'X') ||
      (!isXNext && role !== 'O')
    ) return;

    socket.emit("move", index);
  }

  function resetGame() {
    console.log("Reset clicked, role:", role);
    socket.emit("reset");
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      <p className={winner ? "winner-text" : ""}>
        {winner
          ? `Winner: ${winner}`
          : isDraw
          ? "Draw!"
          : `Next player: ${isXNext ? 'X' : 'O'}`}
      </p>
      <p>You are: {role}</p>

      <div className="board">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            highlight={winningLine?.includes(index)}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      <button
        className="restart"
        onClick={resetGame}
        disabled={role !== 'X' && role !== 'O'}
      >
        Restart Game
      </button>

    </div>
  );
}

export default App;
