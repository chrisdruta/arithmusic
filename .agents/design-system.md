# Arithmusic Design System

## Intent

**Who:** A curious tinkerer at the intersection of math and music. Someone who opens a graphing calculator for fun, hears a sine wave and thinks "what if I add harmonics?" Late night, headphones on, exploring.

**Task:** Write mathematical expressions that become sound. Arrange them into tracks. Hit play and hear the math. Tweak, re-listen, iterate.

**Feel:** A **TI-92 landscape graphing calculator** — the dark injection-molded shell, a reflective grey-green LCD, chunky raised plastic keys with legends printed above them. Not retro as decoration — retro as *instrument*. The kind of object that felt powerful in your hands. The landscape orientation, the dominant LCD screen, the function key strip along the side. One physical object, not a collection of floating panels.

## Direction

**Domain:** Graphing calculators (TI-92 II, Casio fx-6300G), reflective LCDs, printed key legends
**Metaphor:** The entire app is one physical calculator sitting on a muted desk. A glossy black bezel holds the brand and the **one** LCD. Blue F-keys angle down the left side, a key cluster with a cursor pad sits on the right, and the timeline is the keypad deck along the bottom.
**Signature elements:** Reflective grey-green LCD with dark pixels and a pixel grid; monochrome traces told apart by line style; raised keys in color families with yellow/teal 2nd-function legends; a TI-style status line; the `2nd` modifier.

Reference photos (local only, may be missing): `.agents/context/TI-92-II_1.jpg`, `.agents/context/casio_fx-6300g.jpg`. The green-phosphor vs grey-LCD comparison that picked this direction was committed as `.interface-design/mockups/lcd-variants.html` in `50f2710`.

---

## Responsive Scaling

The UI scales proportionally across display resolutions via a responsive root font-size:

```css
html {
  font-size: clamp(16px, 0.75vw, 22px);
}
```

| Resolution | Viewport width | Root font-size | Scale |
|------------|---------------|----------------|-------|
| 1080p | 1920px | 16px | 1× (base) |
| 1440p | 2560px | 19.2px | 1.2× |
| 4K | 3840px | 22px | 1.375× (cap) |

**Principle:** Use standard Tailwind classes (`text-xs`, `text-sm`, `text-base`, etc.) which are rem-based. Avoid hardcoded `text-[Npx]` values — they bypass the scaling system. The only px values should be decorative (borders, border-radius tokens, scanline patterns).

SVG elements (graph axes, margins) don't respond to CSS font-size, so the `Chart` component reads `getComputedStyle(document.documentElement).fontSize` and computes margin/font values as multiples of `rem`.

LCD slider thumb and track sizes use rem units in `index.css` so they scale with the root.

---

## Palette

All tokens live in `@theme inline` in `src/index.css`.

### Shell (plastic)
| Token / value | Role |
|---|---|
| `#2f2b38` | Desk behind the calculator (`bg-[#2f2b38]` on the root div) |
| `.calc-body` `#3b3d42 → #303236` | Injection-molded body, `rounded-[2.25rem]`, heavy desk shadow |
| `.calc-bezel` `#121316 → #070708` | Glossy black screen surround with a diagonal sheen |
| `.calc-deck` `#45484e → #3b3e43` | Keypad deck; inset top shadow so it reads as lower than the screen half |
| `.name-plate` `#2a2c30` | Recessed label plates (track names) |
| `foreground` `#d9dbdf`, `muted-foreground` `#9da1a8` | Text on plastic |

### LCD (monochrome)
| Token | Hex | Role |
|---|---|---|
| `lcd-bg` | `#bac4a6` | Flat LCD color (popups, legend fills, slider gaps). `.lcd-screen` uses a `#c9d1b6 → #aab595` gradient |
| `lcd-ink` | `#1b2317` | Pixels: all text, traces, axes, inverted bars |
| `lcd-dim` | `#5c6851` | Secondary text: row labels, hints, axis titles |
| `lcd-grid` | `#a7b192` | Graph gridlines |

**The LCD never shows color.** Emphasis comes from inverting (`.lcd-inverse`), line weight, dimming, and dash patterns.

### Printed legends
| Token | Hex | Role |
|---|---|---|
| `legend` | `#e9c84a` | 2nd-function legends above keys, `2nd` key ring, focus outline, latched toggle text |
| `legend-alt` | `#4fd1b5` | Secondary printed ink: F4/F5, INSERT legends, timeline ruler |

