import { useEffect, useRef, useState } from 'react';

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
}

export default function Road({ width, height, speed }: RoadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 4;
    let animationId: number;

    const roadMargin = width * 0.1;
    const roadWidth = width - 2 * roadMargin;

    // Initialize player and obstacle cars
    const playerCar: Car = { x: width / 2, y: height - 60, speed: 5, color: '#ffffff' };
    const cars: Car[] = [
      { x: width / 1.3, y: height * 2, speed: speed, color: '#ef4444' },
      { x: width / 4, y: height * 0.3, speed: speed + 2, color: '#3b82f6' },
      { x: width / 2, y: height * 0.5, speed: speed, color: '#10b981' },
    ];

    const drawCar = (ctx: CanvasRenderingContext2D, car: Car) => {
      const carWidth = 30;
      const carHeight = 50;
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x - carWidth / 2, car.y, carWidth, carHeight);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(car.x - carWidth / 2 + 5, car.y + 10, carWidth - 10, 15);
      ctx.fillStyle = '#000000';
      ctx.fillRect(car.x - carWidth / 2 - 2, car.y + 5, 4, 10);
      ctx.fillRect(car.x + carWidth / 2 - 2, car.y + 5, 4, 10);
      ctx.fillRect(car.x - carWidth / 2 - 2, car.y + carHeight - 15, 4, 10);
      ctx.fillRect(car.x + carWidth / 2 - 2, car.y + carHeight - 15, 4, 10);
    };

    const updateCars = () => {
      cars.forEach((car) => {
        car.y = (car.y + car.speed / 2) % height;
        if (car.y < 0) car.y = height;
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
      if (isGameOver) return;

      const moveDistance = 10;

      switch (event.key) {
        case 'ArrowLeft':
          playerCar.x = Math.max(roadMargin + 15, playerCar.x - moveDistance);
          break;
        case 'ArrowRight':
          playerCar.x = Math.min(roadMargin + roadWidth - 15, playerCar.x + moveDistance);
          break;
        case 'ArrowUp':
          playerCar.y = Math.max(0, playerCar.y - moveDistance);
          break;
        case 'ArrowDown':
          playerCar.y = Math.min(height - 50, playerCar.y + moveDistance);
          break;
        default:
          break;
      }
    };

    const drawRoad = () => {
      if (!ctx) return;

      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, width, height);

      const lineSpacing = 40;
      const lineHeight = 20;

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      for (let y = offset; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(width / 2.8, y);
        ctx.lineTo(width / 2.8, y + lineHeight);
        ctx.stroke();
      }

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      for (let y = offset; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(width / 1.6, y);
        ctx.lineTo(width / 1.6, y + lineHeight);
        ctx.stroke();
      }

      ctx.strokeStyle = '#ffffff';
      [roadMargin, width - roadMargin].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      drawCar(ctx, playerCar);

      cars.forEach((car) => {
        drawCar(ctx, car);
        if (checkCollision(playerCar, car)) {
          setIsGameOver(true);
          cancelAnimationFrame(animationId);
        }
      });

      offset = (offset + speed) % lineSpacing;
      updateCars();

      if (!isGameOver) {
        animationId = requestAnimationFrame(drawRoad);
      }
    };

    drawRoad();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [width, height, speed, isGameOver]);

  return (
    <div>
      {isGameOver ? (
        <div className="game-over">
          <h1>Game Over</h1>
        </div>
      ) : (
        <canvas ref={canvasRef} width={width} height={height} className="absolute top-0 left-0" />
      )}
    </div>
  );
}
