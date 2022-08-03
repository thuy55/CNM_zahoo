import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  paper: {
    width: 400,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 2, 3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: '10px',
  },
  actions:{
    display:"flex",
    width:"100%",
    justifyContent:"flex-end",
    '& button':{
      marginLeft:theme.spacing(1),
    }
  },
  listMember:{
    // display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    backgroundColor:theme.palette.grey[100],
    borderRadius:"15px",
    padding:theme.spacing(0.5)
  }
}));