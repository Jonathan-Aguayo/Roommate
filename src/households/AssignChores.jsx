import React from 'react';
import 'whatwg-fetch';
import {DialogContentText, TextField} from '@material-ui/core';
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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';



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
    const [ warningDialog, setWarningDialog ] = React.useState(false);
    const [ chores, setChores ] = React.useState([]);
    const [ groups, setGroups ] = React.useState([]);

    function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
    }

    function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
    }

    const handleChoresToggle = (value) => () => {
        const currentIndex = chores.indexOf(value);
        const newChores = [...chores];

        if (currentIndex === -1) {
        newChores.push(value);
        } else {
        newChores.splice(currentIndex, 1);
        }
        setChores(newChores);
    };

    const handleGroupsToggle = (value) => () => {
        const currentIndex = groups.indexOf(value);
        const newGroups = [...groups];

        if (currentIndex === -1) {
        newGroups.push(value);
        } else {
        newGroups.splice(currentIndex, 1);
        }
        setGroups(newGroups);
    };

    const customGroupsList = (items) => (
        <Paper className={classes.paper}>
        <List dense component="div" role="list">
            {items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
                <ListItem key={value} role="listitem" button onClick={handleGroupsToggle(value)}>
                    <ListItemIcon>
                        <Checkbox
                        checked={groups.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemAvatar>
                        <Avatar alt={value.avatar} src={value.picture}></Avatar>
                    </ListItemAvatar>
                    <Typography id={labelId}> {`${value.firstName}`} </Typography>
                </ListItem>
            );
            })}
            <ListItem />
        </List>
        </Paper>
    );

    const customChoresList = (items) => (
        <Paper className={classes.paper}>
        <List dense component="div" role="list">
            {items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
                <ListItem key={value} role="listitem" button onClick={handleChoresToggle(value)}>
                    <ListItemIcon>
                        <Checkbox
                        checked={chores.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value}`} />

                </ListItem>
            );
            })}
            <ListItem />
        </List>
        </Paper>
    );

    const submit = (e) =>
    {
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

        let choresQueue = new Queue(chores); 
        let groupQueue = new Queue(groups);

        let promisesArray = new Array();
        let eventBody = '';
        //Set start to be sunday
        start.setDate(start.getDate() - start.getDay());
        //set end to be saturday of the same week
        end.setDate(start.getDate() + (6 - start.getDay() ));

        for(let i =0; i < (endWeekInteger - startWeekInteger) + 1 ; i++)
        {
            chores.forEach( (chore, index) => 
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

                {
                    props.household.chores?
                    <Grid item xs={6}>
                        Chores
                        {customChoresList(props.household.chores)}
                    </Grid>
                    :
                    <Typography> Create chores to assign Chores </Typography>
                }


                <Grid item xs={6}>
                    Members
                    <Paper elevation ={2} style={{overflow:'auto'}}>
                        <List>
                            {props.household.groups.map((group, index) => (
                                <li key={`section-${index}`}>
                                <ul style={{padding: 0}}>
                                    <ListSubheader onClick={handleGroupsToggle(group)}>
                                        <Checkbox
                                        checked={groups.indexOf(group) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': `group-transfer-list-item-${group}` }}
                                        />
                                        {`Group ${index + 1}`}
                                    </ListSubheader>
                                    {group.map(users => (
                                    <ListItem key={`G-${ index }-${users._id}`}>
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
                <Button value='submit' onClick = {() => setWarningDialog(true) } style={{verticalAlign:'bottom', }} disabled={props.household.chores==null}>Continue</Button>
            </DialogActions>
                </form>
                <Dialog
                open = {warningDialog}
                onClose = { () => setWarningDialog(false) }>
                    <DialogContentText>
                        By clicking submit, you will assign the selected chores to the selected groups starting from the week of {weekStart.toDateString()} to the week of {weekEnd.toDateString()}
                    </DialogContentText>
                    <DialogActions>
                        <Button value='submit' type='submit' onClick = {submit} style={{verticalAlign:'bottom', }}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </div>)
}