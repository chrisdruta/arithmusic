import React, { Component } from 'react';

import InputBase from '@material-ui/core/InputBase';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import { VolumeMute, CurrentAc, HandSaw, SquareOutline } from 'mdi-material-ui';

class TrackControls extends Component {

    render() {
        return(
            <div className="TrackControl">
                <InputBase defaultValue="Untitled Track"/>
                <ToggleButtonGroup size="small" exclusive={true}>
                    <ToggleButton size="small" selected={true} value='sine'>
                        <CurrentAc />
                    </ToggleButton>
                    <ToggleButton size="small" selected={false} value='square'>
                        <SquareOutline />
                    </ToggleButton>
                    <ToggleButton size="small" selected={false} value='saw'>
                        <HandSaw />
                    </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup size="small" style={{marginLeft: 5}}>
                    <ToggleButton size="small" selected={false} value='mute'>
                        <VolumeMute />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        )
    }
}

export default TrackControls;
