import React, { Component } from 'react';

import { IconButton, TextField } from '@material-ui/core';
import { Delete } from 'mdi-material-ui';

import EditorOutput from './editor-output';

class EditorPanel extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="EditorPanel">
        <TextField
          id="standard-name"
          label="Title"
          //className={classes.textField}
          //value={"values.name"}
          //onChange={handleChange('name')}
          margin="normal"
        />
        <TextField
          id="standard-name"
          label="Equation f(x)"
          //className={classes.textField}
          //value={"values.name"}
          //onChange={handleChange('name')}
          margin="normal"
        />
        <TextField
          id="standard-name"
          label="Length (ms)"
          //className={classes.textField}
          //value={"values.name"}
          //onChange={handleChange('name')}
          margin="normal"
        />
        <TextField
          id="standard-name"
          label="Volume (%)"
          //className={classes.textField}
          //value={"values.name"}
          //onChange={handleChange('name')}
          margin="normal"
        />
        <EditorOutput />
        <IconButton>
          <Delete />
        </IconButton>
      </div>
    )
  }
}

export default EditorPanel;
