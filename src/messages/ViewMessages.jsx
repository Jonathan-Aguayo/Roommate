import React from 'react';
import 'whatwg-fetch';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import {Typography} from '@material-ui/core'
import {Grid} from '@material-ui/core';

export default function ViewMessages (props)
{
    return (
    <Paper style={{height:'600px', overflowY:'auto', overflowX:'hidden', scrollMarginTop:'length'}}>
        {
        props.messages?    
        <List style={{padding:0}}>
            {props.messages.map(message => 
            <div>
            <ListItem alignItems = 'flex-start' key={message._id}>
                <ListItemText
                key={`${message._id}-text`}
                primary={message.title}
                secondary={message.body}/>
            </ListItem>
            <Divider/>
            </div>)
            }
        </List>
        :
            <Typography>no messages</Typography>
        }
    </Paper>

    );
}