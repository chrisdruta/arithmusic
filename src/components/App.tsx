import * as React from "react";
import PlotlyChart from "react-plotlyjs-ts";

import { Navbar, NavItem, Icon, Modal, Row, Input } from "react-materialize";

import {
  Tabs,
  DragTabList,
  DragTab,
  PanelList,
  Panel,
} from "react-tabtab";

const initialState = {
  isModalOpen: false,
  fs: 44100
};

type State = Readonly<typeof initialState>;

export class App extends React.Component<object, State> {

  readonly state: State = initialState;

  shouldComponentUpdate(nextProps: object, nextState: State) {
    if (this.state.isModalOpen == nextState.isModalOpen && !nextState.isModalOpen)
      return false;
    return true;
  }

  render() {
    return (
      <div>
        <Navbar
          brand={<span style={{ paddingLeft: "10px" }}>TuneScript</span>}
          href=""
          right
        >
          <NavItem onClick={this.handlePlay}>
            <Icon>play_arrow</Icon>
          </NavItem>
          <NavItem onClick={this.handleStop}>
            <Icon>stop</Icon>
          </NavItem>
          <NavItem onClick={this.handleOpenSettings}>
            <Icon>settings</Icon>
          </NavItem>
        </Navbar>
        <Modal
          open={this.state.isModalOpen}
          header='Settings'
          fixedFooter
          modalOptions={{
            complete: this.handleCloseSettings
          }}
        >
          <Row>
            <Input label="Sampling Frequency (Hz)" s={6} defaultValue={this.state.fs} />
          </Row>
        </Modal>
        <PlotlyChart
          data={[
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: "scatter",
              mode: "lines",
              marker: { color: "red" }
            },
            {
              type: "line",
              x: [1, 2, 3],
              y: [2, 5, 3]
            }
          ]}
          config={{
            displayModeBar: false
          }}
        />
        <Tabs>
          <DragTabList>
            <DragTab>Segment 1</DragTab>
            <DragTab>Segment 2</DragTab>
            <DragTab>Segment 3</DragTab>
          </DragTabList>
          <PanelList>
            <Panel>Segment 1 Form</Panel>
            <Panel>Segment 2 Form</Panel>
            <Panel>Segment 3 Form</Panel>
          </PanelList>
        </Tabs>
      </div>
    );
  }

  private handlePlay = () => this.setState(playSegments);
  private handleStop = () => this.setState(stopAudio);
  private handleOpenSettings = () => this.setState(openSettings);
  private handleCloseSettings = () => this.setState(closeSettings);
}

const playSegments = (prevState: State) => ({});

const stopAudio = (prevState: State) => ({});

const openSettings = (prevState: State) => ({
  isModalOpen: true
});

const closeSettings = (prevState: State) => ({
  isModalOpen: false
});
