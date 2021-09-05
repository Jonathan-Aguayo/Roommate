import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function DeleteCalendar(props)
{
    const household = props.household;
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [backdropOpen, setBackdropOpen] = React.useState(false);


    function handleClose() 
    {
        setDialogOpen(false);
    }

    function handleClickOpen() 
    {
        setDialogOpen(true);
    }

    function deleteCalendar()
    { 
        setBackdropOpen(true);
        fetch(`/api/v1/houseHolds/${household._id}`,
        {
            method:'DELETE',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
        })
        .then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    console.log(message.message);
                    alert(`Success: ${message}`)
                })
            }
            else
            {
                res.json().then(message => 
                {
                    alert(`Error: ${message.message}`)
                })
            }
            setDialogOpen(false);
            setBackdropOpen(false);
        })
    }

    return(
        <div>
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Button onClick={handleClickOpen} style={{background:"#fc2b2b"}}> Delete calendar</Button>
            <Dialog
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Delete household and associated Calendar?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Deleting household will erase all household data associated with ${household.houseName} 
                        and the google calendar associated with ${household.houseName}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant='outlined'>
                        Back
                    </Button>
                    <Button onClick={deleteCalendar} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}