### Track identity
| Track | Color (`track-N`) | Line style (`trackDash`) |
|---|---|---|
| 1 | `#46ff7a` | solid |
| 2 | `#ffb547` | `8 4` dashed |
| 3 | `#4fd6ff` | `2 4` dotted |
| 4 | `#ff6a5c` | `12 4 3 4` dash-dot |

Helpers in `src/lib/track-style.ts`. Colors appear **only off-screen**: timeline LEDs and the stripe on segment keys. On the LCD (graph traces, legend) and on the name plates, tracks are identified by line style.

---

## Typography

| Role | Font | Notes |
|---|---|---|
| LCD (everything on screen, KaTeX output) | `TICELarge` (`font-lcd`) → VT323 | Local `/fonts/TICELarge.ttf` |
| Keys, legends, printed labels | `Helvetica Neue` / Arial bold (`font-button`) | Uppercase on keys via `Key`; legends `0.5625rem` with wide tracking |
| Brand | Georgia small-caps "Arithmusic" + bold italic "fx-AM1" | Mirrors "Texas Instruments / TI-92 II" |
| Body fallback (modals) | Share Tech Mono (`font-sans`) | |

Printed legends sit below `text-xs`, so they use rem-based arbitrary sizes (`text-[0.5625rem]`, `text-[0.625rem]`), which still scale with the root font-size.

---

## Keys

Key styling is plain CSS in `index.css` (`.key`, `.key-blue`, `.key-red`, `.key-grey`, `.key-second`, `.key-chip`, `.key-doomed`, `.key-legend`). **These rules are unlayered on purpose:** unlayered CSS beats Tailwind's layered utilities, so shadcn size/variant classes (`rounded-sm`, `bg-*`, `shadow-*`) can't flatten a key. Text color and sizing are left to utilities.

| Button / Toggle variant | Key | Used for |
|---|---|---|
| `calc` | blue | Play, Pause, modal primary actions |
| `calc-accent` | red | Stop |
| `calc-secondary` | black | Most keys: UNDO, MODE, HELP, LOAD, SAVE, DEL, track keys, menus |
| `calc-grey` | grey | Number-key style (segment keys use the raw `key key-grey key-chip` classes) |
| `calc-second` | black + yellow ring | `2nd` |
| Toggle `calc` | black | Wave picker, MUTE |

**Pressed state:** `:active`, `[data-state=on]` and `[aria-pressed=true]` all drop the key 2px and collapse the shadow. Use `aria-pressed` for latched keys (TIME/BEAT, `2nd`, the open insert menu, the selected segment).

**Legends:** `<Key legend="REDO" legendTone="yellow|teal">` (`components/ui/key.tsx`) prints a legend above the key. Leave about `1.75rem` of row gap wherever keys with legends stack. Legends must be honest: yellow means "the 2nd function of this key", teal is a category label (INSERT) or an F-number.

---

## The `2nd` modifier

`2nd` latches (yellow, pressed, and `2ND` inverted in the status line) until the next modifier-aware key consumes it:
- `2nd` + UNDO → Redo
- `2nd` + cursor ◀/▶ → move the selected segment left/right

Add new 2nd functions by printing the legend on the key and handling `second` in `App.tsx`.

---

## LCD

`.lcd-screen` is a grid: graph | Y= editor on top, a status line spanning the bottom.

### Graph
- Visx SVG, transparent background (the screen gradient shows through)
- Traces in `lcd-ink` with `trackDash(row)`: selected track `strokeWidth 2.5`, others `1.75` at `0.55` opacity
- Axes `lcd-ink` `strokeWidth 2`, titles `t (s)` / `f (kHz)` in `lcd-dim`
- Legend: dash swatch + title, `lcd-bg` fill, `lcd-dim` border
- Playhead: dotted `2 3` ink line with a small triangle at the top. No glow.

### Y= editor (`SegmentPanel` / `EditorPanel`)
- Inverted title bar `Y= SEGMENT` with `col/n`
- Rows via `LcdRow` (`components/editor/lcd-row.tsx`): dim label column (`w-14`), then the value. Rows: TITLE, `y{row+1}(x)=`, LEN + bar slider, VOL + bar slider, dashed rule, OUTPUT (KaTeX, `text-2xl`)
- Inputs: `surface="lcd"` (transparent, dashed underline, solid when focused)
- Sliders: `.lcd-slider`, a segmented pixel bar. Set `--pct` inline to fill it
- Errors: `LcdError`, an inverted `ERR` tag + message. Hints: `LcdHint`
- Equation syntax: operators and parens dimmed, everything else ink. The `?` box opens an `.lcd-popup` cheat sheet with inverted section tags

