import * as THREE from 'three';
import { SHARED_GEOMETRIES, SHARED_MATERIALS, makeBox } from './sharedAssets.js';
import {
  TILE_SIZE,
  DIRECTIONS,
  LANE_OFFSETS,
  TILE_TYPES,
  BASE_SOCKETS,
  SOCKET_TRANSFORMS,
  registerTileBuilder,
  getTileBuilder,
} from './assetRegistry.js';

function seededVal(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function addDhakaBuilding(group, w, h, d, x, z, seed) {
  const matIndex = Math.floor(seededVal(seed) * SHARED_MATERIALS.buildings.length);
  const bldgMat = SHARED_MATERIALS.buildings[matIndex];

  // Main building volume + rooftop parapet wall
  group.add(makeBox(w, h, d, bldgMat, x, 0.12, z));
  group.add(makeBox(w + 0.06, 0.25, d + 0.06, SHARED_MATERIALS.footpath, x, 0.12 + h, z));

  // Horizontal dark window strips per story
  const floors = Math.floor(h / 1.4);
  for (let f = 1; f <= floors; f++) {
    const wy = f * 1.3;
    if (wy + 0.35 < h) {
      group.add(makeBox(w + 0.04, 0.28, d + 0.04, SHARED_MATERIALS.windowStrip, x, wy, z));
    }
  }

  // Rooftop cylindrical water tank
  if (seededVal(seed + 9) > 0.35) {
    const tank = new THREE.Mesh(SHARED_GEOMETRIES.cylinder, SHARED_MATERIALS.waterTank);
    tank.scale.set(0.5, 0.65, 0.5);
    tank.position.set(x + (seededVal(seed + 3) - 0.5) * 0.4, 0.12 + h + 0.32, z);
    group.add(tank);
  }
}

function addSidewalkStripZ(group, sideSign, zStart, zEnd, seedBase) {
  const length = zEnd - zStart;
  const zCenter = (zStart + zEnd) / 2;
  group.add(makeBox(2.0, 0.12, length, SHARED_MATERIALS.footpath, sideSign * 4.0, 0, zCenter));

  const segments = Math.max(2, Math.floor(length));
  const segLen = length / segments;
  for (let i = 0; i < segments; i++) {
    const mat = i % 2 === 0 ? SHARED_MATERIALS.kerbLight : SHARED_MATERIALS.kerbDark;
    const zPos = zStart + (i + 0.5) * segLen;
    group.add(makeBox(0.2, 0.16, segLen, mat, sideSign * 3.1, 0, zPos));
  }

  const bldgCount = Math.max(1, Math.floor(length / 3.2));
  const slotLen = length / bldgCount;
  for (let i = 0; i < bldgCount; i++) {
    const seed = seedBase + i * 17;
    const h = 2.8 + seededVal(seed) * 4.2;
    const zPos = zStart + (i + 0.5) * slotLen;
    addDhakaBuilding(group, 1.15, h, slotLen - 0.18, sideSign * 4.35, zPos, seed);
  }
}

function addSidewalkStripX(group, sideSign, xStart, xEnd, seedBase) {
  const length = xEnd - xStart;
  const xCenter = (xStart + xEnd) / 2;
  group.add(makeBox(length, 0.12, 2.0, SHARED_MATERIALS.footpath, xCenter, 0, sideSign * 4.0));

  const segments = Math.max(2, Math.floor(length));
  const segLen = length / segments;
  for (let i = 0; i < segments; i++) {
    const mat = i % 2 === 0 ? SHARED_MATERIALS.kerbLight : SHARED_MATERIALS.kerbDark;
    const xPos = xStart + (i + 0.5) * segLen;
    group.add(makeBox(segLen, 0.16, 0.2, mat, xPos, 0, sideSign * 3.1));
  }

  const bldgCount = Math.max(1, Math.floor(length / 3.2));
  const slotLen = length / bldgCount;
  for (let i = 0; i < bldgCount; i++) {
    const seed = seedBase + i * 17;
    const h = 2.8 + seededVal(seed) * 4.2;
    const xPos = xStart + (i + 0.5) * slotLen;
    addDhakaBuilding(group, slotLen - 0.18, h, 1.15, xPos, sideSign * 4.35, seed);
  }
}

function addCornerPocket(group, sx, sz, seed) {
  const h = 3.2 + seededVal(seed) * 3.5;
  group.add(makeBox(2.0, 0.12, 2.0, SHARED_MATERIALS.footpath, sx * 4.0, 0, sz * 4.0));
  addDhakaBuilding(group, 1.8, h, 1.8, sx * 4.0, sz * 4.0, seed);
}

function buildStraightTile() {
  const group = new THREE.Group();
  group.add(makeBox(TILE_SIZE, 0.1, TILE_SIZE, SHARED_MATERIALS.asphalt, 0, -0.1, 0));
  for (let z = -4; z <= 4; z += 2.5) {
    group.add(makeBox(0.12, 0.02, 1.1, SHARED_MATERIALS.laneLine, -1, 0, z));
    group.add(makeBox(0.12, 0.02, 1.1, SHARED_MATERIALS.laneLine, 1, 0, z));
  }
  addSidewalkStripZ(group, -1, -5, 5, 101);
  addSidewalkStripZ(group, 1, -5, 5, 202);
  return group;
}

function buildTurn90Tile() {
  const group = new THREE.Group();
  group.add(makeBox(TILE_SIZE, 0.1, TILE_SIZE, SHARED_MATERIALS.asphalt, 0, -0.1, 0));
  group.add(makeBox(0.12, 0.02, 1.2, SHARED_MATERIALS.laneLine, -1, 0, -4.0));
  group.add(makeBox(0.12, 0.02, 1.2, SHARED_MATERIALS.laneLine, 1, 0, -4.0));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, 4.0, 0, -1));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, 4.0, 0, 1));
  addSidewalkStripZ(group, -1, -5, 3, 303);
  addSidewalkStripX(group, 1, -5, 5, 404);
  addCornerPocket(group, 1, -1, 505);
  return group;
}

