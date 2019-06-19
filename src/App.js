import React, { Component } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Play, Stop, Tune } from 'mdi-material-ui';

import { SynthesizeComposition } from './api/synthesize';
import { settingsChange, trackDataChange, toggleModal, segmentSelection, segmentRearrange,
         addSegment, deleteSegment, trackOptionChange, addTrack, deleteTrack, getCompositionErrors,
         exportCompositionJson, loadCompositionJson
} from './api/handlers';

import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal } from './components/modals';
import initialState from './initial-state';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.revision = 0;

    this.settingsChange = settingsChange.bind(this);
    this.trackDataChange = trackDataChange.bind(this);
    this.toggleModal = toggleModal.bind(this);
    this.segmentSelection = segmentSelection.bind(this);
    this.segmentRearrange = segmentRearrange.bind(this);
    this.addSegment = addSegment.bind(this);
    this.deleteSegment = deleteSegment.bind(this);
    this.trackOptionChange = trackOptionChange.bind(this);
    this.addTrack = addTrack.bind(this);
    this.deleteTrack = deleteTrack.bind(this);
    this.getCompositionErrors = getCompositionErrors.bind(this);
    this.exportCompositionJson = exportCompositionJson.bind(this);
    this.loadCompositionJson = loadCompositionJson.bind(this);

    let count = 0;
    for (let tl of this.state.timelines) {
      count += tl.segments.length;
    }
    this.idCount = count;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSources = [];
  }

  handlePlay = () => {

    // Check for errors before synthesizing
    const errors = this.getCompositionErrors();
    if (errors) {
      this.toggleModal("alert");
      return;
    }

    const rawBuffer = SynthesizeComposition(this.state.timelines, this.state.settings);
    const audioSourceBuffer = this.audioContext.createBuffer(1, rawBuffer.length, this.state.settings.fs.value);
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
            upperRange={this.state.settings.graphRange.value}
            data={this.state.timelines[this.state.selectedSegment.row]
              ? this.state.timelines[this.state.selectedSegment.row].segments : null
            }
          />
          <Editor
            animateGraph={this.handleAnimateGraph}
            timelines={timelines}
            selectedSegment={this.state.selectedSegment}
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
            onLoadJson={this.loadCompositionJson}
          />
          <SaveModal open={this.state.showingModals.save}
            toggleModal={this.toggleModal}
            currentComposition={(this.exportCompositionJson())}
          />
          <SettingsModal open={this.state.showingModals.settings} settings={this.state.settings}
            toggleModal={this.toggleModal} onChange={this.settingsChange}
          />
          <AlertModal open={this.state.showingModals.alert} errors={this.state.alertErrors}
            toggleModal={this.toggleModal}
          />
        </div>
      </div>
    );
  }
}

export default App;
