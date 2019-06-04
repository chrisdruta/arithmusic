import React, { Component } from 'react';

import InputBase from '@material-ui/core/InputBase';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import { VolumeMute, CurrentAc, HandSaw, SquareOutline } from 'mdi-material-ui';

class TrackControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="TrackControl">
        <InputBase value={this.props.options.title} className="trackTitle"
          inputProps={{ style: { fontSize: 15, paddingLeft: 3, paddingRight: 3, fontWeight: 400 } }}
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
        <ToggleButtonGroup size="small" style={{ marginLeft: 5 }}>
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
