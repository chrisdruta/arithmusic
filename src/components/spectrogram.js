import React, { Component } from 'react';

import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from "./custom-plotly";
const Plot = createPlotlyComponent(Plotly);

class Spectrogram extends Component {

  render() {
    this.props.generateSpectrogram();

    return (<Plot
        className="Graph"
        useResizeHandler
        config={{
          displayModeBar: false
        }}
        data={[{
            x: this.props.getTx(),
            y: this.props.getFx(),
            z: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            type: "heatmap"
        }]}
        layout={{
          showlegend: true,
          autosize: true,
          xaxis: { title: "Time (s)" },
          yaxis: { title: "Frequency (Hz)<br />&nbsp;" },
          margin: {
            t: 40,
            l: 85,
            r: 50,
            b: 80,
            pad: 5
          }
        }}
      />);
  }
}

export default Spectrogram;
