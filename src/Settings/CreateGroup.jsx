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
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: 250,
    Maxheight: 400,
    minHeight: 250,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  gridItem:{
    flexBasis:0,
  }
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
    setNewGroup(not(newGroup, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setMembers(members.concat(newGroup));
    setNewGroup([]);
  };

  const handleSubmit = (e) =>
  {
    if(newGroup.length > 0)
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
    else
    {
      alert('Cannot create empty group')
    }
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
      direction="row"
      alignItems="flex-end"
      justify="space-evenly"
    >
      <Grid item xs ={3} className = {classes.gridItem}>
        <Typography>All Members</Typography>
        {customList(members)}
      </Grid>
        <Grid item xs ={1} container direction="column" alignItems="center" className = {classes.gridItem}>
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

      <Grid 
        item xs = {3} 
        className = {classes.gridItem}
        container 
        direction = "column"
        >
        <Typography>New Group</Typography>
        {customList(newGroup)}
        <Button value = 'submit' type='submit' onClick={handleSubmit} variant='contained' style={{MarginTop:5}}>Create Group</Button>
      </Grid>

      <Grid item xs={3} className = {classes.gridItem}> 
        <Typography>Existing Groups</Typography>
        <Paper className={ classes.paper }>
          <List className={ classes.root }>
          {existing.map((group, index) => (
            <li key={`section-${index}`}>
              <ul>
                <ListSubheader>
                  <Typography>{`Group ${index + 1}`}                     
                    <IconButton onClick={() =>
                      {
                        const updatedGroups = existing.filter(group => existing.indexOf(group)!=index);
                        fetch('/api/v1/houseHolds/group',
                        {
                          method: "PUT",
                          headers:{'Accept':'application/json','Content-Type':'application/json'},
                          body:JSON.stringify({ 'groups' : updatedGroups})
                        }).then(res =>
                          {
                            if(res.ok)
                            {
                              setExisting(updatedGroups);
                            }
                          })
                      }}>
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
        </Paper>
      </Grid>
    </Grid>
  );
}