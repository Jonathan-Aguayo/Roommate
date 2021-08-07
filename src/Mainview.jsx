import React from 'react';
import 'whatwg-fetch';
import ViewMessages from './messages/ViewMessages.jsx';
import {AddMessage} from './messages/AddMessage.jsx'
import {AddTask} from './households/AddTask.jsx'
import {Grid} from '@material-ui/core';
import {Snackbar} from '@material-ui/core';
import { CardMedia } from '@material-ui/core';
import {Typography} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import CreateGroup from './households/CreateGroup.jsx';
import AssignChores from './households/AssignChores.jsx'


export default class Home extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            household: null,
            messages: null,
            tasks: null,
            user: null,
            iframeID: null,

        }
        this.createMessage = this.createMessage.bind(this);
    }


    componentDidMount()
    {
        fetch('/api/v1/user').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    this.setState({
                        user: message.message.user,
                        household: null,
                        iframeID: null,
                    })
                    if(message.message.household)
                    {
                        this.setState({
                            household:message.message.household,
                            iframeID: message.message.household.calendarID.split('@'),
                        })
                    }
                })
            }
        })

        fetch('/api/v1/messages').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    this.setState({messages: message.message});
                })
            }
        })
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
                    const newMessages = this.state.messages;
                    newMessages.push(message.message);
                    this.setState({messages: newMessages});
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


    render()
    {
        return(
            <div>
                {this.state.user && this.state.household?
                    <Grid container justify='space-between' spacing={1}>
                        <Grid item xs= {5} container direction="column" spacing={1}>
                            <Grid item xs={9}>
                                <ViewMessages messages={this.state.messages}/>
                            </Grid>
                            <Grid item xs={1}>
                                <AddMessage createMessage = {this.createMessage}/>
                            </Grid>
                        </Grid>
                        <Grid item xs= {7} container direction="column" spacing={1}>
                            <Grid item xs={10} style={{maxWidth:'100%'}}>
                                <iframe src={ `https://calendar.google.com/calendar/embed?src=${this.state.iframeID[0]}%40group.calendar.google.com&ctz=America%2FLos_Angeles `}  width="100%" height="700" frameBorder="0" scrolling="no"></iframe>
                            </Grid>
                            <Grid item xs={1}>
                                <AddTask household = {this.state.household}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <div>
                             
                    </div>
                }
            </div>
        );
    }
}