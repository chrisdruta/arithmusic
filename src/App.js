import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
        <img src={logo} className="App-logo" alt="logo" />
        <p className='title'>
          Test 123
        </p>
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
