import { useEffect, useRef } from 'react';

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

    const drawRoad = () => {
      if (!ctx) return;
      ctx.fillStyle = '#1f2937'; // Dark background
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

      offset = (offset + speed) % lineSpacing;
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