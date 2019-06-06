import React from 'react';

import { Button, FormControlLabel, Modal, Switch, TextField, Typography } from '@material-ui/core/';

import { getModalStyle, useStyles } from '../modals';

const style = {
  volume: {
    width: 139
  },
  multiplier: {
    width: 250
  },
  fs: {
    width: 180
  }
};

export default function SettingsModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  return (
    <Modal
      open={props.open}
    //onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <div style={{display: "flex", flexDirection: "row"}}>
          <div className="settingsColumn">
            <Typography variant="h5">
              Settings
            </Typography>
            <TextField
              label="Master Volume (%)"
              value={props.masterVolume}
              onChange={() => { }}
              margin="normal"
              style={style.volume}
            />
            <TextField
              label="Auto multipler for function input (x)"
              value={props.multiplier}
              onChange={() => { }}
              margin="normal"
              style={style.multiplier}
            />
            <TextField
              label="Sampling frequency (Hz)"
              value={props.fs}
              onChange={() => { }}
              margin="normal"
              style={style.fs}
            />
            <FormControlLabel
              style={{ alignSelf: "flex-start", marginLeft: 0, marginTop: 30 }}
              control={<Switch />}
              label="Enable Aliasing"
              labelPlacement="start"
            />
          </div>
          <div className="settingsColumn" style={{alignItems: "center"}}>
            <Typography variant="h6">
              About
            </Typography>
            <Typography variant="h6">
              Chris Druta
            </Typography>
            
          </div>
        </div>

        <br />
        <div className="modalActions">
          <Button variant="contained" onClick={props.toggleSettingsModal}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
