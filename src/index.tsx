import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";
import { LikeButton } from "./components/LikeButton";

ReactDOM.render(
    <App />,
    document.getElementById("app")
);

ReactDOM.render(
    <LikeButton />,
    document.getElementById("example-like")
);
