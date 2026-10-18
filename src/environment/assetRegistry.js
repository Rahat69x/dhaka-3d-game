import * as THREE from 'three';

export const TILE_SIZE = 10.0;
export const DIRECTIONS = ['N', 'E', 'S', 'W'];
export const LANE_OFFSETS = [-2.0, 0.0, 2.0];

export const TILE_TYPES = {
  Straight: 'Straight',
  Turn90: 'Turn90',
  TJunction: 'TJunction',
};

export const OBSTACLE_TYPES = {
  Rickshaw: 'Rickshaw',
  CNG: 'CNG',
  Bus: 'Bus',
  MarketStall: 'MarketStall',
  BarrierPothole: 'BarrierPothole',
};

export const BASE_SOCKETS = {
  [TILE_TYPES.Straight]: { N: true, E: false, S: true, W: false },
  [TILE_TYPES.Turn90]: { N: true, E: true, S: false, W: false },
  [TILE_TYPES.TJunction]: { N: true, E: true, S: false, W: true },
};

export const SOCKET_TRANSFORMS = {
  N: {
    position: new THREE.Vector3(0, 0, -5),
    normal: new THREE.Vector3(0, 0, -1),
  },
  E: {
    position: new THREE.Vector3(5, 0, 0),
    normal: new THREE.Vector3(1, 0, 0),
  },
  S: {
    position: new THREE.Vector3(0, 0, 5),
    normal: new THREE.Vector3(0, 0, 1),
  },
  W: {
    position: new THREE.Vector3(-5, 0, 0),
    normal: new THREE.Vector3(-1, 0, 0),
  },
};

const tileBuilders = new Map();
const obstacleBuilders = new Map();

export function registerTileBuilder(type, fn) {
  tileBuilders.set(type, fn);
}

export function getTileBuilder(type) {
  const fn = tileBuilders.get(type);
  if (!fn) {
    throw new Error(`Tile builder not registered for type: ${type}`);
  }
  return fn;
}

export function registerObstacleBuilder(type, fn) {
  obstacleBuilders.set(type, fn);
}

export function getObstacleBuilder(type) {
  const fn = obstacleBuilders.get(type);
  if (!fn) {
    throw new Error(`Obstacle builder not registered for type: ${type}`);
  }
  return fn;
}
