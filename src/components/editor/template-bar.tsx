import { useRef, useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown } from 'lucide-react';
import { Key } from '@/components/ui/key';
import { cn } from '@/lib/utils';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, type TemplateCategory } from '../../lib/templates';

function TemplateDropdown({
  category,
  label,
  openCategory,
  setOpenCategory,
}: {
  category: TemplateCategory;
  label: string;
  openCategory: TemplateCategory | null;
  setOpenCategory: (c: TemplateCategory | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openCategory === category;
  const templates = getTemplatesByCategory(category);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setOpenCategory]);

  return (
    <div ref={ref} className="relative">
      <Key
        variant="calc-secondary"
        size="sm"
        legend="INSERT"
        legendTone="teal"
        aria-pressed={isOpen}
        onClick={() => setOpenCategory(isOpen ? null : category)}
        className="text-xs"
      >
        {label}
        <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} />
      </Key>

      {isOpen && (
        <div className="parts-tray absolute left-0 top-full z-50 mt-3 w-[21rem] p-3 pb-3.5">
          <div className="printed mb-3 flex justify-between">
            <span>{label}</span>
            <span>drag onto a track</span>
          </div>
          <div className={cn('grid gap-x-2.5 gap-y-3', category === 'patterns' ? 'grid-cols-2' : 'grid-cols-3')}>
            {templates.map((template) => (
              // One droppable per chip, so lifting a chip leaves its slot empty
              // instead of the rest of the tray reflowing around it.
              <Droppable key={template.id} droppableId={`templates-${template.id}`} isDropDisabled>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="tray-slot h-10">
                    <Draggable draggableId={template.id} index={0}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          title={template.expression}
                          className={cn(
                            'key key-grey flex h-10 cursor-grab flex-col items-center justify-center gap-1 px-1.5 text-xs',
                            snapshot.isDragging && 'key-lifted -rotate-3 cursor-grabbing'
                          )}
                        >
                          <span className="max-w-full truncate">{template.title}</span>
                          <span className="max-w-full truncate font-mono text-[0.5625rem] font-medium leading-none tracking-normal text-[#3b3f45]">
                            {template.expression}
                          </span>
                        </div>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplateDropdowns() {
  const [openCategory, setOpenCategory] = useState<TemplateCategory | null>(null);

  return (
    <div className="flex items-center gap-2.5">
      {TEMPLATE_CATEGORIES.map(({ key, label }) => (
        <TemplateDropdown
          key={key}
          category={key}
          label={label}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
        />
      ))}
    </div>
  );
}
