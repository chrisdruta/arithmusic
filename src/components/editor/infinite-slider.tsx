import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { LcdError, LcdRow } from './lcd-row';

// Fixed tiers in seconds so the scale never shifts unpredictably mid-drag
const TIERS = [0.5, 1, 2, 5, 10, 30, 60, 120];

function pickTier(v: number) {
  for (const t of TIERS) if (v < t * 0.85) return t;
  return TIERS[TIERS.length - 1];
}

// Displays and edits length in seconds; onChange returns milliseconds as a string
export default function InfiniteSlider({ valueMs, error, onChange }: {
  valueMs: number | string;
  error?: string | null;
  onChange: (ms: string) => void;
}) {
  const seconds = (Number(valueMs) || 0) / 1000;
  const [localValue, setLocalValue] = useState(seconds);
  const [dragging, setDragging] = useState(false);
  const [sliderMax, setSliderMax] = useState(() => pickTier(seconds));

  // Sync local state + recalc tier when not dragging
  useEffect(() => {
    if (!dragging) {
      setLocalValue(seconds);
      setSliderMax(pickTier(seconds));
    }
  }, [seconds, dragging]);

  const displayValue = dragging ? localValue : seconds;

  const commitValue = () => {
    onChange(String(Math.round(localValue * 1000)));
    setDragging(false);
  };

  return (
    <>
      <LcdRow label="LEN" htmlFor="seg-length">
        <Input
          id="seg-length"
          surface="lcd"
          className="w-16"
          value={dragging ? localValue : parseFloat(seconds.toFixed(3))}
          onChange={(e) => {
            const secs = Number(e.target.value);
            if (!isNaN(secs)) onChange(String(Math.round(secs * 1000)));
            else onChange(e.target.value);
          }}
          aria-invalid={!!error}
        />
        <span className="text-sm">s</span>
        <span className="ml-auto text-xs text-lcd-dim">0–{sliderMax}s</span>
      </LcdRow>
      <LcdRow>
        <input
          type="range"
          min={0}
          max={sliderMax}
          step={0.01}
          value={displayValue}
          onChange={(e) => {
            const val = Math.round(Number(e.target.value) * 100) / 100;
            setDragging(true);
            setLocalValue(val);
            // Grow to next tier if user pushes near the edge
            if (val >= sliderMax * 0.95) {
              const next = TIERS.find(t => t > sliderMax);
              if (next) setSliderMax(next);
            }
          }}
          onPointerUp={commitValue}
          onLostPointerCapture={commitValue}
          className="lcd-slider w-full"
          style={{ '--pct': `${(displayValue / sliderMax) * 100}%` } as React.CSSProperties}
          aria-label="Length"
        />
      </LcdRow>
      {error && <LcdError>{error}</LcdError>}
    </>
  );
}
