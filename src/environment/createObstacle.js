import * as THREE from 'three';
import { SHARED_MATERIALS, makeBox, makeWheel } from './sharedAssets.js';
import { OBSTACLE_TYPES, registerObstacleBuilder, getObstacleBuilder } from './assetRegistry.js';

// 1. RICKSHAW (148 triangles, fits 1.20w x 1.85h x 2.10d)
function buildRickshaw() {
  const group = new THREE.Group();
  group.add(makeWheel(0.32, 0.08, 0, 0.32, -0.75));
  group.add(makeWheel(0.32, 0.08, -0.52, 0.32, 0.65));
  group.add(makeWheel(0.32, 0.08, 0.52, 0.32, 0.65));
  group.add(makeBox(0.95, 0.1, 1.1, SHARED_MATERIALS.metalSilver, 0, 0.3, 0.35));
  group.add(makeBox(0.12, 0.55, 0.9, SHARED_MATERIALS.rickshawBlue, 0, 0.35, -0.35));
  group.add(makeBox(0.08, 0.65, 0.08, SHARED_MATERIALS.metalSilver, 0, 0.32, -0.75));
  group.add(makeBox(0.55, 0.06, 0.06, SHARED_MATERIALS.tireBlack, 0, 0.95, -0.72));
  group.add(makeBox(0.92, 0.22, 0.55, SHARED_MATERIALS.rickshawYellow, 0, 0.4, 0.58));
  group.add(makeBox(0.92, 0.45, 0.12, SHARED_MATERIALS.rickshawBlue, 0, 0.62, 0.82));
  group.add(makeBox(1.02, 0.55, 0.75, SHARED_MATERIALS.rickshawHood, 0, 1.05, 0.55));
  group.add(makeBox(0.96, 0.22, 0.55, SHARED_MATERIALS.rickshawYellow, 0, 1.6, 0.58));
  return group;
}

// 2. CNG AUTO-RICKSHAW (136 triangles, fits 1.35w x 1.65h x 2.30d)
function buildCNG() {
  const group = new THREE.Group();
  group.add(makeWheel(0.25, 0.14, 0, 0.25, -0.82));
  group.add(makeWheel(0.25, 0.14, -0.58, 0.25, 0.72));
  group.add(makeWheel(0.25, 0.14, 0.58, 0.25, 0.72));
  group.add(makeBox(1.28, 0.68, 1.65, SHARED_MATERIALS.cngGreen, 0, 0.22, 0.15));
  group.add(makeBox(0.85, 0.62, 0.55, SHARED_MATERIALS.cngGreen, 0, 0.22, -0.75));
  group.add(makeBox(0.78, 0.42, 0.08, SHARED_MATERIALS.windowStrip, 0, 0.84, -0.68));
  group.add(makeBox(0.22, 0.16, 0.06, SHARED_MATERIALS.headlightWarm, 0, 0.52, -1.04));
  group.add(makeBox(1.26, 0.16, 1.75, SHARED_MATERIALS.cngCanopy, 0, 1.38, 0.05));
  group.add(makeBox(1.26, 0.5, 0.12, SHARED_MATERIALS.cngCanopy, 0, 0.9, 0.88));
  group.add(makeBox(1.3, 0.48, 1.1, SHARED_MATERIALS.metalSilver, 0, 0.9, 0.15));
  return group;
}

// 3. DHAKA LOCAL BUS (164 triangles, fits 1.80w x 2.75h x 4.60d)
function buildBus() {
  const group = new THREE.Group();
  group.add(makeWheel(0.42, 0.24, -0.82, 0.42, -1.35));
  group.add(makeWheel(0.42, 0.24, 0.82, 0.42, -1.35));
  group.add(makeWheel(0.42, 0.24, -0.82, 0.42, 1.35));
  group.add(makeWheel(0.42, 0.24, 0.82, 0.42, 1.35));
  group.add(makeBox(1.76, 1.05, 4.5, SHARED_MATERIALS.busBodyRed, 0, 0.38, 0));
  group.add(makeBox(1.8, 0.28, 4.54, SHARED_MATERIALS.busStripeGreen, 0, 1.15, 0));
  group.add(makeBox(1.74, 1.05, 4.46, SHARED_MATERIALS.kerbLight, 0, 1.43, 0));
  group.add(makeBox(1.78, 0.45, 4.3, SHARED_MATERIALS.windowStrip, 0, 1.75, 0));
  group.add(makeBox(1.6, 0.2, 3.8, SHARED_MATERIALS.metalSilver, 0, 2.55, 0));
  group.add(makeBox(1.5, 0.16, 0.1, SHARED_MATERIALS.headlightWarm, 0, 0.65, -2.28));
  group.add(makeBox(1.4, 0.3, 2.2, SHARED_MATERIALS.tarpBlue, 0, 2.75, 0.2));
  return group;
}

