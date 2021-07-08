import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';

export default function DeleteCalendar(props)
{
    let household = {};
    React.useEffect( () => 
    {
        fetch('/api/v1/houseHolds/').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    console.log(message);
                    household = message.message;
                })
            }
            else
            {
                res.json().then(message => 
                {
                    alert(`Error: ${message}`)
                })
            }
        })
    }, )

    function deleteCalendar()
    { 
        console.log(household);
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
        })
    }



    return(
        <div>
            <Button onClick={deleteCalendar}> Delete calendar</Button>
        </div>
    );
}