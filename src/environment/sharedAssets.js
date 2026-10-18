import * as THREE from 'three';

export const PALETTE = {
  // Road & Municipal Infrastructure
  asphalt: 0x2b2d2f,
  potholeDark: 0x161718,
  potholeMud: 0x4a3f35,
  laneLine: 0xe2d8b5,
  footpath: 0x85888c,
  kerbLight: 0xd8d2c5,
  kerbDark: 0x222426,
  windowStrip: 0x263238,
  waterTank: 0x37474f,

  // Muted Dhaka Mid-Rise Building Facades
  buildings: [
    0xc87d65, // Terracotta brick
    0xd4b483, // Faded ochre plaster
    0x7a9a95, // Dusty Dhaka teal
    0xb5ada3, // Weathered concrete
    0xc49792, // Faded dusty rose
    0x9b8c7c  // Warm grey-brown
  ],

  // Dhaka Vehicles & Roadside Obstacle Colors
  cngGreen: 0x2e7d32,
  cngCanopy: 0x1c1e1f,
  metalSilver: 0xb0bec5,
  tireBlack: 0x1a1a1a,
  rickshawHood: 0xd81b60,
  rickshawYellow: 0xfbc02d,
  rickshawBlue: 0x1e88e5,
  busBodyRed: 0xb74134,
  busStripeGreen: 0x2e6b4e,
  headlightWarm: 0xfff59d,
  woodBrown: 0x6d4c41,
  bambooTan: 0xc8a165,
  tarpBlue: 0x1976d2,
  tarpOrange: 0xf57c00,
  dmpBlue: 0x0d47a1,
  dmpWhite: 0xf5f5f5
};

const createFlatMat = (color) =>
  new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.88,
    metalness: 0.08
  });

export const SHARED_GEOMETRIES = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 8),
  wheelCylinder: new THREE.CylinderGeometry(1, 1, 1, 10)
};

export const SHARED_MATERIALS = {
  asphalt: createFlatMat(PALETTE.asphalt),
  potholeDark: createFlatMat(PALETTE.potholeDark),
  potholeMud: createFlatMat(PALETTE.potholeMud),
  laneLine: createFlatMat(PALETTE.laneLine),
  footpath: createFlatMat(PALETTE.footpath),
  kerbLight: createFlatMat(PALETTE.kerbLight),
  kerbDark: createFlatMat(PALETTE.kerbDark),
  windowStrip: createFlatMat(PALETTE.windowStrip),
  waterTank: createFlatMat(PALETTE.waterTank),
  buildings: PALETTE.buildings.map((hex) => createFlatMat(hex)),
  cngGreen: createFlatMat(PALETTE.cngGreen),
  cngCanopy: createFlatMat(PALETTE.cngCanopy),
  metalSilver: createFlatMat(PALETTE.metalSilver),
  tireBlack: createFlatMat(PALETTE.tireBlack),
  rickshawHood: createFlatMat(PALETTE.rickshawHood),
  rickshawYellow: createFlatMat(PALETTE.rickshawYellow),
  rickshawBlue: createFlatMat(PALETTE.rickshawBlue),
  busBodyRed: createFlatMat(PALETTE.busBodyRed),
  busStripeGreen: createFlatMat(PALETTE.busStripeGreen),
  headlightWarm: createFlatMat(PALETTE.headlightWarm),
  woodBrown: createFlatMat(PALETTE.woodBrown),
  bambooTan: createFlatMat(PALETTE.bambooTan),
  tarpBlue: createFlatMat(PALETTE.tarpBlue),
  tarpOrange: createFlatMat(PALETTE.tarpOrange),
  dmpBlue: createFlatMat(PALETTE.dmpBlue),
  dmpWhite: createFlatMat(PALETTE.dmpWhite)
};

export function makeBox(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(SHARED_GEOMETRIES.box, material);
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y + h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function makeWheel(radius, thickness, x, y, z) {
  const wheel = new THREE.Mesh(SHARED_GEOMETRIES.wheelCylinder, SHARED_MATERIALS.tireBlack);
  wheel.rotation.z = Math.PI / 2;
  wheel.scale.set(radius * 2, thickness, radius * 2);
  wheel.position.set(x, y, z);
  wheel.castShadow = true;
  return wheel;
}
