import * as React from "react";

import {Navbar, NavItem, Icon, CardTitle} from "react-materialize";
import PlotlyChart from "react-plotlyjs-ts";

export class App extends React.Component<{}, {}> {
    render() {
        return (
          <div>
            <Navbar brand={<span style={{paddingLeft: "5px"}}>TuneScript</span>} href="#" right>
              <NavItem href='get-started.html'><Icon>play_arrow</Icon></NavItem>
              <NavItem href='get-started.html'><Icon>stop</Icon></NavItem>
              <NavItem href='get-started.html'><Icon>settings</Icon></NavItem>
            </Navbar>
            <PlotlyChart
              data={[
                {
                  x: [1, 2, 3],
                  y: [2, 6, 3],
                  type: 'scatter',
                  mode: 'lines',
                  marker: {color: 'red'},
                },
                {
                  type: 'line',
                  x: [1, 2, 3],
                  y: [2, 5, 3]},
              ]}
              config={{
                displayModeBar: false
              }}
            />
          </div>
          )
    }
}
