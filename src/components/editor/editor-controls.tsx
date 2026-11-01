import { Plus } from 'lucide-react';
import { Key } from '@/components/ui/key';
import { useComposition } from '../../context/CompositionContext';
import TemplateDropdowns from './template-bar';

export default function EditorControls() {
  const { dispatch } = useComposition();

  return (
    <div className="flex w-full items-center gap-2.5 px-2.5 pt-5 pb-3">
      <span className="printed mr-3 text-[0.6875rem] text-[#c9ccd1]">Timeline</span>
      <Key variant="calc-secondary" size="sm" legend="NEW" onClick={() => dispatch({ type: 'ADD_TRACK' })}>
        Track <Plus className="size-4" />
      </Key>
      <div className="mx-1.5 h-5 w-px bg-black/30 shadow-[1px_0_0_rgba(255,255,255,0.06)]" />
      <TemplateDropdowns />
    </div>
  );
}
