# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev` - Starts Vite dev server with hot reload
- **Build**: `pnpm build` - Runs TypeScript compiler then Vite build
- **Preview**: `pnpm serve` - Preview production build locally

## Architecture

This is a 2D canvas game demo showcasing neon visual effects using HTML5 Canvas.

### Game Loop
The main game loop in `src/main.ts` uses a fixed timestep pattern (1/60s) with `requestAnimationFrame`. The loop accumulates delta time and processes physics updates at a consistent rate while rendering at the browser's refresh rate.

### Key Libraries
- **Vite** - Build tooling and dev server
- **Contro** - Keyboard input handling (`Keyboard` class)
- **Tweakpane** - Debug UI panel with real-time monitors

### Code Structure
- `src/main.ts` - Entry point, game loop, canvas setup, and entity management
- `src/entities/` - Game entities (Player, Bullet) with `update(dt)` and `draw(ctx)` methods
- `src/lib/` - Utilities: `Vector2` class, `getResolution` for scaling, `getRandom` helper

### Rendering
Uses `globalCompositeOperation = 'lighter'` for additive blending (neon glow effect). Entities are drawn with two passes: a white base layer at lower alpha, then a colored overlay at higher alpha, combined with `shadowBlur` for the glow.

### Resolution Scaling
Canvas maintains 1280x720 base resolution and scales to fit the window using CSS transforms. The `getResolution` function calculates integer scale factors to preserve pixel-perfect rendering.
