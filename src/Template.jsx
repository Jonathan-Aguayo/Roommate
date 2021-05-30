import React from 'react';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core'
const Template = (props) =>
{
    return(
        <div>
            <div className='header' style={{marginBottom:'100px'}}>
                <AppBar>
                    <Toolbar>
                        <h1>Issue Tracker project</h1>  
                    </Toolbar>
                </AppBar>
            </div>
            <div className='body'>
                {props.children}
            </div>

            <div className='footer'>
                this is the footer
            </div>
        </div>
    );
}

export default Template;
