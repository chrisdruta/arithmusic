import React, { Component } from 'react';

import { IconButton, TextField } from '@material-ui/core';
import { Delete } from 'mdi-material-ui';

import EditorOutput from './editor-output';

const style = {
  title: {
    width: 100
  },
  equation: {
    width: "25%"
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
    const { selectedSegment, timelines } = this.props;
    const i = selectedSegment.col, j = selectedSegment.row;
    return (
      <div className="EditorPanel">
        <TextField
          id="standard-name"
          label="Title"
          value={this.props.title.value}
          error={!!this.props.title.error}
          helperText={this.props.title.error}
          onChange={(event) => this.props.onTrackDataChange(timelines, i, j, 'title', event.target.value)}
          margin="normal"
          style={style.title}
        />
        <TextField
          label="Equation f(x)"
          value={this.props.expression.value}
          error={!!this.props.expression.error}
          helperText={!!this.props.expression.error ? "See output" : ""}
          onChange={(event) => this.props.onTrackDataChange(timelines, i, j, 'expression', event.target.value)}
          margin="normal"
          style={style.equation}
        />
        <TextField
          label="Length (ms)"
          value={this.props.length.value}
          error={!!this.props.length.error}
          helperText={this.props.length.error}
          onChange={(event) => this.props.onTrackDataChange(timelines, i, j, 'length', event.target.value)}
          margin="normal"
          style={style.length}
        />
        <TextField
          label="Volume (%)"
          value={this.props.volume.value}
          error={!!this.props.volume.error}
          helperText={this.props.volume.error}
          onChange={(event) => this.props.onTrackDataChange(timelines, i, j, 'volume', event.target.value)}
          margin="normal"
          style={style.volume}
        />
        <EditorOutput
          output={!!this.props.expression.error ? this.props.expression.error : this.props.expression.value}
          error={!!this.props.expression.error}
        />
        <IconButton onClick={() => this.props.onDeleteSegment()}>
          <Delete />
        </IconButton>
      </div>
    )
  }
}

export default EditorPanel;
