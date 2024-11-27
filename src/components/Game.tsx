import { useEffect, useState, useRef } from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';
import Quiz from './Quiz';
import Road from './Road';
import StartQuiz from './StartQuiz';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;

const GAME_SPEED = {
  1: 1,
  2: 2,
  3: 3
};

const SCORE_TO_QUIZ = 1000;

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
      setScore(s => {
        const newScore = s + 1;
        if (newScore >= level * SCORE_TO_QUIZ) {
          setGameState('quiz');
          return newScore;
        }
        return newScore;
      });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, level]);

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

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const resetGame = () => {
    setGameState('initial');
    setLevel(1);
    setScore(0);
    setCountdown(3);
  };

  return (
    <div className="flex flex-col max-w-[500px] place-items-center border-4 border-gray-800 bg-gray-900 text-white p-4 rounded-xl shadow-2xl">
      {gameState !== 'initial' && (
        <div className="mb-4 font-bold bg-gray-800 px-6 py-3 rounded-lg flex gap-6 shadow-lg">
          <div className="text-xl">Level: {level}</div>
          <div className="text-xl">Score: {score}</div>
          <div className="text-xl">Target: {level * SCORE_TO_QUIZ}</div>
        </div>
      )}

      {gameState === 'initial' && (
        <StartQuiz onComplete={handleStartQuizComplete} />
      )}

      {(gameState === 'playing' || gameState === 'countdown') && (
        <>
          <div className="relative overflow-hidden rounded-lg" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
            <Road 
              width={GAME_WIDTH} 
              height={GAME_HEIGHT} 
              speed={GAME_SPEED[level as keyof typeof GAME_SPEED]}
              onGameOver={handleGameOver}
              isPlaying={gameState === 'playing'}
            />
          </div>
          {gameState === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10 backdrop-blur-sm">
              <div className="text-8xl font-bold text-blue-500 animate-pulse">{countdown}</div>
            </div>
          )}
        </>
      )}

      {gameState === 'quiz' && (
        <Quiz level={level} onComplete={handleQuizComplete} />
      )}

      {gameState === 'gameOver' && (
        <div className="text-center w-[350px] bg-gray-800 p-8 rounded-lg shadow-xl">
          <AlertTriangle className="w-20 h-20 mx-auto mb-4 text-red-500" />
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-6">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="text-center min-w-[400px] bg-gray-800 p-8 rounded-lg shadow-xl">
          <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
          <p className="text-xl mb-2">You've mastered all levels!</p>
          <p className="text-2xl font-semibold mb-6">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}