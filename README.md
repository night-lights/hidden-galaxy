# Hidden Galaxy

> *Every codebase is a galaxy. Dependencies are gravitational relationships. Packages are celestial bodies.*

**Hidden Galaxy** is a 3D interactive visualization of code dependencies as a cosmic solar system. Explore npm packages and GitHub repositories as glowing spheres floating in space, connected by light trails that reveal the invisible architecture holding software together.

*Screenshot/demo GIF coming soon*

---

## Why This Exists

Dependencies are the invisible fabric of modern software. We declare them, we update them, we occasionally break them—but we rarely *see* them. They're abstract relationships we feel in stack traces and build failures, but never experience as tangible, spatial things.

**Hidden Galaxy makes dependency graphs visible, beautiful, and explorable.**

This isn't a debugging tool or an optimization utility. It's an art piece that asks: *What if we could walk through our code like astronomers navigating the cosmos?* What patterns would emerge? What beauty would we find in the structure itself?

---

## What It Is

Hidden Galaxy transforms code dependencies into a 3D cosmic visualization where:

- **Packages are glowing spheres** - Size represents importance (downloads, stars, dependents)
- **Dependencies are light trails** - Connecting packages through gravitational relationships
- **Colors indicate categories** - Package type, depth in the dependency tree, or ecosystem
- **Space reveals structure** - Layout algorithms position packages based on their relationships

This project is part of the **Night Lights** series—a collection of art explorations that approach code through beauty rather than utility. The goal isn't to ship faster or debug better. The goal is to *see code differently*.

**Philosophy**: Beauty first, performance second, everything else third.

---

## Quick Start

Get running in under 5 minutes:

```bash
git clone https://github.com/night-lights/hidden-galaxy.git
cd hidden-galaxy
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore your first galaxy.

**Requirements:**
- Node.js >= 18.0.0
- pnpm >= 9.0.0

**Optional:**
- GitHub personal access token (for higher API rate limits)

---

## Tech Stack

Hidden Galaxy is built with modern web technologies optimized for 60fps 3D performance:

**Core Framework:**
- **Next.js 15** - App Router with React Server Components
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict mode for type safety

**3D Rendering:**
- **React Three Fiber v9** - Declarative Three.js in React
- **Three.js r163+** - WebGL rendering engine
- **@react-three/drei** - Useful helpers and abstractions
- **@react-three/postprocessing** - Bloom effects and visual polish

**State & Data:**
- **Zustand** - Lightweight client state management
- **TanStack Query** - Server state with caching
- **GitHub GraphQL API** - Real dependency data from repositories
- **npm Registry API** - Package metadata and statistics

**Styling & Tools:**
- **Tailwind CSS** - Utility-first styling
- **pnpm** - Fast, efficient package manager
- **Vercel** - Deployment platform

---

## Project Structure

```
hidden-galaxy/
├── app/
│   ├── page.tsx              # Entry point (Server Component)
│   └── layout.tsx            # Root layout
├── src/
│   ├── components/
│   │   ├── canvas/           # 3D React Three Fiber components
│   │   │   ├── GalaxyScene.tsx
│   │   │   ├── PackageSphere.tsx
│   │   │   ├── DependencyLines.tsx
│   │   │   └── CameraRig.tsx
│   │   ├── dom/              # HTML overlays (search, info panels)
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── api/              # GitHub GraphQL & npm API clients
│   │   ├── three/            # Layout algorithms, shaders, geometry
│   │   ├── hooks/            # React hooks for data fetching
│   │   └── utils.ts
│   ├── stores/               # Zustand state management
│   └── types/                # TypeScript type definitions
├── public/
│   └── textures/             # Particle textures, noise maps
└── package.json
```

**Current Status**: Boilerplate complete, 3D visualization features in active development.

---

## How to Remix

Hidden Galaxy is designed to be customized and remixed. Here are common starting points:

### Visualize a Different Repository

Change the target repository in your data fetching logic:

```typescript
// Modify the GraphQL query to point at any GitHub repo
const data = await fetchDependencyGraph('facebook', 'react')
```

### Customize Visual Appearance

**Change colors:**
```typescript
// Modify sphere materials in src/components/canvas/PackageSphere.tsx
<meshStandardMaterial
  emissive="#00ffff"  // Change to your preferred color
  emissiveIntensity={2.0}
/>
```

**Adjust glow intensity:**
```typescript
// Modify bloom settings in src/components/canvas/GalaxyScene.tsx
<Bloom
  luminanceThreshold={0.9}
  intensity={1.5}  // Increase for more glow
/>
```

### Modify Layout Algorithm

The spatial arrangement of packages is controlled by layout algorithms in `src/lib/three/layout.ts`:

- **Hierarchical layout** - Packages arranged in concentric rings by dependency depth
- **Force-directed layout** - Organic positioning using physics simulation (d3-force-3d)

Switch algorithms or tune parameters to create different visual structures.

### Add New Visual Effects

React Three Fiber makes it easy to add:
- Particle systems for ambient space dust
- Animated camera paths
- Custom shaders for unique materials
- Interactive hover states and click handlers

---

## Documentation

### Additional Commands

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Production build
pnpm build

# Clean rebuild
rm -rf .next node_modules && pnpm install
```

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

Hidden Galaxy is open source and free to use, modify, and remix. We encourage you to create your own variations and share them with the community.

---

## Part of Night Lights

Hidden Galaxy is part of the **Night Lights** series—a collection of art projects exploring code through beauty rather than utility.

**The series asks:** What if we approached software as artists instead of engineers? What beauty exists in the structures we build every day? What emerges when we optimize for wonder instead of productivity?

Other projects in the series: *Coming soon*

---

**Built with curiosity. Designed for beauty. Made for exploration.**

*Questions, ideas, or just want to share what you built? Open an issue or reach out.*
