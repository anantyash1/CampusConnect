'use client'; // required in Next.js 13+ (App Router) for hooks to work

import { useState, useEffect } from 'react';

const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: pos.y - 15,
        left: pos.x - 15,
        width: 30,
        height: 30,
        borderRadius: '50%',
        pointerEvents: 'none',
        background:
          'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
        filter: 'blur(8px)',
        transition: 'top 0.05s ease-out, left 0.05s ease-out',
        zIndex: 1000,
      }}
    />
  );
};

export default CursorGlow;
