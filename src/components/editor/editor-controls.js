import React, { Component } from 'react';

import { Button } from '@material-ui/core/';
import { Plus, ContentSave, Upload } from 'mdi-material-ui';

const styles = {
  button: {
    backgroundColor: "#f5f5f5",
    fontWeight: 500
  }
}

class EditorControls extends Component {

  render() {
    return (
      <div className="EditorOptions">
        <Button variant="contained" size="medium" style={styles.button} onClick={this.props.onAddTrack}>
          Track&nbsp;<Plus />
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button variant="contained" size="medium" style={Object.assign({ marginRight: 10 }, styles.button)}
          onClick={() => this.props.toggleModal("load")}
        >
          Load&nbsp;<Upload />
        </Button>
        <Button variant="contained" size="medium" style={styles.button}
          onClick={() => this.props.toggleModal("save")}
        >
          Save&nbsp;<ContentSave />
        </Button>
      </div>
    );
  }
}

export default EditorControls;
