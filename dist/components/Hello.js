"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Hello extends React.Component {
    render() {
        return React.createElement("h1", null,
            "Hello from ",
            this.props.compiler,
            " and ",
            this.props.framework,
            "!");
    }
}
exports.Hello = Hello;
//# sourceMappingURL=Hello.js.map