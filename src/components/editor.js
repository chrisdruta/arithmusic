import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core/';

import Typography from '@material-ui/core/Typography';
import { ChevronUp } from 'mdi-material-ui';

import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackControls from './editor/track-controls';

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
    wdith: "100%",
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
    this.timer = setInterval(this.props.animateGraph, 16);
  }

  render() {
    const { classes } = this.props;
    const trackTimelines = [];
    let selectedSegmentData = null;

    this.props.timelines.forEach((tl, index) => {
      tl.segments.forEach((segment) => {
        if (segment.id === this.props.selectedSegmentId) selectedSegmentData = segment
      });
      trackTimelines.push(
        <div key={index} className="EditorTimelineRow">
          <TrackControls
            options={tl.options}
            onTrackDataChange={this.props.onTrackDataChange}
            onDeleteTrack={this.props.onDeleteTrack}
            index={index}
          />
          <TrackTimeline
            segments={tl.segments}
            selectedSegmentId={this.props.selectedSegmentId}
            onSegmentSelection={this.props.onSegmentSelection}
            onSegmentRearrange={this.props.onSegmentRearrange}
            onAddSegment={this.props.onAddSegment}
            index={index}
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
              onToggleLoadModal={this.props.onToggleLoadModal}
              onToggleSaveModal={this.props.onToggleSaveModal}
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
                  onDataChange={this.props.onDataChange}
                  onDeleteSegment={this.props.onDeleteSegment}
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
