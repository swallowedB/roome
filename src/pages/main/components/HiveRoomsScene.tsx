import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { HiveSpatialIndex } from '@pages/main/engine/HiveSpatialIndex';
import HiveRoomModel from './HiveRoomModel';

interface HiveRoomsSceneProps {
  positionedRooms: PositionedRoom[];
  onPointerDown: (e) => void;
  onPointerUp: (e, index: number) => void;
  onPointerOver: (index: number) => void;
  onPointerOut: () => void;
  onModelLoaded: (roomId: string) => void;
}

const VISIBLE_RADIUS = 18; // 렌더링 반경
const PREFETCH_RADIUS_INNER = 18; // 프리패치 시작
const PREFETCH_RADIUS_OUTER = 24; // 프리패치 끝

export default function HiveRoomsScene({
  positionedRooms,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  onModelLoaded,
}: HiveRoomsSceneProps) {
  const { camera } = useThree();

  const indexRef = useRef<HiveSpatialIndex | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [prefetchPaths, setPrefetchPaths] = useState<string[]>([]);

  useEffect(() => {
    indexRef.current = new HiveSpatialIndex(positionedRooms);
  }, [positionedRooms]);

  useFrame(() => {
    const index = indexRef.current;
    if (!index) return;

    const camX = camera.position.x;
    const camZ = camera.position.z;

    const visible = index.getVisible(camX, camZ, VISIBLE_RADIUS);
    const prefetch = index.getPrefetchTargets(
      camX,
      camZ,
      PREFETCH_RADIUS_INNER,
      PREFETCH_RADIUS_OUTER,
    );

    const nextVisible = new Set(visible.map((v) => v.index));
    setVisibleIndices((prev) => {
      if (prev.size === nextVisible.size) {
        let same = true;
        prev.forEach((v) => {
          if (!nextVisible.has(v)) same = false;
        });
        if (same) return prev;
      }
      return nextVisible;
    });

    setPrefetchPaths(prefetch.map((v) => v.modelPath));
  });

  useEffect(() => {
    const uniquePaths = Array.from(new Set(prefetchPaths));
    uniquePaths.forEach((path) => {
      if (path) {
        useGLTF.preload(path);
      }
    });
  }, [prefetchPaths]);

  return (
    <>
      {positionedRooms
        .filter(
          ({ index }) => visibleIndices.size === 0 || visibleIndices.has(index),
        )
        .map(({ room, position, index }) => (
          <group
            key={room.roomId}
            position={position}
            onPointerDown={onPointerDown}
            onPointerUp={(e) => onPointerUp(e, index)}
            onPointerOver={() => onPointerOver(index)}
            onPointerOut={onPointerOut}>
            <HiveRoomModel
              room={room}
              onModelLoaded={onModelLoaded}
            />
          </group>
        ))}
    </>
  );
}
