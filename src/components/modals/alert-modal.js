import React from 'react';

import { Button, Divider, List, ListItem, ListItemText, Modal, Typography } from '@material-ui/core/';

import { getModalStyle, useStyles } from '../modals';

const errorKeyMap = {
  fs: "Sampling frequency",
  volume: "Volume",
  multiplier: "Auto multiplier",
  expression: "Expression",
  length: "Length"
}

export default function AlertModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const listItems = [];
  if (props.errors) {
    props.errors.settings.forEach((key, index) => {
      listItems.push(
        <ListItem key={`s${index}`}>
          <ListItemText primary={`${errorKeyMap[key]} in Settings`} />
        </ListItem>
      );
      if (index !== props.errors.settings.length - 1) {
        listItems.push(<Divider key={`ds${index}`} variant="middle" />);
      } else if (props.errors.editor.length) {
        listItems.push(<Divider key={`ds${index}`} variant="middle" />);
      }
    });

    props.errors.editor.forEach((err, index) => {
      listItems.push(
        <ListItem key={`e${index}`}>
          <ListItemText primary={`${errorKeyMap[err.key]} for tab titled '${err.title}' in Editor`} />
        </ListItem>
      );
      if (index !== props.errors.editor.length - 1) {
        listItems.push(<Divider key={`de${index}`} variant="middle" />);
      }
    });
  }

  return (
    <Modal
      open={props.open}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h5">
          Composition Errors
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Please fix the following errors and try again
        </Typography>
        <List style={{ width: "55%" }}> {listItems} </List>
        <br />
        <div className="modalActions">
          <Button variant="contained" onClick={() => props.toggleModal("alert")}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
