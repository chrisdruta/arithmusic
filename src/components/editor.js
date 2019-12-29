import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core/';

import Typography from '@material-ui/core/Typography';
import { ChevronUp } from 'mdi-material-ui';

import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: "#ffa4a2",
    flex: 0,
    '&$expanded': {
      margin: 0,
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 600
  },
  details: {
    width: "100%",
    backgroundColor: "black",
    padding: 0
  },
  expanded: {
    margin: 0
  }
});

class Editor extends Component {

  constructor(props) {
    super(props);
    this.timer = null;
  }

  animate = () => {
    this.timer = setInterval(this.props.animateGraph, 1/60 * 1000);
  }

  render() {
    const { classes, selectedSegment, timelines } = this.props;
    const trackTimelines = [];
    const selectedSegmentData = timelines[selectedSegment.row].segments[selectedSegment.col]

    this.props.timelines.forEach((tl, rowIndex) => {
      trackTimelines.push(
        <div key={rowIndex} className="EditorTimelineRow">
          <TrackOptions
            options={tl.options} rowIndex={rowIndex}
            onTrackOptionChange={this.props.onTrackOptionChange}
            onDeleteTrack={this.props.onDeleteTrack}  
          />
          <TrackTimeline
            segments={tl.segments} rowIndex={rowIndex}
            selectedSegment={selectedSegment}
            onSegmentSelection={this.props.onSegmentSelection}
            onSegmentRearrange={this.props.onSegmentRearrange}
            onAddSegment={this.props.onAddSegment}
          />
        </div>
      );
    });

    return (
      <ExpansionPanel defaultExpanded={true} classes={{root: classes.root, expanded: classes.expanded}}
        TransitionProps={{
          onEnter: this.animate, onEntered: () => clearInterval(this.timer),
          onExit: this.animate, onExited: () => clearInterval(this.timer)
        }}
      >
        <ExpansionPanelSummary expandIcon={<ChevronUp />}>
          <Typography className={classes.heading}>Timeline Editor</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{root: classes.details}}>
          <div className="Editor">
            <EditorControls
              onAddTrack={this.props.onAddTrack}
              toggleModal={this.props.toggleModal}
            />
            <div className="EditorTimelineContainer">
              {trackTimelines}
            </div>
            { selectedSegmentData
              ? <EditorPanel
                  title={selectedSegmentData.title}
                  expression={selectedSegmentData.expression}
                  length={selectedSegmentData.length}
                  volume={selectedSegmentData.volume}
                  onTrackDataChange={this.props.onTrackDataChange}
                  onDeleteSegment={this.props.onDeleteSegment}
                  timelines={timelines}
                  selectedSegment={selectedSegment}
                />
              : <div className="EmptyEditorPanel"/>
              }
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

}

export default withStyles(styles)(Editor);
