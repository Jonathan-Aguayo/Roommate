import React from 'react';
import {UserContext} from '../App.jsx'
import {Paper} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import {Delete} from '@material-ui/icons';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import 'whatwg-fetch';





export default function EditChores (props)
{   
    const {user} = React.useContext(UserContext);
    const [currentChores, setCurrentChores] = React.useState(user.household.chores? user.household.chores : []);
    const [newChore, setNewChore] = React.useState('');

    const handleChoreChange = (e) =>
    {
        setNewChore(e.target.value);
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        let updatedChores = currentChores;
        updatedChores.push(newChore);
        fetch('/api/v1/houseHolds/Chore',
        {
            method:'PATCH',
            headers: {'Accept':'application/json','Content-Type':'application/json'},
            body: JSON.stringify({'updatedChores': updatedChores})
        })
        .then( res =>
        {
            if(res.ok)
            {
                setCurrentChores(updatedChores);
            }
        })
        setNewChore('');
    }

    function deleteChore(chore)
    {


        let updatedChores = currentChores.filter(value => value !== chore);
        setCurrentChores(updatedChores);
        fetch('/api/v1/houseHolds/Chore',
        {
            method:'PATCH',
            headers: {'Accept':'application/json','Content-Type':'application/json'},
            body: JSON.stringify({'updatedChores': updatedChores})
        })
    }

    return(
        <Paper style={{padding:'10px'}}>
            <Grid container spacing={1} direction='column'>
                {
                    currentChores?
                    <Grid item>
                        <Paper elevation={2} style={{maxHeight:'300px', overflowY:'auto'}} >
                            <List component="div" role="list">
                            {currentChores.map( (chore,index) => 
                                {
                                    return(
                                    <ListItem key = {`chores-list-item-${chore}-${index}`}>
                                        <IconButton onClick = {() => deleteChore(chore)} >
                                            <Delete style={{color:'red'}}/>
                                        </IconButton>
                                        <ListItemText>{chore}</ListItemText>
                                    </ListItem>)
                                })
                            }
                            </List>
                        </Paper>
                    </Grid>
                    :
                    <p hidden></p>                   
                }


                <Grid container justify='space-between' alignItems='flex-end'>
                    <form onSubmit={handleSubmit}>
                        <FormControl variant="outlined" style={{paddingTop:'25px'}}>
                            <InputLabel id='New chore'>New Chore</InputLabel>
                            <OutlinedInput
                                id='New chore'
                                value={newChore}
                                onChange={handleChoreChange}
                                label='New Chore'
                            />
                        </FormControl>
                    </form>
                    <Button variant='outlined' type='submit'> Submit</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}