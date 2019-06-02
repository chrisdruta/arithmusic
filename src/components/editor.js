import React, { Component } from 'react';

import TrackTimeline from './track-timeline';

class Editor extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <TrackTimeline
                selectedTabId={this.props.selectedTabId}
                onTabSelection={this.props.onTabSelection}
            />
            <div>
                {this.props.selectedTabId}
            </div>
        </div>);
    }

}

export default Editor;
