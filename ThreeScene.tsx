import { useEffect, useRef } from 'react';

export const ThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Building {
      x: number;
      y: number;
      width: number;
      height: number;
      depth: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
    }

    const buildings: Building[] = [];
    const numBuildings = 8;

    for (let i = 0; i < numBuildings; i++) {
      buildings.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 40 + 30,
        height: Math.random() * 60 + 40,
        depth: Math.random() * 30 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        color: `hsl(${220 + Math.random() * 40}, 70%, ${40 + Math.random() * 20}%)`,
      });
    }

    const drawBuilding = (building: Building) => {
      ctx.save();
      ctx.translate(building.x, building.y);
      ctx.rotate(building.rotation);

      const cos = Math.cos(building.rotation * 0.5);
      const sin = Math.sin(building.rotation * 0.5);

      ctx.fillStyle = building.color;
      ctx.fillRect(-building.width / 2, -building.height / 2, building.width, building.height);

      ctx.fillStyle = adjustBrightness(building.color, -20);
      ctx.beginPath();
      ctx.moveTo(building.width / 2, -building.height / 2);
      ctx.lineTo(building.width / 2 + building.depth * cos, -building.height / 2 - building.depth * sin);
      ctx.lineTo(building.width / 2 + building.depth * cos, building.height / 2 - building.depth * sin);
      ctx.lineTo(building.width / 2, building.height / 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = adjustBrightness(building.color, 20);
      ctx.beginPath();
      ctx.moveTo(-building.width / 2, -building.height / 2);
      ctx.lineTo(-building.width / 2 + building.depth * cos, -building.height / 2 - building.depth * sin);
      ctx.lineTo(building.width / 2 + building.depth * cos, -building.height / 2 - building.depth * sin);
      ctx.lineTo(building.width / 2, -building.height / 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const adjustBrightness = (color: string, amount: number) => {
      const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (!match) return color;
      const h = match[1];
      const s = match[2];
      const l = Math.max(0, Math.min(100, parseInt(match[3]) + amount));
      return `hsl(${h}, ${s}%, ${l}%)`;
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      buildings.forEach(building => {
        building.rotation += building.rotationSpeed;
        drawBuilding(building);
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10"
      style={{ zIndex: 0 }}
    />
  );
};
