import { useMemo } from 'react';

function getTickConfig(totalMs: number): { major: number; minor: number } {
  if (totalMs <= 500) return { major: 100, minor: 50 };
  if (totalMs <= 1500) return { major: 500, minor: 250 };
  if (totalMs <= 3000) return { major: 500, minor: 250 };
  if (totalMs <= 6000) return { major: 1000, minor: 500 };
  if (totalMs <= 15000) return { major: 2000, minor: 1000 };
  if (totalMs <= 30000) return { major: 5000, minor: 2500 };
  if (totalMs <= 60000) return { major: 10000, minor: 5000 };
  return { major: 30000, minor: 10000 };
}

function formatTime(ms: number): string {
  const s = ms / 1000;
  return Number.isInteger(s) ? `${s}s` : `${s}s`;
}

interface Tick {
  time: number;
  pct: number;
  isMajor: boolean;
}

export default function TimelineRuler({
  maxTotalMs,
  leftOffset,
}: {
  maxTotalMs: number;
  leftOffset: number;
}) {
  const ticks = useMemo<Tick[]>(() => {
    if (maxTotalMs <= 0) return [];
    const { major, minor } = getTickConfig(maxTotalMs);
    const result: Tick[] = [];
    for (let t = 0; t <= maxTotalMs; t += minor) {
      result.push({
        time: t,
        pct: (t / maxTotalMs) * 100,
        isMajor: t % major === 0,
      });
    }
    return result;
  }, [maxTotalMs]);

  if (ticks.length === 0) return null;

  return (
    <div
      className="flex shrink-0 select-none"
      style={{ paddingLeft: leftOffset }}
    >
      <div className="relative mr-12 ml-2.5 h-5 flex-1 overflow-hidden">
        {ticks.map(({ time, pct, isMajor }) => (
          <div
            key={time}
            className={`absolute bottom-0 flex flex-col items-center ${
              pct < 0.1 ? '' : pct > 99.9 ? '-translate-x-full' : '-translate-x-1/2'
            }`}
            style={{ left: `${pct}%` }}
          >
            {isMajor && (
              <span className="mb-0.5 font-button text-[0.5625rem] font-bold leading-none tracking-wider text-legend-alt whitespace-nowrap">
                {formatTime(time)}
              </span>
            )}
            <div
              className={`w-px ${
                isMajor
                  ? 'h-1.5 bg-legend-alt'
                  : 'h-1 bg-legend-alt/40'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
