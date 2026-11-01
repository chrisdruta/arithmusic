import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { parse } from 'mathjs';

function generateTex(expression: string): string {
  const tex = parse(`f(x) = ${expression}`).toTex();
  // mathjs outputs \mathrm{f} — swap to \mathit for italic function name
  return tex.replace('\\mathrm{f}', '\\mathit{f}');
}

export default function EditorOutput({ output, error }: { output: string; error: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 px-3">
      <span className="text-xs text-lcd-dim">OUTPUT</span>
      {!error ? (
        <span className="lcd-katex overflow-hidden text-2xl">
          <InlineMath math={generateTex(output)} />
        </span>
      ) : (
        <p className="text-sm leading-tight">
          <span className="lcd-inverse mr-1 px-1">ERR</span>{output}
        </p>
      )}
    </div>
  );
}
