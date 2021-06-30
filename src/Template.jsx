import React from 'react';

export default function Template(props)
{
    return(
        <div className='MainContainer'>
            <div className='header'>
                <h1>Header</h1>
            </div>

            <div className='body'>
                {props.children}
            </div>

            <div className='footer'>
                <h1>Footer</h1>
            </div>
        </div>
    )
}