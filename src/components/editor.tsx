import { useEffect, useRef, useState } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

import { useComposition } from '../context/CompositionContext';
import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TimelineRuler from './editor/timeline-ruler';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';
import { Led } from './ui/led';
import { getTemplateById } from '../lib/templates';
import { trackColor } from '../lib/track-style';
import type { Segment } from '../types';

function reorder(list: Segment[], startIndex: number, endIndex: number): Segment[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function TimelinePanel() {
  const { state, dispatch } = useComposition();
  const { timelines, selectedSegment } = state;

  const controlsRef = useRef<HTMLDivElement>(null);
  const [controlsWidth, setControlsWidth] = useState(0);

  useEffect(() => {
    const el = controlsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setControlsWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxTotalMs = timelines.reduce(
    (max, tl) => Math.max(max, tl.segments.reduce((sum, s) => sum + Math.max(s.length.value, 1), 0)),
    0
  );

  const onDragEnd = (result: DropResult) => {
    const sourceDropId = result.source.droppableId;

    if (!result.destination) {
      // Template dropped nowhere — ignore
      if (sourceDropId.startsWith('templates-')) return;
      // Segment dragged outside all tracks — delete it
      const sourceRow = Number(sourceDropId);
      const sourceCol = result.source.index;
      dispatch({ type: 'DELETE_SEGMENT', row: sourceRow, col: sourceCol });
      return;
    }

    const destDropId = result.destination.droppableId;
    const destCol = result.destination.index;

    // Template drag → insert new segment from template
    if (sourceDropId.startsWith('templates-')) {
      if (destDropId.startsWith('templates-')) return;
      const template = getTemplateById(result.draggableId);
      if (!template) return;
      const destRow = Number(destDropId);
      dispatch({
        type: 'INSERT_SEGMENT',
        row: destRow,
        col: destCol,
        segment: {
          title: template.title,
          expression: template.expression,
          length: template.length,
          volume: template.volume,
        },
      });
      return;
    }

    const sourceRow = Number(sourceDropId);
    const destRow = Number(destDropId);
    const sourceCol = result.source.index;

    if (sourceRow === destRow) {
      if (sourceCol === destCol) return;
      const reordered = reorder(timelines[sourceRow].segments, sourceCol, destCol);
      dispatch({
        type: 'SEGMENT_REARRANGE',
        rowIndex: sourceRow,
        sourceCol,
        destCol,
        segments: reordered,
      });
    } else {
      dispatch({
        type: 'SEGMENT_MOVE_CROSS_TRACK',
        sourceRow,
        sourceCol,
        destRow,
        destCol,
      });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden px-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <EditorControls />
        <div className="flex-1 overflow-y-auto pb-4">
          <TimelineRuler maxTotalMs={maxTotalMs} leftOffset={controlsWidth} />
          {timelines.map((_tl, rowIndex) => (
            <div key={rowIndex} className="flex w-full justify-start">
              <div ref={rowIndex === 0 ? controlsRef : undefined} className="flex shrink-0">
                <div className="flex w-7 shrink-0 items-center justify-center">
                  <Led
                    className="size-2.5"
                    color={trackColor(rowIndex)}
                    on={selectedSegment.row === rowIndex}
                  />
                </div>
                <TrackOptions rowIndex={rowIndex} />
              </div>
              <TrackTimeline rowIndex={rowIndex} maxTotalMs={maxTotalMs} />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

// Right half of the LCD: TI-style Y= editor for the selected segment
export function SegmentPanel() {
  const { state } = useComposition();
  const { timelines, selectedSegment } = state;
  const segments = timelines[selectedSegment.row]?.segments ?? [];
  const selectedSegmentData = segments[selectedSegment.col];

  return (
    <div className="flex min-h-0 flex-col border-l-2 border-lcd-ink/30">
      <div className="lcd-inverse flex justify-between px-3 py-1 text-sm tracking-wider">
        <span>Y= SEGMENT</span>
        {selectedSegmentData && <span>{selectedSegment.col + 1}/{segments.length}</span>}
      </div>
      <div className="relative min-h-0 flex-1">
        {selectedSegmentData ? (
          <EditorPanel />
        ) : (
          <div className="flex h-full items-center justify-center text-sm tracking-widest text-lcd-dim">
            SELECT A SEGMENT
          </div>
        )}
      </div>
    </div>
  );
}
