import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import {
  haveSameMembers,
  HiveSpatialIndex,
} from '@pages/main/engine/HiveSpatialIndex';
import {
  HIVE_ROOM_DEPTH_STEP,
  HIVE_ROOM_VERTICAL_STEP,
  HIVE_ROOM_WIDTH,
} from '../constants/hiveGrid';
import HiveRoomModel from './HiveRoomModel';

interface HiveRoomsSceneProps {
  positionedRooms: PositionedRoom[];
  onPointerDown: (e) => void;
  onPointerUp: (e, index: number) => void;
  onPointerOver: (index: number) => void;
  onPointerOut: () => void;
  onModelLoaded: (roomId: string) => void;
  initialVisibleRoomIds: string[];
  onInitialVisibleRoomIds: (roomIds: string[]) => void;
}

const PREFETCH_MARGIN_WORLD = 3;
const ROOM_GRID_PLANE = new THREE.Plane().setFromCoplanarPoints(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(HIVE_ROOM_WIDTH, 0, 0),
  new THREE.Vector3(
    HIVE_ROOM_WIDTH / 2,
    -HIVE_ROOM_VERTICAL_STEP,
    HIVE_ROOM_DEPTH_STEP,
  ),
);

export default function HiveRoomsScene({
  positionedRooms,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  onModelLoaded,
  initialVisibleRoomIds,
  onInitialVisibleRoomIds,
}: HiveRoomsSceneProps) {
  const { camera, size } = useThree();

  const indexRef = useRef<HiveSpatialIndex | null>(null);
  const visibleIndicesRef = useRef<Set<number>>(new Set());
  const prefetchedPathsRef = useRef<Set<string>>(new Set());
  const lastCameraMatrixRef = useRef(new THREE.Matrix4());
  const lastCanvasSizeRef = useRef({ width: 0, height: 0 });
  const reportedInitialVisibleRef = useRef(false);
  const frustumRef = useRef(new THREE.Frustum());
  const projectionMatrixRef = useRef(new THREE.Matrix4());
  const roomPositionRef = useRef(new THREE.Vector3());
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const initialVisibleRoomIdSet = useMemo(
    () => new Set(initialVisibleRoomIds),
    [initialVisibleRoomIds],
  );

  const screenToWorld = (x: number, y: number) => {
    raycaster.setFromCamera(
      new THREE.Vector2((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1),
      camera,
    );
    return raycaster.ray.intersectPlane(ROOM_GRID_PLANE, new THREE.Vector3());
  };

  useEffect(() => {
    indexRef.current = positionedRooms.length
      ? new HiveSpatialIndex(positionedRooms)
      : null;
    visibleIndicesRef.current = new Set();
    prefetchedPathsRef.current = new Set();
    lastCameraMatrixRef.current.identity();
    lastCanvasSizeRef.current = { width: 0, height: 0 };
    reportedInitialVisibleRef.current = false;
    setVisibleIndices(new Set());
  }, [positionedRooms]);

  useFrame(() => {
    const index = indexRef.current;
    if (!index || !size.width || !size.height) return;

    camera.updateMatrixWorld();
    const isSameCamera = lastCameraMatrixRef.current.equals(camera.matrixWorld);
    const isSameCanvasSize =
      lastCanvasSizeRef.current.width === size.width &&
      lastCanvasSizeRef.current.height === size.height;
    if (isSameCamera && isSameCanvasSize) return;

    lastCameraMatrixRef.current.copy(camera.matrixWorld);
    lastCanvasSizeRef.current = { width: size.width, height: size.height };
    projectionMatrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    frustumRef.current.setFromProjectionMatrix(projectionMatrixRef.current);

    const TL = screenToWorld(0, 0);
    const TR = screenToWorld(size.width, 0);
    const BL = screenToWorld(0, size.height);
    const BR = screenToWorld(size.width, size.height);
    if (!TL || !TR || !BL || !BR) return;

    const minX = Math.min(TL.x, TR.x, BL.x, BR.x);
    const maxX = Math.max(TL.x, TR.x, BL.x, BR.x);
    const minZ = Math.min(TL.z, TR.z, BL.z, BR.z);
    const maxZ = Math.max(TL.z, TR.z, BL.z, BR.z);

    const items = index.queryRange(
      minX - PREFETCH_MARGIN_WORLD,
      maxX + PREFETCH_MARGIN_WORLD,
      minZ - PREFETCH_MARGIN_WORLD,
      maxZ + PREFETCH_MARGIN_WORLD,
    );

    const nextVisible = new Set<number>();
    const nextPrefetch = new Set<string>();

    items.forEach(({ index: idx, modelPath }) => {
      const positioned = positionedRooms[idx];
      if (!positioned) return;

      const { room, position } = positioned;
      const x = position[0];
      const z = position[2];

      const inView = frustumRef.current.containsPoint(
        roomPositionRef.current.set(position[0], position[1], position[2]),
      );

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

    if (!haveSameMembers(visibleIndicesRef.current, nextVisible)) {
      visibleIndicesRef.current = nextVisible;
      setVisibleIndices(nextVisible);
    }

    if (!reportedInitialVisibleRef.current) {
      reportedInitialVisibleRef.current = true;
      onInitialVisibleRoomIds(
        Array.from(nextVisible)
          .map((roomIndex) => positionedRooms[roomIndex]?.room.roomId)
          .filter((roomId): roomId is string => Boolean(roomId)),
      );
    }

    nextPrefetch.forEach((path) => {
      if (!prefetchedPathsRef.current.has(path)) {
        prefetchedPathsRef.current.add(path);
        useGLTF.preload(path);
      }
    });
  });

  return (
    <>
      {positionedRooms
        .filter(({ room, index }) => {
          return (
            visibleIndices.has(index) || initialVisibleRoomIdSet.has(room.roomId)
          );
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
              onModelLoaded={onModelLoaded}
            />
          </group>
        ))}
    </>
  );
}
