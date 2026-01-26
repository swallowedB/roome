export class HiveSpatialIndex {
  private items: {
    index: number;
    x: number;
    z: number;
    modelPath: string;
  }[];

  constructor(
    positionedRooms: { room: Room; position: [number, number, number] }[],
  ) {
    this.items = positionedRooms.map(({ room, position }, index) => ({
      index,
      x: position[0],
      z: position[2],
      modelPath: room.modelPath ?? '',
    }));
  }

  getCandidatesInRadius(camX: number, camZ: number, radius: number) {
    const r2 = radius * radius;

    return this.items.filter((item) => {
      const dx = item.x - camX;
      const dz = item.z - camZ;
      const dist2 = dx * dx + dz * dz;
      return dist2 <= r2;
    });
  }
}
