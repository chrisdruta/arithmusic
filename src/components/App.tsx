import * as React from "react";

import { Navbar, NavItem, Icon, Modal, Row, Col, Input, Button } from "react-materialize";
import { arrayMove } from "react-sortable-hoc";
import { Tabs, DragTabList, DragTab, PanelList, Panel } from "react-tabtab";
import * as MaterialTab from "react-tabtab/lib/themes/material-design";

import * as _ from "lodash";
import PlotlyChart from "react-plotlyjs-ts";
import { Tex } from "react-tex";
const math = require("mathjs");

import * as styles from "../styles/App.css";

declare var window: any;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const GenerateTex = (expression: string) => {
  const parsedMath = math.simplify(math.parse(expression));
  return `\\LARGE f(x)=${parsedMath.toTex()}`;
}

interface TabData {
  title: string;
  expression: string;
  length: number;
  volume: number;
  isValid: boolean;
  output: string;
}

const initialState = {
  isModalOpen: false as boolean,
  activeTabIndex: 0 as number,
  tabs: [
    {
      title: "Tab 1",
      expression: "10*x",
      length: 500,
      volume: 100,
      isValid: true,
      output: GenerateTex("10*x")
    },
    {
      title: "Tab 2",
      expression: "5000",
      length: 500,
      volume: 100,
      isValid: true,
      output: GenerateTex("5000")
    },
    {
      title: "Tab 3",
      expression: "abs(sin(x/100))* x^2/1000 + 5000",
      length: 4000,
      volume: 100,
      isValid: true,
      output: GenerateTex("abs(sin(x/100))* x^2/1000 + 5000")
    }
  ] as TabData[],
  fs: 44100 as number,
  xMultiplier: 1000 as number,
  masterVolume: 10 as number,
  enableAliasing: true as boolean,
  tabBuffer: "" as string
};

type State = Readonly<typeof initialState>;

export class App extends React.Component<object, State> {
  readonly state: State = initialState;
  private sources: AudioScheduledSourceNode[] = [];

  shouldComponentUpdate(nextProps: object, nextState: State) {
    return (
      this.state.isModalOpen !== nextState.isModalOpen ||
      this.state.enableAliasing !== nextState.enableAliasing ||
      this.state.activeTabIndex !== nextState.activeTabIndex ||
      this.state.tabs !== nextState.tabs
    );
  }

