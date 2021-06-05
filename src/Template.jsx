import React from 'react';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import Home from './Homepage.jsx';
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
            <Container maxWidth = {false} >
                <Container style = {{marginBottom: '7%', padding:0,}}>
                    <AppBar style= {{backgroundColor: 'WhiteSmoke'}}>
                        <Toolbar>
                            <a href = '/' style = {{textDecoration: 'none', color: 'DimGrey', marginRight:'70%'}}> <h1>Issue Tracker project</h1> </a>
                            <Home/>
                        </Toolbar>
                    </AppBar>
                </Container>

                <Container maxWidth = {false}>
                    {this.props.children}
                </Container>

                <Container maxWidth = {false} style ={{marginTop: '25%'}}>
                    Made by : Jonathan Aguayo
                </Container>
            </Container>
        )
    }
}

export default Template;
