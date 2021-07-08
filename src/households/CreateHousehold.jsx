import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';


export default function CreateCalendar (props)
{
    const [houseName, setHouseName] = React.useState('');

    let houseID = ''; 

    const createCalendar = () =>
    {
        fetch('/api/v1/households', 
        {
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'houseName': houseName}),
        })
        .then(res => 
        {
            if(res.ok)
            {   
                res.json().then(house => 
                {
                    console.log(house);
                    houseID = house.calendarID;
                    makeCalendarPublic();
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
            {
                alert(`Error: ${err.message}`)
            })
    }

    const makeCalendarPublic= () => 
    {
        fetch('/api/v1/households/public')
            .then(res => 
            {
                if(res.ok)
                {
                    alert('Success');
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
                    alert(`Error: ${err.message}`)
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
                <TextField id = 'houseName' label='Enter house name' onChange = {(event) => {setHouseName(event.target.value)}}/>
                <Button type='submit'>Submit</Button>
            </form>
        </div>

    );
}