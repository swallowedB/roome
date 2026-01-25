export class HiveSpatialIndex {
  private items: {
    index: number;
    x: number;
    z: number;
    modelPath: string;
  }[];

  constructor(positionedRooms: { room: Room; position: [number, number, number] }[]) {
    this.items = positionedRooms.map(({ room, position }, index) => ({
      index,
      x: position[0],
      z: position[2],
      modelPath: room.modelPath ?? '',
    }));
  }

  getVisible(cameraX: number, cameraZ: number, radius: number) {
    return this.items.filter((item) => {
      const dx = item.x - cameraX;
      const dz = item.z - cameraZ;
      return Math.hypot(dx, dz) <= radius;
    });
  }

  getPrefetchTargets(cameraX: number, cameraZ: number, inner: number, outer: number) {
    return this.items.filter((item) => {
      const dx = item.x - cameraX;
      const dz = item.z - cameraZ;
      const dist = Math.hypot(dx, dz);
      return dist > inner && dist <= outer;
    });
  }
}