import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import { LikeButton } from "./components/LikeButton";

/*ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);*/

ReactDOM.render(
    <LikeButton />,
    document.getElementById("example-like")
);
