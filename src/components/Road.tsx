import { useEffect, useRef } from 'react';

interface Car {
  x: number;
  y: number;
  speed: number;
  color: string;
}

interface RoadProps {
  width: number;
  height: number;
  speed: number;
  onGameOver: () => void;
  isPlaying: boolean;
}

export default function Road({ width, height, speed, onGameOver, isPlaying }: RoadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerCarRef = useRef<Car>({ x: width / 2, y: height - 60, speed: 5, color: '#ffffff' });
  const carsRef = useRef<Car[]>([
    { x: width / 1.3, y: -100, speed: speed, color: '#ef4444' },
    { x: width / 4, y: -300, speed: speed + 2, color: '#3b82f6' },
    { x: width / 2, y: -500, speed: speed, color: '#10b981' },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 4;
    let animationId: number;
    let isGameActive = true;

    const roadMargin = width * 0.1;
    const roadWidth = width - 2 * roadMargin;

    const drawCar = (ctx: CanvasRenderingContext2D, car: Car) => {
      const carWidth = 30;
      const carHeight = 50;
      
      // Car body
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x - carWidth / 2, car.y, carWidth, carHeight);
      
      // Windows
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(car.x - carWidth / 2 + 5, car.y + 10, carWidth - 10, 15);
      
      // Wheels
      ctx.fillStyle = '#000000';
      ctx.fillRect(car.x - carWidth / 2 - 2, car.y + 5, 4, 10);
      ctx.fillRect(car.x + carWidth / 2 - 2, car.y + 5, 4, 10);
      ctx.fillRect(car.x - carWidth / 2 - 2, car.y + carHeight - 15, 4, 10);
      ctx.fillRect(car.x + carWidth / 2 - 2, car.y + carHeight - 15, 4, 10);
    };

    const updateCars = () => {
      if (!isPlaying) return;
      
      carsRef.current.forEach((car) => {
        car.y += car.speed;
        if (car.y > height) {
          car.y = -100;
          car.x = roadMargin + Math.random() * (roadWidth - 30);
        }
      });
    };

    const checkCollision = (car1: Car, car2: Car) => {
      const carWidth = 30;
      const carHeight = 50;
      return (
        car1.x < car2.x + carWidth &&
        car1.x + carWidth > car2.x &&
        car1.y < car2.y + carHeight &&
        car1.y + carHeight > car2.y
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isGameActive || !isPlaying) return;
    
      const moveDistance = 15; // Define the movement step size
      const playerCar = playerCarRef.current;
    
      // Vertical boundaries (similar to horizontal)
      const roadTopMargin = 0; // Top boundary (can be adjusted based on your game design)
      const roadHeight = height; // Full canvas height as the vertical limit
    
      switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          // Move left
          playerCar.x = Math.max(roadMargin + 15, playerCar.x - moveDistance);
          break;
    
        case 'arrowright':
        case 'd':
          // Move right
          playerCar.x = Math.min(roadMargin + roadWidth - 15, playerCar.x + moveDistance);
          break;
    
        case 'arrowup':
        case 'w':
          // Move up
          playerCar.y = Math.max(roadTopMargin + 15, playerCar.y - moveDistance);
          break;
    
        case 'arrowdown':
        case 's':
          // Move down
          playerCar.y = Math.min(roadTopMargin + roadHeight - 15, playerCar.y + moveDistance);
          break;
    
        default:
          console.log(`Unhandled key: ${event.key}`);
      }
    };
    

    const drawRoad = () => {
      if (!ctx || !isGameActive) return;

      // Background
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, width, height);

      // Road lines
      const lineSpacing = 40;
      const lineHeight = 20;

      // Lane markers
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      [width / 2.8, width / 1.6].forEach(x => {
        for (let y = offset; y < height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + lineHeight);
          ctx.stroke();
        }
      });

      // Road edges
      ctx.strokeStyle = '#ffffff';
      [roadMargin, width - roadMargin].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      // Always draw player car
      drawCar(ctx, playerCarRef.current);

      // Only draw and update other cars if playing
      if (isPlaying) {
        carsRef.current.forEach((car) => {
          drawCar(ctx, car);
          if (checkCollision(playerCarRef.current, car)) {
            isGameActive = false;
            onGameOver();
            cancelAnimationFrame(animationId);
            return;
          }
        });

        offset = (offset + speed) % lineSpacing;
        updateCars();
      }

      if (isGameActive) {
        animationId = requestAnimationFrame(drawRoad);
      }
    };

    drawRoad();
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      isGameActive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [width, height, speed, onGameOver, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="absolute top-0 left-0 rounded-lg"
    />
  );
}