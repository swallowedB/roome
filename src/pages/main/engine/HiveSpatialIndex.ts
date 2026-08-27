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

  getAll() {
    return this.items;
  }
}
