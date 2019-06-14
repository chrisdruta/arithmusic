import React from 'react';

import { Button, Modal, TextField, Typography } from '@material-ui/core/';

import { getModalStyle, useStyles } from '../modals';

export default function SaveModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  return (
    <Modal open={props.open}>
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h5">
          Save Composition
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Copy the text below
        </Typography>
        <TextField
          label="Output" multiline className={classes.textField} disabled
          rows="7" value={props.currentComposition} margin="normal" variant="filled"
        />
        <br />
        <Typography variant="subtitle1">
          or
        </Typography>
        <Button variant="contained" download="composition.json" target="_blank"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(props.currentComposition)}`}
          style={{maxWidth: 200, alignSelf: "center"}}
        >
          Save Json
        </Button>
        <br />
        <div className="modalActions">
          <Button variant="contained" onClick={() => props.toggleModal("save")}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
