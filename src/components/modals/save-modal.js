import React from 'react';

import { Button, Modal, Typography } from '@material-ui/core/';

import { getModalStyle, useStyles } from '../modals';

export default function SaveModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  return (
    <Modal
    open={props.open}
    //onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h6">
          Text in a modal
        </Typography>
        <Typography variant="subtitle1">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </div>
    </Modal>
  );
};