function buildTJunctionTile() {
  const group = new THREE.Group();
  group.add(makeBox(TILE_SIZE, 0.1, TILE_SIZE, SHARED_MATERIALS.asphalt, 0, -0.1, 0));
  group.add(makeBox(0.12, 0.02, 1.2, SHARED_MATERIALS.laneLine, -1, 0, -4.0));
  group.add(makeBox(0.12, 0.02, 1.2, SHARED_MATERIALS.laneLine, 1, 0, -4.0));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, 4.0, 0, -1));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, 4.0, 0, 1));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, -4.0, 0, -1));
  group.add(makeBox(1.2, 0.02, 0.12, SHARED_MATERIALS.laneLine, -4.0, 0, 1));
  addSidewalkStripX(group, 1, -5, 5, 606);
  addCornerPocket(group, -1, -1, 707);
  addCornerPocket(group, 1, -1, 808);
  return group;
}

registerTileBuilder(TILE_TYPES.Straight, buildStraightTile);
registerTileBuilder(TILE_TYPES.Turn90, buildTurn90Tile);
registerTileBuilder(TILE_TYPES.TJunction, buildTJunctionTile);

export function computeRotatedSockets(type, rotationSteps = 0) {
  const steps = ((rotationSteps % 4) + 4) % 4;
  const base = BASE_SOCKETS[type];
  const sockets = {};
  DIRECTIONS.forEach((dir, idx) => {
    const sourceDir = DIRECTIONS[(idx - steps + 4) % 4];
    sockets[dir] = {
      dir,
      open: base[sourceDir],
      position: SOCKET_TRANSFORMS[dir].position.clone(),
      normal: SOCKET_TRANSFORMS[dir].normal.clone(),
    };
  });
  return sockets;
}

export function createTile(type, rotationSteps = 0) {
  const steps = ((rotationSteps % 4) + 4) % 4;
  const rootGroup = new THREE.Group();
  rootGroup.name = `Tile_${type}_rot${steps}`;
  const visualGroup = getTileBuilder(type)();
  visualGroup.rotation.y = -steps * (Math.PI / 2);
  rootGroup.add(visualGroup);

  rootGroup.userData = {
    type,
    rotationSteps: steps,
    sockets: computeRotatedSockets(type, steps),
  };
  return rootGroup;
}

export function snapTileToSocket(parentTile, targetSocketDir, childTile) {
  const parentSockets = parentTile.userData.sockets;
  const targetSocket = parentSockets[targetSocketDir];
  if (!targetSocket || !targetSocket.open) {
    console.warn(`Cannot snap to closed or missing socket ${targetSocketDir}`);
  }

  const offset = targetSocket.normal.clone().multiplyScalar(TILE_SIZE);
  childTile.position.copy(parentTile.position).add(offset);
  return childTile;
}
