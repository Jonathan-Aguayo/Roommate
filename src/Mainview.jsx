import React from 'react';
import 'whatwg-fetch';
import ViewMessages from './messages/ViewMessages.jsx';
import {AddMessage} from './messages/AddMessage.jsx'
import {AddTask} from './households/AddTask.jsx'
import {Grid} from '@material-ui/core';
import {Snackbar} from '@material-ui/core';
import { SettingsInputComponentTwoTone } from '@material-ui/icons';
import {Typography} from '@material-ui/core';
import {Paper} from '@material-ui/core';


export default class Home extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            household: {},
            messages: new Array(),
            tasks: new Array(),
            user: {},
            iframeID: '',

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
                        household:null,
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
            else
            {
                this.setState({
                    household: null, 
                    user: null,
                    iframeID: null,
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
            else
            {
                this.setState(
                    {
                        messages: null
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
                    <Grid container spacing={1}>
                        <Grid item xs= {5} container direction="column" spacing={1}>
                            <Grid item xs={9}>
                                <ViewMessages messages={this.state.messages}/>
                            </Grid>
                            <Grid item xs={1}>
                                <AddMessage createMessage = {this.createMessage}/>
                            </Grid>
                        </Grid>
                        <Grid item xs= {7} container direction="column" spacing={1} alignContent='flex-end'>
                            <Grid item xs={11}>
                                <Paper style = {{overflow:'auto',width:'inherit'}}>
                                    <iframe src={ `https://calendar.google.com/calendar/embed?src=${this.state.iframeID[0]}%40group.calendar.google.com& `}  width="1000" height="600" frameBorder="0" scrolling="no"></iframe>
                                </Paper>
                            </Grid>
                            <Grid item xs={1}>
                                <AddTask/>
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