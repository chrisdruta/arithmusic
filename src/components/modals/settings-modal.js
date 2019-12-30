import React from 'react';

import { Button, FormControlLabel, Link, Modal, Switch, TextField, Typography } from '@material-ui/core/';

import { getModalStyle, useStyles } from '../modals';

const style = {
  volume: {
    width: 139
  },
  multiplier: {
    width: 250
  },
  graphRange: {
    width: 173
  },
  fs: {
    width: 180
  }
};

export default function SettingsModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const { fs, volume, multiplier, graphRange, aliasing, spectrogram } = props.settings;
  return (
    <Modal open={props.open} onBackdropClick={() => props.toggleModal("settings")}>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="settingsColumn">
            <Typography variant="h5">
              Settings
            </Typography>
            <TextField
              label="Master volume (%)"
              value={volume.value}
              error={!!volume.error}
              helperText={volume.error}
              onChange={(e) => props.onChange('volume', e.target.value) }
              margin="normal"
              style={style.volume}
            />
            <TextField
              label="Auto multipler for function input (x)"
              value={multiplier.value}
              error={!!multiplier.error}
              helperText={multiplier.error}
              onChange={(e) => props.onChange('multiplier', e.target.value) }
              margin="normal"
              style={style.multiplier}
            />
            <TextField
              label="Upper graph range (Hz)"
              value={graphRange.value}
              error={!!graphRange.error}
              helperText={graphRange.error}
              onChange={(e) => props.onChange('graphRange', e.target.value) }
              margin="normal"
              style={style.graphRange}
            />
            <TextField
              label="Sampling frequency (Hz)"
              value={fs.value}
              error={!!fs.error}
              helperText={fs.error}
              onChange={(e) => props.onChange('fs', e.target.value) }
              margin="normal"
              style={style.fs}
            />
            <FormControlLabel
              style={{ alignSelf: "flex-start", marginLeft: 0, marginTop: 15 }}
              control={<Switch checked={aliasing} onChange={() => props.onChange('aliasing')}/>}
              label="Enable Aliasing"
              labelPlacement="start"
            />
            <FormControlLabel
              style={{ alignSelf: "flex-start", marginLeft: 0, marginTop: 15 }}
              control={<Switch checked={spectrogram} onChange={() => props.onChange('spectrogram')}/>}
              label="Spectrogram View"
              labelPlacement="start"
            />
          </div>
          <div className="aboutBorder">
            <Typography variant="h6" style={{ alignSelf: "center" }}>
              About Arithmusic
            </Typography>
            <Typography>
              Version: 1.0.0<br />
              Last updated: June 20, 2019<br />
              <Link href="https://github.com/chrisdruta/arithmusic" target="_blank">
                github.com/chrisdruta/arithmusic
            </Link>
            <br />
            GPL v3.0
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
          <Button variant="contained" style={{marginRight: 10}} onClick={() => props.resetSettings()}>Defaults</Button>
          <Button variant="contained" onClick={() => props.toggleModal("settings")}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
