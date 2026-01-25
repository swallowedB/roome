import { RoomModelCache } from '@pages/main/engine/RoomModelCache';
import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';

export default function HiveRoomModel({
  room,
  onModelLoaded,
}: HiveRoomModelProps) {
  const { scene: originalScene } = useGLTF(room.modelPath) as GLTFResult;

  const scene = useMemo(() => {
    return RoomModelCache.getInstance(room.modelPath, originalScene);
  }, [originalScene, room.modelPath]);

  const roomScale = 0.5;

  useEffect(() => {
    if (!scene) return;
    onModelLoaded(room.roomId);
  }, [scene, room.roomId, onModelLoaded]);

  return (
    <Center>
      <primitive
        object={scene}
        scale={roomScale}
        rotation={[0, -Math.PI / 4, 0]}
      />
    </Center>
  );
}
