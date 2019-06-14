import React, { Component } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Play, Stop, Tune } from 'mdi-material-ui';

import { SynthesizeComposition } from './api/synthesize';
import { settingsChange, trackDataChange, loadJson, toggleModal, segmentSelection, segmentRearrange,
         addSegment, deleteSegment, trackOptionChange, addTrack, deleteTrack 
} from './api/handlers';

import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal } from './components/modals';
import initialState from './initial-state';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.revision = 0;

    this.settingsChange = settingsChange.bind(this);
    this.trackDataChange = trackDataChange.bind(this);
    this.loadJson = loadJson.bind(this);
    this.toggleModal = toggleModal.bind(this);
    this.segmentSelection = segmentSelection.bind(this);
    this.segmentRearrange = segmentRearrange.bind(this);
    this.addSegment = addSegment.bind(this);
    this.deleteSegment = deleteSegment.bind(this);
    this.trackOptionChange = trackOptionChange.bind(this);
    this.addTrack = addTrack.bind(this);
    this.deleteTrack = deleteTrack.bind(this);

    let count = 0;
    for (let tl of this.state.timelines) {
      count += tl.segments.length;
    }
    this.idCount = count;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSources = [];
  }

  handlePlay = () => {

    // Check for editor errors before synthesizing
    if (this.state.compositionHasError) {
      alert("Please fix errors in the editor and try again");
      return;
    }

    const rawBuffer = SynthesizeComposition(this.state.timelines, this.state.settings);
    const audioSourceBuffer = this.audioContext.createBuffer(1, rawBuffer.length, this.state.settings.fs);
    audioSourceBuffer.copyToChannel(rawBuffer, 0);
    const audioSource = this.audioContext.createBufferSource();
    audioSource.buffer = audioSourceBuffer;

    this.audioSources.push(audioSource);

    audioSource.connect(this.audioContext.destination);
    audioSource.start(0);
  }

  handleStop = () => {
    this.audioSources.forEach((source) => source.stop(0));
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
            <IconButton color="inherit" onClick={() => this.toggleModal("settings")}><Tune /></IconButton>
          </Toolbar>
        </AppBar>
        <div className="AppContainer">
          <Graph
            revision={this.state.revision} multiplier={this.state.settings.multiplier.value}
            data={this.state.timelines[this.state.selectedRowIndex]
              ? this.state.timelines[this.state.selectedRowIndex].segments : null
            }
          />
          <Editor
            animateGraph={this.handleAnimateGraph}
            timelines={timelines}
            selectedSegmentId={this.state.selectedSegmentId}
            onSegmentSelection={this.segmentSelection}
            onSegmentRearrange={this.segmentRearrange}
            onAddTrack={this.addTrack}
            onDeleteTrack={this.deleteTrack}
            onTrackOptionChange={this.trackOptionChange}
            onTrackDataChange={this.trackDataChange}
            onAddSegment={this.addSegment}
            onDeleteSegment={this.deleteSegment}
            toggleModal={this.toggleModal}
          />
          <LoadModal open={this.state.showingModals.load}
            toggleModal={this.toggleModal}
            onLoadJson={this.loadJson}
          />
          <SaveModal open={this.state.showingModals.save}
            toggleModal={this.toggleModal}
            currentComposition={JSON.stringify(this.state.timelines)}
          />
          <SettingsModal open={this.state.showingModals.settings} settings={this.state.settings}
            toggleModal={this.toggleModal} onChange={this.settingsChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
