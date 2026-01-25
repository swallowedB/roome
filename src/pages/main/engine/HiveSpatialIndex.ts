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

  getVisibleByX(cameraX: number, halfWidth: number) {
    return this.items.filter((item) => {
      const dx = item.x - cameraX;
      const distX = Math.abs(dx);
      return distX <= halfWidth;
    });
  }

  getPrefetchTargetsByX(
    cameraX: number,
    innerHalfWidth: number,
    outerHalfWidth: number,
  ) {
    return this.items.filter((item) => {
      const dx = item.x - cameraX;
      const distX = Math.abs(dx);
      return distX > innerHalfWidth && distX <= outerHalfWidth;
    });
  }
}
