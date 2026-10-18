import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TILE_TYPES, OBSTACLE_TYPES } from './assetRegistry.js';
import { createTile, snapTileToSocket } from './createTile.js';
import { createObstacle, placeObstacleInLane } from './createObstacle.js';

function SocketOverlay({ tile }) {
  const { sockets } = tile.userData;
  return (
    <group position={[tile.position.x, 0.25, tile.position.z]}>
      {Object.values(sockets).map((s) => (
        <mesh key={s.dir} position={[s.position.x, 0, s.position.z]}>
          {s.open ? (
            <sphereGeometry args={[0.28, 10, 10]} />
          ) : (
            <boxGeometry args={[0.36, 0.36, 0.36]} />
          )}
          <meshBasicMaterial color={s.open ? '#00e676' : '#ff1744'} />
        </mesh>
      ))}
    </group>
  );
}

function Box3Overlay({ obs }) {
  const { dimensions, centerOffset } = obs.userData;
  return (
    <group position={obs.position} rotation={obs.rotation}>
      <mesh position={[centerOffset.x, centerOffset.y, centerOffset.z]}>
        <boxGeometry args={[dimensions.x, dimensions.y, dimensions.z]} />
        <meshBasicMaterial color="#ffea00" wireframe />
      </mesh>
    </group>
  );
}

export default function DebugScene() {
  const [showSockets, setShowSockets] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);

  const { allTiles, obstacles } = useMemo(() => {
    // 1. Catalog Row: Every Tile Type (3) x Every Rotation (4) = 12 Tiles at z = -18
    const row = [];
    [TILE_TYPES.Straight, TILE_TYPES.Turn90, TILE_TYPES.TJunction].forEach((t, ti) => {
      for (let r = 0; r < 4; r++) {
        const tile = createTile(t, r);
        tile.position.set(((ti * 4 + r) - 5.5) * 12.5, 0, -18);
        row.push(tile);
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

    // 3. All 5 Dhaka Obstacles Placed in Lane Slots (-2, 0, +2)
    const obs = [
      placeObstacleInLane(createObstacle(OBSTACLE_TYPES.Rickshaw), -2, 11, 0),
      placeObstacleInLane(createObstacle(OBSTACLE_TYPES.CNG), 0, 3, 0),
      placeObstacleInLane(createObstacle(OBSTACLE_TYPES.BarrierPothole), 2, -2, 0),
      placeObstacleInLane(createObstacle(OBSTACLE_TYPES.Bus), 10, -12, Math.PI / 2),
      placeObstacleInLane(createObstacle(OBSTACLE_TYPES.MarketStall), 22, -6, 0),
    ];

    return { allTiles: [...row, t0, t1, t2, t3, t4, t5, t6], obstacles: obs };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setShowSockets(!showSockets)}
          style={{
            padding: '6px 12px',
            background: showSockets ? '#00e676' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Sockets: {showSockets ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setShowBoxes(!showBoxes)}
          style={{
            padding: '6px 12px',
            background: showBoxes ? '#ffea00' : '#333',
            color: showBoxes ? '#000' : '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Box3: {showBoxes ? 'ON' : 'OFF'}
        </button>
      </div>
      <Canvas camera={{ position: [0, 25, 35], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 30, 20]} intensity={1.2} castShadow />
        <OrbitControls />
        {allTiles.map((tile, i) => (
          <group key={i}>
            <primitive object={tile} />
            {showSockets && <SocketOverlay tile={tile} />}
          </group>
        ))}
        {obstacles.map((obs, i) => (
          <group key={i}>
            <primitive object={obs} />
            {showBoxes && <Box3Overlay obs={obs} />}
          </group>
        ))}
      </Canvas>
    </div>
  );
}
