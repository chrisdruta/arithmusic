"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_plotly_js_1 = require("react-plotly.js");
class App extends React.Component {
    render() {
        return (React.createElement(react_plotly_js_1.default, { data: [
                {
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    type: 'scatter',
                    mode: 'lines',
                    marker: { color: 'red' },
                },
                { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
            ], layout: { width: 320, height: 240, title: 'A Fancy Plot' } }));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map