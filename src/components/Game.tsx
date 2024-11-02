import  { useEffect, useState, useRef } from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';
import Quiz from './Quiz';
import Road from './Road';
import StartQuiz from './StartQuiz';
import CCar from './Car'

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const CAR_WIDTH = 50;
const MOVE_SPEED = 5;
const ROAD_BOUNDS = {
  left: GAME_WIDTH * 0.1,
  right: GAME_WIDTH * 0.9
};

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
  const [carPosition, setCarPosition] = useState({ 
    x: GAME_WIDTH / 2 - CAR_WIDTH / 2, 
    y: GAME_HEIGHT - 100 
  });

  const [keys, setKeys] = useState({ left: false, right: false });
  const gameLoopRef = useRef<number>();
  const obstacleSpawnRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
      if (e.key === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
      if (e.key === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
      setCarPosition(pos => {
        const newX = pos.x + (keys.left ? -MOVE_SPEED : 0) + (keys.right ? MOVE_SPEED : 0);
        const boundedX = Math.max(
          ROAD_BOUNDS.left,
          Math.min(ROAD_BOUNDS.right - CAR_WIDTH, newX)
        );
        return { x: boundedX, y: pos.y };
      });

 

      setScore(s => s + 1);
      
      if (score > (level * 1000)) {
        setGameState('quiz');
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

 

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
    };
  }, [gameState, keys, level, carPosition.x, carPosition.y, score]);

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      if (level === 3) {
        setGameState('victory');
      } else {
        setLevel(l => l + 1);
        setGameState('countdown');
       ;
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
    setCarPosition({ x: GAME_WIDTH / 2 - CAR_WIDTH / 2, y: GAME_HEIGHT - 100 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {gameState !== 'initial' && (
        <div className="mb-4 flex gap-4">
          <div className="text-xl">Level: {level}</div>
          <div className="text-xl">Score: {score}</div>
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
        <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          <Road width={GAME_WIDTH} height={GAME_HEIGHT} speed={GAME_SPEED[level as keyof typeof GAME_SPEED]} />
          
          {/* Player car */}
          <div className='absolute '>
            <CCar/>
          </div>
        </div>
      )}

      {gameState === 'quiz' && (
        <Quiz level={level} onComplete={handleQuizComplete} />
      )}

      {gameState === 'gameOver' && (
        <div className="text-center">
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
        <div className="text-center">
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
