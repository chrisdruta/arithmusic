import React, { Component } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton } from "@material-ui/core";
import { Plus } from 'mdi-material-ui';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getStyle = (isDragging, draggableStyle, isSelected) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  marginLeft: 5,
  padding: 5,
  minHeight: 16,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  alignSelf: 'center',
  // change background colour if dragging
  background: '#ffa4a2',
  borderBottom: isSelected ? '2px solid #EE6E73' : '2px solid #ffa4a2',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#af4448' : '#ffa4a2',
  display: 'flex',
  justifyContent: 'flex-start',
  padding: 8,
  overflow: 'auto',
  flexGrow: 1,
  width: '100%'
});

class TrackTimeline extends Component {

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const segments = reorder(
      this.props.segments,
      result.source.index,
      result.destination.index
    );

    this.props.onSegmentRearrange(this.props.rowIndex, result.source.index, result.destination.index, segments);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.props.segments.map((segment, colIndex) => {
                return (
                  <Draggable key={segment.id} draggableId={segment.id} index={colIndex}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          (this.props.selectedSegment.row === this.props.rowIndex && 
                           this.props.selectedSegment.col === colIndex)
                        )}
                        onClick={() => this.props.onSegmentSelection(this.props.rowIndex, colIndex)}
                      >
                        {segment.title.value}
                      </div>
                    )}
                  </Draggable>)
              })}
              {provided.placeholder}
              <div className="verticalDivider"></div>
              <IconButton onClick={() => this.props.onAddSegment(this.props.rowIndex)} size='small'><Plus /></IconButton>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default TrackTimeline;
