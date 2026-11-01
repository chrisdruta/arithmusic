import { useState, useRef, useCallback, useEffect } from 'react';

import { Play, Pause, Square, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Key } from '@/components/ui/key';
import { Led } from '@/components/ui/led';
import { cn } from '@/lib/utils';

import { CompositionProvider, useComposition, computeErrors, exportCompositionJson } from './context/CompositionContext';
import { SynthesizeComposition } from './lib/synthesize';
import Graph from './components/graph';
import { TimelinePanel, SegmentPanel } from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal, TutorialModal } from './components/modals';

const RANDOM_TAG_LINES = [
  "ARITHMETIC SYNTH",
  "ALGORITHMIC AUDIO",
  "COMPUTED SOUND",
  "SPECTRAL GRAPHICS",
  "FORMULA SYNTH",
  "PARAMETRIC AUDIO",
  "VECTOR SOUND",
  "OSCILLATION ENGINE",
  "SONIC GRAPHICS",
  "NUMERIC AUDIO",
]
const TAG_LINE = RANDOM_TAG_LINES[Math.floor(Math.random() * RANDOM_TAG_LINES.length)]

type DomainMode = 'time' | 'beat';

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

// Blue circular cursor pad (TI-92 style). 2nd + ◀/▶ moves the segment instead.
function CursorPad({ onMove }: { onMove: (dRow: number, dCol: number) => void }) {
  const arrow = 'absolute flex items-center justify-center text-white/80 hover:text-white active:scale-90';
  return (
    <div className="relative mx-auto size-32 rounded-full bg-[radial-gradient(circle_at_40%_35%,#7393e6_0%,#3d5fbf_55%,#2c4894_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-4px_6px_rgba(0,0,0,0.35),0_4px_0_#0b0c0e,0_7px_12px_rgba(0,0,0,0.55)]">
      <div className="absolute inset-[2.1rem] rounded-full bg-[radial-gradient(circle_at_45%_40%,#5576d0,#3655ad)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
      <button className={cn(arrow, 'inset-x-0 top-0 h-[2.1rem]')} onClick={() => onMove(-1, 0)} aria-label="Previous track"><ChevronUp className="size-4" /></button>
      <button className={cn(arrow, 'inset-x-0 bottom-0 h-[2.1rem]')} onClick={() => onMove(1, 0)} aria-label="Next track"><ChevronDown className="size-4" /></button>
      <button className={cn(arrow, 'inset-y-0 left-0 w-[2.1rem]')} onClick={() => onMove(0, -1)} aria-label="Previous segment"><ChevronLeft className="size-4" /></button>
      <button className={cn(arrow, 'inset-y-0 right-0 w-[2.1rem]')} onClick={() => onMove(0, 1)} aria-label="Next segment"><ChevronRight className="size-4" /></button>
    </div>
  );
}

