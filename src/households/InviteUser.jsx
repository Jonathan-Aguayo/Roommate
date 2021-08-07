import React from 'react';
import 'whatwg-fetch';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';

export default function InviteUser (props)
{
    const [to, setTo] = React.useState('');
    const [error, setError] = React.useState(false);
    const Invite = () =>
    {
        fetch('/api/v1/invite', 
        {
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'To':to}),
        })
        .then(res => 
            {
                if(res.ok)
                {
                    console.log(res);
                    res.json().then( message => {console.log(message);})
                    alert('Invitation sent successfully')
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
        Invite();
        setTo('');
    }

    const formChange = (e) => 
    {
        const bool = validateEmail(e);
        if(bool)
        {
            setTo(e);
            setError(false);
        }
        else
        {
            setError(true);
        }
    }

    function validateEmail(email) 
    {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    return(
        <div>
            <form noValidate onSubmit={handleSubmit}> 
                <TextField
                required
                helperText='please enter a valid email address'
                error = {error}
                id = 'to' 
                label='To' 
                onChange = {(event) => formChange(event.target.value)}/>
                <Button 
                type='submit'
                disabled={error}>Submit</Button>
            </form>
        </div>

    );
}