import React from 'react';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import {Button} from '@material-ui/core';
import Home from './Homepage.jsx';
import {Box} from '@material-ui/core';
import {Container} from '@material-ui/core';

class Template extends React.Component
{
    constructor(props)
    {
        super(props);
        console.log(this.props)
    }

    render()
    {
        return(
            <Container maxWidth = {false}>
                <Container style = {{marginBottom: '7%'}} maxWidth = {false}>
                    <AppBar style= {{backgroundColor: 'WhiteSmoke'}}>
                        <Toolbar>
                            <a href = '/' style = {{textDecoration: 'none', color: 'DimGrey'}}> <h1>Issue Tracker project</h1> </a>
                            <Home redirect = 'hello'/>
                        </Toolbar>
                    </AppBar>
                </Container>

                <Container maxWidth = {false}>
                    {this.props.children}
                </Container>

                <Container maxWidth = {false} style ={{marginTop: '50px'}}>
                    Made by : Jonathan Aguayo
                </Container>
            </Container>
        )
    }
}

export default Template;
