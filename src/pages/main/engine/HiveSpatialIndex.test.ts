import assert from 'node:assert/strict';
import test from 'node:test';

import { HiveSpatialIndex } from './HiveSpatialIndex';
import * as spatialIndex from './HiveSpatialIndex';

type IndexedRoom = {
  index: number;
  x: number;
  z: number;
  modelPath: string;
};

type RangeQueryable = {
  queryRange: (
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
  ) => IndexedRoom[];
};

type MemberComparator = (left: Set<number>, right: Set<number>) => boolean;

const room = (roomId: string, modelPath: string): Room =>
  ({ roomId, modelPath }) as Room;

test('returns only rooms inside the requested world-space range', () => {
  const index = new HiveSpatialIndex([
    { room: room('left', '/left.glb'), position: [-4, 0, 0] },
    { room: room('visible', '/visible.glb'), position: [1, 0, 2] },
    { room: room('far-z', '/far-z.glb'), position: [1, 0, 9] },
    { room: room('right', '/right.glb'), position: [7, 0, 2] },
  ]);

  const queryable = index as HiveSpatialIndex & RangeQueryable;
  const result = queryable.queryRange(0, 3, 0, 3);

  assert.deepEqual(result.map(({ index: itemIndex }) => itemIndex), [1]);
});

test('compares visible-room memberships without depending on set insertion order', () => {
  const compareMembers = (
    spatialIndex as typeof spatialIndex & {
      haveSameMembers: MemberComparator;
    }
  ).haveSameMembers;

  assert.equal(compareMembers(new Set(), new Set()), true);
  assert.equal(compareMembers(new Set([1, 3]), new Set([3, 1])), true);
  assert.equal(compareMembers(new Set([1, 3]), new Set([1, 4])), false);
});
