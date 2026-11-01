import { useEffect, useRef, useState } from 'react';
import { Minus } from 'lucide-react';
import { mdiSineWave, mdiTriangleWave, mdiSawtoothWave } from '@mdi/js';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useComposition } from '../../context/CompositionContext';
import { trackDash } from '../../lib/track-style';

function MdiIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d={path} />
    </svg>
  );
}

const waves = [
  { value: 'sine', path: mdiSineWave, label: 'Sine wave' },
  { value: 'triangle', path: mdiTriangleWave, label: 'Triangle wave' },
  { value: 'saw', path: mdiSawtoothWave, label: 'Sawtooth wave' },
] as const;

function WaveSelect({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const wave = state.timelines[rowIndex].options.wave;
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const selected = waves.find((w) => w.value === wave) || waves[0];

  if (!expanded) {
    return (
      <Button
        variant="calc-secondary"
        size="sm"
        onClick={() => setExpanded(true)}
        className="px-2"
        aria-label={`Wave: ${selected.label}. Click to change.`}
      >
        <MdiIcon path={selected.path} />
      </Button>
    );
  }

  return (
    <div ref={ref}>
      <ToggleGroup
        type="single"
        size="sm"
        spacing={1}
        value={wave}
        onValueChange={(val) => {
          if (val) dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'wave', value: val });
          setExpanded(false);
        }}
      >
        {waves.map((w) => (
          <ToggleGroupItem key={w.value} value={w.value} aria-label={w.label} variant="calc">
            <MdiIcon path={w.path} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

// Line-style swatch matching this track's trace on the monochrome graph
function DashSwatch({ rowIndex }: { rowIndex: number }) {
  return (
    <svg width="22" height="6" className="shrink-0" aria-hidden>
      <line x1="0" x2="22" y1="3" y2="3" stroke="currentColor" strokeWidth="2.5" strokeDasharray={trackDash(rowIndex)} />
    </svg>
  );
}

export default function TrackOptions({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const options = state.timelines[rowIndex].options;

  return (
    <div className="flex items-center gap-2.5 py-1 pr-2.5">
      <Button
        variant="calc-secondary"
        size="icon-sm"
        onClick={() => dispatch({ type: 'DELETE_TRACK', rowIndex })}
        aria-label="Delete track"
      >
        <Minus className="size-4" />
      </Button>
      <div className="name-plate flex h-8 w-44 items-center gap-2 px-2.5 text-[#d9dbdf]">
        <DashSwatch rowIndex={rowIndex} />
        <input
          value={options.title}
          onChange={(e) => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'title', value: e.target.value })}
          className="min-w-0 flex-1 bg-transparent font-button text-xs font-bold uppercase tracking-wider outline-none"
          aria-label="Track name"
        />
      </div>
      <WaveSelect rowIndex={rowIndex} />
      <Toggle
        size="sm"
        pressed={options.mute}
        onPressedChange={() => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'mute', value: '' })}
        aria-label="Mute track"
        variant="calc"
        className="px-2 text-[0.625rem]"
      >
        MUTE
      </Toggle>
    </div>
  );
}
