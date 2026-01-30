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
  const [score, setScore] = useState({ X: 0, O: 0 });


  const isDraw = !winner && squares.every(square => square !== null);

  useEffect(() => {
      if (winner) confetti();
    }, [winner]);

  function handleClick(index) {
    if (squares[index] || winner || isDraw) return;
    if (!winner) {
      setScore(prev => ({
        ...prev,
        [isXNext ? 'X' : 'O']: prev[isXNext ? 'X' : 'O'] + 1
      }));
    }


    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? 'X' : 'O';

    setSquares(nextSquares);
    setIsXNext(!isXNext);
    

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

      <p>Score — X: {score.X} | O: {score.O}</p>

      <button className="restart" onClick={resetGame}>
        Restart Game
      </button>

    </div>
    
  );
}

export default App
