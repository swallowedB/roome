import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

const SCREEN_INNER_MARGIN = 1.0;
const SCREEN_OUTER_MARGIN = 1.2;

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

  const initializedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!positionedRooms.length) return;
    indexRef.current = new HiveSpatialIndex(positionedRooms);
  }, [positionedRooms]);

  useFrame(() => {
    const index = indexRef.current;
    if (!index) return;
    if (!positionedRooms.length) return;

    const items = index.getAll();
    const nextVisible = new Set<number>();
    const nextPrefetch = new Set<string>();

    let nearest: { idx: number; dist2: number } | null = null;

    for (const item of items) {
      const { index: idx, modelPath } = item;
      const positioned = positionedRooms[idx];
      if (!positioned) continue;

      const { room, position } = positioned;
      const [x, y, z] = position;

      // 월드 좌표 → NDC(-1~1) 변환
      const vec = new THREE.Vector3(x, y, z);
      vec.project(camera); 

      const ndcX = vec.x;
      const ndcY = vec.y;
      const ndcZ = vec.z;

      const dist2 = ndcX * ndcX + ndcY * ndcY;
      if (!nearest || dist2 < nearest.dist2) {
        nearest = { idx, dist2 };
      }

      const inView =
        ndcZ >= -1 &&
        ndcZ <= 1 &&
        Math.abs(ndcX) <= SCREEN_INNER_MARGIN &&
        Math.abs(ndcY) <= SCREEN_INNER_MARGIN;

      const inPrefetch =
        ndcZ >= -1.2 &&
        ndcZ <= 1.2 &&
        Math.abs(ndcX) <= SCREEN_OUTER_MARGIN &&
        Math.abs(ndcY) <= SCREEN_OUTER_MARGIN;

      if (inView) {
        nextVisible.add(idx);
      } else if (inPrefetch) {
        const path = room.modelPath ?? modelPath;
        if (path) {
          nextPrefetch.add(path);
        }
      }
    }

    if (nextVisible.size === 0 && nearest) {
      nextVisible.add(nearest.idx);
    }

    if (!initializedRef.current && nextVisible.size > 0) {
      initializedRef.current = true;
      setInitialized(true);
    }

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

    setPrefetchPaths(Array.from(nextPrefetch));
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
        .filter(({ index }) => {
          if (!initialized) return true;
          return visibleIndices.has(index);
        })
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
              position={position}
              onModelLoaded={onModelLoaded}
            />
          </group>
        ))}
    </>
  );
}
