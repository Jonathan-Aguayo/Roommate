import React from 'react';
import 'whatwg-fetch';
import ViewMessages from './messages/ViewMessages.jsx';

export default class Home extends React.Component
{
    constructor()
    {
        super()
        this.state = {
            household: {},
            messages: new Array(),
            tasks: new Array(),
        }
    }


    componentDidMount()
    {
        fetch('/api/v1/houseHolds/').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    this.setState({household: message.message, })
                })
            }
            else
            {
                res.json().then(message => { alert(`Error: ${message.message}`)})
            }
        })

        fetch('/api/v1/messages').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    console.log(message);
                    this.setState({messages: message.message});
                })
            }
            else
            {
                res.json().then(message => 
                {
                    console.log(message);
                })
            }
        })
    }

    render()
    {
        console.log(this.state)
        return(
            <ViewMessages messages={this.state.messages}/>
        );
    }
}