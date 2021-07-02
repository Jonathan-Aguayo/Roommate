import React from 'react';
import 'whatwg-fetch';
import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';

export default function ViewMessages (props)
{
    return (
        <div>
            {props.messages.map(message => 
            <div>
                {message.title}
                {message.body}
            </div> )}
        </div>
    );
}