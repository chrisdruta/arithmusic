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

import { Tabs, DragTabList, DragTab, PanelList, Panel } from "react-tabtab";

import * as MaterialTab from "react-tabtab/lib/themes/material-design";

import { arrayMove } from "react-sortable-hoc";

import PlotlyChart from "react-plotlyjs-ts";
import { Tex } from "react-tex";

var math = require("mathjs");
import * as _ from "lodash";

interface TabData {
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
      equation: "x*1000",
      length: 500,
      tex: "\\LARGE f(x)=x"
    },
    {
      title: "Tab 2",
      equation: "5000",
      length: 250,
      tex: "\\LARGE f(x)=2000"
    }
  ] as TabData[],
  fs: 44100 as number
};

type State = Readonly<typeof initialState>;

const AppStyle: any = {
  headerFont: {
    fontFamily: "Cookie, cursive",
    fontWeight: "400",
    fontSize: "50px"
  },
  textOffset: {
    paddingLeft: "10px"
  },
  texTitle: {
    textAlign: "center",
    marginTop: "-10px"
  },
  tabsButton: {
    bottom: "45px",
    right: "24px"
  }
};

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

    this.state.tabs.forEach((tab: TabData, index: number) => {
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
            <div style={AppStyle.texTitle} className={"col s5"}>
              <h5>Tex</h5>
              <Tex texContent={tab.tex} />
            </div>
          </Row>
        </Panel>
      );
    });

    const plotData: object[] = [];

    this.state.tabs.forEach((tab: TabData, index: number) => {
      let offset: number = 0;
      for (let i = 0; i < index; i++) {
        offset += this.state.tabs[i].length/1000
      };
      let sample = _.range(0, tab.length/1000, 1/1000);
      const code = math.compile(`${tab.equation}`);
      const output = _.map(sample, (x: number) => code.eval({x: x}));
      sample = _.map(sample, (point: number) => point + offset);

      plotData.push({
        x: sample,
        y: output,
        mode: "lines"
      });
    });

    console.log(plotData);

    return (
      <div>
        <Navbar
          brand={
            <span style={{ ...AppStyle.headerFont, ...AppStyle.textOffset }}>
              Arithmusic
            </span>
          }
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
          data={plotData}
          config={{
            displayModeBar: false
          }}
        />

        <h5 style={AppStyle.textOffset}>Equation Timeline</h5>

        <Tabs
          activeIndex={this.state.activeTabIndex}
          onTabChange={this.handleTabChange}
          onTabSequenceChange={this.handleTabOrderChange}
          showModalButton={false}
          customStyle={MaterialTab}
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
          style={AppStyle.tabsButton}
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
      updateTabs[
        this.state.activeTabIndex
      ].tex = `\\LARGE f(x)=${parsedMath.toTex()}`;
      // Update graph
    } catch (e) {
      updateTabs[this.state.activeTabIndex].tex = `${e}`;
    }

    this.setState({ tabs: updateTabs });
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
