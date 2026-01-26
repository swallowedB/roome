export class HiveSpatialIndex {
  private items: {
    index: number;
    x: number;
    y: number;
    z: number;
    modelPath: string;
  }[];

  constructor(
    positionedRooms: { room: Room; position: [number, number, number] }[],
  ) {
    this.items = positionedRooms.map(({ room, position }, index) => ({
      index,
      x: position[0],
      y: position[1],
      z: position[2],
      modelPath: room.modelPath ?? '',
    }));

    this.items.sort((a, b) => a.x - b.x);
  }

  getAll() {
    return this.items;
  }
}
