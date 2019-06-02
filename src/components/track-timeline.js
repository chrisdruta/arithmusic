import React, { Component } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `${k}`,
    content: `item ${k}`,
  }));

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
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : isSelected ? 'orange' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  justifyContent: 'flex-start',
  padding: grid,
  overflow: 'auto',
  minWidth: '50%',
  maxWidth: '95%',
  marginLeft: 10,
  marginRight: 10
});

class TrackTimeline extends Component {

  constructor(props) {
    super(props);
    this.count = 69;
    this.state = {
      items: props.tabs
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

  addTab = () => {
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
    this.count++;
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
              {this.state.items.map((tab, index) => {
                //alert(JSON.stringify(tab));
                return (
                <Draggable key={tab.id} draggableId={tab.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        this.props.selectedTabId === tab.id
                      )}
                      onClick={() => this.props.onTabSelection(tab.id)}
                    >
                      {tab.title}
                    </div>
                  )}
                </Draggable>)
            })}
              {provided.placeholder}
              <div onClick={this.addTab}>Add</div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default TrackTimeline;
