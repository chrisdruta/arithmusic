import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { AppBar, Toolbar, IconButton } from "@material-ui/core";

import { Play, Stop, Tune } from 'mdi-material-ui';

import Graph from './components/graph';
import Editor from './components/editor';
import initialState from './initial-state';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
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

  handleDataChange = (field, value) => {
    //TODO: find better method than looping through all segments (if slow)
    this.state.timelines.forEach((tl, i) => {
      tl.segments.forEach((segment, j) => {
        if (segment.id === this.state.selectedSegmentId) {
          const { timelines } = this.state;
          timelines[i].segments[j][field] = value;
          this.setState({ timelines: timelines });
          return;
        }
      });
    });
  }

  render() {
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
            <IconButton color="inherit" onClick={this.handleSettings}><Tune /></IconButton>
          </Toolbar>
        </AppBar>
        <img src={logo} className="App-logo" alt="logo" />
        <Editor
          timelines={this.state.timelines}
          selectedSegmentId={this.state.selectedSegmentId}
          onSegmentSelection={this.handleSegmentSelection}
          onTrackDataChange={this.handleTrackDataChange}
          onDataChange={this.handleDataChange}
        />
      </div>
    );
  }
}

export default App;
