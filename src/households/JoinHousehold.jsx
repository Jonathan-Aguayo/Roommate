import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import {Grid} from '@material-ui/core'
export default function JoinHouseHold(props)
{
    const [householdID, setHouseholdID] = React.useState('');

    const join = () => 
    {
        fetch(`/api/v1/houseHolds/addMembers`, {
            method:'PATCH',
            headers:{'Accept':'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify({'houseID': householdID}),
        })
        .then(res =>
        {
            if(res.ok)
            {
                alert('success');
            }
            else
            {
                res.json().then(message => 
                {
                    alert(message.message);
                })
            }   
        })
        .catch(err =>
        {
            aler(`Error: ${err}`)
        })
    }

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        join();
        setHouseholdID('');
        props.history.push({pathname: '/home'})
    }


    return(
        <form noValidate onSubmit={handleSubmit} > 
            <Grid container justify='center'spacing={1}>
                <Grid item container xs={12} justify='center' alignItems='flex-end'>
                <TextField
                required
                helperText='Enter household ID'
                id = 'householdID' 
                label='House hold' 
                value={householdID}
                onChange = {(event) => setHouseholdID(event.target.value)}
                style={{width:'25%'}}/>

                <Button 
                type='submit'
                >Submit</Button>
                </Grid>
            </Grid>
        </form>
    )
}