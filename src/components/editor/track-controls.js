import React, { Component } from 'react';

import { Button, InputBase } from '@material-ui/core/';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import { VolumeMute, CurrentAc, HandSaw, SquareOutline, Minus } from 'mdi-material-ui';

class TrackControls extends Component {

  render() {
    return (
      <div className="TrackControl">
        { this.props.index !== 0
          ? <Button variant="contained" size="medium" onClick={() => this.props.onDeleteTrack(this.props.index)}
              style={{marginRight: 10, backgroundColor: '#f5f5f5', fontWeight: 500}}
            >
              Track&nbsp; <Minus />
            </Button>
          : <div style={{width: 120}}/>}
        <InputBase value={this.props.options.title} className="trackTitle"
          inputProps={{ style: { fontSize: 20, paddingLeft: 3, paddingRight: 3, fontWeight: 300, backgroundColor: "#f5f5f5" } }}
          onChange={(event) => this.props.onTrackDataChange(this.props.index, 'title', event.target.value)}
        />
        <ToggleButtonGroup size="small" exclusive={true}
          value={this.props.options.type}
          onChange={(e, val) => this.props.onTrackDataChange(this.props.index, 'type', val)}
        >
          <ToggleButton size="small" value='sine'>
            <CurrentAc />
          </ToggleButton>
          <ToggleButton size="small" value='square'>
            <SquareOutline />
          </ToggleButton>
          <ToggleButton size="small" value='saw'>
            <HandSaw />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="small" style={{ marginLeft: 10 }}>
          <ToggleButton size="small"
            selected={this.props.options.mute}
            value='mute' onClick={() => this.props.onTrackDataChange(this.props.index, 'mute', '')}
          >
            <VolumeMute />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  }
}

export default TrackControls;
