# AGENTS.md

Arithmusic is a web synth where you write math expressions as frequency functions of time (e.g. `440 + 100 * x`), arrange them on a multi-track timeline, and play them back.

## Dev environment

Runs directly on WSL. Bun is the package manager (`bun.lock`); use `bun`/`bunx` rather than npm/npx.

- Dev server: `bun run dev` → http://localhost:5173/arithmusic/ (note the `/arithmusic/` base path)
- Typecheck: `bun run typecheck` (a hook in `.claude/settings.json` also runs it after every `.ts`/`.tsx` edit)
- Build: `bun run build`

## UI design

The UI is a physical graphing calculator: a monochrome grey LCD (graph + Y= segment editor) above plastic keys and a timeline deck. **Read `.agents/design-system.md` before UI work** — it holds the palette, key styles, LCD rules and layout. Key styling lives in unlayered CSS in `src/index.css` on purpose, so it beats Tailwind utilities.

## The `.agents/` folder

Agent working material. Everything directly in `.agents/` is committed and meant to be referenced long-term:

- `design-system.md` — the UI spec. Update it when a design decision changes.
- `ux-audit-2026-02-16.md` — simulated user-testing findings. Check it before building features; the README table tracks their status.

Two subfolders are gitignored, local to this machine:

- `.agents/context/` — reference material the user drops in (reference photos, sketches, pasted docs). Read freely; don't delete.
- `.agents/scratch/` — throwaway work: HTML mockups, screenshots, experiments. Put generated mockups here. Mockups can load the app fonts from `../../public/fonts/`.

When something in scratch turns into a lasting decision, write it into a committed doc (usually `design-system.md`) instead of promoting the scratch file.

## Architecture

- **State:** reducer + React Context in `src/context/CompositionContext.tsx` (`useComposition()` → `{ state, dispatch }`). Also holds validation and JSON import/export.
- **Playback:** `App.tsx` validates the composition, synthesizes a `Float32Array` with the WASM engine (`web-assembly/pkg/`, loaded via dynamic `import('synthesis')`), and plays it through an `AudioBuffer`. If WASM fails to load it falls back to the JS port in `src/lib/synthesize.ts`. Keep the two implementations in sync.
- **WASM engine:** Rust in `web-assembly/`, wasm-bindgen 0.2.46 (old format), prebuilt into `web-assembly/pkg/`. Rust parses expressions with `meval`; the JS fallback uses `mathjs`.
- **UI stack:** Tailwind v4 + shadcn/ui (`src/components/ui/`, add with `bunx shadcn@latest add <name>`), `@hello-pangea/dnd` for drag-and-drop, KaTeX for math, visx for the graph.

## Known bugs

- Aliasing artifacts on triangle and sawtooth waves
- In dev the WASM module fails to load and playback uses the JS fallback
- Graph resets and lags when the editor re-renders
