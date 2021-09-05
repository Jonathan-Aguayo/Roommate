import React from 'react';
import 'whatwg-fetch';
import {TextField, Typography} from '@material-ui/core';
import {Button} from '@material-ui/core';
import { Grid } from '@material-ui/core';
export class AddMessage extends React.Component
{
    /*
        Algo where put all household members in an array and use modulo to select different members from the array so that chores get assigned randomly and will hopefully not put too many chores on any two people
    */
   //State
    constructor(props)
    {
        super(props);
        this.state = {
            title: '',
            body: '',
            open: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.createMessage = this.createMessage.bind(this);
    }

    createMessage(message)
    {
        fetch('/api/v1/messages', {
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'messageBody':message}),
        })
        .then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    const newMessages = messages;
                    newMessages.push(message.message);
                    setMessages(newMessages);
                    alert(`Success:${message}`);
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
            alert(`Error: ${err}`)
        })

    }

    handleSubmit(e)
    {
        e.preventDefault();
        const form = document.forms.addMessage;
        const messageBody = 
        {
            title: form.title.value,
            body: form.body.value,
            postedOn: new Date(),
            completed: false,
        }
        this.createMessage(messageBody);
        this.setState({
            title: '',
            body: '',
            open: false,
        })
    }

    handleClose()
    {
        this.setState({open: !this.state.open});
    }

    handleOpen()
    {
        this.setState({open: true})
    }

    render()
    {
        return(
            <Grid container direction ='column' style={{padding: '10px', background:'#e6e9eb'}}>
                <form noValidate autoComplete='off' name='addMessage'>
                    <Grid item>
                        <TextField
                        id="title"
                        label="Message Title"
                        fullWidth
                        multiline
                        name='title'
                        rowsMax={2}
                        value={this.state.title}
                        onChange={ (event) => {this.setState({title: event.target.value})} } 
                        style={{ paddingTop: '10px' }}/>
                    </Grid>
                    <TextField
                    id="body"
                    label="Message body"
                    multiline
                    fullWidth
                    name='body'
                    rowsMax={6}
                    value={this.state.body}
                    onChange={ (event) => {this.setState({body: event.target.value})} } 
                    style={{ paddingTop: '10px' }}/>
                    <Grid container justify="flex-end">
                        <Button value='submit' type='submit' variant = 'outlined'onClick={this.handleSubmit} style={{verticalAlign:'bottom', marginTop:'5px'}}>Add message</Button>
                    </Grid>
                </form>
            </Grid>)
    }
}