function AppContent() {
  const { state, dispatch } = useComposition();

  const [playbackTime, setPlaybackTime] = useState<number | null>(null);
  const [domain, setDomain] = useState<DomainMode>('time');
  // TI-style 2nd modifier: latches until the next key press consumes it
  const [second, setSecond] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const wasmRef = useRef<typeof import('synthesis') | null>(null);
  const rafRef = useRef<number | null>(null);
  const playbackStartRef = useRef<number>(0);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    import('synthesis')
      .then((mod) => {
        wasmRef.current = mod;
      })
      .catch((err) => {
        console.warn('WASM load failed, falling back to JS synthesis:', err);
      });
  }, []);

  // Cursor: move selection between segments (dCol) and tracks (dRow)
  const moveSelection = useCallback((dRow: number, dCol: number) => {
    const { timelines, selectedSegment } = state;
    if (timelines.length === 0) return;
    const row = clamp(selectedSegment.row + dRow, 0, timelines.length - 1);
    const len = timelines[row].segments.length;
    const col = clamp(selectedSegment.col + dCol, 0, Math.max(len - 1, 0));
    dispatch({ type: 'SEGMENT_SELECT', row, col });
  }, [state, dispatch]);

  // 2nd + cursor: shift the selected segment left/right within its track
  const shiftSegment = useCallback((dCol: number) => {
    const { row, col } = state.selectedSegment;
    const segments = state.timelines[row]?.segments;
    const destCol = col + dCol;
    if (!segments?.[col] || destCol < 0 || destCol >= segments.length) return;
    const reordered = [...segments];
    [reordered[col], reordered[destCol]] = [reordered[destCol], reordered[col]];
    dispatch({ type: 'SEGMENT_REARRANGE', rowIndex: row, sourceCol: col, destCol, segments: reordered });
  }, [state, dispatch]);

  const handleCursor = useCallback((dRow: number, dCol: number) => {
    if (second && dCol !== 0) shiftSegment(dCol);
    else moveSelection(dRow, dCol);
    setSecond(false);
  }, [second, shiftSegment, moveSelection]);

  const handleUndo = useCallback(() => {
    dispatch({ type: second ? 'REDO' : 'UNDO' });
    setSecond(false);
  }, [second, dispatch]);

  const deleteSelected = useCallback(() => {
    const { row, col } = state.selectedSegment;
    if (!state.timelines[row]?.segments[col]) return;
    dispatch({ type: 'DELETE_SEGMENT', row, col });
  }, [state.selectedSegment, state.timelines, dispatch]);

  // Keyboard shortcuts (scoped: suppressed when focus is in text inputs)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const inTextField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;
      if (inTextField) return;
      const mod = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z / Ctrl+Shift+Z
      if ((mod && e.key === 'y') || (mod && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
        return;
      }
      // Delete selected segment: Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }
      // Arrows move the selection; Shift+←/→ moves the segment itself
      const arrows: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
      };
      const delta = arrows[e.key];
      if (delta) {
        e.preventDefault();
        if (e.shiftKey && delta[1] !== 0) shiftSegment(delta[1]);
        else moveSelection(...delta);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, deleteSelected, moveSelection, shiftSegment]);

  const stopPlaybackAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPlaybackTime(null);
  }, []);

  const handlePlay = useCallback(() => {
    const errors = computeErrors(state);
    dispatch({ type: 'SET_ERRORS', errors });
    if (errors) {
      dispatch({ type: 'TOGGLE_MODAL', kind: 'alert' });
      return;
    }

    const composition = exportCompositionJson(state.timelines);
    const settingsJson = JSON.stringify({
      fs: state.settings.fs.value,
      volume: state.settings.volume.value,
      multiplier: state.settings.multiplier.value,
      aliasing: state.settings.aliasing,
    });

    const audioContext = audioContextRef.current!;

    let rawBuffer: Float32Array;
    if (wasmRef.current) {
      rawBuffer = wasmRef.current.synthesize_composition(composition, settingsJson);
    } else {
      rawBuffer = SynthesizeComposition(state.timelines, state.settings);
    }

    const audioSourceBuffer = audioContext.createBuffer(
      1,
      rawBuffer.length,
      state.settings.fs.value
    );
    audioSourceBuffer.copyToChannel(rawBuffer as unknown as Float32Array<ArrayBuffer>, 0);
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioSourceBuffer;

    audioSourcesRef.current.push(audioSource);
    audioSource.connect(audioContext.destination);
    audioSource.start(0);

    // Start playhead animation
    const duration = rawBuffer.length / state.settings.fs.value;
    playbackStartRef.current = performance.now();
    stopPlaybackAnimation();

    const animate = () => {
      const elapsed = (performance.now() - playbackStartRef.current) / 1000;
      if (elapsed >= duration) {
        setPlaybackTime(null);
        rafRef.current = null;
        return;
      }
      setPlaybackTime(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    audioSource.onended = stopPlaybackAnimation;
  }, [state, dispatch, stopPlaybackAnimation]);

  const handlePause = useCallback(() => {
    // Detach onended so stopping doesn't reset playbackTime
    audioSourcesRef.current.forEach((source) => {
      source.onended = null;
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
    // Freeze playhead at current position (don't reset playbackTime)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    audioSourcesRef.current.forEach((source) => {
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
    stopPlaybackAnimation();
  }, [stopPlaybackAnimation]);

  const { row: selRow, col: selCol } = state.selectedSegment;
  const selTrack = state.timelines[selRow];
  const totalSeconds = state.timelines.reduce(
    (max, tl) => Math.max(max, tl.segments.reduce((sum, seg) => sum + (Number(seg.length.value) || 0), 0)),
    0
  ) / 1000;

  return (
    <div className="flex h-screen flex-col bg-[#2f2b38] p-4 text-foreground">
      <div className="calc-body relative flex flex-1 flex-col overflow-hidden px-8">
        <div className="grip-ribs absolute top-[12%] bottom-[12%] left-2 w-3" />
        <div className="grip-ribs absolute top-[12%] right-2 bottom-[12%] w-3" />

        {/* Upper half: function keys | screen | key cluster */}
        <div className="flex min-h-0 flex-[5] items-center gap-6 py-5">
          {/* Function key strip — angled like the TI-92's F-keys */}
          <div className="grid w-32 shrink-0 grid-cols-2 gap-x-3 gap-y-7 [&_.key]:-rotate-[4deg]">
            <Key variant="calc" legend="F1" className="h-10" onClick={handlePlay} aria-label="Play">
              <Play className="size-5 fill-current" />
            </Key>
            <Key variant="calc" legend="F2" className="h-10" onClick={handlePause} aria-label="Pause">
              <Pause className="size-5 fill-current" />
            </Key>
            <Key variant="calc-accent" legend="F3" className="col-span-2 h-10" onClick={handleStop}>
              <Square className="size-3.5 fill-current" /> Stop
            </Key>
            <span className="printed col-span-2 -mb-5 text-center">Domain</span>
            {(['time', 'beat'] as const).map((d, i) => (
              <Key
                key={d}
                variant="calc-secondary"
                legend={`F${i + 4}`}
                legendTone="teal"
                className="h-10 gap-1.5 text-xs"
                aria-pressed={domain === d}
                onClick={() => setDomain(d)}
              >
                <Led color="#ff6a3d" on={domain === d} className="size-1.5" />
                {d}
              </Key>
            ))}
          </div>

          {/* Bezel + LCD */}
          <div className="calc-bezel flex h-full min-w-0 flex-1 flex-col px-5 pt-3 pb-5">
            <div className="relative z-[1] flex items-baseline gap-4 px-1 pb-2.5 text-[#e9e9e9]">
              <span className="font-[Georgia,serif] text-[0.95rem] font-semibold tracking-[0.12em] [font-variant:small-caps]">
                Arithmusic
              </span>
              <span className="font-button text-[0.625rem] font-bold tracking-[0.22em] text-legend">{TAG_LINE}</span>
              <span className="ml-auto font-button text-lg font-extrabold italic">fx-AM1</span>
            </div>
            <div className="lcd-screen grid min-h-0 flex-1 grid-cols-[1fr_19rem] grid-rows-[1fr_auto]">
              <Graph playbackTime={playbackTime} />
              <SegmentPanel />
              {/* TI-style status line */}
              <div className="col-span-2 flex border-t-2 border-lcd-ink/30 text-xs [&>span]:border-r-2 [&>span]:border-lcd-ink/30 [&>span]:px-3 [&>span]:py-0.5">
                <span className={cn(second && 'lcd-inverse')}>{second ? '2ND' : 'MAIN'}</span>
                <span>{domain.toUpperCase()}</span>
                <span>TRK {selTrack ? selRow + 1 : '-'}/{state.timelines.length}</span>
                <span>{selTrack?.options.wave.toUpperCase() ?? '-'}</span>
                {selTrack?.options.mute && <span>MUTE</span>}
                <span className="ml-auto border-r-0! border-l-2">
                  {playbackTime !== null ? '▶' : '■'} {(playbackTime ?? 0).toFixed(2)}s / {totalSeconds.toFixed(2)}s
                </span>
              </div>
            </div>
          </div>

          {/* Right key cluster */}
          <div className="grid w-48 shrink-0 grid-cols-2 gap-x-3.5 gap-y-7">
            <Key variant="calc-second" aria-pressed={second} onClick={() => setSecond((v) => !v)}>
              2nd
            </Key>
            <Key variant="calc-secondary" legend="REDO" onClick={handleUndo}>Undo</Key>
            <Key variant="calc-secondary" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>Mode</Key>
            <Key variant="calc-secondary" onClick={() => window.dispatchEvent(new Event('open-tutorial'))}>Help</Key>
            <Key variant="calc-secondary" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}>Load</Key>
            <Key variant="calc-secondary" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>Save</Key>
            <div className="col-span-2 flex flex-col items-center gap-2">
              <CursorPad onMove={handleCursor} />
              <span className="printed mt-1.5 text-center leading-relaxed">
                Select<br /><span className="text-legend">2nd ◀ ▶ move</span>
              </span>
            </div>
            <Key variant="calc-secondary" className="col-span-2 -mt-3" onClick={deleteSelected}>Del</Key>
          </div>
        </div>

        {/* Keypad deck: timeline */}
        <div className="calc-deck -mx-8 min-h-0 flex-[2]">
          <TimelinePanel />
        </div>
      </div>
      <LoadModal />
      <SaveModal />
      <SettingsModal />
      <AlertModal />
      <TutorialModal />
    </div>
  );
}

export default function App() {
  return (
    <CompositionProvider>
      <AppContent />
    </CompositionProvider>
  );
}
