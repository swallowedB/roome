type HiveSpatialItem = {
  index: number;
  x: number;
  z: number;
  modelPath: string;
};

export function haveSameMembers<T>(left: Set<T>, right: Set<T>) {
  if (left.size !== right.size) return false;
  return Array.from(left).every((item) => right.has(item));
}

export class HiveSpatialIndex {
  private itemsByX: HiveSpatialItem[];

  constructor(
    positionedRooms: { room: Room; position: [number, number, number] }[],
  ) {
    this.itemsByX = positionedRooms
      .map(({ room, position }, index) => ({
        index,
        x: position[0],
        z: position[2],
        modelPath: room.modelPath ?? '',
      }))
      .sort((left, right) => left.x - right.x);
  }

  queryRange(minX: number, maxX: number, minZ: number, maxZ: number) {
    const start = this.findFirstXAtLeast(minX);
    const end = this.findFirstXGreaterThan(maxX);
    const matches: HiveSpatialItem[] = [];

    for (let i = start; i < end; i++) {
      const item = this.itemsByX[i];
      if (item.z >= minZ && item.z <= maxZ) matches.push(item);
    }

    return matches;
  }

  private findFirstXAtLeast(target: number) {
    let low = 0;
    let high = this.itemsByX.length;

    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (this.itemsByX[middle].x < target) low = middle + 1;
      else high = middle;
    }

    return low;
  }

  private findFirstXGreaterThan(target: number) {
    let low = 0;
    let high = this.itemsByX.length;

    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (this.itemsByX[middle].x <= target) low = middle + 1;
      else high = middle;
    }

    return low;
  }
}
