import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { ChevronDown } from 'mdi-material-ui';

import TrackTimeline from './track-timeline';
import TrackControls from './track-controls';

class Editor extends Component {

    constructor(props) {
        super(props);
        this.idCount = props.tabs.reduce((count, row) => (count + row.length), 0);
    }

    getNewId = () => {
        return ++this.idCount;
    }

    render() {
        const trackTimelines = [];
        this.props.tabs.forEach((row, index) => {
            trackTimelines.push(
                <div key={index} className="EditorRow">
                    <TrackControls />
                    <TrackTimeline
                        tabs={row}
                        selectedTabId={this.props.selectedTabId}
                        onTabSelection={this.props.onTabSelection}
                        onAddTab={this.handleTabAddition}
                        idGenerator={this.getNewId}
                    />

                </div>
            );
        });

        return (
            <ExpansionPanel defaultExpanded={true} classes={{root: {width: "100%"}}}>
                <ExpansionPanelSummary
                    //expandIcon={<ExpandMoreIcon />} TODO: doesnt work with existing icon
                >
                    <Typography>Timeline</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="Editor">
                        {trackTimelines}
                        <div>
                            {this.props.selectedTabId}
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

}

export default Editor;
