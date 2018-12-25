import * as React from "react";
import PlotlyChart from "react-plotlyjs-ts";

export class App extends React.Component<{}, {}> {
    render() {
        return (<PlotlyChart
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
              },
              {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={ {title: 'A Fancy Plot'} }
          />)
    }
}
