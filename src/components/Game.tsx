import { useEffect, useState, useRef } from 'react';
import { Trophy, AlertTriangle, VolumeOff, Volume2 } from 'lucide-react';
import Quiz from './Quiz';
import Road from './Road';
import StartQuiz from './StartQuiz';
import { ImSpinner11 } from "react-icons/im";
import LevelList from './LevelList';
import Fireworks from './Fireworks'; // Import the Fireworks component
import { savePlayerData, getPlayerData } from './storage'; // Import storage utilities

// Import sounds
import crashSound from './sounds/crash-sound.mp3';
import gameMusic from './sounds/game-music.mp3';
import celebrationSound from './sounds/celebration.mp3'; // Import the celebration sound

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;

const GAME_SPEED = {
  1: 1,
  2: 1.4,
  3: 1.8,
  4: 2
};

const SCORE_TO_QUIZ = 1000;

type GameState = 'countdown' | 'playing' | 'quiz' | 'gameOver' | 'victory' | 'initial' | 'startQuiz';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('initial');
  const [countdown, setCountdown] = useState(3);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0); // State for previous score
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(''); // State to manage email
  const [celebration, setCelebration] = useState(false); // State to manage fireworks

  const gameLoopRef = useRef<number>();
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);
  const crashSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const celebrationSoundRef = useRef<HTMLAudioElement | null>(null); // Ref for celebration sound

  // Initialize sounds on mount
  useEffect(() => {
    gameMusicRef.current = new Audio(gameMusic);
    crashSoundRef.current = new Audio(crashSound);
    celebrationSoundRef.current = new Audio(celebrationSound); // Initialize celebration sound

    if (gameMusicRef.current) {
      gameMusicRef.current.loop = true;
      gameMusicRef.current.volume = 0.5;
    }

    // Check for existing player data
    const storedEmail = localStorage.getItem('currentPlayerEmail');
    if (storedEmail) {
      const playerData = getPlayerData(storedEmail);
      if (playerData) {
        setEmail(storedEmail);
        setNickname(playerData.nickname);
        setLevel(playerData.level);
        setGameState('countdown');
      }
    }
  }, []);

  // Start music when game begins or if it's unmuted
  useEffect(() => {
    if (gameState === 'playing' && !isMuted) {
      gameMusicRef.current?.play();
    } else {
      gameMusicRef.current?.pause();
    }
  }, [gameState, isMuted]);

  // Handle countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((c) => {
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

  // Game loop logic
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const gameLoop = () => {
      setScore((s) => {
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
  }, [gameState, level, isPaused]);

  // Play crash sound on game over
  const handleGameOver = () => {
    crashSoundRef.current?.play();
    setScore(previousScore); // Reset score to previous score
    setGameState('gameOver');
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      correctSoundRef.current?.play();
      setCelebration(true); // Start fireworks effect
      celebrationSoundRef.current?.play(); // Play celebration sound

      setTimeout(() => {
        setCelebration(false); // Stop fireworks effect after a delay
      }, 5000); // Fireworks duration (5 seconds)
      setTimeout(() => {
        setGameState('countdown');
      }, 5000); // Delay state change to allow fireworks to finish

      setLevel((l) => {
        const newLevel = l + 1;
        savePlayerData(email, nickname, newLevel); // Save player data
        return newLevel;
      });

      setPreviousScore(score); // Update previous score to current score

    } else {
      // If the player fails, reset the score to the previous score
      wrongSoundRef.current?.play();
      setScore(previousScore);
      setTimeout(() => {
        setGameState('countdown');
      }, 2000); // Short delay before restarting the level
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
    setScore(0);
    setPreviousScore(0); // Reset previous score
    setCountdown(3);
    setCelebration(false); // Reset celebration state
    crashSoundRef.current?.pause();
    if (crashSoundRef.current) {
      crashSoundRef.current.currentTime = 0;
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleSelectLevel = (selectedLevel: number) => {
    if (selectedLevel <= level) {
      setLevel(selectedLevel);
      setGameState('countdown');
    } else {
      alert('You must complete the previous levels first.');
    }
  };

  const handleNicknameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (nickname.trim() !== '' && email.trim() !== '') {
      savePlayerData(email, nickname, level); // Save player data
      localStorage.setItem('currentPlayerEmail', email); // Store current player email
      setGameState('startQuiz');
    } else {
      alert('Please enter a nickname and email.');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="mr-4 flex flex-col gap-4">
        {nickname && (
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Izina</h3>
            <p>{nickname}</p>
          </div>
        )}
        <LevelList currentLevel={level} onSelectLevel={handleSelectLevel} />
      </div>
      <div className="flex flex-col max-w-[500px] place-items-center border-4 border-gray-800 bg-gray-900 text-white p-4 rounded-xl shadow-2xl">
        {gameState !== 'initial' && (
          <div className="mb-4 font-bold bg-gray-800 px-6 py-3 rounded-lg flex gap-6 shadow-lg">
            <div className="text-sm">Icyiciro: {level}</div>
            <div className="text-sm">Amanota: {score}</div>
            <div className="text-sm">Ategetswe: {level * SCORE_TO_QUIZ}</div>
          </div>
        )}

        {gameState === 'initial' && (
          <form onSubmit={handleNicknameSubmit} className="mb-4">
            <label className="block text-lg font-bold mb-2" htmlFor="nickname">
              Andika izina:
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white mb-4 w-full"
            />
            <label className="block text-lg font-bold mb-2" htmlFor="email">
              Andika email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white mb-4 w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              Tangira
            </button>
          </form>
        )}

        {gameState === 'startQuiz' && <StartQuiz onComplete={handleStartQuizComplete} />}

        {(gameState === 'playing' || gameState === 'countdown') && (
          <>
            <div
              className="relative overflow-hidden rounded-lg"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              <Road
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                speed={GAME_SPEED[level as keyof typeof GAME_SPEED]}
                onGameOver={handleGameOver}
                isPlaying={gameState === 'playing' && !isPaused}
              />
            </div>
            {gameState === 'countdown' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10 backdrop-blur-sm">
                <div className="text-8xl font-bold text-blue-500 animate-pulse">{countdown}</div>
              </div>
            )}
          </>
        )}

        {gameState === 'quiz' && <Quiz level={level} onComplete={handleQuizComplete} />}

        {gameState === 'gameOver' && (
          <div className="text-center w-[350px] bg-gray-800 p-8 rounded-lg shadow-xl">
            <AlertTriangle className="w-20 h-20 mx-auto mb-4 text-red-500" />
            <h2 className="text-3xl font-bold mb-4">Umukino Urarangiye!</h2>
            <p className="text-xl mb-6">Amanota : {score}</p>
            <button
              onClick={() => setGameState('countdown')}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              <span className='flex'><p>Ongera </p><ImSpinner11 size={13} className=' font-bold animate-pulse mt-2 ml-1' /></span>
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="text-center min-w-[400px] bg-gray-800 p-8 rounded-lg shadow-xl">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-2">Urangije Ibyicyiro byose !</p>
            <p className="text-2xl font-semibold mb-6">Amanota : {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              Kina Nanone
            </button>
          </div>
        )}

        {/* Fireworks Component */}
        <Fireworks run={celebration} />

        {gameState === 'playing' && (
          <div className="absolute top-4 right-4 flex gap-4">
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md"
            >
              {isPaused ? 'komeza' : 'Hagarika'}
            </button>
            <button
              onClick={toggleMute}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md"
            >
              {isMuted ? <VolumeOff className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}