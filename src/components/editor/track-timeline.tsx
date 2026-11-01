import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useComposition } from '../../context/CompositionContext';
import { trackColor } from '../../lib/track-style';

export default function TrackTimeline({ rowIndex, maxTotalMs }: { rowIndex: number; maxTotalMs: number }) {
  const { state, dispatch } = useComposition();
  const segments = state.timelines[rowIndex].segments;
  const selectedSegment = state.selectedSegment;

  const trackTotalMs = segments.reduce((sum, s) => sum + Math.max(s.length.value, 1), 0);
  const remainderMs = maxTotalMs - trackTotalMs;

  return (
    <Droppable droppableId={String(rowIndex)} direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "flex w-full flex-1 items-stretch gap-1.5 overflow-x-auto rounded-md px-1 py-1.5",
            snapshot.isDraggingOver && "bg-black/15"
          )}
        >
          {segments.map((segment, colIndex) => {
            const isSelected = selectedSegment.row === rowIndex && selectedSegment.col === colIndex;
            return (
              <Draggable key={segment.id} draggableId={segment.id} index={colIndex}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      flexGrow: Math.max(segment.length.value, 1),
                      flexShrink: 0,
                      flexBasis: 0,
                      minWidth: '3rem',
                      '--chip': trackColor(rowIndex),
                      ...(provided.draggableProps.style as React.CSSProperties | undefined),
                    } as React.CSSProperties}
                    onClick={() => dispatch({ type: 'SEGMENT_SELECT', row: rowIndex, col: colIndex })}
                    aria-pressed={isSelected}
                    className={cn(
                      "key key-grey key-chip flex h-9 select-none items-center truncate px-2.5 text-xs",
                      snapshot.isDragging && snapshot.draggingOver == null && "key-doomed text-white"
                    )}
                  >
                    {segment.title.value}
                  </div>
                )}
              </Draggable>
            );
          })}
          {remainderMs > 0 && (
            <div style={{ flexGrow: remainderMs, flexShrink: 0, flexBasis: 0 }} />
          )}
          {provided.placeholder}
          <Button
            variant="calc-secondary"
            size="icon-sm"
            onClick={() => dispatch({ type: 'ADD_SEGMENT', rowIndex })}
            className="ml-2 self-center"
            aria-label="Add segment"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </Droppable>
  );
}
