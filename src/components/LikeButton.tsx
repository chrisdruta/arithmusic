import * as React from "react";

import {Button, Icon} from "react-materialize";

export class LikeButton extends React.Component<{}, {}> {
    render() {
        return (
            <Button waves='light'>
                <Icon>thumb_up</Icon>
            </Button>)
    }
}
