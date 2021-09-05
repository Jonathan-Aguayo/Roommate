import React from 'react';
import CreateHousehold from './CreateHousehold.jsx'
import CreateGroup from './CreateGroup.jsx';
import { UserContext } from '../App.jsx'
import DeleteHousehold from './DeleteHousehold.jsx'
import AssignChores from '../households/AssignChores.jsx'
import {Button} from '@material-ui/core';
import { Divider } from '@material-ui/core';
import EditChores from './EditChores.jsx';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default function Settings(props)
{
    const classes = useStyles;
    const {user} = React.useContext(UserContext);



    return(
        <div >
            {
                user?.household?
                <div> 
                    { user.household.owner === user.user._id?
                    <Grid container spacing={0} justify='space-evenly'>
                            <Grid item container direction = 'column' xs ={2} spacing={2} alignItems='stretch' justify='center'>
                                <Grid item>
                                    <DeleteHousehold household = {user.household}/>
                                </Grid>
                                <Grid item>
                                    <AssignChores household = {user.household}/>
                                </Grid>
                            </Grid>
                            <Grid item xs ={4}>
                                <EditChores/>
                            </Grid>
                    </Grid>
                    :<p></p>
                    }
                    <Divider variant='middle' style={{margin:'10px'}}/>                        
                    
                    <CreateGroup household = {user.household}/>
                    <Divider variant='middle' style={{margin:'10px'}}/>
                    <Grid container alignItems='center' justify='center'>
                        <Button href= '/auth/google?returnTo=/invite'variant='outlined'> Invite people to your household! </Button>
                    </Grid>
                </div>
                :
                <CreateHousehold/>
            }
        </div>
    );

}