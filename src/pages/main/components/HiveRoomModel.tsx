import { prepareModelTemplate } from '@pages/main/utils/prepareModelTemplate';
import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';

export default function HiveRoomModel({
  room,
  onModelLoaded,
}: HiveRoomModelProps) {
  const { scene: originalScene } = useGLTF(room.modelPath) as GLTFResult;

  const template = useMemo(
    () => prepareModelTemplate(room.modelPath, originalScene),
    [room.modelPath, originalScene],
  );

  const scene = useMemo(() => template.clone(true), [template]);

  const roomScale = 0.5;

  useEffect(() => {
    onModelLoaded(room.roomId);
  }, [room.roomId, onModelLoaded]);

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