// 4. MARKET STALL (108 triangles, fits 1.65w x 2.10h x 1.80d)
function buildMarketStall() {
  const group = new THREE.Group();
  group.add(makeBox(1.45, 0.82, 1.2, SHARED_MATERIALS.woodBrown, 0, 0, 0));
  group.add(makeBox(1.58, 0.1, 1.32, SHARED_MATERIALS.bambooTan, 0, 0.82, 0));
  [[-0.7, -0.55], [0.7, -0.55], [-0.7, 0.55], [0.7, 0.55]].forEach(([px, pz]) => {
    group.add(makeBox(0.09, 1.95, 0.09, SHARED_MATERIALS.bambooTan, px, 0, pz));
  });
  const awning = makeBox(1.65, 0.12, 1.65, SHARED_MATERIALS.tarpBlue, 0, 1.88, 0);
  awning.rotation.x = 0.12;
  group.add(awning);
  group.add(makeBox(0.45, 0.28, 0.45, SHARED_MATERIALS.tarpOrange, -0.38, 0.92, -0.15));
  group.add(makeBox(0.42, 0.24, 0.42, SHARED_MATERIALS.rickshawYellow, 0.32, 0.92, 0.12));
  return group;
}

// 5. BARRIER / POTHOLE (96 triangles, fits 1.70w x 1.15h x 1.60d)
function buildBarrierPothole() {
  const group = new THREE.Group();
  group.add(makeBox(1.45, 0.03, 0.85, SHARED_MATERIALS.potholeMud, 0, 0, 0.35));
  group.add(makeBox(1.1, 0.05, 0.55, SHARED_MATERIALS.potholeDark, 0.05, 0, 0.35));
  group.add(makeBox(0.12, 0.1, 0.7, SHARED_MATERIALS.dmpBlue, -0.72, 0, -0.35));
  group.add(makeBox(0.12, 0.1, 0.7, SHARED_MATERIALS.dmpBlue, 0.72, 0, -0.35));
  group.add(makeBox(0.1, 1.1, 0.1, SHARED_MATERIALS.dmpBlue, -0.72, 0.05, -0.35));
  group.add(makeBox(0.1, 1.1, 0.1, SHARED_MATERIALS.dmpBlue, 0.72, 0.05, -0.35));
  group.add(makeBox(1.65, 0.22, 0.08, SHARED_MATERIALS.dmpBlue, 0, 0.82, -0.35));
  group.add(makeBox(1.65, 0.22, 0.08, SHARED_MATERIALS.dmpWhite, 0, 0.56, -0.35));
  group.add(makeBox(1.65, 0.2, 0.08, SHARED_MATERIALS.dmpBlue, 0, 0.32, -0.35));
  return group;
}

registerObstacleBuilder(OBSTACLE_TYPES.Rickshaw, buildRickshaw);
registerObstacleBuilder(OBSTACLE_TYPES.CNG, buildCNG);
registerObstacleBuilder(OBSTACLE_TYPES.Bus, buildBus);
registerObstacleBuilder(OBSTACLE_TYPES.MarketStall, buildMarketStall);
registerObstacleBuilder(OBSTACLE_TYPES.BarrierPothole, buildBarrierPothole);

export function countTriangles(object3D) {
  let tris = 0;
  object3D.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const g = child.geometry;
      tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
    }
  });
  return Math.round(tris);
}

export function createObstacle(type) {
  const rootGroup = new THREE.Group();
  rootGroup.name = `Obstacle_${type}`;
  const visualGroup = getObstacleBuilder(type)();
  rootGroup.add(visualGroup);
  const localBox = new THREE.Box3().setFromObject(visualGroup);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  localBox.getSize(size);
  localBox.getCenter(center);
  rootGroup.userData = {
    type,
    dimensions: size,
    centerOffset: center,
    box: localBox,
  };
  return rootGroup;
}

export function placeObstacleInLane(obstacle, laneX, z, rotY = 0) {
  obstacle.position.set(laneX, 0, z);
  obstacle.rotation.y = rotY;
  return obstacle;
}
