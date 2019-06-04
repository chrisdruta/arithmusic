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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, isSelected) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  marginLeft: 5,
  padding: 5,
  minHeight: 20,
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
  padding: grid,
  overflow: 'auto',
  flexGrow: 1,
  width: '100%'
});

class TrackTimeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: props.segments
    };
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  addSegment = () => {
    const items = this.state.items;
    this.setState({
      items: [...items,
        {
          id: `t${this.props.idGenerator()}`,
          title: "New Tab",
          expression: "10*x",
          length: 500,
          volume: 100
        }
      ]
    });
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
              {this.state.items.map((segment, index) => {
                return (
                  <Draggable key={segment.id} draggableId={segment.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          this.props.selectedSegmentId === segment.id
                        )}
                        onClick={() => this.props.onSegmentSelection(segment.id)}
                      >
                        {segment.title}
                      </div>
                    )}
                  </Draggable>)
              })}
              {provided.placeholder}
              <div className="verticalDivider"></div>
              <IconButton onClick={this.addSegment} size='small'><Plus /></IconButton>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default TrackTimeline;
