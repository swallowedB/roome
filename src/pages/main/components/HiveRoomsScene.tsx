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

const PREFETCH_MARGIN_WORLD = 3;

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

  const screenToWorld = (x: number, y: number) => {
    const vec = new THREE.Vector3(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5,
    );
    vec.unproject(camera);
    return vec;
  };

  useEffect(() => {
    if (!positionedRooms.length) return;
    indexRef.current = new HiveSpatialIndex(positionedRooms);
  }, [positionedRooms]);

  useFrame(() => {
    const index = indexRef.current;
    if (!index) return;
    if (!positionedRooms.length) return;

    const TL = screenToWorld(0, 0);
    const TR = screenToWorld(window.innerWidth, 0);
    const BL = screenToWorld(0, window.innerHeight);
    const BR = screenToWorld(window.innerWidth, window.innerHeight);

    const minX = Math.min(TL.x, TR.x, BL.x, BR.x);
    const maxX = Math.max(TL.x, TR.x, BL.x, BR.x);
    const minZ = Math.min(TL.z, TR.z, BL.z, BR.z);
    const maxZ = Math.max(TL.z, TR.z, BL.z, BR.z);

    const items = index.getAll();

    const nextVisible = new Set<number>();
    const nextPrefetch = new Set<string>();

    items.forEach(({ index: idx, modelPath }) => {
      const positioned = positionedRooms[idx];
      if (!positioned) return;

      const { room, position } = positioned;
      const x = position[0];
      const z = position[2];

      const inView = x >= minX && x <= maxX && z >= minZ && z <= maxZ;

      const inMargin =
        x >= minX - PREFETCH_MARGIN_WORLD &&
        x <= maxX + PREFETCH_MARGIN_WORLD &&
        z >= minZ - PREFETCH_MARGIN_WORLD &&
        z <= maxZ + PREFETCH_MARGIN_WORLD;

      if (inView) {
        nextVisible.add(idx);
      } else if (inMargin) {
        const path = room.modelPath ?? modelPath;
        if (path) nextPrefetch.add(path);
      }
    });

    setVisibleIndices((prev) => {
      if (nextVisible.size === 0) {
        return prev;
      }

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
          if (visibleIndices.size === 0) return true;
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
