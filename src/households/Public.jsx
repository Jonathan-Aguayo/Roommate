import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';

export default function Public() 
{
    const makePublic = () =>
    {
        fetch('/api/v1/households/public')
        .then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    alert('success');
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
        .catch(err =>
        alert(`Error: ${err}`))
    }
    return(
        <Button onClick={makePublic}>Public</Button>
    );
}