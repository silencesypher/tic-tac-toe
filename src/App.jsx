import { useState } from 'react'
import './App.css'
import Square from './Square';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';



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
  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }


  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line;


  const isDraw = !winner && squares.every(square => square !== null);

  useEffect(() => {
      if (winner) confetti();
    }, [winner]);

  function handleClick(index) {
    if (squares[index] || winner || isDraw) return;


    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? 'X' : 'O';

    setSquares(nextSquares);
    setIsXNext(!isXNext);
    

  }
  function makeAIMove(board) {
    const empty = board
      .map((v, i) => (v === null ? i : null))
      .filter(v => v !== null);

    if (empty.length === 0) return null;

    const randomIndex = empty[Math.floor(Math.random() * empty.length)];
    return randomIndex;
  }

  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      const aiMove = makeAIMove(squares);

      if (aiMove !== null) {
        setTimeout(() => handleClick(aiMove), 500);
      }
    }
  }, [isXNext, squares, winner, isDraw]);

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

      <button className="restart" onClick={resetGame}>
        Restart Game
      </button>

    </div>
    
  );
}

export default App
