import React from 'react';
import AppBar from './AppBar.jsx'
import 'whatwg-fetch';
import {Snackbar} from '@material-ui/core';
import { SnackbarContent } from '@material-ui/core';
import { UserContext } from './App.jsx';
import { isNull } from 'lodash';
export default function Template(props)
{
    const {user} = React.useContext(UserContext);
    const [open, setOpen] = React.useState();


    return(

        <div className='MainContainer'>
            <Snackbar
            open={open}
            anchorOrigin = {{
                vertical:'bottom',
                horizontal: 'left'
            }}
            >
                <SnackbarContent
                autoHideDuration={6000}
                message={'Sign in to view household information'}
                style={{backgroundColor: 'red'}}/>
            </Snackbar>
            <div className='header'>
                <AppBar/>
            </div>

            <div className='body'>
                {React.cloneElement(props.children,)}
            </div>

        </div>
    );

}