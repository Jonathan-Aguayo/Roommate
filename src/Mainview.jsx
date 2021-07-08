import React from 'react';
import 'whatwg-fetch';
import ViewMessages from './messages/ViewMessages.jsx';
import {AddMessage} from './messages/AddMessage.jsx'
import {Grid} from '@material-ui/core';
import {Snackbar} from '@material-ui/core';
import { SettingsInputComponentTwoTone } from '@material-ui/icons';


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
                        household: message.message.household, 
                        user: message.message.user,
                        iframeID: message.message.household.calendarID.split('@'),
                    })
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
                res.json().then(message => 
                {
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
        console.log(this.state.iframeID)
        return(
            <div>
                {this.state.household._id?
                    <Grid container spacing = {2}>
                        <Grid item xs= {3} container direction="column" spacing={1}>
                            <Grid item xs={9}>
                                <ViewMessages messages={this.state.messages}/>
                            </Grid>
                            <Grid item xs={3} container spacing={1}>
                                <Grid item xs={3}>
                                    <AddMessage createMessage = {this.createMessage}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs= {6}>
                            <iframe src={ `https://calendar.google.com/calendar/embed?src=${this.state.iframeID[0]}%40group.calendar.google.com& `}  width="1000" height="600" frameborder="0" scrolling="no"></iframe>
                        </Grid>
                        <Grid item xs= {3}>

                        </Grid>
                    </Grid>
                    :
                    <p></p>
                }
            </div>
        );
    }
}