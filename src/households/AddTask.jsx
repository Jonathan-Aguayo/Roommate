import React from 'react';
import 'whatwg-fetch';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
}from '@material-ui/pickers'

import {TextField} from '@material-ui/core';
import {FormControl} from '@material-ui/core';
import {InputLabel} from '@material-ui/core';
import {Select} from '@material-ui/core';
import {MenuItem} from '@material-ui/core';
import {Button} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { AddCircleTwoTone } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export class AddTask extends React.Component
{
   //State
    constructor(props)
    {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            title: '',
            body: '',
            household: this.props.household,
            open: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const form = document.forms.addEvent;
        const eventBody = 
        {
            'end': {
                'dateTime': new Date(form.end.value).toISOString(),
                'timeZone': 'America/Los_Angeles'
            },
            'start':{
                'dateTime': new Date(form.start.value).toISOString(),
                'timeZone': 'America/Los_Angeles'
            },
            'summary':form.summary.value,
            'description':form.description.value,
        }
        fetch('/api/v1/events', {
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({'eventBody':eventBody}),
        })
        .then(res => 
        {
            if(res.ok)
            {
                res.json().then(message => 
                {
                    console.log(message);
                    alert(`Success:${message}`)
                })
                this.setState({
                    startDate: new Date(),
                    endDate: new Date(),
                    title: '',
                    body: '',
                    household:{members:[], calendarID: ''},
                })
            }
            else
            {
                res.json().then(message => 
                {
                    console.log(message.message);
                    alert(`Error: ${message.message}`)
                })
            }
        })
        .catch(err => 
        {
            alert(`Error: ${err}`)
        })

    }

    handleClose()
    {
        this.setState({open: !this.state.open});
    }

    handleOpen()
    {
        this.setState({open: true})
    }

    render()
    {
        let menuitems = this.props.household.members.map( (user,index) => <MenuItem value = {user.firstName} key = {index}> {user.firstName} </MenuItem>)
        return(
        <div>
            <IconButton variant = 'outlined' onClick={this.handleOpen}>
                <AddCircleTwoTone style={{color:'#58a7ed', fontSize:40}}/>
            </IconButton>
            <Dialog onClose = {this.handleClose} open={this.state.open}>
                <DialogTitle id="simple-dialog-title">Add Task</DialogTitle>
                <form noValidate autoComplete='off' name='addEvent' style={{ padding: '25px' }}>
                    <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant = 'inline'
                        format='MM/dd/yyyy'
                        margin='normal'
                        id='start-date-picker'
                        label='Start date picker'
                        value={this.state.startDate}
                        name='start'
                        onChange={ (date) => { this.setState({startDate: date}) } }/>

                        <div style={{ align: 'right'}}>
                            <KeyboardDatePicker
                            disableToolbar
                            margin='normal'
                            variant='inline'
                            id='end-date-picker'
                            label="End date picker"
                            format="MM/dd/yyyy"
                            name='end'
                            value={this.state.endDate}
                            onChange={ (date) => { this.setState({endDate: date})} } />
                        </div>
                    </MuiPickersUtilsProvider>
                    
                    <TextField
                    id="summary"
                    label="Event Title"
                    multiline
                    name='summary'
                    rowsMax={2}
                    value={this.state.title}
                    onChange={ (event) => {this.setState({title: event.target.value})} } 
                    style={{ paddingTop: '10px' }}/>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.body}
                        name='description'
                        onChange={(event) => {this.setState({body: event.target.value})} }
                        label = {menuitems[0]}
                        style={{ paddingTop: '10px', minWidth:120 }}
                        >
                            { menuitems }
                        </Select>
                    </FormControl>
                    <DialogActions style={{  }}>
                        <Button value='submit' type='submit' onClick={this.handleSubmit} style={{verticalAlign:'bottom', }}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>)
    }
}