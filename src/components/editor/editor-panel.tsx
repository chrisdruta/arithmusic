import { Input } from '@/components/ui/input';
import EditorOutput from './editor-output';
import EquationInput from './equation-input';
import InfiniteSlider from './infinite-slider';
import { LcdError, LcdHint, LcdRow } from './lcd-row';
import { useComposition } from '../../context/CompositionContext';

export default function EditorPanel() {
  const { state, dispatch } = useComposition();
  const { row, col } = state.selectedSegment;
  const segment = state.timelines[row]?.segments[col];
  if (!segment) return null;

  const { title, expression, length, volume } = segment;
  const volumePct = Math.min(Math.max(Number(volume.value) || 0, 0), 200) / 2;

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-y-auto py-3">
      <LcdRow label="TITLE" htmlFor="seg-title">
        <Input
          id="seg-title"
          surface="lcd"
          value={title.value}
          aria-invalid={!!title.error}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'title', value: e.target.value })}
        />
      </LcdRow>
      {title.error && <LcdError>{title.error}</LcdError>}

      <LcdRow label={`y${row + 1}(x)=`} htmlFor="seg-expression">
        <EquationInput
          id="seg-expression"
          value={expression.value}
          error={!!expression.error}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'expression', value: e.target.value })}
        />
      </LcdRow>
      <LcdHint>x = time (s)</LcdHint>

      <InfiniteSlider
        valueMs={length.value}
        error={length.error}
        onChange={(val) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'length', value: val })}
      />

      <LcdRow label="VOL" htmlFor="seg-volume">
        <Input
          id="seg-volume"
          surface="lcd"
          className="w-16"
          value={volume.value}
          aria-invalid={!!volume.error}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
        />
        <span className="text-sm">%</span>
        <span className="ml-auto text-xs text-lcd-dim">0–200</span>
      </LcdRow>
      <LcdRow>
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={Number(volume.value) || 0}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
          className="lcd-slider w-full"
          style={{ '--pct': `${volumePct}%` } as React.CSSProperties}
          aria-label="Volume"
        />
      </LcdRow>
      {volume.error && <LcdError>{volume.error}</LcdError>}

      <div className="mx-3 mt-1 border-t-2 border-dashed border-lcd-ink/35" />
      <EditorOutput
        output={expression.error ? expression.error : expression.value}
        error={!!expression.error}
      />
    </div>
  );
}
