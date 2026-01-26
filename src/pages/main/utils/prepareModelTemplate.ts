import * as THREE from 'three';

const roomModelTemplateCache = new Map<string, THREE.Object3D>();

export function prepareModelTemplate(modelPath: string, originalScene: THREE.Object3D) {
  const cached = roomModelTemplateCache.get(modelPath);
  if (cached) return cached;

  const template = originalScene.clone(true);

  template.traverse((object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh) {
      object.material = (object.material as THREE.Material).clone();
      object.geometry = object.geometry.clone();

      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  roomModelTemplateCache.set(modelPath, template);
  return template;
}