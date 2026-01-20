import { OrbitControls } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import Loading from '../../../components/Loading';
import { RoomLighting } from '../../../components/room-models/RoomLighting';
import useHexagonGrid from '../hooks/useHexagonGrid';
import useRooms from '../hooks/useRooms';
import HiveRoomModel from './HiveRoomModel';

export default function HiveRooms({
  myUserId,
  onLoadingComplete,
}: HiveRoomsProps) {
  const { rooms } = useRooms(myUserId);
  const positionedRooms = useHexagonGrid(rooms, 0, 0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedRooms, setLoadedRooms] = useState(new Set());
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startPos = useRef<{ x: number; y: number } | null>(null);
  const tapThreshold = 8;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>, roomIndex: number) => {
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
  };

  const handlePointerOver = useCallback((index: number) => {
    setHoveredRoom(index);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredRoom(null);
  }, []);

  const handleModelLoaded = useCallback((roomId: string) => {
    setLoadedRooms((prev) => {
      if (prev.has(roomId)) return prev;
      const newSet = new Set(prev);
      newSet.add(roomId);
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (loadedRooms.size === rooms.length && rooms.length > 0) {
      setIsLoading(false);
      if (onLoadingComplete) onLoadingComplete();
    }
  }, [loadedRooms, rooms.length, onLoadingComplete]);

  return (
    <div className='w-full h-screen relative'>
      {isLoading && <Loading />}
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 4, 10], fov: 25 }}
        shadows>
        <RoomLighting />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {positionedRooms.map(({ room, position }, index: number) => (
          <group
            key={index}
            position={position}
            onPointerDown={handlePointerDown}
            onPointerUp={(e) => handlePointerUp(e, index)}
            onPointerOver={() => handlePointerOver(index)}
            onPointerOut={handlePointerOut}>
            
            <HiveRoomModel
              room={room}
              position={position}
              onModelLoaded={handleModelLoaded}
            />
          </group>
        ))}
        <OrbitControls
          enableRotate={false}
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={14}
          mouseButtons={{ LEFT: THREE.MOUSE.PAN }}
          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
      {hoveredRoom !== null && (
        <div
          className='absolute bottom-22 left-1/2 transform -translate-x-1/2 font-medium z-30'
          style={{
            padding: '8px 20px',
            background: 'rgba(47, 71, 131, 0.4)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '40px',
            fontSize: '14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            opacity: hoveredRoom !== null ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}>
          {`✊🏻 똑똑! ${rooms[hoveredRoom]?.nickname}의 방에 들어가실래요?`}
        </div>
      )}
    </div>
  );
}
