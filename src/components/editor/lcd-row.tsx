import { cn } from '@/lib/utils';

// One line of the Y= editor: dim label column, then the value.
export function LcdRow({ label, htmlFor, children, className }: {
  label?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 px-3', className)}>
      <label htmlFor={htmlFor} className="w-14 shrink-0 text-sm text-lcd-dim">{label}</label>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  );
}

// TI-style error line: inverted ERR tag + message
export function LcdError({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pl-[4.5rem] text-xs leading-tight">
      <span className="lcd-inverse mr-1 px-1">ERR</span>{children}
    </p>
  );
}

// Small dim annotation under a field
export function LcdHint({ children }: { children: React.ReactNode }) {
  return <p className="-mt-1 pl-[4.5rem] pr-3 text-xs text-lcd-dim">{children}</p>;
}
