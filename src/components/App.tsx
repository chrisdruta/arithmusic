import * as React from "react";

import { Navbar, NavItem, Icon } from "react-materialize";
import PlotlyChart from "react-plotlyjs-ts";

export class App extends React.Component<{}, {}> {
  play = (e: Event) => {
    // Go through each tab and generate data then play
  };

  stop = (e: Event) => {
    // Stop audio context
  };

  openSettings = (e: Event) => {
    // Open dialogue for setting sample rate and possibly other settings
  };

  render() {
    return (
      <div>
        <Navbar
          brand={<span style={{ paddingLeft: "10px" }}>TuneScript</span>}
          href="#"
          right
        >
          <NavItem href="#" onClick={this.play}>
            <Icon>play_arrow</Icon>
          </NavItem>
          <NavItem href="#" onClick={this.stop}>
            <Icon>stop</Icon>
          </NavItem>
          <NavItem href="#" onClick={this.openSettings}>
            <Icon>settings</Icon>
          </NavItem>
        </Navbar>
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
      </div>
    );
  }
}
