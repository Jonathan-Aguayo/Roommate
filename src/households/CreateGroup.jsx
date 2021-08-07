import React from 'react';
import 'whatwg-fetch';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import {Button, Typography} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [members, setMembers] = React.useState(props.household.members);
  const [newGroup, setNewGroup] = React.useState([]);
  const [existing, setExisting] = React.useState(props.household.groups);

  const leftChecked = intersection(checked, members);
  const rightChecked = intersection(checked, newGroup);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setNewGroup(newGroup.concat(leftChecked));
    setMembers(not(members, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setMembers(members.concat(rightChecked));
    setNewGroupt(not(newGroup, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setMembers(members.concat(newGroup));
    setNewGroup([]);
  };

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    fetch('/api/v1/households/groups', {
    method: 'POST',
    headers: {'Accept':'application/json','Content-Type':'application/json'},
    body: JSON.stringify({'newGroup': newGroup}),
    }).then(res =>
    {
      console.log(res);
      if(res.ok)
      {
        res.json().then(message =>
        {
          alert('Success');
        })
      }
      else
      {
        console.log('No');
        alert('No');
      }
      setNewGroup([]);
      setMembers(props.household.members);
    })
  }

  const customList = (users) => (
    <Paper className={classes.paper}>
      <List component="nav" role="list">
        {users.map((user) => {
          const labelId = `transfer-list-item-${user._id}-label`;

          return (
            <ListItem key={user._id} role="listitem" button onClick={handleToggle(user)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(user) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemAvatar>
                  <Avatar alt={user.firstName} src={user.picture}></Avatar>
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${user.firstName}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      className={classes.root}
    >
      <Grid item>All Members{customList(members)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">

          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={newGroup.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>New Group{customList(newGroup)}</Grid>
      <Grid item> 
        <List className={classes.root}>
          {existing.map((group, index) => (
            <li key={`section-${index}`}>
              <ul>
                <ListSubheader>
                  <Typography>{`T${index +1}`}                     
                    <IconButton>
                      <Delete fontSize='small'/>
                    </IconButton>
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
      </Grid>
      <Grid item><Button value = 'submit' type='submit' onClick={handleSubmit}>Submit</Button></Grid>
    </Grid>
  );
}