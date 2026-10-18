import * as THREE from 'three';
import { TILE_TYPES, OBSTACLE_TYPES } from './assetRegistry.js';
import { createTile, snapTileToSocket } from './createTile.js';
import { createObstacle, placeObstacleInLane } from './createObstacle.js';

export function initDebugViewer(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 30, 40);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(20, 40, 20);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // 1. Catalog Row: Every Tile Type (3) x Every Rotation (4) = 12 Tiles at z = -18
  const allTiles = [];
  [TILE_TYPES.Straight, TILE_TYPES.Turn90, TILE_TYPES.TJunction].forEach((t, ti) => {
    for (let r = 0; r < 4; r++) {
      const tile = createTile(t, r);
      tile.position.set(((ti * 4 + r) - 5.5) * 12.5, 0, -18);
      scene.add(tile);
      allTiles.push(tile);
    }
  });

  // 2. Socket-Snapped Dhaka Test Route
  const t0 = createTile(TILE_TYPES.Straight, 0);
  t0.position.set(0, 0, 10);
  const t1 = snapTileToSocket(t0, 'N', createTile(TILE_TYPES.Straight, 0));
  const t2 = snapTileToSocket(t1, 'N', createTile(TILE_TYPES.Turn90, 1));
  const t3 = snapTileToSocket(t2, 'E', createTile(TILE_TYPES.Straight, 1));
  const t4 = snapTileToSocket(t3, 'E', createTile(TILE_TYPES.TJunction, 0));
  const t5 = snapTileToSocket(t4, 'N', createTile(TILE_TYPES.Straight, 0));
  const t6 = snapTileToSocket(t4, 'E', createTile(TILE_TYPES.Turn90, 3));
  [t0, t1, t2, t3, t4, t5, t6].forEach((tile) => {
    scene.add(tile);
    allTiles.push(tile);
  });

  // 3. All 5 Dhaka Obstacles Placed in Lane Slots (-2, 0, +2)
  const obstacles = [
    placeObstacleInLane(createObstacle(OBSTACLE_TYPES.Rickshaw), -2, 11, 0),
    placeObstacleInLane(createObstacle(OBSTACLE_TYPES.CNG), 0, 3, 0),
    placeObstacleInLane(createObstacle(OBSTACLE_TYPES.BarrierPothole), 2, -2, 0),
    placeObstacleInLane(createObstacle(OBSTACLE_TYPES.Bus), 10, -12, Math.PI / 2),
    placeObstacleInLane(createObstacle(OBSTACLE_TYPES.MarketStall), 22, -6, 0),
  ];
  obstacles.forEach((obs) => scene.add(obs));

  // Overlays
  const socketOverlays = [];
  const boxOverlays = [];

  const sphereGeo = new THREE.SphereGeometry(0.28, 10, 10);
  const boxGeo = new THREE.BoxGeometry(0.36, 0.36, 0.36);
  const openMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
  const closedMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xffea00, wireframe: true });

  allTiles.forEach((tile) => {
    const { sockets } = tile.userData;
    const socketGroup = new THREE.Group();
    socketGroup.position.set(tile.position.x, 0.25, tile.position.z);
    Object.values(sockets).forEach((s) => {
      const mesh = new THREE.Mesh(s.open ? sphereGeo : boxGeo, s.open ? openMat : closedMat);
      mesh.position.set(s.position.x, 0, s.position.z);
      socketGroup.add(mesh);
    });
    scene.add(socketGroup);
    socketOverlays.push(socketGroup);
  });

  obstacles.forEach((obs) => {
    const { dimensions, centerOffset } = obs.userData;
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z), wireMat);
    boxMesh.position.set(obs.position.x + centerOffset.x, obs.position.y + centerOffset.y, obs.position.z + centerOffset.z);
    boxMesh.rotation.copy(obs.rotation);
    scene.add(boxMesh);
    boxOverlays.push(boxMesh);
  });

  let showSockets = true;
  let showBoxes = true;

  function toggleSockets() {
    showSockets = !showSockets;
    socketOverlays.forEach((o) => (o.visible = showSockets));
    return showSockets;
  }

  function toggleBoxes() {
    showBoxes = !showBoxes;
    boxOverlays.forEach((b) => (b.visible = showBoxes));
    return showBoxes;
  }

  // Interactive mouse drag orbit controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let spherical = { radius: 55, theta: 0.3, phi: 1.05 };

  function updateCamera() {
    camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta) + 5;
    camera.position.y = spherical.radius * Math.cos(spherical.phi);
    camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta) - 5;
    camera.lookAt(5, 0, -5);
  }
  updateCamera();

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    spherical.theta -= deltaX * 0.008;
    spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
    previousMousePosition = { x: e.clientX, y: e.clientY };
    updateCamera();
  });

  container.addEventListener('wheel', (e) => {
    spherical.radius = Math.max(10, Math.min(140, spherical.radius + e.deltaY * 0.05));
    updateCamera();
  });

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return { toggleSockets, toggleBoxes, allTiles, obstacles };
}
