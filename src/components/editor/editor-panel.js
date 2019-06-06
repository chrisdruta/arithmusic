import React, { Component } from 'react';

import { IconButton, TextField } from '@material-ui/core';
import { Delete } from 'mdi-material-ui';

import EditorOutput from './editor-output';

const style = {
  title: {
    width: 100
  },
  equation: {

  },
  length: {
    width: 100
  },
  volume: {
    width: 90
  }
}

class EditorPanel extends Component {

  render() {
    return (
      <div className="EditorPanel">
        <TextField
          id="standard-name"
          label="Title"
          value={this.props.title}
          onChange={(event) => this.props.onDataChange('title', event.target.value)}
          margin="normal"
          style={style.title}
        />
        <TextField
          label="Equation f(x)"
          value={this.props.expression}
          onChange={(event) => this.props.onDataChange('expression', event.target.value)}
          margin="normal"
          style={style.equation}
        />
        <TextField
          label="Length (ms)"
          value={this.props.length}
          onChange={(event) => this.props.onDataChange('length', event.target.value)}
          margin="normal"
          style={style.length}
        />
        <TextField
          label="Volume (%)"
          value={this.props.volume}
          onChange={(event) => this.props.onDataChange('volume', event.target.value)}
          margin="normal"
          style={style.volume}
        />
        <EditorOutput />
        <IconButton onClick={() => this.props.onDeleteSegment()}>
          <Delete />
        </IconButton>
      </div>
    )
  }
}

export default EditorPanel;
