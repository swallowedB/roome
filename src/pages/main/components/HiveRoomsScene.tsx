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

const ROOM_RADIUS = 2.5;
const PREFETCH_MARGIN = 6;

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
    if (!positionedRooms.length) return;
    indexRef.current = new HiveSpatialIndex(positionedRooms);
  }, [positionedRooms]);

  useFrame(() => {
    const index = indexRef.current;
    if (!index) return;
    if (!positionedRooms.length) return;

    const items = index.getAll();

    camera.updateMatrix();
    camera.updateMatrixWorld();

    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    const frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(projScreenMatrix);

    const nextVisible = new Set<number>();
    const nextPrefetch = new Set<string>();

    items.forEach(({ index: idx, modelPath }) => {
      const positioned = positionedRooms[idx];
      if (!positioned) return;

      const { room, position } = positioned;
      const center = new THREE.Vector3(position[0], position[1], position[2]);

      const baseSphere = new THREE.Sphere(center, ROOM_RADIUS);
      const marginSphere = new THREE.Sphere(
        center,
        ROOM_RADIUS + PREFETCH_MARGIN,
      );

      const inBase = frustum.intersectsSphere(baseSphere);
      const inMargin = frustum.intersectsSphere(marginSphere);

      if (inBase) {
        nextVisible.add(idx);
      } else if (inMargin) {
        const path = room.modelPath ?? modelPath;
        if (path) {
          nextPrefetch.add(path);
        }
      }
    });


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
