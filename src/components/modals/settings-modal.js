import React from 'react';

import { Box, Button, FormControlLabel, Link, Modal, Switch, TextField, Typography } from '@material-ui/core/';
import { borders } from '@material-ui/system';

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
        <div style={{ display: "flex", flexDirection: "row" }}>
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
          <div className="aboutBorder">
            <Typography variant="h6" style={{ alignSelf: "center" }}>
              About Arithmusic
            </Typography>
            <Typography>
              Version: 1.0.0<br />
              Last updated: June 6, 2019<br />
              <Link href="https://github.com/chrisdruta/arithmusic">
                github.com/chrisdruta/arithmusic
            </Link>
            <br />
            </Typography>
            <Typography>
              Made with <span role="img" style={{ fontSize: 20 }} aria-label="heart">❤️</span>,<br />
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
