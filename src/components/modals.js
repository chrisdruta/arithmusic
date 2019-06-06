import SaveModal from './modals/save-modal';
import LoadModal from './modals/load-modal';
import SettingsModal from './modals/settings-modal';

import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
}));

export {
  SaveModal,
  LoadModal,
  SettingsModal,
  getModalStyle,
  useStyles
};