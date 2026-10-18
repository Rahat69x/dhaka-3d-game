# Dhaka 3D Endless Runner — Cop Daddy 🚓🇧🇩

[![Deploy to GitHub Pages](https://github.com/Rahat69x/dhaka-3d-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/Rahat69x/dhaka-3d-game/actions/workflows/deploy.yml)
[![Live Game](https://img.shields.io/badge/Live_Game-GitHub_Pages-success?style=flat&logo=github)](https://rahat69x.github.io/dhaka-3d-game/)

A high-speed 3D endless runner game set in the metropolitan streets of **Dhaka, Bangladesh**. Built using **Three.js**, **HTML5 Canvas**, and **Vanilla Web Audio**, optimized for both desktop and mobile touch browsers.

🎮 **Live Playable Link:** [https://rahat69x.github.io/dhaka-3d-game/](https://rahat69x.github.io/dhaka-3d-game/)

---

## 🌟 Key Features

- **Procedural Dhaka Tile System with Sockets**:
  - Modular procedural tiles (`Straight`, `90° Turn Left/Right`, `T-Junction`).
  - Formal socket connection points on every tile: `entrySocket`, `exitSocket(s)`, `obstacleSlots`, `coinSlots`, and `powerupSlot`.
  - T-Junction tile with dual branching paths (steer into Left or Right branch with interactive warning).
  - Instanced roadside low-poly Dhaka architecture (multi-story buildings with balconies and rooftop water tanks).
- **Procedural Obstacle Factory**:
  - Centralized `ObstacleFactory` managing procedural low-poly obstacle generation with collision classification:
    - 🛺 **Cycle Rickshaw** (148 tris): Red body, yellow canopy, 3 spoked wheels (Pillar avoidance).
    - 🛺 **CNG Auto Rickshaw** (136 tris): Green chassis (`#15803D`), yellow taxi roof, black roll bars (Pillar avoidance).
    - 🚌 **Local Transit Bus ("Murir Tin")** (164 tris): Classic blue body, yellow identity stripe, roof cargo (Pillar avoidance).
    - 🏪 **Street Market Stall (Tong)** (108 tris): 4 bamboo posts, overhead blue tarp canopy (Slide under!).
    - 🚧 **DMP Police Barricade & Pothole** (96 tris): DMP barricade with reflective white stripes and sunken asphalt pothole (Jump over!).
- **Engine Debug Scene & Live Telemetry**:
  - Interactive debug mode with 3D wireframe socket gizmos (Green for Entry, Cyan for Exits, Red for Hazards, Gold for Coins).
  - Real-time engine telemetry HUD displaying FPS, frame delta, speed, active tiles, obstacles count, draw calls, and vertex/triangle count.
  - Quick toggle button `🐞 DEBUG` and keyboard shortcut `\`.
- **Pursuit Guardian AI**: Cop Daddy (Commander Habib) aggressively pursues the runner, surging into danger distance upon stumbling.
- **Runners & Skins**: Play as **Dr. Araf** (Executive Suit or Rooftop Casual) or **Cop Daddy**.
- **100% Offline Capable**: Zero network calls required during gameplay. Local progress (High Score, Gold Coins) persists across browser sessions via `localStorage`.
- **Mobile Touch Controls**: Full swipe gesture detection (Jump, Slide, Lane Change, 90° Turn) with `touch-action: none` and thumb-friendly floating controls.
- **WebGL Fallback & Loading Screen**: Smooth loading indicator and hardware acceleration detection.

---

## 🕹️ Controls

| Action | Keyboard | Touch / Mobile Swipe |
| :--- | :--- | :--- |
| **Steer Left / Right** | `A` / `D` or `◀` / `▶` | Swipe Left / Right |
| **90° Turn at Junction** | `A` / `D` or `◀` / `▶` at turn prompt | Swipe in turn direction |
| **T-Junction Branch Choice** | `A` / `D` or `◀` / `▶` at T-Junction prompt | Swipe Left or Right |
| **Jump over Barricade** | `W` or `▲` or `Space` | Swipe Up |
| **Slide under Stalls / Dive** | `S` or `▼` | Swipe Down |
| **Activate Power-Up** | `Space` (when meter is full) | Double-Tap screen / Power meter |
| **Toggle Debug Gizmos & HUD**| `\` (Backslash) | Tap `🐞 DEBUG` button |
| **Pause / Resume** | `P` or `Esc` | Floating Pause button (bottom-right) |

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/Rahat69x/dhaka-3d-game.git
cd dhaka-3d-game

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production (outputs to dist/)
npm run build

# 5. Preview production build
npm run preview
```

---

## 🛠️ Architecture & Tech Stack

- **Graphics Engine**: Three.js (r128) WebGL Renderer
- **Audio**: Web Audio API (procedural frequency synthesizers for coins, jumping, sliding, and stumble alerts)
- **Bundler & Build Tool**: Vite 5
- **Deployment**: GitHub Actions -> GitHub Pages (`actions/deploy-pages@v4`)
- **Hosting**: GitHub Pages (`https://rahat69x.github.io/dhaka-3d-game/`)

---

## 📄 License

MIT License. Designed and maintained by Rahat.
