
import * as THREE from 'three';

export class RoomModelCache {
  private static baseScenes = new Map<string, THREE.Object3D>();

  static getInstance(modelPath: string, originalScene: THREE.Object3D) {
    let base = this.baseScenes.get(modelPath);

    if (!base) {
      base = originalScene.clone(true);

      base.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      this.baseScenes.set(modelPath, base);
    }

    return base.clone();
  }
}
