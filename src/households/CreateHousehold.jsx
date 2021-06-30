import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';


export default function CreateCalendar (props)
{
    const [houseName, setHouseName] = React.useState('');

    const createCalendar = () =>
    {
        fetch('/api/v1/createHousehold', 
        {
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'houseName':houseName}),
        })
        .then(res => 
            {
                if(res.ok)
                {
                    console.log(res);
                    res.json().then( message => {console.log(message);})
                    alert('Calendar created successfully')
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
            {
                alert(`Error: ${err}`)
            })
    }

    const handleSubmit = (e) => 
    {
        e.preventDefault();
        createCalendar();
    }
    
    return(
        <div>
            <form noValidate onSubmit={handleSubmit}> 
                <TextField id = 'houseName' label='Enter house name' onChange = {(event) => setHouseName(event.target.value)}/>
                <Button type='submit'>Submit</Button>
            </form>
        </div>

    );
}