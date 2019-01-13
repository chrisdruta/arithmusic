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

const math = require("mathjs");
import * as _ from "lodash";

import * as styles from "../styles/App.css";

declare var window: any;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

interface TabData {
  title: string;
  equation: string;
  length: number;
  isValid: boolean;
  tex: string;
}

const initialState = {
  isModalOpen: false as boolean,
  activeTabIndex: 0 as number,
  tabs: [
    {
      title: "Tab 1",
      equation: "x",
      length: 500,
      isValid: true,
      tex: "\\LARGE f(x)=x"
    },
    {
      title: "Tab 2",
      equation: "5000",
      length: 250,
      isValid: true,
      tex: "\\LARGE f(x)=5000"
    }
  ] as TabData[],
  fs: 44100 as number
};

type State = Readonly<typeof initialState>;

export class App extends React.Component<object, State> {
  readonly state: State = initialState;
  private sources: AudioScheduledSourceNode[] = [];

  shouldComponentUpdate(nextProps: object, nextState: State) {
    return (
      this.state.isModalOpen !== nextState.isModalOpen ||
      this.state.activeTabIndex !== nextState.activeTabIndex ||
      this.state.tabs !== nextState.tabs
    );
  }

  render() {
    const plotData: object[] = [];

    this.state.tabs.forEach((tab: TabData, index: number) => {
      let offset: number = 0;
      for (let i = 0; i < index; i++) {
        offset += this.state.tabs[i].length / 1000;
      }

      let sample: number[] = _.range(0, tab.length / 1000, 1/1000);
      const code = math.compile(math.simplify(tab.equation).toString());
      const output = _.map(sample, (x: number) => code.eval({ x: x * 1000 }));
      sample = _.map(sample, (point: number) => point + offset);

      plotData.push({
        x: sample,
        y: output,
        mode: "lines"
      });
      
    });

    const tabsTemplate: JSX.Element[] = [];
    const panelTemplate: JSX.Element[] = [];

    this.state.tabs.forEach((tab: TabData, index: number) => {

      let processedInput;
      if (tab.isValid)
        processedInput = <Tex texContent={tab.tex} />;
      else
        processedInput = <div className={styles.inputError}>{tab.tex}</div>;

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
            <div  className={`col s5 ${styles.texTitle}`}>
              <h5>Input:</h5>
              {processedInput}            
            </div>
          </Row>
        </Panel>
      );
    });

    return (
      <div>
        <Navbar
          brand={
            <span className={`${styles.headerFont} ${styles.textOffset}`}>
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
          layout={{
            showlegend: false,
            xaxis: {
              title: "Time (s)"
            },
            yaxis: {
              title: "Frequency (Hz)<br>&nbsp;",
              range: [0, 22050]
            },
            margin: {
              l: 85,
              r: 50,
              b: 50,
              t: 25,
              pad: 10
            }
          }}
        />

        <h5 className={styles.textOffset}>Equation Timeline</h5>
        
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
          style={styles.tabsButton}
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

  private handlePlay = async () => {
    let totalLength: number = 0; 
    for (let tab of this.state.tabs) totalLength += tab.length;
    
    let buf: number[] = [];
    const fs = this.state.fs;
    //const source = this.state.audioNode;

    this.handleStop();

    this.state.tabs.forEach((tab: TabData, index: number) => {

      let input: number[] = _.range(0, tab.length / 1000, 1/1000);
      let code = math.compile(math.simplify(tab.equation).toString());
      let output = _.map(input, (x: number) => code.eval({x: x * 1000 }));

      output = _.map(output, (p: number) => (p > fs/2 || p < 0) ? 0 : p );

      output.forEach((tone: number, i: number) => {
        for (let j = 0; j < fs * 1/1000; j++){
          buf.push(Math.sin(j/((fs/tone)/(Math.PI * 2))));
        }
        
      });
    });
    const buffer = audioContext.createBuffer(1, buf.length, fs);
    buffer.copyToChannel(Float32Array.from(buf), 0);
    const source = audioContext.createBufferSource();
    this.sources.push(source);
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  private handleStop = () => {
    for (let source of this.sources) source.stop(0);
  };
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
      const parsedMath = math.simplify(math.parse(val));
      parsedMath.eval({x: 1});

      updateTabs[this.state.activeTabIndex].equation = val;
      updateTabs[this.state.activeTabIndex].tex = `\\LARGE f(x)=${parsedMath.toTex()}`;
      updateTabs[this.state.activeTabIndex].isValid = true;
    } catch (e) {
      updateTabs[this.state.activeTabIndex].tex = e.message;
      updateTabs[this.state.activeTabIndex].isValid = false;
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
        isValid: true,
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
