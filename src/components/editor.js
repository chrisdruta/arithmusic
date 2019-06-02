import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';

import TrackTimeline from './track-timeline';

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
                    <div style={{color: 'red'}}>Test</div>
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
        <div className="Editor">
            {trackTimelines}
            <div>
                {this.props.selectedTabId}
            </div>
        </div>
        );
    }

}

export default Editor;
