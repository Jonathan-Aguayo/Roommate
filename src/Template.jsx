import React from 'react';
import AppBar from './AppBar.jsx'
import 'whatwg-fetch';
import {Snackbar} from '@material-ui/core';

export default class Template extends React.Component
{
   constructor(props)
   {
       super(props);
       this.loadData = this.loadData.bind(this);
       this.state = {
           user: {},
           open:false,
       }
    this.handleClose = this.handleClose.bind(this); 
   }

   componentDidMount()
   {
       this.loadData();
   }

   loadData()
   {
        fetch('/api/v1/user/')
        .then(res => 
        {
            if(res.ok)
            {   
                res.json().then(message => 
                {
                    
                    this.setState({
                        user: message.message.user,
                    })
                    console.log(this.state.user);
                })
            }   
            else
            {
                res.json().then(message =>
                {
                    this.setState({
                        open:true,
                    })
                })
            }
        })
    }

    handleClose(event, reason)
    {
        if(reason==='clickaway')
        {
            return;
        }
        this.setState({
            open:false,
        })
    }


    render()
    {
        return(

            <div className='MainContainer'>
                <Snackbar
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
                message={'Sign in to view household information'}
                />
                <div className='header'>
                    <AppBar user={this.state.user} />
                </div>

                <div className='body'>
                    {React.cloneElement(this.props.children, {user: this.state.user})}
                </div>

            </div>
        );
    }

}