  render() {
    // Generating Graph Data
    const multiplier = this.state.xMultiplier;
    const plotData: object[] = [];
    this.state.tabs.forEach((tab: TabData, index: number) => {
      let offset: number = 0;
      for (let i = 0; i < index; i++) {
        offset += this.state.tabs[i].length / 1000;
      }

      let sample: number[] = _.range(0, tab.length / 1000, 1/1000);
      const equation = math.compile(math.simplify(tab.expression).toString());
      const output = _.map(sample, (x: number) => equation.eval({ x: x * multiplier }));
      sample = _.map(sample, (point: number) => point + offset);

      plotData.push({
        x: sample,
        y: output,
        mode: "lines"
      });
    });

    // Generating Tabs
    const tabsTemplate: JSX.Element[] = [];
    const panelTemplate: JSX.Element[] = [];
    this.state.tabs.forEach((tab: TabData, index: number) => {
      let processedInput;
      if (tab.isValid)
        processedInput = <Tex texContent={tab.output} />;
      else
        processedInput = <div className={styles.inputError}>{tab.output}</div>;

      tabsTemplate.push(<DragTab key={index}>{tab.title}</DragTab>);
      panelTemplate.push(
        <Panel key={index}>
          <Row>
            <Input
              label="Title"
              s={1}
              defaultValue={tab.title}
              onChange={this.handleTabTitleChange}
            />
            <Input
              label="Equation f(x)"
              s={3}
              defaultValue={tab.expression}
              onChange={this.handleTabExpChange}
            />
            <Input
              label="Length (ms)"
              s={1}
              defaultValue={tab.length}
              onChange={this.handleTabLenChange}
            />
            <Input
              label="Volume (%)"
              s={1}
              defaultValue={tab.volume}
              onChange={this.handleTabVolChange}
            />
            <div className={`col s6 ${styles.outputContainer}`}>
              <div className={styles.outputHeader}>Input:</div>
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
        >
        </PlotlyChart>

        <h5 className={styles.textOffset}>Rearrangeable Equation Timeline</h5>
        
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
              label="Master volume (%)" s={4}
              defaultValue={this.state.masterVolume}
              onChange={this.handleMasterVolChange}
            />
            <Input
              label="Sampling frequency (Hz)" s={4}
              defaultValue={this.state.fs}
              onChange={this.handleFsChange}
            />
            <Input
              label="Auto multipler for function input (x)"
              s={4}
              defaultValue={this.state.xMultiplier}
              onChange={this.handleMultiplierChange}
            />
          </Row>
          <Row>
            <Col s={2}>Enable Aliasing:</Col>
            <Col s={2}>
              <Input
                type="switch"
                checked={this.state.enableAliasing}
                onChange={this.handleAliasingChange}
              />
            </Col>
          </Row>
          <Row>
            <Input
              type="textarea"
              s={12}
              value={this.state.tabBuffer}
              onChange={this.handleTabsIoChange}
            />
          </Row>
          <div className={styles.horizontalContainer}>
            <Button waves="light" > Save </Button>
            <Button waves="light" > Load </Button>
            <Button waves="light" > Reset </Button>
          </div>
        </Modal>

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

  // Modal Handlers
  private handleOpenSettings = () => {
    this.setState({isModalOpen: true});
  };

  private handleCloseSettings = () => {
    this.setState({isModalOpen: false});
  };

  private handleFsChange = (e: Event, val: string) => {
    const input = Number(val);

    if (input > 0) {
      this.setState({fs: input});
    }
    else {
      alert("Invalid sampling frequency");
    }
  };

  private handleMultiplierChange = (e: Event, val: string) => {
    const input = Number(val);

    if (input) {
      this.setState({xMultiplier: input});
    }
    else {
      alert("Invalid multiplier");
    }
  };

  private handleMasterVolChange = (e: Event, val: string) => {
    const input = Number(val);

    if (input != NaN && input >= 0) {
      this.setState({masterVolume: input});
    }
    else {
      alert("Invalid master volume");
    }
  };

  private handleAliasingChange = (e: Event, val: string) => {
    this.setState({enableAliasing: !this.state.enableAliasing});
  };

  private handleTabsIoChange = (e: Event, val: string) => {
    this.setState({tabBuffer: val});
  };

  // Tab Handlers
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

      updateTabs[this.state.activeTabIndex].expression = val;
      updateTabs[this.state.activeTabIndex].output = GenerateTex(val);
      updateTabs[this.state.activeTabIndex].isValid = true;
  } catch (e) {
      updateTabs[this.state.activeTabIndex].output = e.message;
      updateTabs[this.state.activeTabIndex].isValid = false;
  }

    this.setState({ tabs: updateTabs });
  };

  private handleTabLenChange = (e: Event, val: string) => {
    const input = Number(val);
    const updateTabs = [...this.state.tabs];

    if (input >= 0) {
      updateTabs[this.state.activeTabIndex].isValid = true;
      updateTabs[this.state.activeTabIndex].output = GenerateTex(updateTabs[this.state.activeTabIndex].expression);
      updateTabs[this.state.activeTabIndex].length = Number(val);
    }
    else if (input == NaN) {
      updateTabs[this.state.activeTabIndex].isValid = false;
      updateTabs[this.state.activeTabIndex].output = "Invalid Length";
    }
    else {
      updateTabs[this.state.activeTabIndex].isValid = false;
      updateTabs[this.state.activeTabIndex].output = "Length must be >= 0";
    }
    
    this.setState({ tabs: updateTabs });
  };

  private handleTabVolChange = (e: Event, val: string) => {
    const input = Number(val);
    const updateTabs = [...this.state.tabs];
    if (input >= 0) {
      updateTabs[this.state.activeTabIndex].isValid = true;
      updateTabs[this.state.activeTabIndex].output = GenerateTex(updateTabs[this.state.activeTabIndex].expression);
      updateTabs[this.state.activeTabIndex].volume = input;

    }
    else if (input == NaN) {
      updateTabs[this.state.activeTabIndex].isValid = false;
      updateTabs[this.state.activeTabIndex].output = "Invalid volume";
    }
    else {
      updateTabs[this.state.activeTabIndex].isValid = false;
      updateTabs[this.state.activeTabIndex].output = "Volume must be >= 0";
    }
    
    this.setState({ tabs: updateTabs} );
  }

  private handleTabChange = (index: number) => {
    this.setState({ activeTabIndex: index });
  };

  private handleTabOrderChange = ({oldIndex, newIndex}: {oldIndex: number;newIndex: number;}) => {
    const tabs = this.state.tabs;
    const updateTabs = arrayMove(tabs, oldIndex, newIndex);
    this.setState({ tabs: updateTabs, activeTabIndex: newIndex });
  };

  private handleTabAddition = () => {
    const updateTabs = [
      ...this.state.tabs,
      {
        title: `Tab ${this.state.tabs.length + 1}`,
        expression: "10*x + 10000",
        length: 500,
        volume: 100,
        isValid: true,
        output: GenerateTex("10*x + 10000")
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

  // Audio handlers
  private handlePlay = async () => {
    let totalLength: number = 0; 
    for (let tab of this.state.tabs) totalLength += tab.length;

    const fs = this.state.fs;
    const bufferLength = totalLength * fs/1000;
    const rawBuffer: Float32Array = new Float32Array(bufferLength);
    let index = 0;
    
    this.handleStop();

    for (let tab of this.state.tabs) {
      let sample: number[] = _.range(0, tab.length / 1000, 1/1000);

      const equation = math.compile(math.simplify(tab.expression).toString());

      let output = _.map(sample, (x: number) => equation.eval({x: x * this.state.xMultiplier }));

      if (!this.state.enableAliasing)
        output = _.map(output, (y: number) => (y > fs/2 || y < 0) ? 0 : y );

      for (let tone of output) {
        for (let j = 0; j < fs * 1/1000; j++){
          rawBuffer[index] = this.state.masterVolume/100 * tab.volume/100 * Math.sin(j/((fs/tone)/(Math.PI * 2)));
          index++;
        }
      }
    }

    const sourceBuffer = audioContext.createBuffer(1, bufferLength, fs);
    sourceBuffer.copyToChannel(rawBuffer, 0);

    const source = audioContext.createBufferSource();
    this.sources.push(source);

    source.buffer = sourceBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  private handleStop = async () => {
    for (let source of this.sources) source.stop(0);
  };
}
