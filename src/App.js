import React, { Component } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { Play, Stop, Tune } from 'mdi-material-ui';

import { range, map } from 'lodash';
import { parse, simplify } from 'mathjs';

import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal } from './components/modals';
import initialState from './initial-state';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.revision = 0;

    let count = 0;
    for (let tl of this.state.timelines) {
      count += tl.segments.length;
    }
    this.idCount = count;
  }

  idGenerator = () => {
    return ++this.idCount;
  }

  handleSegmentSelection = (selectedSegmentId) => {
    this.setState({
      selectedSegmentId: selectedSegmentId
    });
  }

  handleTrackDataChange = (index, field, value) => {
    const { timelines } = this.state;
    if (field === 'title') {
      timelines[index].options.title = value;
    } else if (field === 'type') {
      if (value === null)
        timelines[index].options.type = 'sine';
      else
        timelines[index].options.type = value;
    } else if (field === 'mute') {
      timelines[index].options.mute = !timelines[index].options.mute;
    }

    this.setState({ timelines: timelines });
  }

  handleSegmentRearrange = (index, segments) => {
    const { timelines } = this.state;
    timelines[index].segments = segments;
    this.setState({ timelines: timelines });
  }

  handleDataChange = (field, value) => {
    //TODO: find better method than looping through all segments (if slow)
    this.state.timelines.forEach((tl, i) => {
      tl.segments.forEach((segment, j) => {
        if (segment.id === this.state.selectedSegmentId) {
          const { timelines } = this.state;
          timelines[i].segments[j][field].value = value;

          if (field === "title") {
            if (value.length > 0) {
              timelines[i].segments[j].title.error = "";
            } else {
              timelines[i].segments[j].title.error = "Too short"
            }
          } else if (field === "expression") {
            try {
              const parsedMath = simplify(parse(value));
              parsedMath.evaluate({ x:1 });
              timelines[i].segments[j].expression.error = "";
            } catch (e) {
              timelines[i].segments[j].expression.error = e.message;
            }
            if (value.length === 0) {
              timelines[i].segments[j].expression.error = "Undefined";
            }
            
          } else if (field === "length") {
            const parsedVal = parseInt(value);
            if (parsedVal >= 0) {
              timelines[i].segments[j].length.value = parsedVal;
              timelines[i].segments[j].length.error = "";
            } else if (isNaN(parsedVal)) {
              timelines[i].segments[j].length.error = "Not a number";
            } else {
              timelines[i].segments[j].length.error = "Can't be negative"
            }

          } else if (field === "volume") {
            const parsedVal = parseInt(value);
            if (parsedVal >= 0) {
              timelines[i].segments[j].volume.value = parsedVal;
              timelines[i].segments[j].volume.error = "";
            } else if (isNaN(parsedVal)) {
              timelines[i].segments[j].volume.error = "Not a number";
            } else {
              timelines[i].segments[j].volume.error = "Can't be negative"
            }
          }

          this.setState({ timelines: timelines });
          return;
        }
      });
    });
  }

  handleAddSegment = (index) => {
    const { timelines } = this.state;

    timelines[index].segments = [...timelines[index].segments,
    {
      id: `t${this.idGenerator()}`,
      title: { value: "New Tab", error: "" },
      expression: { value: "10*x", error: "" },
      length: { value: 500, error: "" },
      volume: { value: 100, error: "" }
    }
    ];
    this.setState({ timelines: timelines });
  }

  handleDeleteSegment = () => {
    const { timelines } = this.state;
    let prevSegmentId = null;

    timelines.forEach((tl, tlIndex) => {
      tl.segments.forEach((segment, segmentIndex) => {

        if (segment.id === this.state.selectedSegmentId) {
          const updateSegments = [...tl.segments];
          updateSegments.splice(segmentIndex, 1);
          timelines[tlIndex].segments = updateSegments;

          this.setState({
            selectedSegmentId: prevSegmentId,
            timelines: timelines
          });
          return;
        }
        prevSegmentId = segment.id;
      });
    });
  }

  handleAddTrack = () => {
    const { timelines } = this.state;

    timelines.push({
      options: {
        title: 'Untitled Track',
        type: 'sine',
        mute: false
      },
      segments: []
    });

    this.setState({ timelines: timelines });
  }

  handleDeleteTrack = (trackIndex) => {
    const { timelines } = this.state;

    timelines.splice(trackIndex, 1);
    this.setState({ timelines: timelines });
  }

  handleToggleLoadModal = () => {
    this.setState({ showLoadModal: !this.state.showLoadModal });
  }

  handleToggleSaveModal = () => {
    this.setState({ showSaveModal: !this.state.showSaveModal });
  }

  handleToggleSettingsModal = () => {
    this.setState({ showSettingsModal: !this.state.showSettingsModal });
  }

  handleLoadJson = (text) => {
    const json = JSON.parse(text);
    this.setState({ timelines: json });
  }

  handleSettingsChange = (field, value) => {
    if (field === 'volume') {
      this.setState({ volume: parseInt(value) });
    } else if (field === 'multipler') {
      this.setState({ multiplier: parseInt(value) });
    } else if (field === 'fs') {
      this.setState({ fs: parseInt(value) });
    } else if (field === 'aliasing') {
      this.setState({ aliasing: !this.state.aliasing });
    }
  }

  handleAnimateGraph = () => {
    this.setState({ revision: this.state.revision + 1 });
  }

  render() {
    const { timelines } = this.state;
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar className="AppBar">
            <span className="title">
              Arithmusic
            </span>
            <div style={{ flexGrow: 1 }}></div>
            <IconButton color="inherit" onClick={this.handlePlay}><Play /></IconButton>
            <IconButton color="inherit" onClick={this.handleStop}><Stop /></IconButton>
            <IconButton color="inherit" onClick={this.handleToggleSettingsModal}><Tune /></IconButton>
          </Toolbar>
        </AppBar>
        <div className="AppContainer">
          <Graph revision={this.state.revision} />
          <Editor
            animateGraph={this.handleAnimateGraph}
            timelines={timelines}
            selectedSegmentId={this.state.selectedSegmentId}
            onSegmentSelection={this.handleSegmentSelection}
            onSegmentRearrange={this.handleSegmentRearrange}
            onTrackDataChange={this.handleTrackDataChange}
            onDataChange={this.handleDataChange}
            onAddSegment={this.handleAddSegment}
            onDeleteSegment={this.handleDeleteSegment}
            onAddTrack={this.handleAddTrack}
            onDeleteTrack={this.handleDeleteTrack}
            onToggleLoadModal={this.handleToggleLoadModal}
            onToggleSaveModal={this.handleToggleSaveModal}
          />
          <LoadModal open={this.state.showLoadModal}
            toggleLoadModal={this.handleToggleLoadModal}
            onLoadJson={this.handleLoadJson}
          />
          <SaveModal open={this.state.showSaveModal}
            toggleSaveModal={this.handleToggleSaveModal}
            currentComposition={JSON.stringify(this.state.timelines)}
          />
          <SettingsModal open={this.state.showSettingsModal}
            toggleSettingsModal={this.handleToggleSettingsModal}
            volume={this.state.volume} multiplier={this.state.multiplier}
            fs={this.state.fs} aliasing={this.state.aliasing}
            onChange={this.handleSettingsChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
