import React from 'react';
import 'whatwg-fetch';
import ViewMessages from './messages/ViewMessages.jsx';
import {AddTask} from './households/AddTask.jsx'
import {Grid} from '@material-ui/core';
import { UserContext } from './App.jsx';


export default function Home(props)
{
    const {user} = React.useContext(UserContext);
    const [messages, setMessages] = React.useState();
    const iframeID = user?.household?.calendarID.split('@')[0]
    React.useEffect(() => {
        if(user?.household)
            loadData()
    })

    const loadData = () =>
    {
        fetch('/api/v1/messages').then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    let messagesArray = message.message;
                    setMessages(messagesArray);
                })
            }
        })
    }

    return(
        <div>
            {user && user.household?
                <Grid container justify='space-evenly' spacing={0}>
                    <Grid item xs = {3} container direction="column">
                        <Grid item xs={10}>
                            <ViewMessages messages={messages}/>
                        </Grid>
                    </Grid>
                    <Grid item xs= {8} container direction="column">
                        <Grid container justify='flex-end'>
                            <iframe src={ `https://calendar.google.com/calendar/embed?src=${iframeID}%40group.calendar.google.com&ctz=America%2FLos_Angeles `}  width="80%" height="700" frameBorder="0" scrolling="no"></iframe>
                        </Grid>
                        <Grid container justify='flex-end'>
                            <AddTask household = {user.household}/>
                        </Grid>
                    </Grid>
                </Grid>
                :
                <div>
                            
                </div>
            }
        </div>
    );
}