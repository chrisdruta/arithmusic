import * as React from "react";
import PlotlyChart from "react-plotlyjs-ts";

import { Navbar, NavItem, Icon, Modal, Row, Input } from "react-materialize";

import { Tabs, DragTabList, DragTab, PanelList, Panel } from "react-tabtab";

import { arrayMove } from "react-sortable-hoc";

const initialState = {
  isModalOpen: false as boolean,
  activeTabIndex: 0 as number,
  tabs: [
    {
      title: "Tab1",
      expression: "x",
      length: 500
    },
    {
      title: "Tab2",
      expression: "x^2",
      length: 250
    }
  ] as ExampleTab[],
  fs: 44100 as number
};

interface ExampleTab {
  title: string;
  expression: string;
  length: number;
}

type State = Readonly<typeof initialState>;

export class App extends React.Component<object, State> {
  readonly state: State = initialState;

  shouldComponentUpdate(nextProps: object, nextState: State) {
    return (
      this.state.isModalOpen !== nextState.isModalOpen ||
      this.state.activeTabIndex !== nextState.activeTabIndex ||
      this.state.tabs !== nextState.tabs
    );
  }

  render() {
    const tabsTemplate: JSX.Element[] = [];
    const panelTemplate: JSX.Element[] = [];
    this.state.tabs.forEach((tab: ExampleTab, index: number) => {
      tabsTemplate.push(<DragTab key={index}>{tab.title}</DragTab>);
      panelTemplate.push(<Panel key={index}>{`Expression: ${tab.expression} for time: ${tab.length} ms`}</Panel>
      );
    });
    
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
          header="Settings"
          fixedFooter
          modalOptions={{
            complete: this.handleCloseSettings
          }}
        >
          <Row>
            <Input
              label="Sampling Frequency (Hz)"
              s={6}
              defaultValue={this.state.fs}
            />
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

        <Tabs
          activeIndex={this.state.activeTabIndex}
          //activeIndex={this.state.activeTabIndex}
          onTabChange={this.handleTabChange}
          onTabSequenceChange={this.handleTabOrderChange}
        >
          <DragTabList>{tabsTemplate}</DragTabList>
          <PanelList>{panelTemplate}</PanelList>
        </Tabs>
      </div>
    );
  }

  private handlePlay = () => this.setState(playSegments);
  private handleStop = () => this.setState(stopAudio);
  private handleSettings = () => this.setState(toggleSettingsModal);
  private handleOpenSettings = () => this.setState(openSettings);
  private handleCloseSettings = () => this.setState(closeSettings);

  private handleTabChange = (index: number) => {
    this.setState({ activeTabIndex: index });
  };

  private handleTabOrderChange = ({oldIndex, newIndex}: {oldIndex: number; newIndex: number;}) => {
    const { tabs } = this.state;
    const updateTabs = arrayMove(tabs, oldIndex, newIndex);
    this.setState({ tabs: updateTabs, activeTabIndex: newIndex });
  };
}

const playSegments = (prevState: State) => ({});

const stopAudio = (prevState: State) => ({});

const toggleSettingsModal = (prevState: State) => ({
  isModalOpen: !prevState.isModalOpen
});

const openSettings = (prevState: State) => ({
  isModalOpen: true
});

const closeSettings = (prevState: State) => ({
  isModalOpen: false
});

const changeTabOrder = (prevState: State) => ({
  //const {tabs} = prevState
});
