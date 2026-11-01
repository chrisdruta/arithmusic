import { useRef } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Input } from '@/components/ui/input';

// Math expression highlighting via transparent-input overlay. The LCD is
// monochrome, so structure (operators, parens) is dimmed rather than colored.
const MATH_TOKEN = /(\b(?:sin|cos|tan|asin|acos|atan|atan2|sqrt|abs|log|ln|exp|ceil|floor|round|min|max|pow|mod)\b)|\b(pi|e)\b|(x)|([0-9]+\.?[0-9]*)|([+\-*/^%])|([()])|(.)/g;

function highlightMath(text: string) {
  const spans: { text: string; dim: boolean }[] = [];
  let match;
  MATH_TOKEN.lastIndex = 0;
  while ((match = MATH_TOKEN.exec(text)) !== null) {
    const [full, , , , , op, paren] = match;
    spans.push({ text: full, dim: !!(op || paren) });
  }
  return spans;
}

function HelpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="lcd-inverse px-1 text-xs tracking-widest">{title}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function EquationInput({ id, value, error, onChange }: {
  id?: string;
  value: string;
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  // Sync scroll position between input and highlight layer
  const syncScroll = () => {
    if (inputRef.current && mirrorRef.current) {
      mirrorRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  return (
    <>
      <div className="relative min-w-0 flex-1">
        <div
          ref={mirrorRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-1 text-base"
        >
          <span className="whitespace-pre">
            {highlightMath(value).map((t, i) => (
              <span key={i} className={t.dim ? 'text-lcd-dim' : undefined}>{t.text}</span>
            ))}
          </span>
        </div>
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={onChange}
          onScroll={syncScroll}
          surface="lcd"
          className="text-transparent caret-lcd-ink"
          aria-invalid={error}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger
          className="size-5 shrink-0 border-2 border-lcd-ink text-xs leading-none hover:bg-lcd-ink hover:text-lcd-bg"
          aria-label="Equation syntax"
        >
          ?
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="left"
            align="start"
            sideOffset={10}
            className="lcd-popup z-50 w-72 p-3 animate-in fade-in-0 zoom-in-95"
          >
            <div className="space-y-2.5 text-sm">
              <HelpSection title="VARIABLE">
                <p>x = elapsed time in seconds</p>
              </HelpSection>
              <HelpSection title="FUNCTIONS">
                <p>sin cos tan asin acos atan sqrt abs log ln exp pow min max ceil floor round</p>
              </HelpSection>
              <HelpSection title="CONSTANTS">
                <p>pi &nbsp; e</p>
              </HelpSection>
              <HelpSection title="EXAMPLES">
                <p>440</p>
                <p>440 + 100 * x</p>
                <p>sin(x * 2 * pi) * 200 + 440</p>
              </HelpSection>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </>
  );
}
