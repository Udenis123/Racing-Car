import { useEffect, useState, useRef } from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';
import Quiz from './Quiz';
import Road from './Road';
import StartQuiz from './StartQuiz';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 550;

const GAME_SPEED = {
  1: 3,
  2: 5,
  3: 7
};

type GameState = 'countdown' | 'playing' | 'quiz' | 'gameOver' | 'victory' | 'initial';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('initial');
  const [countdown, setCountdown] = useState(3);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number>();


  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            setGameState('playing');
            return 3;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setScore(s => s + 1);
      if (score > level * 1000) {
        setGameState('quiz');
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, level, score]);


  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      if (level === 3) {
        setGameState('victory');
      } else {
        setLevel(l => l + 1);
        setGameState('countdown');
      }
    } else {
      setGameState('gameOver');
    }
  };

  const handleStartQuizComplete = (passed: boolean) => {
    if (passed) {
      setGameState('countdown');
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    setGameState('initial');
    setLevel(1);
    setScore(0);
  };

  return (
    <div className="flex flex-col max-w-[500px] place-items-center border-b-black border-4 bg-gray-900 text-white p-4">
      {gameState !== 'initial' && (
        <div className="mb-4 font-bold bg-black px-3 rounded-lg py-2 flex gap-4">
          <div className="text-xl">Level: {level}</div>
          <div className="text-xl">Score: {score}</div>
          <div> </div>
        </div>
      )}

      {gameState === 'initial' && (
        <StartQuiz onComplete={handleStartQuizComplete} />
      )}

      {gameState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-6xl font-bold">{countdown}</div>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'countdown') && (
        <div className="relative h-screen" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          <Road width={GAME_WIDTH} height={GAME_HEIGHT} speed={GAME_SPEED[level as keyof typeof GAME_SPEED]} />
          
        </div>
      )}

      {gameState === 'quiz' && (
        <Quiz level={level} onComplete={handleQuizComplete} />
      )}

      {gameState === 'gameOver' && (
        <div className="text-center w-[350px]">
          <AlertTriangle className="w-20 h-20 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl mb-4">Game Over!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="text-center min-w-[400px]">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl mb-4">Congratulations! You've completed all levels!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
