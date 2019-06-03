import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { AppBar, Toolbar, IconButton, Modal, Typography } from "@material-ui/core";

import { Play, Stop, Tune } from 'mdi-material-ui';

import Graph from './components/graph';
import Editor from './components/editor';

const initialState = {
  selectedTabId: 't1',
  tabs: [
    [
      {
        id: "t0",
        title: "Tab 1",
        expression: "10*x",
        length: 500,
        volume: 100
      },
      {
        id: "t1",
        title: "Tab 2",
        expression: "20*x",
        length: 500,
        volume: 100
      }
    ],
    [
      {
        id: "t2",
        title: "Tab 3",
        expression: "10*x",
        length: 500,
        volume: 100
      },
      {
        id: "t3",
        title: "Tab 4",
        expression: "20*x",
        length: 500,
        volume: 100
      }
    ]
  ]
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleTabSelection = (selectedTabId) => {
    this.setState({
      selectedTabId: selectedTabId
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
            <div style={{flexGrow: 1}}></div>
            <IconButton color="inherit" onClick={this.handlePlay}><Play /></IconButton>
            <IconButton color="inherit" onClick={this.handleStop}><Stop /></IconButton>
            <IconButton color="inherit" onClick={this.handleSettings}><Tune /></IconButton>
          </Toolbar>
        </AppBar>
        <img src={logo} className="App-logo" alt="logo" />
        <Editor
          tabs={this.state.tabs}
          selectedTabId={this.state.selectedTabId}
          onTabSelection={this.handleTabSelection}
          onTabDataChange={this.handleTabDataChange}
        />
      </div>
    );
  }
}

export default App;
