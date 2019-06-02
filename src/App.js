import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Graph from './components/graph';
import Editor from './components/editor';

const initialState = {
  selectedTabId: 0
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
          selectedTabId={this.state.selectedTabId}
          onTabSelection={this.handleTabSelection}
        />
      </div>
    );
  }
}

export default App;
