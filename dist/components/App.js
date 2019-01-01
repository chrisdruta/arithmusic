"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_materialize_1 = require("react-materialize");
const react_plotlyjs_ts_1 = require("react-plotlyjs-ts");
const react_tabtab_1 = require("react-tabtab");
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.play = (e) => {
            // Go through each tab and generate data then play
        };
        this.stop = (e) => {
            // Stop audio context
        };
        this.openSettings = (e) => {
            // Open dialogue for setting sample rate and possibly other settings
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(react_materialize_1.Navbar, { brand: React.createElement("span", { style: { paddingLeft: "10px" } }, "TuneScript"), href: "#", right: true },
                React.createElement(react_materialize_1.NavItem, { href: "#", onClick: this.play },
                    React.createElement(react_materialize_1.Icon, null, "play_arrow")),
                React.createElement(react_materialize_1.NavItem, { href: "#", onClick: this.stop },
                    React.createElement(react_materialize_1.Icon, null, "stop")),
                React.createElement(react_materialize_1.NavItem, { href: "#", onClick: this.openSettings },
                    React.createElement(react_materialize_1.Icon, null, "settings"))),
            React.createElement(react_plotlyjs_ts_1.default, { data: [
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
                ], config: {
                    displayModeBar: false
                } }),
            React.createElement(react_tabtab_1.Tabs, null)));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map