import React from 'react';
import 'whatwg-fetch';
import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function addChore(props)
{
    const [chore, setChore] = React.useState('');
    const [existingChore, setExistingChore] = React.useState([]);
    const handleSubmit = (e)=>
    {
        e.preventDefault();
        fetch('/api/v1/households/Chore', {
            method:'PATCH',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'Chore':chore}),
        })
        .then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    alert('Success');
                    const updatedChores = message.message;
                    setExistingChore(message.message);
                    setChore('');
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
            <form noValidate onSubmit={handleSubmit}>
                <TextField 
                onChange={(event) => setChore(event.target.value)}
                id='chore'
                label='Chore'
                value={chore}/>
                <Button value='submit' type='submit'>Submit</Button>
            </form>
        </div>
    )
}