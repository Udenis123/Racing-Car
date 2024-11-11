import { useEffect, useRef } from 'react';

interface Car {
  x: number;
  y: number;
  lane: number;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 4;
    let animationId: number;

    // Initialize cars
    const cars: Car[] = [
      { x: width / 1.3, y: height * 2, lane: 1, speed: speed, color: '#ef4444' },
      { x: width / 4, y: height * 0.3, lane: 2, speed: speed+2, color: '#3b82f6' },
      { x: width / 2, y: height * 0.5, lane: 1, speed: speed, color: '#10b981' }
    ];

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
      cars.forEach(car => {
        car.y = (car.y + car.speed/2) % height;
        if (car.y < 0) car.y = height;
      });
    };

    const drawRoad = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, width, height);

      // Draw moving lines
      const lineSpacing = 40;
      const lineHeight = 20;
      
      // Center lines (dashed yellow)
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

      // Side lines (solid white)
      ctx.strokeStyle = '#ffffff';
      const roadMargin = width * 0.1;
      [roadMargin, width - roadMargin].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      // Draw cars
      cars.forEach(car => drawCar(ctx, car));

      // Update positions
      offset = (offset + speed) % lineSpacing;
      updateCars();

      animationId = requestAnimationFrame(drawRoad);
    };

    drawRoad();
    return () => cancelAnimationFrame(animationId);
  }, [width, height, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0"
    />
  );
}