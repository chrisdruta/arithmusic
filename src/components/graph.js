import React, { Component } from 'react';

import createPlotlyComponent from 'react-plotly.js/factory';

var Plotly = require('plotly.js/lib/core');
const Plot = createPlotlyComponent(Plotly);

class Graph extends Component {

  render() {
    return (
      <Plot
        className="Graph"
        useResizeHandler
        revision={this.props.getRevision}
        config={{
          displayModeBar: false
        }}
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' },
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{
          showlegend: false,
          autosize: true,
          xaxis: { title: "Time (s)" },
          yaxis: {
            title: "Frequency (Hz)",
            range: [0, 22050]
          },
          margin: {
            t: 10,
            l: 80,
            r: 80,
            b: 80
          }
        }}
      />
    );
  }

}

export default Graph;
