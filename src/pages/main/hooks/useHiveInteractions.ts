import { useCallback, useRef, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

export default function useHiveInteractions(
  rooms: Room[],
  navigate: NavigateFunction,
) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const tapThreshold = 8;

  const handlePointerDown = useCallback((e) => {
    startPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e, roomIndex: number) => {
      if (!startPos.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < tapThreshold) {
        const room = rooms[roomIndex];
        if (room?.userId) {
          navigate(`/room/${room.userId}`);
        }
      }
      startPos.current = null;
    },
    [navigate, rooms],
  );

  const handlePointerOver = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return {
    hoveredIndex,
    handlePointerDown,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
  };
}
