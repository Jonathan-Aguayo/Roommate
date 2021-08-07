import React from 'react';
import 'whatwg-fetch';
import {TextField} from '@material-ui/core';
import {Button, Typography} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
}from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import {Grid} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Paper} from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import Queue from '../Queue';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function AssignChores(props)
{
    const classes = useStyles();

    const [ weekStart, setWeekStart ] = React.useState(new Date());
    const [ weekEnd, setWeekEnd ] = React.useState(new Date());
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [backdropOpen, setBackdropOpen] = React.useState(false);


    const submit = (e) =>
    {
        e.preventDefault();
        setDialogOpen(false);
        setBackdropOpen(true);

        let start = new Date(weekStart);
        let end = new Date(weekEnd);
        const janOne = new Date(start.getFullYear(), 0, 1);
        // Finding the week number of each date 
        let numberOfDays = Math.floor((start - janOne) / (24 * 60 * 60 * 1000));
        const startWeekInteger = Math.ceil(( start.getDay() + 1 + numberOfDays) / 7);
        numberOfDays = Math.floor((end - janOne) / (24 * 60 * 60 * 1000));
        const endWeekInteger = Math.ceil(( end.getDay() + 1 + numberOfDays) / 7);

        let choresQueue = new Queue(props.household.chores); 
        let groupQueue = new Queue(props.household.groups);

        let promisesArray = new Array();
        let eventBody = '';
        //Set start to be sunday
        start.setDate(start.getDate() - start.getDay());
        //set end to be saturday of the same week
        end.setDate(start.getDate() + (6 - start.getDay() ));

        for(let i =0; i < (endWeekInteger - startWeekInteger) + 1 ; i++)
        {
            props.household.chores.forEach( (chore, index) => 
            {
                let nextGroupNames = ''; 
                groupQueue.front().forEach( (user, index, array) => 
                {
                    if(index != array.length-1)
                    {
                        nextGroupNames += `${user.firstName} & `
                    }
                    else
                    { 
                        nextGroupNames += `${user.firstName}`
                    }

                });
                eventBody = 
                {
                    'end': {
                        'dateTime': end.toISOString(),
                        'timeZone': 'America/Los_Angeles'
                    },
                    'start':{
                        'dateTime': start.toISOString(),
                        'timeZone': 'America/Los_Angeles'
                    },
                    'summary':chore,
                    'description': nextGroupNames,
                    'colorId': index,
                }

                const next = groupQueue.dequeue();
                groupQueue.enqueue(next);
                promisesArray.push(fetch('/api/v1/events',{
                    method:'POST',
                    headers:{'Accept':'application/json','Content-Type':'application/json'},
                    body:JSON.stringify({'eventBody': eventBody}),
                }));

            })

        //increment start by 7 days
        start.setDate(start.getDate() + 7);
        //increment end by 7 days
        end.setDate(end.getDate() + 7);
        //Deque and add the element by to the queue
        choresQueue.enqueue(choresQueue.dequeue());
        }
        
        Promise.all(promisesArray).then(() => 
        {
            setBackdropOpen(false);
            alert("Success");
        })

    }


    return(
        <div>
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Button variant = 'outlined' onClick={() => setDialogOpen(true)}>
                Assign Chores
            </Button>
            <Dialog onClose = {() => setDialogOpen(false)} open={dialogOpen}>
                <DialogTitle id="simple-dialog-title">Assign Chores</DialogTitle>
                <form noValidate autoComplete='off' name='addEvent' style={{ padding: '25px' }}>
            <Grid container spacing={1}>
                
                <Grid item xs={6}>
                    <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant = 'inline'
                        format='MM/dd/yyyy'
                        margin='normal'
                        id='start-week-picker'
                        label='Start week'
                        value={weekStart}
                        name='start'
                        onChange={ (date) => { setWeekStart(date) }}/>
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={6}>
                    <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                        <div style={{ align: 'right'}}>
                            <KeyboardDatePicker
                            disableToolbar
                            margin='normal'
                            variant='inline'
                            id='end-week-picker'
                            label="End week"
                            format="MM/dd/yyyy"
                            name='end'
                            value={weekEnd}
                            onChange={ (date) => { setWeekEnd(date) } } />
                        </div>
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={6}>
                    Chores
                    <Paper elevation ={2}>
                        <List>
                        {props.household.chores.map(chores => (
                        <ListItem key={`${chores}`}>
                            <ListItemText primary={`${chores}`} />
                        </ListItem>
                        ))}
                    </List>
                    </Paper>
                </Grid>

                <Grid item xs={6}>
                    Members
                    <Paper elevation ={2} style={{overflow:'auto'}}>
                        <List>
                        {props.household.groups.map((group, index) => (
                            <li key={`section-${index}`}>
                            <ul>
                                <ListSubheader>
                                <Typography>{`Group${index +1}`}                     
                                </Typography>
                                </ListSubheader>
                                {group.map(users => (
                                <ListItem key={`Group-${ index }-${users._id}`}>
                                    <ListItemAvatar>
                                        <Avatar alt={users.firstName} src={users.picture}></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${users.firstName}`} />
                                </ListItem>
                                ))}
                            </ul>
                            </li>
                        ))}
                    </List>
                    </Paper>
                </Grid>
            </Grid>
            <DialogActions >
                <Button value='submit' type='submit' onClick = {submit} style={{verticalAlign:'bottom', }}>Submit</Button>
            </DialogActions>
                </form>
            </Dialog>
        </div>)
}