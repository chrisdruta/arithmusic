import { useMemo } from 'react';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { curveLinear } from '@visx/curve';
import { SampleTrackGraph } from '../lib/synthesize';
import { useComposition } from '../context/CompositionContext';
import { trackDash } from '../lib/track-style';

const fontFamily = '"TICELarge", "VT323", monospace';
const ink = 'var(--color-lcd-ink)';
const dimInk = 'var(--color-lcd-dim)';
const gridColor = 'var(--color-lcd-grid)';
const bgColor = 'var(--color-lcd-bg)';
const dimOpacity = 0.55;

function Chart({ width, height, playbackTime }: { width: number; height: number; playbackTime: number | null }) {
  const { state } = useComposition();
  const { settings, timelines, selectedSegment } = state;

  // Scale SVG margins and font sizes with the responsive root font-size
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const margin = { top: 2.5 * rem, left: 6 * rem, right: 3.125 * rem, bottom: 5.3 * rem };
  const labelFontSize = rem;
  const tickFontSize = 0.875 * rem;

  const allTraces = useMemo(
    () =>
      timelines.map((timeline) =>
        SampleTrackGraph(timeline.segments, settings.multiplier.value) ?? []
      ),
    [timelines, settings.multiplier.value]
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (innerWidth <= 0 || innerHeight <= 0) return null;

  const xMax = allTraces.reduce(
    (max, traces) =>
      traces.reduce(
        (m, t) => Math.max(m, t.x.length > 0 ? t.x[t.x.length - 1] : 0),
        max
      ),
    0
  );

  const xScale = scaleLinear<number>({
    domain: [0, xMax || 1],
    range: [0, innerWidth],
  });

  const yScale = scaleLinear<number>({
    domain: [0, settings.graphRange.value || 1],
    range: [innerHeight, 0],
  });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={yScale} width={innerWidth} stroke={gridColor} />
        <GridColumns scale={xScale} height={innerHeight} stroke={gridColor} />
        {/* Render non-selected timelines first (dimmed), then selected on top */}
        {allTraces.map((traces, trackIdx) => {
          if (trackIdx === selectedSegment.row) return null;
          return traces.map((trace, segIdx) => {
            const points = trace.x.map((xVal, j) => ({ x: xVal, y: trace.y[j] }));
            return (
              <LinePath
                key={`${trackIdx}-${segIdx}`}
                data={points}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke={ink}
                strokeWidth={1.75}
                strokeOpacity={dimOpacity}
                strokeDasharray={trackDash(trackIdx)}
                curve={curveLinear}
              />
            );
          });
        })}
        {(allTraces[selectedSegment.row] ?? []).map((trace, segIdx) => {
          const points = trace.x.map((xVal, j) => ({ x: xVal, y: trace.y[j] }));
          return (
            <LinePath
              key={`selected-${segIdx}`}
              data={points}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              stroke={ink}
              strokeWidth={2.5}
              strokeDasharray={trackDash(selectedSegment.row)}
              curve={curveLinear}
            />
          );
        })}
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          label="t (s)"
          labelProps={{ fill: dimInk, fontSize: labelFontSize, fontFamily, textAnchor: 'middle', dy: 0.75 * rem }}
          tickLabelProps={{ fill: ink, fontSize: tickFontSize, fontFamily }}
          stroke={ink}
          strokeWidth={2}
          tickStroke={ink}
        />
        <AxisLeft
          scale={yScale}
          label="f (kHz)"
          labelProps={{ fill: dimInk, fontSize: labelFontSize, fontFamily, textAnchor: 'middle', dx: -1.125 * rem }}
          tickFormat={(v) => (Number(v) / 1000).toFixed(1)}
          tickLabelProps={{ fill: ink, fontSize: tickFontSize, fontFamily }}
          stroke={ink}
          strokeWidth={2}
          tickStroke={ink}
        />
        {/* Legend */}
        {(() => {
          const legendLineW = 1.75 * rem;
          const legendRowH = 1.25 * rem;
          const legendPadX = 0.5 * rem;
          const legendPadY = 0.375 * rem;
          const legendW = legendLineW + legendPadX * 2 + 8 * rem;
          const legendH = legendPadY * 2 + timelines.length * legendRowH;
          const legendX = innerWidth - legendW - 0.5 * rem;
          const legendY = 0.5 * rem;
          return (
            <Group left={legendX} top={legendY}>
              <rect width={legendW} height={legendH} fill={bgColor} fillOpacity={0.85} stroke={dimInk} strokeWidth={1.5} />
              {timelines.map((tl, idx) => {
                const isSelected = idx === selectedSegment.row;
                const y = legendPadY + idx * legendRowH + legendRowH / 2;
                return (
                  <g key={idx} opacity={isSelected ? 1 : dimOpacity}>
                    <line x1={legendPadX} x2={legendPadX + legendLineW} y1={y} y2={y} stroke={ink} strokeWidth={2} strokeDasharray={trackDash(idx)} />
                    <text x={legendPadX + legendLineW + 6} y={y} fill={ink} fontSize={tickFontSize} fontFamily={fontFamily} dominantBaseline="central">
                      {tl.options.title}
                    </text>
                  </g>
                );
              })}
            </Group>
          );
        })()}
        {playbackTime !== null && playbackTime >= 0 && playbackTime <= xMax && (
          <>
            <line
              x1={xScale(playbackTime)}
              x2={xScale(playbackTime)}
              y1={0}
              y2={innerHeight}
              stroke={ink}
              strokeWidth={1.5}
              strokeDasharray="2 3"
            />
            <path
              d={`M${xScale(playbackTime) - 6} 0 h12 l-6 8z`}
              fill={ink}
            />
          </>
        )}
      </Group>
    </svg>
  );
}

export default function Graph({ playbackTime }: { playbackTime: number | null }) {
  return (
    <div className="relative min-h-0 min-w-0 overflow-hidden">
      <ParentSize>
        {({ width, height }) => <Chart width={width} height={height} playbackTime={playbackTime} />}
      </ParentSize>
    </div>
  );
}
