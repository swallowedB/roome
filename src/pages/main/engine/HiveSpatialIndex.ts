export class HiveSpatialIndex {
  private items: {
    index: number;
    x: number;
    z: number;
    modelPath: string;
  }[];

  private minX: number;
  private maxX: number;

  constructor(
    positionedRooms: { room: Room; position: [number, number, number] }[],
  ) {
    this.items = positionedRooms.map(({ room, position }, index) => ({
      index,
      x: position[0],
      z: position[2],
      modelPath: room.modelPath ?? '',
    }));
    const xs = this.items.map((i) => i.x);
    this.minX = Math.min(...xs);
    this.maxX = Math.max(...xs);
  }

  getVisibleByX(cameraX: number, halfWidth: number) {
    const left = cameraX - halfWidth;
    const right = cameraX + halfWidth;

    return this.items.filter((item) => {
      return item.x >= left && item.x <= right;
    });
  }

  getPrefetchTargetsByX(
    cameraX: number,
    innerHalfWidth: number,
    outerHalfWidth: number,
  ) {
    const innerLeft = cameraX - innerHalfWidth;
    const innerRight = cameraX + innerHalfWidth;
    const outerLeft = cameraX - outerHalfWidth;
    const outerRight = cameraX + outerHalfWidth;

    return this.items.filter((item) => {
      const x = item.x;
      const inOuter = x >= outerLeft && x <= outerRight;
      const inInner = x >= innerLeft && x <= innerRight;
      return inOuter && !inInner;
    });
  }
  
  getHorizontalBounds() {
    return { minX: this.minX, maxX: this.maxX };
  }
}
