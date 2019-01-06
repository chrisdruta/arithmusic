import * as React from "react";

import {
  Navbar,
  NavItem,
  Icon,
  Modal,
  Row,
  Input,
  Button
} from "react-materialize";

import {
  Tabs,
  DragTabList,
  DragTab,
  PanelList,
  Panel
} from "react-tabtab";

import * as md from "react-tabtab/lib/themes/material-design";

import { arrayMove } from "react-sortable-hoc";

import PlotlyChart from "react-plotlyjs-ts";
import {Tex, InlineTex} from "react-tex";
var math = require("mathjs");

interface ExampleTab {
  title: string;
  equation: string;
  length: number;
  tex: string;
}

const initialState = {
  isModalOpen: false as boolean,
  activeTabIndex: 0 as number,
  tabs: [
    {
      title: "Tab 1",
      equation: "500",
      length: 500,
      tex: "\\LARGE f(x)=500"
    },
    {
      title: "Tab 2",
      equation: "2000",
      length: 250,
      tex: "\\LARGE f(x)=2000"
    }
  ] as ExampleTab[],
  fs: 44100 as number
};

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
    const textOffset: any = { paddingLeft: "10px" };
    const tabsTemplate: JSX.Element[] = [];
    const panelTemplate: JSX.Element[] = [];

    this.state.tabs.forEach((tab: ExampleTab, index: number) => {
      tabsTemplate.push(<DragTab key={index}>{tab.title}</DragTab>);
      panelTemplate.push(
        <Panel key={index}>
          <Row>
            <Input
              label="Title"
              s={2}
              defaultValue={tab.title}
              onChange={this.handleTabTitleChange}
            />
            <Input
              label="Equation f(x)"
              s={3}
              defaultValue={tab.equation}
              onChange={this.handleTabExpChange}
            />
            <Input
              label="Length (ms)"
              s={2}
              defaultValue={tab.length}
              onChange={this.handleTabLenChange}
            />
            <div style={{textAlign: "center", marginTop: "-10px"}} className={"col s5"}><h5>Tex</h5><Tex texContent={tab.tex} /></div>
          </Row>
        </Panel>
      );
    });

    return (
      <div>
        <Navbar brand={<span style={textOffset}>TuneScript</span>} href="" right>
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
        <h5 style={textOffset}>Equation Timeline</h5>
        <Tabs
          activeIndex={this.state.activeTabIndex}
          onTabChange={this.handleTabChange}
          onTabSequenceChange={this.handleTabOrderChange}
          showModalButton={false}
          customStyle={md}
        >
          <DragTabList>{tabsTemplate}</DragTabList>
          <PanelList>{panelTemplate}</PanelList>
        </Tabs>
        <Button
          floating
          fab="vertical"
          icon="edit"
          className="red"
          large
          style={{ bottom: "45px", right: "24px" }}
        >
          <Button
            floating
            icon="add"
            className="green"
            onClick={this.handleTabAddition}
          />
          <Button
            floating
            icon="remove"
            className="blue"
            onClick={this.handleTabDeletion}
          />
        </Button>
      </div>
    );
  }

  private handlePlay = () => this.setState(playSegments);
  private handleStop = () => this.setState(stopAudio);
  private handleOpenSettings = () => this.setState(openSettings);
  private handleCloseSettings = () => this.setState(closeSettings);

  private handleTabTitleChange = (e: Event, val: string) => {
    const updateTabs = [...this.state.tabs];
    updateTabs[this.state.activeTabIndex].title = val;
    this.setState({ tabs: updateTabs });
  };

  private handleTabExpChange = (e: Event, val: string) => {
    const updateTabs = [...this.state.tabs];

    try {
      const parsedMath = math.parse(val);
      //compiled.eval();

      updateTabs[this.state.activeTabIndex].equation = val;
      updateTabs[this.state.activeTabIndex].tex = `\\LARGE f(x)=${parsedMath.toTex()}`;
      // Update graph
    }

    catch (e) {
      updateTabs[this.state.activeTabIndex].tex = `${e}`;
    }

    this.setState({tabs: updateTabs});
  };

  private handleTabLenChange = (e: Event, val: string) => {
    const updateTabs = [...this.state.tabs];
    updateTabs[this.state.activeTabIndex].length = Number(val);
    this.setState({ tabs: updateTabs });
  };

  private handleTabChange = (index: number) => {
    this.setState({ activeTabIndex: index });
  };

  private handleTabOrderChange = ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const tabs = this.state.tabs;
    const updateTabs = arrayMove(tabs, oldIndex, newIndex);
    this.setState({ tabs: updateTabs, activeTabIndex: newIndex });
  };

  private handleTabAddition = () => {
    const updateTabs = [
      ...this.state.tabs,
      {
        title: `Tab ${this.state.tabs.length + 1}`,
        equation: "x + 1000",
        length: 500,
        tex: "\\LARGE f(x)=x+1000"
      }
    ];

    this.setState({ tabs: updateTabs, activeTabIndex: updateTabs.length - 1 });
  };

  private handleTabDeletion = () => {
    const updateTabs = [...this.state.tabs];
    updateTabs.splice(this.state.activeTabIndex, 1);

    if (this.state.activeTabIndex > 0)
      this.setState({
        tabs: updateTabs,
        activeTabIndex: this.state.activeTabIndex - 1
      });
    else this.setState({ tabs: updateTabs, activeTabIndex: 0 });
  };
}

const playSegments = (prevState: State) => ({});

const stopAudio = (prevState: State) => ({});

const openSettings = (prevState: State) => ({
  isModalOpen: true
});

const closeSettings = (prevState: State) => ({
  isModalOpen: false
});
