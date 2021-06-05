import { Button } from '@material-ui/core';
import React from 'react';
import {Container} from '@material-ui/core';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom'

class Home extends React.Component
{
    constructor (props)
    {
        super(props);
        this.logout = this.logout.bind(this);
        console.log(this.props)
        this.state = {logOut: false}
    }

    logout()
    {
        fetch('/api/v1/logout')
        .then( () => {
            this.setState({logOut: true})
            this.setState({logOut: false})
        })
        .catch(err => 
            {
                console.log(err)
            })
    }

    render()
    {
        return(
            !this.state.logOut?
            <div style={{padding:0, margin:0}}>
                <Button variant='outlined' href='/auth/google' style = {{MarginRight: '5px'}}> Login </Button>
                <Button variant = 'outlined' onClick = {this.logout} style = {{marginLeft: '5px'}}> Logout </Button>
            </div> :
            <Redirect push to = '/' />
        )
    }
}



export default Home;