### Status line
`MAIN`/`2ND` · `TIME`/`BEAT` · `TRK r/n` · wave · `MUTE` (if muted) · right-aligned `▶/■ t / total`. Cells are separated by `border-lcd-ink/30` rules.

### Pop-ups
Menus and reference cards drawn "on the screen" use `.lcd-popup` (ink border, `lcd-bg`, LCD font). Hovered/dragged rows invert. Only use it for things that come from the screen. Anything opened from the plastic deck stays plastic.

### INSERT parts tray
The INSERT keys open a `.parts-tray`: a recessed plastic bin that holds grey `key-grey` chips. These are the same object as timeline segments, minus the track stripe. Each chip shows its title, with the expression underneath in small mono. Each chip sits in its own `.tray-slot`, which is a separate one-item `Droppable`. That way, picking a chip up leaves an empty slot and the rest of the tray doesn't reflow. A lifted chip gets `key-lifted` and tilts slightly. Notes and functions use 3 columns; patterns use 2, because their names are longer.

---

## Layout

```
┌ desk p-4 ──────────────────────────────────────────────────────────────┐
│ ┌ calc-body rounded-[2.25rem] px-8 ─────────────────────────────────┐  │
│ │▓ ┌F-keys┐ ┌ calc-bezel ──────────────────────────────┐ ┌cluster┐ ▓│  │
│ │▓ │F1  F2│ │ Arithmusic  TAGLINE                fx-AM1 │ │2nd UND│ ▓│  │
│ │▓ │[▶][❚❚]│ │ ┌ lcd-screen ─────────────┬────────────┐ │ │MODE HL│ ▓│  │
│ │▓ │[ STOP]│ │ │ graph                   │ Y= SEGMENT │ │ │LOAD SV│ ▓│  │
│ │▓ │DOMAIN│ │ │                         │ TITLE …    │ │ │ (pad) │ ▓│  │
│ │▓ │[TIME]│ │ ├─────────────────────────┴────────────┤ │ │ [DEL] │ ▓│  │
│ │▓ │[BEAT]│ │ │ MAIN│TIME│TRK 1/3│SINE      ■ 0s/2.8s │ │ └───────┘ ▓│  │
│ │▓ └──────┘ └──────────────────────────────────────────┘           ▓│  │
│ ├ calc-deck ────────────────────────────────────────────────────────┤  │
│ │ TIMELINE [TRACK+] │ [NOTES▾][FUNCTIONS▾][PATTERNS▾]                │  │
│ │                     0s     0.5s     1s     1.5s  (teal ruler)      │  │
│ │ ● [−] [── AM ARPEGGIO] [∿] [MUTE] [A4][C5][E5][G5][  A5  ]… [+]    │  │
│ └───────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

| Zone | Sizing |
|---|---|
| Upper half | `flex-[5]`, `items-center gap-6 py-5` |
| F-key strip | `w-32`, 2-col grid, keys rotated `-4deg` |
| Bezel / LCD | `flex-1`; LCD columns `1fr 19rem` |
| Key cluster | `w-48`, 2-col grid |
| Deck | `flex-[2]`, `-mx-8` to span the body |
| Grips | absolute `w-3`, `top/bottom-[12%]` |

### Timeline (deck)
- Track row: LED (track color, lit when the row is selected) · `−` key · name plate (dash swatch + inline input) · wave key · MUTE toggle · segment keys · `+` key
- Segment keys: `key key-grey key-chip` divs inside `@hello-pangea/dnd`, `flexGrow` proportional to length in ms, `minWidth 3rem`, and a trailing spacer so all tracks share one time scale. Spread `provided.draggableProps.style` **after** custom styles. Selected segment = `aria-pressed` (pressed + track-color ring).
- Ruler: teal printed ticks. Left offset measured from the first row's header via `ResizeObserver`.

**Tick intervals:** Adaptive based on total composition duration (`maxTotalMs`). `getTickConfig()` returns `{ major, minor }` intervals:
| Total duration | Major | Minor |
|---------------|-------|-------|
| ≤ 500ms | 100ms | 50ms |
| ≤ 1.5s | 500ms | 250ms |
| ≤ 3s | 500ms | 250ms |
| ≤ 6s | 1s | 500ms |
| ≤ 15s | 2s | 1s |
| ≤ 30s | 5s | 2.5s |
| ≤ 60s | 10s | 5s |
| > 60s | 30s | 10s |

**Major ticks:** Labeled + taller line (`h-1.5 bg-muted-foreground/30`). Labels in `text-xs text-muted-foreground/40`. Format: `0s`, `0.5s`, `1s`, etc.
**Minor ticks:** Unlabeled shorter line (`h-1 bg-muted-foreground/15`).

---

## Undo / Redo

### Scope

Undo/redo covers **structural composition changes** only — operations that alter the shape of the timeline. Text field edits (`TRACK_DATA_CHANGE`, `TRACK_OPTION_CHANGE`, `SETTINGS_CHANGE`) are excluded and rely on native browser undo (Ctrl+Z within inputs).

**Undoable actions:** `DELETE_SEGMENT`, `ADD_SEGMENT`, `INSERT_SEGMENT`, `SEGMENT_REARRANGE`, `SEGMENT_MOVE_CROSS_TRACK`, `ADD_TRACK`, `DELETE_TRACK`, `LOAD_COMPOSITION`.

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `↑` `↓` | Select previous / next track |
| `←` `→` | Select previous / next segment |
| `Shift+←` `Shift+→` | Move the selected segment within its track |
| UNDO key / `2nd` + UNDO | Undo / Redo |

All shortcuts are **suppressed when focus is in `<input>`, `<textarea>`, or `contentEditable`** — this is the boundary that prevents conflation with text-level undo.

### Snapshot

Each undo entry captures `timelines`, `selectedSegment`, and `nextId`. UI-ephemeral state (`showingModals`, `compositionErrors`, `settings`, `revision`) is preserved as-is on restore — undoing won't close a dialog or revert settings.

### Implementation

Dispatch wrapper in `CompositionProvider` intercepts `UNDO`/`REDO` actions before they reach the reducer. Stacks stored in `useRef` (no re-renders on push/pop). Max depth: 50 entries (FIFO eviction). A new undoable action clears the redo stack.

### Deletion UX

Segment deletion has two input paths, both feeding the same `DELETE_SEGMENT` action (which is undoable):

1. **Drag-to-delete:** Drag a segment key outside all track droppables. Visual feedback: the key turns red (`key-doomed`) when `snapshot.draggingOver == null`. Deletion fires on drop.
2. **Keyboard:** `Delete` / `Backspace` removes the selected segment. Suppressed when focus is in text fields.
3. **DEL key** in the right key cluster.

No confirmation dialog — undo via Ctrl+Z is the recovery path.

---

## shadcn/ui Conventions

- **Variants over className.** Repeated style patterns become cva variants (or unlayered key classes for physical keys), not `className` overrides.
- **Use `Button`/`Key`** for clickable things. Exceptions: the cursor pad's four hit areas (parts of one composite control) and Radix primitive triggers.
- **Custom CSS lives in `index.css` only when Tailwind can't express it:** key physics, vendor-prefixed sliders, pseudo-element overlays, `.katex` overrides.
- **Strip `dark:` classes** and `"use client"` from newly added shadcn components.
- **Use rem-based sizes.** Standard Tailwind sizes where possible; rem arbitrary values for sub-`xs` printed text.

---

## Rules

1. **One screen.** Everything that is "display" lives on the single LCD. Plastic is never styled to look like a screen.
2. **The LCD is monochrome.** Ink on grey-green. Use inversion, dimming, weight and dash patterns for emphasis, never color.
3. **Color lives on the plastic.** Key families (blue/red/black/grey), yellow/teal legends, track LEDs.
4. **Clickable = physical key.** Raised with a hard bottom shadow; pressed = translateY(2px) + collapsed shadow.
5. **Legends are honest.** Only print a yellow legend when the key really does that with `2nd`.
6. **Shadows serve physics.** Raised key, recessed screen and deck, device on desk. No glows on the LCD.
7. **Track identity = line style on screen, color off screen.** Keep `trackDash` and `trackColor` in sync.
8. **Labels on plastic are ALL CAPS** bold sans; labels on the LCD are TI font.
9. **Transitions are fast.** ~60–75ms for presses, 150–200ms for popups.
10. **Permanently dark plastic.** No theme toggle; it's an object, not a website.
11. **Sizes scale with the root font-size.** No hardcoded px for text, spacing or hit targets (hairline borders/shadows excepted).

---

## UX Audit

Simulated user testing results are tracked in `.agents/ux-audit-2026-02-16.md`. Consult it before building new features.
