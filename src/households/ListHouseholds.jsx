import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';
export default function ListHouseholds (props)
{
    function getUserHouseholds()
    {
        fetch('/api/v1/houseHolds/').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    console.log(message.userHousehold);
                    alert(`Success: message`);
                })
            }
            else
            {
                console.log(res);
                res.json().then(message => { alert(`Error: ${message.message}`)})
            }
        })
    }
    return(
        <div>
            <Button onClick = {getUserHouseholds}>Get households</Button>
        </div>
    )
}