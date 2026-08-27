import HiveRoomsScene from '@pages/main/components/HiveRoomsScene';
import useHiveInteractions from '@pages/main/hooks/useHiveInteractions';
import useHiveLoading from '@pages/main/hooks/useHiveLoading';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import Loading from '../../../components/Loading';
import { RoomLighting } from '../../../components/room-models/RoomLighting';
import useHexagonGrid from '../hooks/useHexagonGrid';
import useRooms from '../hooks/useRooms';

export default function HiveRooms({
  myUserId,
  onLoadingComplete,
}: HiveRoomsProps) {
  const { rooms } = useRooms(myUserId);
  const positionedRooms = useHexagonGrid(rooms, 0, 0);
  const navigate = useNavigate();
  const [initialLoadRoomIds, setInitialLoadRoomIds] = useState<string[]>([]);
  const [pinnedInitialRoomIds, setPinnedInitialRoomIds] = useState<string[]>(
    [],
  );
  const [hasInitialVisibleBatch, setHasInitialVisibleBatch] = useState(false);
  const roomIds = rooms.map(({ roomId }) => roomId).join(',');

  useEffect(() => {
    setInitialLoadRoomIds([]);
    setPinnedInitialRoomIds([]);
    setHasInitialVisibleBatch(false);
  }, [roomIds]);

  const handleInitialVisibleRoomIds = useCallback((roomIds: string[]) => {
    setInitialLoadRoomIds((previous) =>
      previous.length ? previous : roomIds,
    );
    setPinnedInitialRoomIds((previous) =>
      previous.length ? previous : roomIds,
    );
    setHasInitialVisibleBatch(true);
  }, []);

  const {
    hoveredIndex,
    handlePointerDown,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
  } = useHiveInteractions(rooms, navigate);

  const { isLoading, handleModelLoaded } = useHiveLoading(
    initialLoadRoomIds,
    hasInitialVisibleBatch,
    onLoadingComplete,
  );

  useEffect(() => {
    if (!isLoading && pinnedInitialRoomIds.length) {
      setPinnedInitialRoomIds([]);
    }
  }, [isLoading, pinnedInitialRoomIds.length]);

  return (
    <div className='w-full h-screen relative'>
      {isLoading && <Loading />}
      <Canvas
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
        <HiveRoomsScene
          positionedRooms={positionedRooms}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onModelLoaded={handleModelLoaded}
          initialVisibleRoomIds={pinnedInitialRoomIds}
          onInitialVisibleRoomIds={handleInitialVisibleRoomIds}
        />
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
      {hoveredIndex !== null && (
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
            opacity: hoveredIndex !== null ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}>
          {`✊🏻 똑똑! ${rooms[hoveredIndex]?.nickname}의 방에 들어가실래요?`}
        </div>
      )}
    </div>
  );
}
